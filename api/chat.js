import Anthropic from '@anthropic-ai/sdk'
import { Langfuse } from 'langfuse'
import { waitUntil } from '@vercel/functions'
import SYSTEM_PROMPT from '../chatbot-prompt.txt'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Intent classification (keyword-based, no extra LLM cost)
function classifyIntent(text) {
  const lower = text.toLowerCase()
  const tags = []

  // Jailbreak attempts
  const jailbreakPatterns = [
    'ignore', 'pretend', 'roleplay', 'act as', 'you are now',
    'forget', 'disregard', 'bypass', 'override', 'jailbreak',
    'dan', 'developer mode', 'evil', 'malicious', 'hack',
    'prompt', 'system prompt', 'instructions', 'ignore previous'
  ]
  if (jailbreakPatterns.some(p => lower.includes(p))) {
    tags.push('jailbreak-attempt')
  }

  // Topic classification
  if (/experiencia|experience|trabajo|work|career|carrera|santifer|irepair/.test(lower)) {
    tags.push('topic:experience')
  }
  if (/proyecto|project|portfolio|github|código|code/.test(lower)) {
    tags.push('topic:projects')
  }
  if (/contact|contacto|email|linkedin|hablar|talk|hire|contratar/.test(lower)) {
    tags.push('topic:contact')
  }
  if (/stack|tech|tecnolog|python|react|airtable|claude|ai|ia|llm|agente|agent/.test(lower)) {
    tags.push('topic:technical')
  }
  if (/salario|salary|money|dinero|rate|precio|cobr/.test(lower)) {
    tags.push('topic:compensation')
  }
  if (/hola|hello|hi|hey|buenos|good/.test(lower) && text.length < 20) {
    tags.push('greeting')
  }

  return tags.length > 0 ? tags : ['topic:general']
}

// Send real-time jailbreak alert (using fetch for Edge compatibility)
async function sendJailbreakAlert(userMessage) {
  if (!process.env.RESEND_API_KEY || !process.env.ALERT_EMAIL) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Santi Bot <onboarding@resend.dev>',
      to: process.env.ALERT_EMAIL,
      subject: '🚨 JAILBREAK ATTEMPT - santifer.io',
      html: `
        <h2>🚨 Jailbreak Attempt Detected</h2>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>User message:</strong></p>
        <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #e74c3c;">
          ${userMessage.slice(0, 500)}${userMessage.length > 500 ? '...' : ''}
        </blockquote>
        <p style="margin-top: 20px;">
          <a href="https://cloud.langfuse.com" style="background: #e74c3c; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View in Langfuse
          </a>
        </p>
      `,
    }),
  })
}

// Langfuse client (lazy initialization)
let langfuseClient = null
function getLangfuse() {
  if (!langfuseClient && process.env.LANGFUSE_SECRET_KEY) {
    langfuseClient = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      baseUrl: process.env.LANGFUSE_BASE_URL,
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
  let generation = null

  try {
    const { messages, lang, sessionId } = await req.json()

    // Get last user message for classification
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || ''
    const intentTags = classifyIntent(lastUserMessage)

    // Send real-time alert if jailbreak detected
    if (intentTags.includes('jailbreak-attempt')) {
      waitUntil(sendJailbreakAlert(lastUserMessage))
    }

    // Create trace if Langfuse is configured
    if (langfuse) {
      trace = langfuse.trace({
        name: 'chat',
        sessionId: sessionId || undefined,
        tags: [lang, ...intentTags],
        metadata: {
          lang,
          messageCount: messages.length,
          lastUserMessage: lastUserMessage.slice(0, 200),
        },
      })
    }

    // Dynamic part: language instruction + email (not cached)
    const langInstruction = lang === 'en'
      ? 'The user is browsing in English. You MUST respond in English. Contact email: hi@santifer.io'
      : 'El usuario navega en español. Responde en español. Email de contacto: hola@santifer.io'

    // Create generation span
    generation = trace?.generation({
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

          // Use waitUntil to ensure flush completes after response
          if (langfuse) {
            waitUntil(langfuse.flushAsync())
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
    trace?.update({ metadata: { error: error.message } })
    if (langfuse) {
      waitUntil(langfuse.flushAsync())
    }
    return new Response(JSON.stringify({ error: 'Error processing request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
