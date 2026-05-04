import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'

export interface ParsedDocument {
  text: string
  pageCount: number
  fileName: string
}

export async function parseFile(filePath: string): Promise<ParsedDocument> {
  const ext = path.extname(filePath).toLowerCase()
  const fileName = path.basename(filePath)

  if (ext === '.pdf') {
    return await parsePDF(filePath, fileName)
  } else if (ext === '.docx' || ext === '.doc') {
    return await parseWord(filePath, fileName)
  } else if (ext === '.txt') {
    return await parseTxt(filePath, fileName)
  } else {
    throw new Error(`Unsupported file type: ${ext}`)
  }
}

async function parsePDF(filePath: string, fileName: string): Promise<ParsedDocument> {
  const { extractText } = await import('unpdf')
  const buffer = fs.readFileSync(filePath)
  const uint8Array = new Uint8Array(buffer)
  const { text, totalPages } = await extractText(uint8Array, { mergePages: true })
  return {
    text: text as string,
    pageCount: totalPages,
    fileName,
  }
}

async function parseWord(filePath: string, fileName: string): Promise<ParsedDocument> {
  const buffer = fs.readFileSync(filePath)
  const result = await mammoth.extractRawText({ buffer })
  return {
    text: result.value,
    pageCount: 1,
    fileName,
  }
}

async function parseTxt(filePath: string, fileName: string): Promise<ParsedDocument> {
  const text = fs.readFileSync(filePath, 'utf-8')
  return {
    text,
    pageCount: 1,
    fileName,
  }
}