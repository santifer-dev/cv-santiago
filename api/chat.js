import Anthropic from '@anthropic-ai/sdk'
import SYSTEM_PROMPT from '../chatbot-prompt.txt'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { messages, lang } = await req.json()

    // Dynamic part: language instruction + email (not cached)
    const langInstruction = lang === 'en'
      ? 'The user is browsing in English. You MUST respond in English. Contact email: hi@santifer.io'
      : 'El usuario navega en español. Responde en español. Email de contacto: hola@santifer.io'

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

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const chunk = event.delta.text
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
            }
          }
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
    return new Response(JSON.stringify({ error: 'Error processing request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
