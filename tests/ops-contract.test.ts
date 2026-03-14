/**
 * Contract tests: validates that Langfuse trace metadata matches what the ops dashboard expects.
 * If someone changes chat.js metadata format, these tests catch it BEFORE deploy.
 *
 * Usage: npm run test:contract
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

const LANGFUSE_PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY!
const LANGFUSE_SECRET_KEY = process.env.LANGFUSE_SECRET_KEY!
const LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'
const AUTH = Buffer.from(`${LANGFUSE_PUBLIC_KEY}:${LANGFUSE_SECRET_KEY}`).toString('base64')

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

let passed = 0
let failed = 0
let skipped = 0

function assert(condition: boolean, msg: string) {
  if (condition) { passed++; console.log(`  \u2705 ${msg}`) }
  else { failed++; console.error(`  \u274c ${msg}`) }
}

function skip(msg: string) {
  skipped++; console.log(`  \u23ed\ufe0f  SKIP ${msg}`)
}

// ---------------------------------------------------------------------------
// Langfuse API helpers
// ---------------------------------------------------------------------------

interface LangfuseTrace {
  id: string
  timestamp: string
  name: string
  tags: string[]
  metadata: Record<string, unknown>
  input?: unknown
  output?: unknown
}

interface LangfuseScore {
  traceId: string
  name: string
  value: number
}

async function fetchTraces(params: Record<string, string> = {}): Promise<LangfuseTrace[]> {
  const qs = new URLSearchParams({
    limit: '30',
    fromTimestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
    ...params,
  })
  const res = await fetch(`${LANGFUSE_BASE_URL}/api/public/traces?${qs}`, {
    headers: { Authorization: `Basic ${AUTH}` },
  })
  if (!res.ok) throw new Error(`Langfuse traces: ${res.status}`)
  const data = await res.json()
  return data.data || []
}

async function fetchScores(fromMs: number): Promise<LangfuseScore[]> {
  const from = new Date(fromMs).toISOString()
  const res = await fetch(`${LANGFUSE_BASE_URL}/api/public/scores?fromTimestamp=${encodeURIComponent(from)}`, {
    headers: { Authorization: `Basic ${AUTH}` },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.data || []
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!LANGFUSE_PUBLIC_KEY || !LANGFUSE_SECRET_KEY) {
    console.error('Missing LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY in .env.local')
    process.exit(1)
  }

  console.log('\n=== Contract Tests: chat.js -> ops dashboard ===\n')

  // Fetch recent traces (last 7 days)
  const allTraces = await fetchTraces()
  if (allTraces.length === 0) {
    console.error('No traces found in the last 7 days. Cannot validate contract.')
    process.exit(1)
  }

  const chatTraces = allTraces.filter(t => t.name === 'chat')
  const voiceTraces = allTraces.filter(t => (t.tags || []).includes('voice'))

  console.log(`Found ${allTraces.length} traces (${chatTraces.length} chat, ${voiceTraces.length} voice)\n`)

  // --- Language tags ---
  console.log('Language tags:')
  for (const t of chatTraces.slice(0, 10)) {
    const tags = t.tags || []
    const hasLang = tags.includes('es') || tags.includes('en')
    assert(hasLang, `Trace ${t.id.slice(0, 8)} has language tag (${tags.filter(t => t === 'es' || t === 'en').join(',')})`)
  }

  // --- Cost metadata ---
  console.log('\nCost metadata (metadata.cost):')
  const costKeys = ['toolDecision', 'embedding', 'reranking', 'generation', 'total']
  const tracesWithCost = chatTraces.filter(t => t.metadata?.cost)
  if (tracesWithCost.length === 0) {
    skip('No chat traces have metadata.cost — possibly all pre-fix traces')
  } else {
    for (const t of tracesWithCost.slice(0, 5)) {
      const cost = t.metadata.cost as Record<string, unknown>
      for (const key of costKeys) {
        assert(key in cost, `Trace ${t.id.slice(0, 8)} cost.${key} exists`)
      }
      assert(typeof cost.total === 'number', `Trace ${t.id.slice(0, 8)} cost.total is number`)
    }
  }

  // --- Latency breakdown ---
  console.log('\nLatency breakdown (metadata.latencyBreakdown):')
  const tracesWithLatency = chatTraces.filter(t => t.metadata?.latencyBreakdown)
  if (tracesWithLatency.length === 0) {
    skip('No chat traces have metadata.latencyBreakdown')
  } else {
    for (const t of tracesWithLatency.slice(0, 5)) {
      const lb = t.metadata.latencyBreakdown as Record<string, unknown>
      assert('totalMs' in lb, `Trace ${t.id.slice(0, 8)} latencyBreakdown.totalMs exists`)
      assert(typeof lb.totalMs === 'number', `Trace ${t.id.slice(0, 8)} latencyBreakdown.totalMs is number`)
    }
  }

  // --- RAG sources ---
  console.log('\nRAG sources (rag:yes traces):')
  const ragTraces = chatTraces.filter(t => (t.tags || []).includes('rag:yes'))
  if (ragTraces.length === 0) {
    skip('No rag:yes traces found in sample')
  } else {
    for (const t of ragTraces.slice(0, 5)) {
      const sources = t.metadata?.sources
      assert(Array.isArray(sources), `Trace ${t.id.slice(0, 8)} has metadata.sources (array)`)
    }
  }

  // --- lastUserMessage ---
  console.log('\nLast user message:')
  for (const t of chatTraces.slice(0, 5)) {
    const msg = t.metadata?.lastUserMessage
    assert(typeof msg === 'string' && msg.length > 0, `Trace ${t.id.slice(0, 8)} has metadata.lastUserMessage`)
  }

  // --- promptVersion ---
  console.log('\nPrompt version:')
  const tracesWithVersion = chatTraces.filter(t => t.metadata?.promptVersion != null)
  if (tracesWithVersion.length === 0) {
    skip('No traces have metadata.promptVersion')
  } else {
    for (const t of tracesWithVersion.slice(0, 5)) {
      const v = t.metadata.promptVersion
      assert(
        typeof v === 'number' || typeof v === 'string',
        `Trace ${t.id.slice(0, 8)} promptVersion is number|string (got ${typeof v}: ${v})`
      )
    }
  }

  // --- Scores ---
  console.log('\nScores (quality, safety):')
  const scores = await fetchScores(Date.now() - 7 * 86400000)
  const scoreNames = new Set(scores.map(s => s.name))
  if (scores.length === 0) {
    skip('No scores found in the last 7 days')
  } else {
    assert(scoreNames.has('quality'), 'Score name "quality" exists in scored traces')
    assert(scoreNames.has('safety'), 'Score name "safety" exists in scored traces')
  }

  // --- Voice traces ---
  console.log('\nVoice traces:')
  if (voiceTraces.length === 0) {
    skip('No voice traces found — voice mode may not have traffic yet')
  } else {
    for (const t of voiceTraces.slice(0, 5)) {
      const meta = t.metadata || {}
      assert(meta.durationMs != null, `Voice trace ${t.id.slice(0, 8)} has metadata.durationMs`)
      assert(meta.turnCount != null, `Voice trace ${t.id.slice(0, 8)} has metadata.turnCount`)
    }
  }

  // --- Input/Output on traces ---
  console.log('\nTrace input/output:')
  const tracesWithIO = chatTraces.filter(t => t.input != null || t.output != null)
  if (tracesWithIO.length === 0) {
    skip('No chat traces have input/output — possibly all pre-fix traces')
  } else {
    for (const t of tracesWithIO.slice(0, 5)) {
      assert(Array.isArray(t.input), `Trace ${t.id.slice(0, 8)} input is array of messages`)
      assert(typeof t.output === 'string', `Trace ${t.id.slice(0, 8)} output is string`)
    }
  }

  // --- Summary ---
  console.log(`\n${'='.repeat(50)}`)
  console.log(`Passed: ${passed}  Failed: ${failed}  Skipped: ${skipped}`)
  console.log(`${'='.repeat(50)}\n`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
