import { Langfuse } from 'langfuse'
import { waitUntil } from '@vercel/functions'
import { classifyIntent, containsFingerprint, sendJailbreakAlert } from './_shared/rag.js'

export const config = {
  runtime: 'edge',
}

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

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { traceId, sessionId, transcript = [], durationMs, lang } = await req.json()

    if (!traceId) {
      return new Response(JSON.stringify({ error: 'Missing traceId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const langfuse = getLangfuse()
    if (!langfuse) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Classify intent from all user messages
    const userMessages = transcript.filter(t => t.role === 'user').map(t => t.text)
    const allTags = new Set(['voice', lang])
    let jailbreakDetected = false

    for (const msg of userMessages) {
      const tags = classifyIntent(msg)
      tags.forEach(t => allTags.add(t))
      if (tags.includes('jailbreak-attempt')) jailbreakDetected = true
    }

    // Check for fingerprint leaks in assistant responses
    const assistantMessages = transcript.filter(t => t.role === 'assistant').map(t => t.text)
    let leakDetected = false
    for (const msg of assistantMessages) {
      if (containsFingerprint(msg)) {
        leakDetected = true
        allTags.add('prompt-leak-detected')
        break
      }
    }

    // Estimate voice costs (OpenAI Realtime API pricing)
    // ~$0.06/min input audio, ~$0.24/min output audio
    // Estimate 40/60 split user/assistant based on message counts
    const durationMin = (durationMs || 0) / 60000
    const userRatio = transcript.length > 0
      ? userMessages.length / transcript.length
      : 0.4
    const audioInputCost = durationMin * userRatio * 0.06
    const audioOutputCost = durationMin * (1 - userRatio) * 0.24
    const voiceTotalCost = audioInputCost + audioOutputCost

    // Update trace with transcript and metadata
    const trace = langfuse.trace({ id: traceId })
    trace.update({
      sessionId: sessionId || undefined,
      tags: [...allTags],
      metadata: {
        durationMs,
        turnCount: transcript.length,
        userMessageCount: userMessages.length,
        jailbreakDetected,
        leakDetected,
        cost: {
          audioInput: audioInputCost,
          audioOutput: audioOutputCost,
          voice: voiceTotalCost,
          total: voiceTotalCost,
        },
      },
    })

    // Add transcript as a generation
    trace.generation({
      name: 'voice-transcript',
      input: userMessages.join('\n'),
      output: assistantMessages.join('\n'),
      metadata: {
        turns: transcript.length,
        durationMs,
      },
    })

    // Send jailbreak alert if detected
    if (jailbreakDetected) {
      waitUntil(sendJailbreakAlert(`[VOICE JAILBREAK] ${userMessages.join(' | ')}`))
    }

    await langfuse.flushAsync()

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Voice trace error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
