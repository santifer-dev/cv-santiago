import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// System prompt stored in Vercel environment variable
const SYSTEM_PROMPT = process.env.CHATBOT_SYSTEM_PROMPT || ''

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!SYSTEM_PROMPT) {
    console.error('CHATBOT_SYSTEM_PROMPT not configured')
    return new Response(JSON.stringify({ error: 'Chat not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { messages, lang } = await req.json()

    const email = lang === 'en' ? 'hi@santifer.io' : 'hola@santifer.io'
    const langInstruction = lang === 'en'
      ? '\n\n**IMPORTANT: The user is browsing in English. You MUST respond in English.**'
      : ''

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 800,
      system: SYSTEM_PROMPT.replace(/\{\{EMAIL\}\}/g, email) + langInstruction,
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
