import { generateEmbedding } from '@/lib/llm'
import { TextChunk } from './chunker'

export interface EmbeddedChunk {
  text: string
  embedding: number[]
  chunkIndex: number
  wordCount: number
}

export async function embedChunks(
  chunks: TextChunk[]
): Promise<EmbeddedChunk[]> {
  const embedded: EmbeddedChunk[] = []

  console.log(`Embedding ${chunks.length} chunks...`)

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]

    try {
      const embedding = await generateEmbedding(chunk.text)

      embedded.push({
        text: chunk.text,
        embedding,
        chunkIndex: chunk.chunkIndex,
        wordCount: chunk.wordCount,
      })

      console.log(`  ✓ Chunk ${i + 1}/${chunks.length} embedded`)
    } catch (error) {
      console.error(`  ✗ Failed to embed chunk ${i}:`, error)
      // Skip failed chunks — don't abort the whole upload
    }
  }

  return embedded
}