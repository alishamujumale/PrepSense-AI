import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getChromaClient } from '@/lib/chromadb'
import { getLLMClient } from '@/lib/llm'

export async function GET() {
  const status: Record<string, string> = {}

  // Check MongoDB
  try {
    await connectDB()
    status.mongo = 'ok'
  } catch (e) {
    status.mongo = `error: ${(e as Error).message}`
  }

  // Check ChromaDB
  try {
    const client = getChromaClient()
    await client.heartbeat()
    status.chroma = 'ok'
  } catch (e) {
    status.chroma = `error: ${(e as Error).message}`
  }

  // Check Ollama
  try {
    const client = getLLMClient()
    const models = await client.list()
    const hasLLM   = models.models.some(m => m.name.includes('llama3.2'))
    const hasEmbed = models.models.some(m => m.name.includes('nomic-embed-text'))
    status.ollama_llm   = hasLLM   ? 'ok' : 'error: llama3.2 not found — run: ollama pull llama3.2'
    status.ollama_embed = hasEmbed ? 'ok' : 'error: nomic-embed-text not found — run: ollama pull nomic-embed-text'
  } catch (e) {
    status.ollama_llm   = `error: ${(e as Error).message}`
    status.ollama_embed = `error: ${(e as Error).message}`
  }

  // Check env vars
  const required = ['MONGODB_URI', 'OLLAMA_URL', 'CHROMA_URL']
  const missing  = required.filter(k => !process.env[k])
  status.env = missing.length === 0 ? 'ok' : `missing: ${missing.join(', ')}`

  const allOk = Object.values(status).every(v => v === 'ok')

  return NextResponse.json(
    { status, timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  )
}