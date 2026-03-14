#!/usr/bin/env npx tsx

/**
 * Reads the latest eval report from evals/results/ and writes a JSON summary
 * to api/ops/_eval-results.json so the Edge function can import it.
 *
 * Run: npx tsx scripts/embed-evals.ts
 * Called automatically during `npm run build`.
 */

import * as fs from 'fs'
import * as path from 'path'

const RESULTS_DIR = path.join(import.meta.dirname, '..', 'evals', 'results')
const OUTPUT_JSON = path.join(import.meta.dirname, '..', 'api', 'ops', '_eval-results.json')
const OUTPUT_JS = path.join(import.meta.dirname, '..', 'api', 'ops', '_eval-results.js')

interface EvalTest {
  name: string
  passed: boolean
  reason?: string
}

interface EvalCategory {
  name: string
  total: number
  passed: number
  passRate: number
  tests: EvalTest[]
}

interface EvalResults {
  date: string
  passRate: number
  totalTests: number
  passed: number
  failed: number
  categories: Array<{ name: string; total: number; passed: number; passRate: number }>
  failedTests: Array<{ name: string; category: string; reason: string }>
}

function findLatestReport(): string | null {
  if (!fs.existsSync(RESULTS_DIR)) return null

  const files = fs.readdirSync(RESULTS_DIR)
    .filter(f => f.startsWith('report-') && f.endsWith('.md'))
    .sort()

  return files.length > 0 ? path.join(RESULTS_DIR, files[files.length - 1]) : null
}

function parseReport(content: string): EvalResults {
  const categories: EvalCategory[] = []
  let totalTests = 0
  let totalPassed = 0
  let totalFailed = 0
  let date = ''

  // Extract date from title: # Eval Report - 2026-03-14T10-30-00
  const titleMatch = content.match(/# Eval Report - (\S+)/)
  if (titleMatch) {
    date = titleMatch[1].replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3')
  }

  // Parse Summary table for totals
  const totalMatch = content.match(/\| Total Tests \| (\d+) \|/)
  const passedMatch = content.match(/\| Passed \| (\d+) \|/)
  const failedMatch = content.match(/\| Failed \| (\d+) \|/)

  if (totalMatch) totalTests = parseInt(totalMatch[1])
  if (passedMatch) totalPassed = parseInt(passedMatch[1])
  if (failedMatch) totalFailed = parseInt(failedMatch[1])

  // Parse Results by Category table
  // Format: | emoji name | passed | total | rate% |
  const catTableRegex = /\| [✅⚠️❌]+ (.+?) \| (\d+) \| (\d+) \| (\d+)% \|/g
  let catMatch
  while ((catMatch = catTableRegex.exec(content)) !== null) {
    categories.push({
      name: catMatch[1].trim(),
      passed: parseInt(catMatch[2]),
      total: parseInt(catMatch[3]),
      passRate: parseInt(catMatch[4]) / 100,
      tests: [],
    })
  }

  // Parse Detailed Results to get individual test results
  // Format: #### emoji testId
  const detailedSections = content.split(/### (.+)\n/)
  let currentCatName = ''

  for (let i = 1; i < detailedSections.length; i += 2) {
    const sectionTitle = detailedSections[i]?.trim()
    const sectionBody = detailedSections[i + 1] || ''

    // Category headers are like "factual" (matching category names)
    const cat = categories.find(c => c.name === sectionTitle)
    if (cat) {
      currentCatName = sectionTitle
      // Parse individual tests within this section
      const testBlocks = sectionBody.split(/#### [✅❌] /)
      for (let j = 1; j < testBlocks.length; j++) {
        const block = testBlocks[j]
        const testIdMatch = block.match(/^(\S+)/)
        if (!testIdMatch) continue

        const testId = testIdMatch[1]
        const passed = !sectionBody.includes(`#### ❌ ${testId}`)

        let reason = ''
        if (!passed) {
          // Extract failed assertion reason
          const reasonMatch = block.match(/- ❌ (.+)/)
          if (reasonMatch) reason = reasonMatch[1]
        }

        cat.tests.push({ name: testId, passed, reason: reason || undefined })
      }
    }
  }

  // Build failedTests array
  const failedTests: Array<{ name: string; category: string; reason: string }> = []
  for (const cat of categories) {
    for (const test of cat.tests) {
      if (!test.passed) {
        failedTests.push({
          name: test.name,
          category: cat.name,
          reason: test.reason || 'Assertion failed',
        })
      }
    }
  }

  const passRate = totalTests > 0 ? totalPassed / totalTests : 0

  return {
    date: date || new Date().toISOString(),
    passRate,
    totalTests,
    passed: totalPassed,
    failed: totalFailed,
    categories: categories.map(c => ({
      name: c.name,
      total: c.total,
      passed: c.passed,
      passRate: c.passRate,
    })),
    failedTests,
  }
}

function generatePlaceholder(): EvalResults {
  return {
    date: new Date().toISOString(),
    passRate: 0,
    totalTests: 0,
    passed: 0,
    failed: 0,
    categories: [],
    failedTests: [],
  }
}

function main() {
  const reportPath = findLatestReport()

  let results: EvalResults

  if (reportPath) {
    console.log(`📋 Parsing eval report: ${path.basename(reportPath)}`)
    const content = fs.readFileSync(reportPath, 'utf-8')
    results = parseReport(content)
    console.log(`   ${results.passed}/${results.totalTests} passed (${Math.round(results.passRate * 100)}%)`)
  } else {
    console.log('⚠️  No eval reports found in evals/results/ — writing placeholder')
    console.log('   Run "npm run evals" to generate real results')
    results = generatePlaceholder()
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2))
  // Also write as JS module for Edge Runtime compatibility (no import assertions needed)
  fs.writeFileSync(OUTPUT_JS, `export default ${JSON.stringify(results)}`)
  console.log(`✅ Wrote ${OUTPUT_JSON} + ${OUTPUT_JS}`)
}

main()
