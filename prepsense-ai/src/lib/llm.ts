import { Ollama } from 'ollama'

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'

let ollamaClient: Ollama | null = null

export function getLLMClient(): Ollama {
  if (!ollamaClient) {
    ollamaClient = new Ollama({ host: OLLAMA_URL })
  }
  return ollamaClient
}

/**
 * Generate a text response from the LLM.
 * Drop-in replacement for the Anthropic call we had before.
 */
export async function generateResponse(
  systemPrompt: string,
  userMessage: string,
  model: string = 'llama3.2'
): Promise<string> {
  const client = getLLMClient()

  const response = await client.chat({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage  },
    ],
    options: {
      temperature: 0.3,   // lower = more factual, less creative (good for study tool)
      num_ctx: 4096,      // context window
    },
  })

  return response.message.content
}

/**
 * Generate embeddings for a piece of text.
 * Used by the RAG pipeline to convert chunks into vectors.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getLLMClient()

  const response = await client.embeddings({
    model: 'nomic-embed-text',
    prompt: text,
  })

  return response.embedding
}