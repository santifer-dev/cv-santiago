import { validateOpsAuth } from '../_shared/ops-auth.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const auth = validateOpsAuth(req)
  if (!auth.ok) return auth.response

  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return json({
        chunks: [],
        totalChunks: 0,
        rateLimits: null,
        error: 'Supabase not configured',
      })
    }

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    }

    // Fetch chunk counts grouped by article_id using RPC or direct query
    // Supabase REST API: select article_id, count(*) from documents group by article_id
    // We use the PostgREST select syntax with a custom RPC, or query all chunks and aggregate.
    // Simplest approach: fetch all chunks with only the metadata column, aggregate client-side.
    // Better: use a select with a computed count. PostgREST doesn't natively support GROUP BY,
    // so we use an RPC if available, otherwise fetch distinct article_ids.

    const [chunksRes, rateLimitsRes] = await Promise.all([
      // Get all chunks — only select the fields we need for counting
      fetch(
        `${supabaseUrl}/rest/v1/documents?select=metadata`,
        { headers },
      ),
      // Get voice rate limits
      fetch(
        `${supabaseUrl}/rest/v1/voice_rate_limits?select=*&order=window_start.desc&limit=10`,
        { headers },
      ).catch(() => null),
    ])

    // Aggregate chunks by article_id
    let chunks = []
    let totalChunks = 0
    if (chunksRes.ok) {
      const rows = await chunksRes.json()
      totalChunks = rows.length
      const counts = {}
      for (const row of rows) {
        const id = row.metadata?.article_id || 'unknown'
        counts[id] = (counts[id] || 0) + 1
      }
      chunks = Object.entries(counts)
        .map(([articleId, chunkCount]) => ({ articleId, slug: articleId, chunkCount }))
        .sort((a, b) => b.chunkCount - a.chunkCount)
    }

    // Rate limits
    let voiceRateLimits = []
    if (rateLimitsRes?.ok) {
      const rlData = await rateLimitsRes.json()
      voiceRateLimits = (rlData || []).map(r => ({
        ip: r.ip || r.client_ip || 'unknown',
        count: r.request_count || r.count || 0,
        windowStart: r.last_used || r.window_start || new Date().toISOString(),
      }))
    }

    return json({
      byArticle: chunks,
      totalChunks,
      voiceRateLimits,
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
