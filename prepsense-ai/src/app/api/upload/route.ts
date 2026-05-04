import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { connectDB } from '@/lib/mongodb'
import DocumentModel from '@/models/Document'
import { parseFile } from '@/services/rag/parser'
import { chunkText } from '@/services/rag/chunker'
import { embedChunks } from '@/services/rag/embedder'
import { storeChunks } from '@/services/rag/retriever'
import { getCollection } from '@/lib/chromadb'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const formData = await req.formData()

    // Extract fields
    const file    = formData.get('file')
    const userId  = formData.get('userId')
    const examId  = formData.get('examId')
    const subject = formData.get('subject')
    const docType = formData.get('docType')

    // Validate
    if (!file || !userId || !examId || !subject || !docType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, userId, examId, subject, docType' },
        { status: 400 }
      )
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'file field must be a File' },
        { status: 400 }
      )
    }

    const userIdStr  = userId.toString()
    const examIdStr  = examId.toString()
    const subjectStr = subject.toString()
    const docTypeStr = docType.toString()

    if (!['notes', 'pyq', 'syllabus'].includes(docTypeStr)) {
      return NextResponse.json(
        { error: 'docType must be: notes, pyq, or syllabus' },
        { status: 400 }
      )
    }

    // Save file to disk
    const uploadDir = path.join(process.cwd(), 'uploads', userIdStr, examIdStr)
    await mkdir(uploadDir, { recursive: true })

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const filePath = path.join(uploadDir, fileName)

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    console.log(`✓ File saved: ${filePath}`)

    // Get ChromaDB collection name
    const { collectionName } = await getCollection(userIdStr, examIdStr, subjectStr)

    // Save document record to MongoDB
    const doc = await DocumentModel.create({
      userId:           userIdStr,
      examId:           examIdStr,
      subject:          subjectStr,
      type: docTypeStr as 'notes' | 'pyq' | 'syllabus',
      originalName:     file.name,
      filePath,
      chromaCollection: collectionName,
      chunkCount:       0,
      isProcessed:      false,
    })

    // Run the RAG pipeline
    console.log('Starting RAG pipeline...')

    
        // Step 1 — Parse
    const parsed = await parseFile(filePath)
console.log(`✓ Parsed: ${parsed.pageCount} pages, ${parsed.text.length} chars`)
console.log(`Preview: "${parsed.text.substring(0, 300)}"`)

    // Step 2 — Chunk
    const chunks = chunkText(parsed.text)
    console.log(`✓ Chunked: ${chunks.length} chunks`)

    // Step 3 — Embed
    const embedded = await embedChunks(chunks)
    console.log(`✓ Embedded: ${embedded.length} chunks`)

    // Step 4 — Store in ChromaDB
    await storeChunks(embedded, {
      userId:  userIdStr,
      examId:  examIdStr,
      subject: subjectStr,
      docId: doc._id.toString(),
      docType: docTypeStr as 'notes' | 'pyq' | 'syllabus',
    })

    // Update MongoDB record
    await DocumentModel.findByIdAndUpdate(doc._id, {
      chunkCount:  embedded.length,
      isProcessed: true,
    })

    return NextResponse.json({
      success:    true,
      documentId: doc._id,
      fileName:   file.name,
      pages:      parsed.pageCount,
      chunks:     embedded.length,
      collection: collectionName,
      message:    `Successfully processed ${embedded.length} chunks from ${file.name}`,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}