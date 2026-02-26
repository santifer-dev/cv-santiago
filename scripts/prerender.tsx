/**
 * Post-build script: SSR prerender using React's renderToString.
 *
 * Renders the actual App component to HTML so the pre-rendered content
 * matches exactly what React produces. This enables hydrateRoot() on the
 * client to adopt the existing DOM without replacing it (zero CLS).
 *
 * Articles are loaded from the article registry. Only articles whose
 * component files exist will be prerendered (new case studies added to the
 * registry but not yet created will be skipped gracefully).
 *
 * Usage: npx tsx scripts/prerender.tsx  (runs automatically via "npm run build")
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import React, { type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router-dom';
import Critters from 'critters';
import App from '../src/App.tsx';
import GlobalNav from '../src/GlobalNav.tsx';
import { articleRegistry, type ArticleConfig } from '../src/articles/registry.ts';
import { seo } from '../src/i18n.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// SSR render per language (home page)
// ---------------------------------------------------------------------------
function renderApp(lang: 'es' | 'en'): string {
  const path = lang === 'en' ? '/en' : '/';
  return renderToString(
    <StaticRouter location={path}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/en" element={<App />} />
      </Routes>
    </StaticRouter>
  );
}

function renderArticlePage(slug: string, ArticleComponent: ComponentType<{ lang: 'es' | 'en' }>, lang: 'es' | 'en'): string {
  return renderToString(
    <StaticRouter location={`/${slug}`}>
      <GlobalNav />
      <Routes>
        <Route path={`/${slug}`} element={<ArticleComponent lang={lang} />} />
      </Routes>
    </StaticRouter>
  );
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Inject into built HTML
// ---------------------------------------------------------------------------
const distDir = resolve(root, 'dist');
const indexPath = resolve(distDir, 'index.html');

let indexHtml: string;
try {
  indexHtml = readFileSync(indexPath, 'utf-8');
} catch {
  console.error('Error: dist/index.html not found. Run "vite build" first.');
  process.exit(1);
}

// --- ES version (inject into existing index.html) ---
let esHtml: string;
try {
  esHtml = renderApp('es');
} catch (err) {
  console.error('[prerender] SSR failed for ES, falling back to empty root:', err);
  esHtml = '';
}

const esSeo = seo.es;

const injectedEs = indexHtml
  .replace('<div id="root"></div>', `<div id="root">${esHtml}</div>`)
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(esSeo.title)}</title>`)
  .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(esSeo.title)}" />`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(esSeo.description)}" />`)
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(esSeo.title)}" />`)
  .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(esSeo.description)}" />`)
  .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(esSeo.title)}" />`)
  .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(esSeo.description)}" />`);

// --- EN version ---
let enHtml: string;
try {
  enHtml = renderApp('en');
} catch (err) {
  console.error('[prerender] SSR failed for EN, falling back to empty root:', err);
  enHtml = '';
}

const enSeo = seo.en;

let enPage = indexHtml
  .replace('<div id="root"></div>', `<div id="root">${enHtml}</div>`)
  .replace('<html lang="es" class="dark">', '<html lang="en" class="dark">')
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(enSeo.title)}</title>`)
  .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(enSeo.title)}" />`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(enSeo.description)}" />`)
  .replace(/<link rel="canonical" href="[^"]*" \/>/, '<link rel="canonical" href="https://santifer.io/en" />')
  .replace(/<meta property="og:url" content="[^"]*" \/>/, '<meta property="og:url" content="https://santifer.io/en" />')
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(enSeo.title)}" />`)
  .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(enSeo.description)}" />`)
  .replace(/<meta property="og:locale" content="es_ES" \/>/, '<meta property="og:locale" content="en_US" />')
  .replace(/<meta property="og:locale:alternate" content="en_US" \/>/, '<meta property="og:locale:alternate" content="es_ES" />')
  .replace(/<meta name="twitter:url" content="[^"]*" \/>/, '<meta name="twitter:url" content="https://santifer.io/en" />')
  .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(enSeo.title)}" />`)
  .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(enSeo.description)}" />`);

// ---------------------------------------------------------------------------
// Article pages — build from registry
// ---------------------------------------------------------------------------
interface ArticlePage {
  slug: string;
  html: string;
}

function buildArticlePage(
  config: ArticleConfig,
  lang: 'es' | 'en',
  ArticleComponent: ComponentType<{ lang: 'es' | 'en' }>,
): string {
  const slug = config.slugs[lang];
  const altSlug = config.slugs[lang === 'es' ? 'en' : 'es'];
  const url = `https://santifer.io/${slug}`;
  const altUrl = `https://santifer.io/${altSlug}`;
  const altLang = lang === 'es' ? 'en' : 'es';
  const htmlLang = lang;
  const ogLocale = lang === 'es' ? 'es_ES' : 'en_US';
  const ogLocaleAlt = lang === 'es' ? 'en_US' : 'es_ES';
  const articleSeo = config.seo[lang];
  const xDefaultHref = `https://santifer.io/${config.xDefaultSlug || config.slugs.es}`;

  let renderedHtml: string;
  try {
    renderedHtml = renderArticlePage(slug, ArticleComponent, lang);
  } catch (err) {
    console.error(`[prerender] SSR failed for ${slug}, falling back to empty root:`, err);
    renderedHtml = '';
  }

  const hreflangLinks = `<link rel="alternate" hreflang="${lang}" href="${url}" /><link rel="alternate" hreflang="${altLang}" href="${altUrl}" /><link rel="alternate" hreflang="x-default" href="${xDefaultHref}" />`;

  return indexHtml
    .replace('<div id="root"></div>', `<div id="root">${renderedHtml}</div>`)
    .replace('<html lang="es" class="dark">', `<html lang="${htmlLang}" class="dark">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(articleSeo.title)}</title>`)
    .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(articleSeo.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />${hreflangLinks}`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, '<meta property="og:type" content="article" />')
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(articleSeo.description)}" />`)
    .replace(/<meta property="og:locale" content="es_ES" \/>/, `<meta property="og:locale" content="${ogLocale}" />`)
    .replace(/<meta property="og:locale:alternate" content="en_US" \/>/, `<meta property="og:locale:alternate" content="${ogLocaleAlt}" />`)
    .replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(articleSeo.description)}" />`);
}

// Load article components and build pages
const articlePages: ArticlePage[] = [];

for (const config of articleRegistry) {
  let ArticleComponent: ComponentType<{ lang: 'es' | 'en' }>;
  try {
    const mod = await config.component();
    ArticleComponent = mod.default;
  } catch {
    console.log(`[prerender] Skipping ${config.id} — component not found yet`);
    continue;
  }

  const seen = new Set<string>();
  for (const lang of ['es', 'en'] as const) {
    const slug = config.slugs[lang];
    if (seen.has(slug)) continue; // same slug for both languages
    seen.add(slug);
    const html = buildArticlePage(config, lang, ArticleComponent);
    articlePages.push({ slug, html });
  }
}

// ---------------------------------------------------------------------------
// Critical CSS inlining with Critters
// ---------------------------------------------------------------------------
const critters = new Critters({
  path: distDir,
  publicPath: '/',
  inlineFonts: false,
  preload: 'media',
  compress: true,
  reduceInlineStyles: true,
});

function dedupePreloads(html: string): string {
  return html.replace(/<link rel="preload" as="image" href="\/foto-avatar\.webp">/g, '');
}

async function writePage(html: string, outputPath: string, label: string) {
  const dir = dirname(outputPath);
  mkdirSync(dir, { recursive: true });
  try {
    const processed = dedupePreloads(await critters.process(html));
    writeFileSync(outputPath, processed, 'utf-8');
    console.log(`[prerender] ${label} (with critical CSS)`);
  } catch {
    writeFileSync(outputPath, html, 'utf-8');
    console.log(`[prerender] ${label} (no critical CSS)`);
  }
}

async function inlineCriticalCSS() {
  // Home pages
  await writePage(injectedEs, indexPath, 'ES: dist/index.html updated');
  await writePage(enPage, resolve(distDir, 'en', 'index.html'), 'EN: dist/en/index.html created');

  // Article pages
  for (const { slug, html } of articlePages) {
    await writePage(html, resolve(distDir, slug, 'index.html'), `${slug}: dist/${slug}/index.html created`);
  }
}

await inlineCriticalCSS();

// ---------------------------------------------------------------------------
// 404 page — Vercel serves this with HTTP 404 status automatically
// ---------------------------------------------------------------------------
const notFoundHtml = indexHtml
  .replace('<div id="root"></div>', `<div id="root"><div style="min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 1.5rem"><p style="font-size:6rem;font-weight:bold;color:var(--primary);margin-bottom:1rem;font-family:var(--font-display)">404</p><h1 style="font-size:1.5rem;font-weight:600;color:var(--foreground);margin-bottom:0.5rem">Page not found</h1><p style="color:var(--muted-foreground);margin-bottom:2rem;max-width:28rem">The page you're looking for doesn't exist or has been moved.</p><a href="/" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;background:var(--primary);color:var(--primary-foreground);font-weight:500;text-decoration:none">← Back to home</a></div></div>`)
  .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/<title>[^<]*<\/title>/, '<title>404 — Page not found | santifer.io</title>');

// Add noindex if no robots meta exists
if (!notFoundHtml.includes('name="robots"')) {
  const withNoindex = notFoundHtml.replace('</head>', '<meta name="robots" content="noindex, nofollow" /></head>');
  writeFileSync(resolve(distDir, '404.html'), withNoindex, 'utf-8');
} else {
  writeFileSync(resolve(distDir, '404.html'), notFoundHtml, 'utf-8');
}
console.log('[prerender] 404: dist/404.html created');

console.log('[prerender] Done.');
