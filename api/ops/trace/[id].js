import { validateOpsAuth, langfuseAuth, langfuseBaseUrl } from '../../_shared/ops-auth.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const auth = validateOpsAuth(req)
  if (!auth.ok) return auth.response

  try {
    // Extract trace ID from URL path: /api/ops/trace/{id}
    const urlPath = new URL(req.url).pathname
    const segments = urlPath.split('/')
    const traceId = segments[segments.length - 1]

    if (!traceId) {
      return json({ error: 'Missing trace ID' }, 400)
    }

    const lfAuth = langfuseAuth()
    if (!lfAuth) return json({ error: 'Langfuse not configured' }, 503)

    const base = langfuseBaseUrl()

    // Fetch trace, observations, and scores in parallel
    const [traceRes, obsRes, scoresRes] = await Promise.all([
      fetch(`${base}/api/public/traces/${traceId}`, {
        headers: { Authorization: lfAuth },
      }),
      fetch(`${base}/api/public/observations?traceId=${traceId}`, {
        headers: { Authorization: lfAuth },
      }),
      fetch(`${base}/api/public/scores?traceId=${traceId}`, {
        headers: { Authorization: lfAuth },
      }),
    ])

    if (!traceRes.ok) {
      const status = traceRes.status === 404 ? 404 : 502
      return json({ error: `Trace not found or Langfuse error: ${traceRes.status}` }, status)
    }

    const trace = await traceRes.json()

    // Observations
    let observations = []
    if (obsRes.ok) {
      const obsData = await obsRes.json()
      observations = (obsData.data || []).map(o => ({
        id: o.id,
        name: o.name,
        type: o.type,
        startTime: o.startTime,
        endTime: o.endTime,
        model: o.model,
        input: o.input,
        output: o.output,
        metadata: o.metadata,
        usage: o.usage,
      }))
    }

    // Scores — flatten to just values for frontend
    let scores = {}
    if (scoresRes.ok) {
      const scoresData = await scoresRes.json()
      for (const s of (scoresData.data || [])) {
        scores[s.name] = s.value
      }
    }

    // Build Langfuse UI link
    const projectId = trace.projectId || ''
    const langfuseUrl = projectId
      ? `${base}/project/${projectId}/traces/${traceId}`
      : `${base}/trace/${traceId}`

    return json({
      id: trace.id,
      name: trace.name,
      timestamp: trace.timestamp,
      tags: trace.tags || [],
      metadata: trace.metadata,
      input: trace.input,
      output: trace.output,
      observations,
      scores,
      langfuseUrl,
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
