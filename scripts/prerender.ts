/**
 * Post-build script: generates semantic HTML for crawlers and AI agents.
 *
 * Reads translations from src/i18n.ts, builds visible HTML with inline styles
 * that approximate the final React layout, and injects it inside <div id="root">
 * so bots that don't execute JS still see the full CV.
 *
 * Usage: npx tsx scripts/prerender.ts  (runs automatically via "npm run build")
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Dynamic import so we can use the project's TS source directly
const { translations, seo } = await import('../src/i18n.ts');

// ---------------------------------------------------------------------------
// Inline style constants (match the React dark-mode layout)
// ---------------------------------------------------------------------------
const STYLES = {
  main: "font-family:'Space Grotesk',system-ui,sans-serif;max-width:800px;margin:0 auto;padding:2rem 1.5rem;color:#e5e5e5;background:#0a0a0a;line-height:1.6",
  h1: 'font-size:2rem;font-weight:700;margin:0 0 0.5rem',
  h2: 'font-size:1.25rem;font-weight:600;margin:0 0 1rem;color:#f5f5f5;border-bottom:1px solid #262626;padding-bottom:0.5rem',
  h3: 'font-size:1.1rem;font-weight:600;margin:0 0 0.25rem;color:#f5f5f5',
  muted: 'color:#a3a3a3',
  link: 'color:#22d3ee;text-decoration:none',
  section: 'margin-bottom:2.5rem',
  header: 'text-align:center;margin-bottom:3rem',
  dt: 'font-weight:600;color:#f5f5f5',
  dd: 'color:#a3a3a3;margin:0 0 0.75rem;margin-inline-start:0',
  li: 'margin-bottom:0.35rem;color:#d4d4d4',
  card: 'background:#171717;border:1px solid #262626;border-radius:0.75rem;padding:1rem 1.25rem;margin-bottom:0.75rem',
  badge: 'display:inline-block;font-size:0.75rem;padding:0.15rem 0.5rem;border-radius:9999px;background:#1e293b;color:#94a3b8;margin-left:0.5rem;vertical-align:middle',
} as const;

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Convert **bold** markdown to <strong> after escaping */
function md(s: string): string {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// ---------------------------------------------------------------------------
// HTML generation per language
// ---------------------------------------------------------------------------
type Lang = 'es' | 'en';

function generateHTML(lang: Lang): string {
  const t = translations[lang];
  const parts: string[] = [];

  // Header
  parts.push(`
<header style="${STYLES.header}">
  <h1 style="${STYLES.h1}">Santiago Fernández de Valderrama</h1>
  <p style="${STYLES.muted}">${esc(t.roles.join(' · '))}</p>
  <p style="${STYLES.muted}">${esc(t.location)}</p>
  <address style="font-style:normal">
    <a href="mailto:${esc(t.email)}" style="${STYLES.link}">${esc(t.email)}</a> ·
    <a href="https://linkedin.com/in/santifer" style="${STYLES.link}">LinkedIn</a> ·
    <a href="https://github.com/santifer-dev" style="${STYLES.link}">GitHub</a>
  </address>
</header>`);

  // Professional Summary
  parts.push(`
<section aria-label="${esc(t.summary.title)}" style="${STYLES.section}">
  <h2 style="${STYLES.h2}">${esc(t.summary.title)}</h2>
  <p>${esc(t.summary.p1)} <strong>${esc(t.summary.p1Highlight)}</strong> ${esc(t.summary.p1End)}</p>
  <p style="margin-top:0.75rem">${esc(t.summary.p2)} <strong>${esc(t.summary.p2Highlight)}</strong>${esc(t.summary.p2End)}</p>
${t.summary.cards.map(c => `  <div style="${STYLES.card}"><strong>${esc(c.title)}</strong><br><span style="${STYLES.muted}">${esc(c.desc)}</span></div>`).join('\n')}
</section>`);

  // Core Competencies
  parts.push(`
<section aria-label="${esc(t.coreCompetencies.title)}" style="${STYLES.section}">
  <h2 style="${STYLES.h2}">${esc(t.coreCompetencies.title)}</h2>
  <dl>
${t.coreCompetencies.items.map(i => `    <dt style="${STYLES.dt}">${esc(i.title)}</dt>\n    <dd style="${STYLES.dd}">${esc(i.desc)}</dd>`).join('\n')}
  </dl>
</section>`);

  // Work Experience
  const exp = t.experience;
  parts.push(`
<section aria-label="${esc(exp.title)}" style="${STYLES.section}">
  <h2 style="${STYLES.h2}">${esc(exp.title)}</h2>

  <article style="${STYLES.card}">
    <h3 style="${STYLES.h3}">Santifer iRepair — ${esc(exp.santifer.role)}</h3>
    <p style="${STYLES.muted}">${esc(exp.santifer.period)}<span style="${STYLES.badge}">${esc(exp.santifer.exit)}</span></p>
    <p style="margin:0.5rem 0;${STYLES.muted}">${esc(exp.santifer.exitDesc)}</p>
    <ul style="padding-left:1.25rem;margin:0.75rem 0">
${exp.santifer.highlights.map(h => `      <li style="${STYLES.li}">${esc(h)}</li>`).join('\n')}
    </ul>
  </article>

  <article style="${STYLES.card}">
    <h3 style="${STYLES.h3}">${esc(exp.santifer.businessOS.title)}<span style="${STYLES.badge}">${esc(exp.santifer.businessOS.badge)}</span></h3>
    <p>${esc(exp.santifer.businessOS.desc)}</p>
    <ul style="padding-left:1.25rem;margin:0.75rem 0">
${exp.santifer.businessOS.modules.map(m => `      <li style="${STYLES.li}">${esc(m.text)}</li>`).join('\n')}
    </ul>
  </article>

  <article style="${STYLES.card}">
    <h3 style="${STYLES.h3}">${esc(exp.santifer.jacobo.title)}<span style="${STYLES.badge}">${esc(exp.santifer.jacobo.badge)}</span></h3>
    <p>${esc(exp.santifer.jacobo.desc)}</p>
    <ul style="padding-left:1.25rem;margin:0.75rem 0">
${exp.santifer.jacobo.items.map(i => `      <li style="${STYLES.li}">${esc(i.text)}</li>`).join('\n')}
    </ul>
  </article>

  <article style="${STYLES.card}">
    <h3 style="${STYLES.h3}">${esc(exp.santifer.webSeo.title)}<span style="${STYLES.badge}">${esc(exp.santifer.webSeo.badge)}</span></h3>
    <p>${esc(exp.santifer.webSeo.desc)}</p>
    <ul style="padding-left:1.25rem;margin:0.75rem 0">
${exp.santifer.webSeo.items.map(i => `      <li style="${STYLES.li}">${esc(i.text)}</li>`).join('\n')}
    </ul>
  </article>

  <article style="${STYLES.card}">
    <h3 style="${STYLES.h3}">LICO Cosmetics — ${esc(exp.lico.role)}</h3>
    <p style="${STYLES.muted}">${esc(exp.lico.period)}</p>
    <p>${esc(exp.lico.desc)}</p>
    <blockquote style="border-left:3px solid #22d3ee;padding-left:1rem;margin:0.75rem 0;font-style:italic;color:#a3a3a3">
      "${esc(exp.lico.testimonial.quote)}"
      <br><strong style="color:#d4d4d4">${esc(exp.lico.testimonial.author)}</strong>, <span style="${STYLES.muted}">${esc(exp.lico.testimonial.role)}</span>
    </blockquote>
  </article>

  <article style="${STYLES.card}">
    <h3 style="${STYLES.h3}">Everis / NTT DATA — ${esc(exp.everis.role)}</h3>
    <p style="${STYLES.muted}">${esc(exp.everis.period)}</p>
    <p><strong>${esc(exp.everis.tesauro.title)}</strong>: ${esc(exp.everis.tesauro.desc)}</p>
    <blockquote style="border-left:3px solid #22d3ee;padding-left:1rem;margin:0.75rem 0;font-style:italic;color:#a3a3a3">
      "${esc(exp.everis.testimonial.quote)}"
      <br><strong style="color:#d4d4d4">${esc(exp.everis.testimonial.author)}</strong>, <span style="${STYLES.muted}">${esc(exp.everis.testimonial.role)}</span>
    </blockquote>
  </article>
</section>`);

  // Projects
  parts.push(`
<section aria-label="${esc(t.projects.title)}" style="${STYLES.section}">
  <h2 style="${STYLES.h2}">${esc(t.projects.title)}</h2>
${t.projects.items.map(p => `  <article style="${STYLES.card}">
    <h3 style="${STYLES.h3}">${esc(p.title)}<span style="${STYLES.badge}">${esc(p.badge)}</span></h3>
    <p>${md(p.desc)}</p>
    <p style="${STYLES.muted};font-size:0.875rem;margin-top:0.5rem">${p.tech.map(esc).join(' · ')}</p>
  </article>`).join('\n')}
</section>`);

  // Tech Stack
  parts.push(`
<section aria-label="${esc(t.techStack.title)}" style="${STYLES.section}">
  <h2 style="${STYLES.h2}">${esc(t.techStack.title)}</h2>
  <dl>
${t.techStack.categories.map(c => `    <dt style="${STYLES.dt}">${esc(c.name)}</dt>\n    <dd style="${STYLES.dd}">${c.items.map(esc).join(', ')}</dd>`).join('\n')}
  </dl>
</section>`);

  // Education
  parts.push(`
<section aria-label="${esc(t.education.title)}" style="${STYLES.section}">
  <h2 style="${STYLES.h2}">${esc(t.education.title)}</h2>
${t.education.items.map(e => `  <div style="${STYLES.card}">
    <p style="${STYLES.muted};font-size:0.875rem">${esc(e.year)} · ${esc(e.org)}</p>
    <h3 style="${STYLES.h3}">${esc(e.title)}</h3>
    <p style="${STYLES.muted}">${esc(e.desc)}</p>
  </div>`).join('\n')}
</section>`);

  // Certifications
  parts.push(`
<section aria-label="${esc(t.certifications.title)}" style="${STYLES.section}">
  <h2 style="${STYLES.h2}">${esc(t.certifications.title)}</h2>
${t.certifications.items.map(c => `  <div style="${STYLES.card}">
    <p style="${STYLES.muted};font-size:0.875rem">${esc(c.year)} · ${esc(c.org)}</p>
    <p><strong>${esc(c.title)}</strong></p>
  </div>`).join('\n')}
</section>`);

  // Skills
  parts.push(`
<section aria-label="${esc(t.skills.title)}" style="${STYLES.section}">
  <h2 style="${STYLES.h2}">${esc(t.skills.title)}</h2>
  <dl>
    <dt style="${STYLES.dt}">${esc(t.skills.languages)}</dt>
    <dd style="${STYLES.dd}">${esc(t.skills.spanish)} (${esc(t.skills.native)}) · ${esc(t.skills.english)} (${esc(t.skills.professional)})</dd>
    <dt style="${STYLES.dt}">${esc(t.skills.soft)}</dt>
    <dd style="${STYLES.dd}">${t.skills.softSkills.map(esc).join(', ')}</dd>
  </dl>
</section>`);

  // CTA
  parts.push(`
<section aria-label="${esc(t.cta.title)}" style="${STYLES.section};text-align:center">
  <h2 style="${STYLES.h2};border:none">${esc(t.cta.title)}</h2>
  <p>${esc(t.cta.desc)}</p>
  <p style="margin-top:1rem">
    <a href="mailto:${esc(t.email)}" style="${STYLES.link};font-weight:600">${esc(t.cta.contact)} &rarr; ${esc(t.email)}</a>
  </p>
</section>`);

  return `<main style="${STYLES.main}">${parts.join('\n')}\n</main>`;
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
const esHtml = generateHTML('es');
const injectedEs = indexHtml.replace(
  '<div id="root"></div>',
  `<div id="root">${esHtml}</div>`,
);
writeFileSync(indexPath, injectedEs, 'utf-8');
console.log('[prerender] ES: dist/index.html updated');

// --- EN version (create dist/en/index.html) ---
const enHtml = generateHTML('en');
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

const enDir = resolve(distDir, 'en');
mkdirSync(enDir, { recursive: true });
writeFileSync(resolve(enDir, 'index.html'), enPage, 'utf-8');
console.log('[prerender] EN: dist/en/index.html created');

console.log('[prerender] Done.');
