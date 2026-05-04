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

  // Step 2 — split into paragraphs first (semantic boundaries)
  const paragraphs = cleaned
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 30)    // discard tiny fragments

  // Step 3 — group paragraphs into chunks of ~CHUNK_SIZE words
  const chunks: TextChunk[] = []
  let currentChunk: string[] = []
  let currentWordCount = 0
  let chunkIndex = 0

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/)
    const wordCount = words.length

    // If adding this paragraph exceeds chunk size, save current chunk
    if (currentWordCount + wordCount > CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push({
        text: currentChunk.join('\n\n'),
        chunkIndex,
        wordCount: currentWordCount,
      })
      chunkIndex++

      // Keep last few words as overlap for context continuity
      const overlapText = currentChunk[currentChunk.length - 1] ?? ''
      const overlapWords = overlapText.split(/\s+/).slice(-CHUNK_OVERLAP)
      currentChunk = overlapWords.length > 0 ? [overlapWords.join(' ')] : []
      currentWordCount = overlapWords.length
    }

    currentChunk.push(paragraph)
    currentWordCount += wordCount
  }

  // Save the last chunk
  if (currentChunk.length > 0 && currentWordCount > 20) {
    chunks.push({
      text: currentChunk.join('\n\n'),
      chunkIndex,
      wordCount: currentWordCount,
    })
  }

  return chunks
}