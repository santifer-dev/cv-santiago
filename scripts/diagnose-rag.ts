#!/usr/bin/env npx tsx
/**
 * RAG Diagnostic — Analyzes recent traces to detect retrieval misses.
 *
 * Compares what the RAG found (metadata.sources) against what it SHOULD
 * have found based on keyword matching against the article registry.
 *
 * Usage: npm run diagnose:rag
 *        npm run diagnose:rag -- --days=7 --limit=50
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

const LANGFUSE_PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY!
const LANGFUSE_SECRET_KEY = process.env.LANGFUSE_SECRET_KEY!
const LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'
const AUTH = Buffer.from(`${LANGFUSE_PUBLIC_KEY}:${LANGFUSE_SECRET_KEY}`).toString('base64')

// ─── Article keyword map ───
// Maps keywords to articles that SHOULD be found when those keywords appear.
// This is the "ground truth" that the RAG should discover.
const ARTICLE_KEYWORDS: Record<string, string[]> = {
  'n8n-for-pms': ['n8n', 'workflow', 'automation', 'automatable friday', 'intelligent router', 'maven', 'marily'],
  'jacobo': ['jacobo', 'agente', 'agent', 'omnicanal', 'whatsapp', 'sub-agent', 'tool calling', 'hitl', 'n8n', 'airtable', 'presupuest'],
  'business-os': ['erp', 'business os', 'airtable', 'operaciones', 'operations', 'crm', 'inventario', 'inventory', 'n8n'],
  'programmatic-seo': ['seo', 'programat', 'paginas', 'pages', 'dataforseo', 'indexa', 'impresiones', 'impressions'],
  'self-healing-chatbot': ['chatbot', 'rag', 'langfuse', 'evals', 'jailbreak', 'prompt', 'defensa', 'defense', 'scoring'],
}

// Reverse map: keyword → articles
function findExpectedArticles(query: string): string[] {
  const q = query.toLowerCase()
  const expected = new Set<string>()

  for (const [articleId, keywords] of Object.entries(ARTICLE_KEYWORDS)) {
    for (const kw of keywords) {
      if (q.includes(kw.toLowerCase())) {
        expected.add(articleId)
        break
      }
    }
  }

  return [...expected]
}

interface Trace {
  id: string
  timestamp: string
  tags: string[]
  metadata: {
    lastUserMessage?: string
    ragUsed?: boolean
    sources?: string[]
  }
}

async function fetchTraces(days: number, limit: number): Promise<Trace[]> {
  const from = new Date(Date.now() - days * 86400000).toISOString()
  const res = await fetch(
    `${LANGFUSE_BASE_URL}/api/public/traces?limit=${limit}&fromTimestamp=${from}&tags=rag:yes`,
    { headers: { Authorization: `Basic ${AUTH}` } },
  )
  if (!res.ok) {
    console.error(`Langfuse error: ${res.status}`)
    return []
  }
  const data = await res.json()
  return (data.data || []).filter((t: Trace) =>
    t.name === 'chat' && !(t.tags || []).some(tag => tag.startsWith('source:')),
  )
}

// ─── Colors ───
const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m',
}

async function main() {
  const args = process.argv.slice(2)
  const daysArg = args.find(a => a.startsWith('--days='))
  const days = daysArg ? parseInt(daysArg.split('=')[1]) : 7
  const limitArg = args.find(a => a.startsWith('--limit='))
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 50

  console.log(`\n${c.bold}${c.cyan}RAG Diagnostic${c.reset}`)
  console.log(`${c.dim}Last ${days} days, up to ${limit} RAG traces (real traffic only)${c.reset}\n`)

  const traces = await fetchTraces(days, limit)

  if (traces.length === 0) {
    console.log(`${c.yellow}No RAG traces found${c.reset}`)
    return
  }

  let perfect = 0
  let misses = 0
  const missDetails: Array<{ query: string; found: string[]; missed: string[]; traceId: string }> = []

  for (const t of traces) {
    const query = t.metadata?.lastUserMessage || ''
    const found = t.metadata?.sources || []
    const expected = findExpectedArticles(query)

    if (expected.length === 0) continue // Can't evaluate if no keywords match

    const missed = expected.filter(e => !found.includes(e))

    if (missed.length === 0) {
      perfect++
    } else {
      misses++
      missDetails.push({ query, found, missed, traceId: t.id })
    }
  }

  const total = perfect + misses
  const hitRate = total > 0 ? (perfect / total * 100).toFixed(1) : '0'

  console.log(`${c.bold}Results:${c.reset}`)
  console.log(`  Total RAG traces analyzed: ${traces.length}`)
  console.log(`  Traces with keyword matches: ${total}`)
  console.log(`  ${c.green}Perfect retrieval: ${perfect}${c.reset}`)
  console.log(`  ${misses > 0 ? c.red : c.green}Missed articles: ${misses}${c.reset}`)
  console.log(`  Hit rate: ${hitRate}%\n`)

  if (missDetails.length > 0) {
    console.log(`${c.bold}${c.red}Retrieval Misses:${c.reset}\n`)

    for (const miss of missDetails) {
      console.log(`  ${c.yellow}Query:${c.reset} "${miss.query}"`)
      console.log(`  ${c.green}Found:${c.reset} [${miss.found.join(', ') || 'none'}]`)
      console.log(`  ${c.red}Missed:${c.reset} [${miss.missed.join(', ')}]`)
      console.log(`  ${c.dim}Trace: ${miss.traceId.slice(0, 8)}...${c.reset}`)
      console.log()
    }

    // Suggest fixes
    console.log(`${c.bold}${c.cyan}Suggested Fixes:${c.reset}\n`)

    // Count which articles are most missed
    const missCount: Record<string, number> = {}
    for (const m of missDetails) {
      for (const article of m.missed) {
        missCount[article] = (missCount[article] || 0) + 1
      }
    }

    const sorted = Object.entries(missCount).sort((a, b) => b[1] - a[1])
    for (const [article, count] of sorted) {
      console.log(`  ${c.yellow}${article}${c.reset} missed ${count} time(s)`)
      console.log(`  ${c.dim}→ Consider adding cross-references in RAG chunks or broadening search query${c.reset}`)
    }

    console.log(`\n  ${c.bold}General recommendations:${c.reset}`)
    console.log(`  1. Add to PORTFOLIO_TOOL description: "Use SHORT, generic queries for broad topics"`)
    console.log(`  2. Consider multi-query RAG (generate 2-3 queries per search)`)
    console.log(`  3. Add cross-references between related article chunks`)
  } else {
    console.log(`${c.green}${c.bold}All RAG retrievals matched expected articles!${c.reset}`)
  }
}

main().catch(console.error)
