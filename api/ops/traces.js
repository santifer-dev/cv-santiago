import { validateOpsAuth, langfuseAuth, langfuseBaseUrl } from '../_shared/ops-auth.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const auth = validateOpsAuth(req)
  if (!auth.ok) return auth.response

  try {
    const url = new URL(req.url)
    const days = parseInt(url.searchParams.get('days') || '7', 10)
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)
    const lang = url.searchParams.get('lang')       // "es" or "en"
    const mode = url.searchParams.get('mode')       // "text" or "voice"
    const rag = url.searchParams.get('rag')         // "yes" or "no"
    const jailbreak = url.searchParams.get('jailbreak') // "true"
    const includeEvals = url.searchParams.get('includeEvals') === 'true'

    const lfAuth = langfuseAuth()
    if (!lfAuth) return json({ error: 'Langfuse not configured' }, 503)

    const from = new Date(Date.now() - days * 86400000).toISOString()
    const base = langfuseBaseUrl()

    // Build Langfuse query params
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      fromTimestamp: from,
    })

    // Tag filters
    const tagFilters = []
    if (lang) tagFilters.push(lang)
    if (mode === 'voice') tagFilters.push('voice')
    if (rag) tagFilters.push(`rag:${rag}`)
    if (jailbreak === 'true') tagFilters.push('jailbreak-attempt')

    // Langfuse supports multiple tags params
    for (const tag of tagFilters) {
      params.append('tags', tag)
    }

    const tracesRes = await fetch(`${base}/api/public/traces?${params}`, {
      headers: { Authorization: lfAuth },
    })

    if (!tracesRes.ok) {
      return json({ error: `Langfuse error: ${tracesRes.status}` }, 502)
    }

    const tracesData = await tracesRes.json()
    const traces = tracesData.data || []
    // Client-side filters (Langfuse can't negate tags)
    let filtered = traces
    if (mode === 'text') {
      filtered = filtered.filter(t => !(t.tags || []).includes('voice'))
    }
    if (!includeEvals) {
      filtered = filtered.filter(t => !(t.tags || []).some(tag => tag.startsWith('source:')))
    }
    // Use filtered count (Langfuse totalItems includes filtered-out traces)
    const total = filtered.length < parseInt(String(limit))
      ? filtered.length + offset
      : (tracesData.meta?.totalItems ?? filtered.length)

    // Fetch scores for these traces
    const traceIds = filtered.map(t => t.id)
    let scoresByTrace = {}
    if (traceIds.length > 0) {
      const scoresRes = await fetch(
        `${base}/api/public/scores?fromTimestamp=${encodeURIComponent(from)}`,
        { headers: { Authorization: lfAuth } },
      )
      if (scoresRes.ok) {
        const scoresData = await scoresRes.json()
        const traceIdSet = new Set(traceIds)
        for (const s of (scoresData.data || [])) {
          if (traceIdSet.has(s.traceId)) {
            if (!scoresByTrace[s.traceId]) scoresByTrace[s.traceId] = {}
            scoresByTrace[s.traceId][s.name] = s.value
          }
        }
      }
    }

    const data = filtered.map(t => {
      // Detect lang from tags
      const tags = t.tags || []
      const lang = tags.includes('es') ? 'es' : tags.includes('en') ? 'en' : undefined

      return {
        id: t.id,
        timestamp: t.timestamp,
        name: t.name,
        tags,
        metadata: {
          lang,
          lastUserMessage: t.metadata?.lastUserMessage || summarizeInput(t.input),
          messageCount: t.metadata?.messageCount,
          cost: t.metadata?.cost,
          latencyBreakdown: t.metadata?.latencyBreakdown,
          ragUsed: t.metadata?.ragUsed,
          sources: t.metadata?.sources,
          ragDegraded: t.metadata?.ragDegraded,
          degradedReason: t.metadata?.degradedReason,
          promptVersion: t.metadata?.promptVersion,
          durationMs: t.metadata?.durationMs,
          turnCount: t.metadata?.turnCount,
          userMessageCount: t.metadata?.userMessageCount,
          jailbreakDetected: t.metadata?.jailbreakDetected,
          leakDetected: t.metadata?.leakDetected,
        },
        scores: scoresByTrace[t.id] || {},
      }
    })

    return json({ data, total })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

/** Extract first user message as a short preview */
function summarizeInput(input) {
  if (!input) return null
  // input is typically the messages array or the last user message
  if (typeof input === 'string') return input.slice(0, 200)
  if (Array.isArray(input)) {
    const last = input.filter(m => m.role === 'user').pop()
    return last?.content?.slice?.(0, 200) || null
  }
  if (input.messages) {
    const last = input.messages.filter(m => m.role === 'user').pop()
    return last?.content?.slice?.(0, 200) || null
  }
  return null
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
