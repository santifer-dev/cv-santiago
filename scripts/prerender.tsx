/**
 * Post-build script: SSR prerender using React's renderToString.
 *
 * Renders the actual App component to HTML so the pre-rendered content
 * matches exactly what React produces. This enables hydrateRoot() on the
 * client to adopt the existing DOM without replacing it (zero CLS).
 *
 * Usage: npx tsx scripts/prerender.tsx  (runs automatically via "npm run build")
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router-dom';
import Critters from 'critters';
import App from '../src/App.tsx';
import { seo } from '../src/i18n.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// SSR render per language
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
  // Inject ES content into #root
  .replace('<div id="root"></div>', `<div id="root">${esHtml}</div>`)
  // Update SEO meta tags from i18n (single source of truth)
  .replace(
    /<title>[^<]*<\/title>/,
    `<title>${esc(esSeo.title)}</title>`,
  )
  .replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${esc(esSeo.title)}" />`,
  )
  .replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${esc(esSeo.description)}" />`,
  )
  // Update OG tags
  .replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${esc(esSeo.title)}" />`,
  )
  .replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${esc(esSeo.description)}" />`,
  )
  // Update Twitter tags
  .replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${esc(esSeo.title)}" />`,
  )
  .replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${esc(esSeo.description)}" />`,
  );

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
  // Inject EN content into #root
  .replace('<div id="root"></div>', `<div id="root">${enHtml}</div>`)
  // Switch to EN lang
  .replace('<html lang="es">', '<html lang="en">')
  // Update SEO meta tags
  .replace(
    /<title>[^<]*<\/title>/,
    `<title>${esc(enSeo.title)}</title>`,
  )
  .replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${esc(enSeo.title)}" />`,
  )
  .replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${esc(enSeo.description)}" />`,
  )
  // Update canonical to /en
  .replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    '<link rel="canonical" href="https://santifer.io/en" />',
  )
  // Update OG tags
  .replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    '<meta property="og:url" content="https://santifer.io/en" />',
  )
  .replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${esc(enSeo.title)}" />`,
  )
  .replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${esc(enSeo.description)}" />`,
  )
  .replace(
    /<meta property="og:locale" content="es_ES" \/>/,
    '<meta property="og:locale" content="en_US" />',
  )
  .replace(
    /<meta property="og:locale:alternate" content="en_US" \/>/,
    '<meta property="og:locale:alternate" content="es_ES" />',
  )
  // Update Twitter tags
  .replace(
    /<meta name="twitter:url" content="[^"]*" \/>/,
    '<meta name="twitter:url" content="https://santifer.io/en" />',
  )
  .replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${esc(enSeo.title)}" />`,
  )
  .replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${esc(enSeo.description)}" />`,
  );

// ---------------------------------------------------------------------------
// Critical CSS inlining with Critters
// ---------------------------------------------------------------------------
const critters = new Critters({
  path: distDir,
  publicPath: '/',
  inlineFonts: false,     // fonts are preloaded separately
  preload: 'media',       // media="print" onload="this.media='all'" — most reliable async CSS
  compress: true,
  reduceInlineStyles: true,
});

// Remove duplicate image preloads added by critters (we already have one in <head>)
function dedupePreloads(html: string): string {
  // Remove critters-added image preload (no type= attribute) — keep our manual one (has type="image/webp")
  return html.replace(/<link rel="preload" as="image" href="\/foto-avatar\.webp">/g, '');
}

async function inlineCriticalCSS() {
  try {
    const processedEs = dedupePreloads(await critters.process(injectedEs));
    writeFileSync(indexPath, processedEs, 'utf-8');
    console.log('[prerender] ES: dist/index.html updated (with critical CSS)');

    const processedEn = dedupePreloads(await critters.process(enPage));
    const enDir = resolve(distDir, 'en');
    mkdirSync(enDir, { recursive: true });
    writeFileSync(resolve(enDir, 'index.html'), processedEn, 'utf-8');
    console.log('[prerender] EN: dist/en/index.html created (with critical CSS)');
  } catch (err) {
    // Fallback: write without critical CSS inlining
    console.error('[prerender] Critters failed, writing without critical CSS:', err);
    writeFileSync(indexPath, injectedEs, 'utf-8');
    console.log('[prerender] ES: dist/index.html updated (no critical CSS)');

    const enDir = resolve(distDir, 'en');
    mkdirSync(enDir, { recursive: true });
    writeFileSync(resolve(enDir, 'index.html'), enPage, 'utf-8');
    console.log('[prerender] EN: dist/en/index.html created (no critical CSS)');
  }
}

await inlineCriticalCSS();
console.log('[prerender] Done.');
