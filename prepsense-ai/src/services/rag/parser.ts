import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'

export interface ParsedDocument {
  text: string
  pageCount: number
  fileName: string
  imageCount?: number
  hasImages?: boolean
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
  try {
    // Try using pdfjs-dist if available for better image detection
    const fs = require('fs')
    const pdfjs = require('pdfjs-dist')
    
    const data = new Uint8Array(fs.readFileSync(filePath))
    const pdf = await pdfjs.getDocument({ data }).promise
    
    let fullText = ''
    let imageCount = 0
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      
      // Extract text
      try {
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .filter((item: any) => item.str)
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n'
      } catch (e) {
        console.warn(`Failed to extract text from page ${pageNum}`)
      }
      
      // Count images - look for image operators in content stream
      try {
        const operatorList = await page.getOperatorList()
        const imageOps = operatorList.fnArray?.filter((fn: number) => fn === 83).length || 0 // 83 is image operator
        imageCount += imageOps
      } catch (e) {
        // Silent catch for image detection
      }
    }
    
    return {
      text: fullText || '',
      pageCount: pdf.numPages,
      fileName,
      imageCount: Math.max(imageCount, 0),
      hasImages: imageCount > 0,
    }
  } catch (pdfJsError) {
    console.log('pdfjs-dist parsing failed, falling back to unpdf')
    // Fallback to unpdf if pdfjs-dist fails
    try {
      const { extractText } = await import('unpdf')
      const buffer = fs.readFileSync(filePath)
      const uint8Array = new Uint8Array(buffer)
      const { text, totalPages } = await extractText(uint8Array, { mergePages: true })
      
      return {
        text: text as string,
        pageCount: totalPages,
        fileName,
        imageCount: 0,
        hasImages: false,
      }
    } catch (unpdfError) {
      console.error('Both pdfjs-dist and unpdf failed:', unpdfError)
      throw new Error(`Failed to parse PDF: ${(unpdfError as Error).message}`)
    }
  }
}

async function parseWord(filePath: string, fileName: string): Promise<ParsedDocument> {
  const buffer = fs.readFileSync(filePath)
  const result = await mammoth.extractRawText({ buffer })
  
  // Also extract images from DOCX
  const imageResult = await mammoth.convertToHtml({ buffer })
  const imageCount = (imageResult.value.match(/<img/g) || []).length
  
  return {
    text: result.value,
    pageCount: 1,
    fileName,
    imageCount,
    hasImages: imageCount > 0,
  }
}

async function parseTxt(filePath: string, fileName: string): Promise<ParsedDocument> {
  const text = fs.readFileSync(filePath, 'utf-8')
  return {
    text,
    pageCount: 1,
    fileName,
    imageCount: 0,
    hasImages: false,
  }
}