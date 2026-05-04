export interface TextChunk {
  text: string
  chunkIndex: number
  wordCount: number
}

const CHUNK_SIZE = 300        // target words per chunk
const CHUNK_OVERLAP = 50      // words shared between consecutive chunks

export function chunkText(rawText: string): TextChunk[] {
  // Step 1 — clean the text
  const cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')    // collapse excessive newlines
    .replace(/[ \t]+/g, ' ')        // collapse spaces
    .trim()

  // Step 2 — split into sentences/paragraphs for better chunking
  const paragraphs = cleaned
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 30)    // discard tiny fragments

  // Step 3 — convert to words for more precise chunking
  const words = paragraphs.flatMap(p => p.split(/\s+/))
  
  // Step 4 — create chunks with proper indexing and overlap
  const chunks: TextChunk[] = []
  let chunkIndex = 0
  
  for (let i = 0; i < words.length; i += (CHUNK_SIZE - CHUNK_OVERLAP)) {
    const chunkWords = words.slice(i, i + CHUNK_SIZE)
    
    if (chunkWords.length < 20) break // Skip if chunk too small
    
    chunks.push({
      text: chunkWords.join(' '),
      chunkIndex,
      wordCount: chunkWords.length,
    })
    
    chunkIndex++
  }

  // Ensure at least one chunk exists
  if (chunks.length === 0 && words.length > 0) {
    chunks.push({
      text: words.join(' '),
      chunkIndex: 0,
      wordCount: words.length,
    })
  }

  return chunks
}