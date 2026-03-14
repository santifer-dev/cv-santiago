/**
 * Ops Dashboard API test suite.
 * Tests all 7 API endpoints: auth, stats, traces, trace detail, evals, prompts, rag-stats.
 * Requires `vercel dev` running on localhost:3000.
 *
 * Usage: npm run test:ops
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

const BASE_URL = process.env.OPS_TEST_BASE_URL || 'http://localhost:3000'
const SECRET = process.env.OPS_DASHBOARD_SECRET || 'test-ops-secret-123'

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

let passed = 0
let failed = 0

function assert(condition: boolean, msg: string) {
  if (condition) { passed++; console.log(`  \u2705 ${msg}`) }
  else { failed++; console.error(`  \u274c ${msg}`) }
}

async function fetchApi(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, options)
}

async function fetchAuthed(path: string, params?: Record<string, string>): Promise<Response> {
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  return fetch(url.toString(), {
    headers: { Authorization: `Bearer ${SECRET}` },
  })
}

async function jsonAuthed<T>(path: string, params?: Record<string, string>): Promise<T> {
  const res = await fetchAuthed(path, params)
  return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Preflight check
// ---------------------------------------------------------------------------

async function checkServerRunning(): Promise<boolean> {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(3000) })
    return res.ok || res.status < 500
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

async function testAuth() {
  console.log('\n--- AUTH (/api/ops/auth) ---')

  // POST required
  const getRes = await fetchApi('/api/ops/auth', { method: 'GET' })
  assert(getRes.status === 405, 'GET returns 405')

  // Wrong password
  const wrongRes = await fetchApi('/api/ops/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'wrong-password' }),
  })
  assert(wrongRes.status === 401, 'Wrong password returns 401')

  // Empty password
  const emptyRes = await fetchApi('/api/ops/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: '' }),
  })
  assert(emptyRes.status === 401, 'Empty password returns 401')

  // Correct password
  const okRes = await fetchApi('/api/ops/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: SECRET }),
  })
  assert(okRes.status === 200, 'Correct password returns 200')
  const okBody = await okRes.json() as { ok: boolean; token: string }
  assert(okBody.ok === true, 'Response has ok: true')
  assert(typeof okBody.token === 'string', 'Response has token string')

  // Invalid JSON body
  const badRes = await fetchApi('/api/ops/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not json',
  })
  assert(badRes.status === 400, 'Invalid body returns 400')
}

async function testAuthProtection() {
  console.log('\n--- AUTH PROTECTION (all endpoints) ---')

  const protectedEndpoints = [
    '/api/ops/stats',
    '/api/ops/traces',
    '/api/ops/evals',
    '/api/ops/prompts',
    '/api/ops/rag-stats',
  ]

  for (const endpoint of protectedEndpoints) {
    // No auth header
    const noAuth = await fetchApi(endpoint)
    assert(noAuth.status === 401, `${endpoint} without token returns 401`)

    // Wrong token
    const wrongAuth = await fetchApi(endpoint, {
      headers: { Authorization: 'Bearer wrong-token' },
    })
    assert(wrongAuth.status === 401, `${endpoint} with wrong token returns 401`)
  }
}

async function testStats() {
  console.log('\n--- STATS (/api/ops/stats) ---')

  const res = await fetchAuthed('/api/ops/stats')
  assert(res.status === 200, 'Returns 200')

  const data = await res.json() as Record<string, unknown>

  // Period
  assert(data.period != null, 'Has period object')
  const period = data.period as { days: number; from: string; to: string }
  assert(typeof period.days === 'number', 'period.days is number')
  assert(typeof period.from === 'string', 'period.from is string')
  assert(typeof period.to === 'string', 'period.to is string')

  // Totals
  assert(data.totals != null, 'Has totals object')
  const totals = data.totals as Record<string, unknown>
  const requiredTotalKeys = ['conversations', 'textConversations', 'voiceConversations', 'totalCost', 'avgCostPerConversation', 'avgLatencyMs']
  for (const key of requiredTotalKeys) {
    assert(key in totals, `totals.${key} exists`)
    assert(typeof totals[key] === 'number', `totals.${key} is number`)
  }

  // Daily
  assert(Array.isArray(data.daily), 'daily is array')
  const daily = data.daily as Array<Record<string, unknown>>
  if (daily.length > 0) {
    const d = daily[0]
    assert(typeof d.date === 'string', 'daily[0].date is string')
    assert(typeof d.conversations === 'number', 'daily[0].conversations is number')
    assert(d.cost != null, 'daily[0].cost exists')
    const cost = d.cost as Record<string, unknown>
    const costKeys = ['toolDecision', 'embedding', 'reranking', 'generation', 'voice', 'total']
    for (const key of costKeys) {
      assert(key in cost, `daily[0].cost.${key} exists`)
    }
    assert(typeof d.avgLatencyMs === 'number', 'daily[0].avgLatencyMs is number')
  }

  // Distributions
  assert(data.distributions != null, 'Has distributions object')
  const dist = data.distributions as Record<string, unknown>
  assert(dist.languages != null, 'distributions.languages exists')
  assert(dist.intents != null, 'distributions.intents exists')
  assert(dist.ragActivation != null, 'distributions.ragActivation exists')
  const rag = dist.ragActivation as { yes: number; no: number }
  assert(typeof rag.yes === 'number', 'ragActivation.yes is number')
  assert(typeof rag.no === 'number', 'ragActivation.no is number')

  // Custom days
  const res3 = await fetchAuthed('/api/ops/stats', { days: '3' })
  assert(res3.status === 200, 'Returns 200 with days=3')
  const data3 = await res3.json() as { period: { days: number } }
  assert(data3.period.days === 3, 'Respects days parameter')
}

async function testTraces() {
  console.log('\n--- TRACES (/api/ops/traces) ---')

  const res = await fetchAuthed('/api/ops/traces')
  assert(res.status === 200, 'Returns 200')

  const body = await res.json() as { data: Array<Record<string, unknown>>; total: number }
  assert(Array.isArray(body.data), 'Response has data array')
  assert(typeof body.total === 'number', 'Response has total number')

  if (body.data.length > 0) {
    const t = body.data[0]
    assert(typeof t.id === 'string', 'trace.id is string')
    assert(typeof t.timestamp === 'string', 'trace.timestamp is string')
    assert(Array.isArray(t.tags), 'trace.tags is array')
    assert(t.metadata != null, 'trace.metadata exists')
    assert(t.scores != null, 'trace.scores exists')

    const meta = t.metadata as Record<string, unknown>
    assert('lastUserMessage' in meta || meta.lastUserMessage === null, 'metadata has lastUserMessage key')
  }

  // Filter: lang
  const resEs = await fetchAuthed('/api/ops/traces', { lang: 'es', limit: '5' })
  assert(resEs.status === 200, 'lang=es filter returns 200')

  // Filter: mode
  const resVoice = await fetchAuthed('/api/ops/traces', { mode: 'voice', limit: '5' })
  assert(resVoice.status === 200, 'mode=voice filter returns 200')

  const resText = await fetchAuthed('/api/ops/traces', { mode: 'text', limit: '5' })
  assert(resText.status === 200, 'mode=text filter returns 200')

  // Filter: rag
  const resRag = await fetchAuthed('/api/ops/traces', { rag: 'yes', limit: '5' })
  assert(resRag.status === 200, 'rag=yes filter returns 200')

  // Filter: jailbreak
  const resJail = await fetchAuthed('/api/ops/traces', { jailbreak: 'true', limit: '5' })
  assert(resJail.status === 200, 'jailbreak=true filter returns 200')

  // Combined filters
  const resCombined = await fetchAuthed('/api/ops/traces', { lang: 'es', rag: 'yes', limit: '5' })
  assert(resCombined.status === 200, 'Combined filters return 200')

  // Pagination
  const resPage = await fetchAuthed('/api/ops/traces', { limit: '5', offset: '5' })
  assert(resPage.status === 200, 'Pagination (offset=5) returns 200')
}

async function testTraceDetail() {
  console.log('\n--- TRACE DETAIL (/api/ops/trace/[id]) ---')

  // First get a real trace ID
  const body = await jsonAuthed<{ data: Array<{ id: string }> }>('/api/ops/traces', { limit: '1' })

  if (body.data.length === 0) {
    console.log('  (skipped — no traces available)')
    return
  }

  const traceId = body.data[0].id
  const res = await fetchAuthed(`/api/ops/trace/${traceId}`)
  assert(res.status === 200, 'Returns 200 for valid trace ID')

  const detail = await res.json() as Record<string, unknown>
  assert(typeof detail.id === 'string', 'detail.id is string')
  assert(typeof detail.timestamp === 'string', 'detail.timestamp is string')
  assert(Array.isArray(detail.tags), 'detail.tags is array')
  assert(detail.metadata != null, 'detail.metadata exists')
  assert(Array.isArray(detail.observations), 'detail.observations is array')
  assert(detail.scores != null, 'detail.scores exists')

  // Observations shape
  if ((detail.observations as unknown[]).length > 0) {
    const obs = (detail.observations as Array<Record<string, unknown>>)[0]
    assert(typeof obs.name === 'string', 'observation.name is string')
    assert(typeof obs.type === 'string', 'observation.type is string')
    assert(typeof obs.startTime === 'string', 'observation.startTime is string')
  }

  // Non-existent trace
  const res404 = await fetchAuthed('/api/ops/trace/nonexistent-trace-id-999')
  assert(res404.status === 404 || res404.status === 502, 'Non-existent trace returns 404 or 502')
}

async function testEvals() {
  console.log('\n--- EVALS (/api/ops/evals) ---')

  const res = await fetchAuthed('/api/ops/evals')
  assert(res.status === 200, 'Returns 200')

  const data = await res.json() as Record<string, unknown>
  assert(typeof data.passRate === 'number', 'Has passRate (number)')
  assert(typeof data.totalTests === 'number', 'Has totalTests (number)')
  assert(typeof data.passed === 'number', 'Has passed (number)')
  assert(typeof data.failed === 'number', 'Has failed (number)')
  assert(Array.isArray(data.categories), 'Has categories (array)')

  const cats = data.categories as Array<Record<string, unknown>>
  if (cats.length > 0) {
    const cat = cats[0]
    assert(typeof cat.name === 'string', 'category.name is string')
    assert(typeof cat.total === 'number', 'category.total is number')
    assert(typeof cat.passed === 'number', 'category.passed is number')
    assert(typeof cat.passRate === 'number', 'category.passRate is number')
  }

  assert(data.passed! <= data.totalTests!, 'passed <= totalTests')
}

async function testPrompts() {
  console.log('\n--- PROMPTS (/api/ops/prompts) ---')

  const res = await fetchAuthed('/api/ops/prompts')
  assert(res.status === 200, 'Returns 200')

  const data = await res.json() as unknown
  // Response can be an array (direct versions) or object with versions key
  const versions = Array.isArray(data) ? data : (data as { versions?: unknown[] }).versions || []

  assert(Array.isArray(versions), 'Response contains versions array')

  if (versions.length > 0) {
    const v = versions[0] as Record<string, unknown>
    assert(typeof v.version === 'number', 'version.version is number')
    assert(typeof v.createdAt === 'string', 'version.createdAt is string')
    assert(Array.isArray(v.labels), 'version.labels is array')
    assert(typeof v.isActive === 'boolean', 'version.isActive is boolean')
  }
}

async function testRagStats() {
  console.log('\n--- RAG STATS (/api/ops/rag-stats) ---')

  const res = await fetchAuthed('/api/ops/rag-stats')
  assert(res.status === 200, 'Returns 200')

  const data = await res.json() as Record<string, unknown>
  assert(typeof data.totalChunks === 'number', 'Has totalChunks (number)')
  assert(Array.isArray(data.byArticle), 'Has byArticle (array)')

  const articles = data.byArticle as Array<Record<string, unknown>>
  if (articles.length > 0) {
    const a = articles[0]
    assert(typeof a.articleId === 'string', 'article.articleId is string')
    assert(typeof a.chunkCount === 'number', 'article.chunkCount is number')
  }

  assert(Array.isArray(data.voiceRateLimits), 'Has voiceRateLimits (array)')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n=== Ops Dashboard API Tests ===')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Secret: ${SECRET.slice(0, 4)}...\n`)

  // Check server is running
  const running = await checkServerRunning()
  if (!running) {
    console.error('Cannot connect to server. Start vercel dev first:')
    console.error(`  cd ${process.cwd()} && vercel dev`)
    process.exit(1)
  }

  await testAuth()
  await testAuthProtection()
  await testStats()
  await testTraces()
  await testTraceDetail()
  await testEvals()
  await testPrompts()
  await testRagStats()

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Passed: ${passed}  Failed: ${failed}`)
  console.log(`${'='.repeat(50)}\n`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
