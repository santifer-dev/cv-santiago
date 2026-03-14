import { validateOpsAuth, langfuseAuth, langfuseBaseUrl } from '../_shared/ops-auth.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const auth = validateOpsAuth(req)
  if (!auth.ok) return auth.response

  try {
    const lfAuth = langfuseAuth()
    if (!lfAuth) return json({ error: 'Langfuse not configured' }, 503)

    const base = langfuseBaseUrl()

    const res = await fetch(`${base}/api/public/v2/prompts/chatbot-system`, {
      headers: { Authorization: lfAuth },
    })

    if (!res.ok) {
      // 404 means prompt doesn't exist yet — return empty
      if (res.status === 404) {
        return json({ versions: [] })
      }
      return json({ error: `Langfuse error: ${res.status}` }, 502)
    }

    const data = await res.json()

    // Langfuse v2 prompt API returns a single prompt object with versions
    // or a list depending on the endpoint. Handle both shapes.
    let versions = []

    if (Array.isArray(data)) {
      versions = data
    } else if (data.versions) {
      versions = data.versions
    } else if (data.version != null) {
      // Single prompt object — wrap in array
      versions = [data]
    }

    const mapped = versions.map(v => ({
      version: v.version,
      createdAt: v.createdAt,
      labels: v.labels || [],
      isActive: (v.labels || []).includes('production') || (v.labels || []).includes('latest'),
      promptLength: typeof v.prompt === 'string' ? v.prompt.length : JSON.stringify(v.prompt || '').length,
    }))

    // Sort by version descending
    mapped.sort((a, b) => b.version - a.version)

    return json(mapped)
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
