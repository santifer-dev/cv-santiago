/**
 * Post-prerender validation for SEO + GEO invariants.
 *
 * Runs AFTER prerender to validate the static HTML output in dist/.
 * Each warning includes a skill hint so the developer knows which
 * Claude Code skill to invoke for the fix.
 *
 * Usage:
 *   npx tsx --tsconfig tsconfig.app.json scripts/validate-prerender.ts
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { articleRegistry, type ArticleConfig } from '../src/articles/registry.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Severity = 'error' | 'warn'
interface Issue { severity: Severity; msg: string; skill?: string }

// ---------------------------------------------------------------------------
// Per-article HTML checks
// ---------------------------------------------------------------------------

function validatePrerenderHtml(id: string, slug: string, lang: 'es' | 'en'): Issue[] {
  const issues: Issue[] = []
  const htmlPath = resolve(dist, slug, 'index.html')

  if (!existsSync(htmlPath)) {
    issues.push({ severity: 'error', msg: `Prerendered HTML not found: dist/${slug}/index.html` })
    return issues
  }

  const html = readFileSync(htmlPath, 'utf-8')

  // 1. JSON-LD: article schema present
  const jsonLdBlocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []
  const articleJsonLd = jsonLdBlocks.find(block =>
    block.includes('"TechArticle"') || block.includes('"Article"') || block.includes('"BlogPosting"')
  )
  if (!articleJsonLd) {
    issues.push({
      severity: 'error',
      msg: `Article JSON-LD missing in prerender. Add seoMeta to registry.`,
      skill: '/seo schema',
    })
  }

  // 2. Meta description length
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)
  if (descMatch) {
    const descLen = descMatch[1].length
    if (descLen > 160) {
      issues.push({
        severity: 'warn',
        msg: `Meta description too long: ${descLen} chars (max 160).`,
        skill: '/seo content',
      })
    }
    if (descLen < 70) {
      issues.push({
        severity: 'warn',
        msg: `Meta description too short: ${descLen} chars (min ~70).`,
        skill: '/seo content',
      })
    }
  } else {
    issues.push({ severity: 'error', msg: 'Meta description not found in prerender' })
  }

  // 3. Title tag length
  const titleMatch = html.match(/<title>([^<]*)<\/title>/)
  if (titleMatch) {
    if (titleMatch[1].length > 70) {
      issues.push({
        severity: 'warn',
        msg: `Title tag: ${titleMatch[1].length} chars (ideal ≤60, truncates ~70).`,
        skill: '/seo page',
      })
    }
  } else {
    issues.push({ severity: 'error', msg: 'Title tag not found' })
  }

  // 4. article:published_time + modified_time
  if (!html.includes('article:published_time')) {
    issues.push({ severity: 'warn', msg: 'article:published_time missing', skill: '/seo page' })
  }
  if (!html.includes('article:modified_time')) {
    issues.push({ severity: 'warn', msg: 'article:modified_time missing', skill: '/seo page' })
  }

  // 5. Canonical
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)
  if (canonicalMatch) {
    if (!canonicalMatch[1].includes(slug)) {
      issues.push({ severity: 'error', msg: `Canonical doesn't match slug: ${canonicalMatch[1]}`, skill: '/seo technical' })
    }
  } else {
    issues.push({ severity: 'error', msg: 'Canonical tag not found', skill: '/seo technical' })
  }

  // 6. Hreflang
  if (!html.includes('hreflang="en"') || !html.includes('hreflang="es"')) {
    issues.push({ severity: 'warn', msg: 'Hreflang incomplete (need en + es)', skill: '/seo hreflang' })
  }

  // 7. OG image
  if (!html.includes('og:image')) {
    issues.push({ severity: 'error', msg: 'og:image missing', skill: '/seo page' })
  }

  // 8. Images without alt
  const imgTags = html.match(/<img\s[^>]*>/g) || []
  const noAlt = imgTags.filter(tag => !tag.includes('alt='))
  if (noAlt.length > 0) {
    issues.push({ severity: 'warn', msg: `${noAlt.length} image(s) without alt text`, skill: '/seo images' })
  }

  // 9. H1 unique
  const h1s = html.match(/<h1[\s>]/g) || []
  if (h1s.length === 0) {
    issues.push({ severity: 'error', msg: 'No H1 found', skill: '/seo page' })
  } else if (h1s.length > 1) {
    issues.push({ severity: 'warn', msg: `${h1s.length} H1 tags (should be 1)`, skill: '/seo page' })
  }

  // 10. JSON-LD image (for rich results + GEO)
  if (articleJsonLd) {
    if (!articleJsonLd.includes('"image"')) {
      issues.push({ severity: 'warn', msg: 'JSON-LD missing "image" — poor rich results + GEO visibility', skill: '/seo schema' })
    }
  }

  // 11. GEO: JSON-LD image should be hero, not OG
  if (articleJsonLd) {
    const imgInLd = articleJsonLd.match(/"image"\s*:\s*\[\s*"([^"]+)"/)
    if (imgInLd && (imgInLd[1].includes('og-') || imgInLd[1].includes('og_'))) {
      issues.push({
        severity: 'warn',
        msg: `JSON-LD image uses OG card instead of hero. Set heroImage in registry.`,
        skill: '/seo geo',
      })
    }
  }

  // 12. GEO: citability — first 300 chars should have definition or number
  const bodyStart = html.match(/<article[^>]*>([\s\S]{0,1000})/)?.[1] || ''
  const stripped = bodyStart.replace(/<[^>]+>/g, '').trim().slice(0, 300)
  if (stripped.length > 50) {
    const hasDef = /\b(is|means|refers to|es|significa|se refiere)\b/i.test(stripped)
    const hasNum = /\d/.test(stripped)
    if (!hasDef && !hasNum) {
      issues.push({
        severity: 'warn',
        msg: 'GEO: first 300 chars lack definition ("X is/means...") and numbers. Low AI citability.',
        skill: '/seo geo',
      })
    }
  }

  // 13. Broken internal links
  const linkMatches = html.match(/<a\s[^>]*href="(\/[^"#]*)"/g) || []
  for (const tag of linkMatches) {
    const hrefMatch = tag.match(/href="(\/[^"#]*)"/)
    if (!hrefMatch) continue
    const href = hrefMatch[1]
    // Skip special paths
    if (href.startsWith('/api/') || href.startsWith('/ops')) continue
    // Check if file exists: dist/{path}/index.html or dist/{path}
    const cleanPath = href.replace(/\/$/, '') || ''
    const candidate1 = resolve(dist, cleanPath.slice(1), 'index.html')
    const candidate2 = resolve(dist, cleanPath.slice(1))
    if (!existsSync(candidate1) && !existsSync(candidate2)) {
      issues.push({
        severity: 'warn',
        msg: `Broken internal link: ${href}`,
        skill: '/seo technical',
      })
    }
  }

  // 14. Word count minimum
  const fullStripped = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ')
  const wordCount = fullStripped.split(/\s+/).filter(w => w.length > 0).length
  if (wordCount < 1500) {
    issues.push({
      severity: 'warn',
      msg: `Low word count: ${wordCount} words (min 1500 for articles).`,
      skill: '/seo content',
    })
  }

  // 15. Heading hierarchy — no skipped levels
  const headingMatches = html.match(/<h([1-6])[\s>]/g) || []
  const levels = headingMatches.map(m => parseInt(m.match(/<h([1-6])/)?.[1] || '0'))
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      issues.push({
        severity: 'warn',
        msg: `Heading hierarchy skip: h${levels[i - 1]} -> h${levels[i]} (missing h${levels[i - 1] + 1}).`,
        skill: '/seo page',
      })
      break // one warning is enough
    }
  }

  // 16. OG image format check
  const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/)
  if (ogImageMatch) {
    const ogUrl = ogImageMatch[1]
    if (!ogUrl || !ogUrl.startsWith('https://')) {
      issues.push({
        severity: 'warn',
        msg: `og:image URL invalid or not HTTPS: "${ogUrl}"`,
        skill: '/seo images',
      })
    }
  }

  return issues
}

// ---------------------------------------------------------------------------
// Registry config checks (catch issues before HTML)
// ---------------------------------------------------------------------------

function validateRegistryConfig(config: ArticleConfig): Issue[] {
  const issues: Issue[] = []

  if (!config.seoMeta) {
    issues.push({ severity: 'error', msg: 'seoMeta missing — no JSON-LD in prerender', skill: '/seo schema' })
    return issues
  }

  if (!config.heroImage) {
    issues.push({ severity: 'warn', msg: 'heroImage missing — JSON-LD uses ogImage. Set heroImage for GEO.', skill: '/seo geo' })
  }

  if (!config.ogImage) {
    issues.push({ severity: 'warn', msg: 'ogImage missing — social cards use default', skill: '/seo page' })
  }

  const meta = config.seoMeta
  if (meta.keywords.length < 5) {
    issues.push({ severity: 'warn', msg: `Only ${meta.keywords.length} keywords (recommend 10+)`, skill: '/seo content' })
  }

  if (meta.about.length === 0) {
    issues.push({ severity: 'warn', msg: 'No "about" entities — weakens JSON-LD', skill: '/seo schema' })
  }

  if (!meta.articleTags || meta.articleTags.split(',').length < 3) {
    issues.push({ severity: 'warn', msg: 'Fewer than 3 article tags', skill: '/seo content' })
  }

  for (const lang of ['es', 'en'] as const) {
    if (!config.seo[lang]?.description) {
      issues.push({ severity: 'error', msg: `SEO description missing [${lang}]`, skill: '/seo content' })
    }
  }

  return issues
}

// ---------------------------------------------------------------------------
// Global file checks
// ---------------------------------------------------------------------------

function validateGlobalFiles(): Issue[] {
  const issues: Issue[] = []

  const robotsPath = resolve(dist, 'robots.txt')
  if (existsSync(robotsPath)) {
    const robots = readFileSync(robotsPath, 'utf-8')
    for (const crawler of ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'OAI-SearchBot']) {
      if (!robots.includes(crawler)) {
        issues.push({ severity: 'warn', msg: `robots.txt missing AI crawler: ${crawler}`, skill: '/seo geo' })
      }
    }
    if (!robots.includes('Sitemap:')) {
      issues.push({ severity: 'warn', msg: 'robots.txt missing Sitemap directive', skill: '/seo technical' })
    }
  } else {
    issues.push({ severity: 'error', msg: 'robots.txt not found' })
  }

  const llmsPath = resolve(dist, 'llms.txt')
  if (existsSync(llmsPath)) {
    const llms = readFileSync(llmsPath, 'utf-8')
    if (llms.includes('56 automated evals') || llms.includes('56 evals')) {
      issues.push({ severity: 'warn', msg: 'llms.txt has stale "56" eval count', skill: '/seo content' })
    }
  } else {
    issues.push({ severity: 'warn', msg: 'llms.txt not found — hurts AI search visibility', skill: '/seo geo' })
  }

  const vercelJsonPath = resolve(root, 'vercel.json')
  if (existsSync(vercelJsonPath)) {
    const vj = readFileSync(vercelJsonPath, 'utf-8')
    for (const h of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']) {
      if (!vj.includes(h)) {
        issues.push({ severity: 'warn', msg: `vercel.json missing header: ${h}`, skill: '/seo technical' })
      }
    }
  }

  // Image size budget — scan dist/ recursively
  // HD images (used as DiagramZoom lightbox) get a higher threshold (500KB warn, 1MB error)
  // Exceptions file lists images allowed to exceed 200KB with justification
  const imageExts = new Set(['.webp', '.png', '.jpg', '.jpeg'])
  const isHdImage = (name: string) => name.includes('-hd.') || name.includes('-hd-') || name.includes('-full.')
  const exceptionsPath = resolve(root, 'scripts', 'image-budget-exceptions.json')
  const imageExceptions = new Set<string>()
  if (existsSync(exceptionsPath)) {
    const data = JSON.parse(readFileSync(exceptionsPath, 'utf-8'))
    for (const e of data.exceptions) imageExceptions.add(e.path)
  }
  function scanImages(dir: string) {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = resolve(dir, entry.name)
      if (entry.isDirectory()) {
        scanImages(fullPath)
      } else {
        const ext = entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase()
        if (imageExts.has(ext)) {
          const size = statSync(fullPath).size
          const sizeKB = Math.round(size / 1024)
          const relPath = fullPath.replace(dist + '/', '')
          if (isHdImage(entry.name)) {
            // HD lightbox images: relaxed thresholds
            if (size > 1024 * 1024) {
              issues.push({ severity: 'error', msg: `HD image too large: ${relPath} (${sizeKB}KB > 1MB)`, skill: '/seo images' })
            }
            // No warn for HD images 200-1MB — they need to be big for zoom
          } else if (imageExceptions.has(relPath)) {
            // Excepted images: only error if >500KB
            if (size > 500 * 1024) {
              issues.push({ severity: 'error', msg: `Excepted image too large: ${relPath} (${sizeKB}KB > 500KB)`, skill: '/seo images' })
            }
          } else {
            // Regular images: strict thresholds
            if (size > 500 * 1024) {
              issues.push({ severity: 'error', msg: `Image too large: ${relPath} (${sizeKB}KB > 500KB)`, skill: '/seo images' })
            } else if (size > 200 * 1024) {
              issues.push({ severity: 'warn', msg: `Image over budget: ${relPath} (${sizeKB}KB > 200KB)`, skill: '/seo images' })
            }
          }
        }
      }
    }
  }
  scanImages(dist)

  // Bundle size budget — check dist/assets/ for JS and CSS
  const assetsDir = resolve(dist, 'assets')
  if (existsSync(assetsDir)) {
    for (const entry of readdirSync(assetsDir)) {
      const fullPath = resolve(assetsDir, entry)
      const stat = statSync(fullPath)
      if (!stat.isFile()) continue
      const sizeKB = Math.round(stat.size / 1024)
      if (entry.endsWith('.js') && stat.size > 500 * 1024) {
        issues.push({ severity: 'warn', msg: `JS bundle over budget: assets/${entry} (${sizeKB}KB > 500KB)`, skill: '/seo technical' })
      }
      if (entry.endsWith('.css') && stat.size > 100 * 1024) {
        issues.push({ severity: 'warn', msg: `CSS bundle over budget: assets/${entry} (${sizeKB}KB > 100KB)`, skill: '/seo technical' })
      }
    }
  }

  return issues
}

// ---------------------------------------------------------------------------
// Helpers for cross-article checks
// ---------------------------------------------------------------------------

function extractMetaDescription(htmlPath: string): string | null {
  if (!existsSync(htmlPath)) return null
  const html = readFileSync(htmlPath, 'utf-8')
  const match = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)
  return match ? match[1] : null
}

function extractWordCount(htmlPath: string): number {
  if (!existsSync(htmlPath)) return 0
  const html = readFileSync(htmlPath, 'utf-8')
  const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ')
  return stripped.split(/\s+/).filter(w => w.length > 0).length
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('\n[validate-prerender] Post-prerender SEO + GEO validation\n')

let totalErrors = 0
let totalWarnings = 0

function printIssues(issues: Issue[], label: string) {
  const errors = issues.filter(i => i.severity === 'error').length
  const warnings = issues.filter(i => i.severity === 'warn').length
  totalErrors += errors
  totalWarnings += warnings

  if (issues.length === 0) return

  const icon = errors > 0 ? '\x1b[31m✗\x1b[0m' : '\x1b[33m⚠\x1b[0m'
  console.log(`${icon} ${label} — ${errors} errors, ${warnings} warnings`)
  for (const issue of issues) {
    const prefix = issue.severity === 'error' ? '\x1b[31m  ERR\x1b[0m' : '\x1b[33m  WARN\x1b[0m'
    const hint = issue.skill ? ` → run ${issue.skill}` : ''
    console.log(`${prefix}  ${issue.msg}${hint}`)
  }
}

// Registry checks
for (const article of articleRegistry) {
  if (article.type === 'bridge') continue
  printIssues(validateRegistryConfig(article), `${article.id} [registry]`)
}

// Per-article HTML checks + collect data for cross-article validation
const metaDescriptions: Map<string, string[]> = new Map() // description -> [labels]
const wordCounts: Map<string, { es: number; en: number }> = new Map()

for (const article of articleRegistry) {
  if (article.type === 'bridge') continue
  for (const [lang, slug] of Object.entries(article.slugs) as ['es' | 'en', string][]) {
    const issues = validatePrerenderHtml(article.id, slug, lang)
    if (issues.length > 0) {
      printIssues(issues, `${article.id} [${lang}]`)
    } else {
      console.log(`\x1b[32m✓\x1b[0m ${article.id} [${lang}] — clean`)
    }

    // Collect meta description
    const htmlPath = resolve(dist, slug, 'index.html')
    const desc = extractMetaDescription(htmlPath)
    if (desc) {
      const label = `${article.id} [${lang}]`
      const existing = metaDescriptions.get(desc) || []
      existing.push(label)
      metaDescriptions.set(desc, existing)
    }

    // Collect word count
    const wc = extractWordCount(htmlPath)
    const counts = wordCounts.get(article.id) || { es: 0, en: 0 }
    counts[lang] = wc
    wordCounts.set(article.id, counts)
  }
}

// Cross-article checks
const crossIssues: Issue[] = []

// 17. Duplicate meta descriptions
for (const [desc, labels] of metaDescriptions) {
  if (labels.length > 1) {
    crossIssues.push({
      severity: 'warn',
      msg: `Duplicate meta description across: ${labels.join(', ')} — "${desc.slice(0, 60)}..."`,
      skill: '/seo content',
    })
  }
}

// 18. ES/EN content parity
for (const article of articleRegistry) {
  if (article.type === 'bridge') continue
  const counts = wordCounts.get(article.id)
  if (!counts || counts.es === 0 || counts.en === 0) continue
  const ratio = Math.min(counts.es, counts.en) / Math.max(counts.es, counts.en)
  if (ratio < 0.7) {
    const shorter = counts.es < counts.en ? 'ES' : 'EN'
    crossIssues.push({
      severity: 'warn',
      msg: `${article.id}: ${shorter} version has ${Math.round(ratio * 100)}% of the other's word count (ES: ${counts.es}, EN: ${counts.en}).`,
      skill: '/seo hreflang',
    })
  }
}

if (crossIssues.length > 0) {
  printIssues(crossIssues, 'Cross-article checks')
} else {
  console.log(`\x1b[32m✓\x1b[0m Cross-article checks — clean`)
}

// Global checks
const globalIssues = validateGlobalFiles()
if (globalIssues.length > 0) {
  printIssues(globalIssues, 'Global files')
} else {
  console.log(`\n\x1b[32m✓\x1b[0m Global files — clean`)
}

console.log(`\nPages: ${articleRegistry.filter(a => a.type !== 'bridge').length * 2} | Errors: ${totalErrors} | Warnings: ${totalWarnings}\n`)

if (totalErrors > 0) {
  console.error('\x1b[31m✗ Prerender validation failed. Fix errors before deploying.\x1b[0m\n')
  process.exit(1)
}

console.log('\x1b[32m✓ Prerender validation passed.\x1b[0m\n')
