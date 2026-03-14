import { validateOpsAuth, langfuseAuth, langfuseBaseUrl } from '../_shared/ops-auth.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const auth = validateOpsAuth(req)
  if (!auth.ok) return auth.response

  try {
    const url = new URL(req.url)
    const days = parseInt(url.searchParams.get('days') || '7', 10)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10), 100)
    const includeEvals = url.searchParams.get('includeEvals') === 'true'

    const lfAuth = langfuseAuth()
    if (!lfAuth) {
      return json({ error: 'Langfuse not configured' }, 503)
    }

    const from = new Date(Date.now() - days * 86400000).toISOString()
    const to = new Date().toISOString()
    const base = langfuseBaseUrl()

    // Fetch traces and scores in parallel
    const [tracesRes, scoresRes] = await Promise.all([
      fetch(`${base}/api/public/traces?limit=${limit}&fromTimestamp=${from}`, {
        headers: { Authorization: lfAuth },
      }),
      fetch(`${base}/api/public/scores?fromTimestamp=${from}`, {
        headers: { Authorization: lfAuth },
      }),
    ])

    if (!tracesRes.ok) {
      return json({ error: `Langfuse traces error: ${tracesRes.status}` }, 502)
    }

    const tracesData = await tracesRes.json()
    const traces = tracesData.data || []

    // Scores — may fail (non-critical)
    let scores = []
    if (scoresRes.ok) {
      const scoresData = await scoresRes.json()
      scores = scoresData.data || []
    }

    // Index safety scores by traceId
    const safetyByTrace = {}
    for (const s of scores) {
      if (s.name === 'safety' || s.name === 'safety_score') {
        safetyByTrace[s.traceId] = s.value
      }
    }

    // Aggregate
    const daily = {}
    let totalCost = 0
    let totalLatency = 0
    let latencyCount = 0
    let safetySum = 0
    let safetyCount = 0
    let textConvos = 0
    let voiceConvos = 0
    const languages = { es: 0, en: 0 }
    const intents = {}
    const ragActivation = { yes: 0, no: 0 }

    for (const t of traces) {
      const tags = t.tags || []
      // Skip synthetic traffic (evals, adversarial) unless explicitly included
      if (!includeEvals && tags.some(tag => tag.startsWith('source:'))) continue
      const meta = t.metadata || {}
      const cost = meta.cost || {}
      const isVoice = tags.includes('voice')

      if (isVoice) voiceConvos++
      else textConvos++

      // Cost
      const traceTotalCost = cost.total || 0
      totalCost += traceTotalCost

      // Latency
      const latency = meta.latencyBreakdown?.totalMs || meta.latencyMs
      if (latency) {
        totalLatency += latency
        latencyCount++
      }

      // Safety
      const safety = safetyByTrace[t.id]
      if (safety != null) {
        safetySum += safety
        safetyCount++
      }

      // Languages
      if (tags.includes('es')) languages.es++
      else if (tags.includes('en')) languages.en++

      // Intents
      for (const tag of tags) {
        if (tag.startsWith('topic:')) {
          intents[tag] = (intents[tag] || 0) + 1
        }
      }

      // RAG
      if (tags.includes('rag:yes')) ragActivation.yes++
      else if (tags.includes('rag:no')) ragActivation.no++

      // Daily bucket
      const date = t.timestamp?.slice(0, 10)
      if (date) {
        if (!daily[date]) {
          daily[date] = {
            date,
            conversations: 0,
            textConversations: 0,
            voiceConversations: 0,
            cost: { toolDecision: 0, embedding: 0, reranking: 0, generation: 0, voice: 0, total: 0 },
            totalLatency: 0,
            latencyCount: 0,
          }
        }
        const d = daily[date]
        d.conversations++
        if (isVoice) d.voiceConversations++
        else d.textConversations++
        d.cost.toolDecision += cost.toolDecision || 0
        d.cost.embedding += cost.embedding || 0
        d.cost.reranking += cost.reranking || 0
        d.cost.generation += cost.generation || 0
        d.cost.voice += cost.voice || 0
        d.cost.total += traceTotalCost
        if (latency) {
          d.totalLatency += latency
          d.latencyCount++
        }
      }
    }

    // Build sorted daily array
    const dailyArray = Object.values(daily)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({
        date: d.date,
        conversations: d.conversations,
        textConversations: d.textConversations,
        voiceConversations: d.voiceConversations,
        cost: d.cost,
        avgLatencyMs: d.latencyCount > 0 ? Math.round(d.totalLatency / d.latencyCount) : 0,
      }))

    const conversations = traces.length

    return json({
      period: { days, from, to },
      totals: {
        conversations,
        textConversations: textConvos,
        voiceConversations: voiceConvos,
        totalCost: round(totalCost),
        avgCostPerConversation: conversations > 0 ? round(totalCost / conversations) : 0,
        avgLatencyMs: latencyCount > 0 ? Math.round(totalLatency / latencyCount) : 0,
        avgSafetyScore: safetyCount > 0 ? round(safetySum / safetyCount) : null,
        evalPassRate: 0,
      },
      daily: dailyArray,
      distributions: {
        languages,
        intents,
        ragActivation,
      },
    })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function round(n) {
  return Math.round(n * 1e6) / 1e6
}
