import Anthropic from '@anthropic-ai/sdk'
import { Langfuse } from 'langfuse'
import SYSTEM_PROMPT from '../chatbot-prompt.txt'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Langfuse client (lazy initialization)
let langfuseClient = null
function getLangfuse() {
  if (!langfuseClient && process.env.LANGFUSE_SECRET_KEY) {
    langfuseClient = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
    })
  }
  return langfuseClient
}

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const langfuse = getLangfuse()
  let trace = null

  try {
    const { messages, lang } = await req.json()

    // Create trace if Langfuse is configured
    if (langfuse) {
      trace = langfuse.trace({
        name: 'chat',
        metadata: { lang, messageCount: messages.length },
      })
    }

    // Dynamic part: language instruction + email (not cached)
    const langInstruction = lang === 'en'
      ? 'The user is browsing in English. You MUST respond in English. Contact email: hi@santifer.io'
      : 'El usuario navega en español. Responde en español. Email de contacto: hola@santifer.io'

    // Create generation span
    const generation = trace?.generation({
      name: 'claude-response',
      model: 'claude-sonnet-4-5-20250929',
      input: messages,
    })

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 800,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' }
        },
        {
          type: 'text',
          text: langInstruction
        }
      ],
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const encoder = new TextEncoder()
    let fullOutput = ''

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const chunk = event.delta.text
              fullOutput += chunk
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
            }
          }

          // Close generation with output and metrics
          const finalMessage = await stream.finalMessage()
          generation?.end({
            output: fullOutput,
            usage: {
              input: finalMessage.usage.input_tokens,
              output: finalMessage.usage.output_tokens,
            },
          })

          // Flush async to Langfuse
          langfuse?.flushAsync()

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    trace?.update({ metadata: { error: error.message } })
    langfuse?.flushAsync()
    return new Response(JSON.stringify({ error: 'Error processing request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
