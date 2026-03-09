import type { ComponentType } from 'react'

export interface ArticleSeo {
  title: string
  description: string
}

export interface ArticleConfig {
  id: string
  slugs: { es: string; en: string }
  titles: { es: string; en: string }
  seo: { es: ArticleSeo; en: ArticleSeo }
  sectionLabels: { es: Record<string, string>; en: Record<string, string> }
  type: 'collab' | 'case-study' | 'bridge'
  /** Absolute OG image URL for prerender (social cards) */
  ogImage?: string
  component: () => Promise<{ default: ComponentType<{ lang: 'es' | 'en' }> }>
  /** x-default hreflang slug (defaults to ES slug) */
  xDefaultSlug?: string
}

export const articleRegistry: ArticleConfig[] = [
  {
    id: 'n8n-for-pms',
    slugs: { es: 'n8n-para-pms', en: 'n8n-for-pms' },
    titles: { es: 'n8n para PMs', en: 'n8n for PMs' },
    seo: {
      es: {
        title: 'n8n para Product Managers: Automatiza con IA',
        description: 'Guía práctica de n8n para PMs: automatiza sprint reports y clasifica feedback con IA. 2 workflows gratis y tutorial.',
      },
      en: {
        title: 'n8n for Product Managers: Automate with AI',
        description: 'Practical n8n cheat sheet for PMs: automate sprint reports and classify feedback with AI. 2 free workflow templates.',
      },
    },
    sectionLabels: {
      es: {
        'time-sinks': 'Tareas que Roban Tiempo',
        'workflow-1': 'Workflow 1',
        'workflow-2': 'Workflow 2',
        'the-pattern': 'El Patrón',
        'get-started': 'Empieza',
        'lessons': 'Lecciones',
        'faq': 'FAQ',
        'import': 'Importar',
        'resources': 'Recursos',
      },
      en: {
        'time-sinks': 'Time Sinks',
        'workflow-1': 'Workflow 1',
        'workflow-2': 'Workflow 2',
        'the-pattern': 'The Pattern',
        'get-started': 'Get Started',
        'lessons': 'Lessons',
        'faq': 'FAQ',
        'import': 'Import',
        'resources': 'Resources',
      },
    },
    type: 'collab',
    ogImage: 'https://santifer.io/workflows/n8n-ai-feedback-classification-workflow.webp',
    component: () => import('../N8nForPMs.tsx'),
  },
  {
    id: 'jacobo',
    slugs: { es: 'agente-ia-jacobo', en: 'ai-agent-jacobo' },
    titles: { es: 'Agente IA Jacobo', en: 'AI Agent Jacobo' },
    seo: {
      es: {
        title: 'Jacobo: Agente IA Omnicanal — 90% Autoservicio',
        description: 'Case study: agente IA omnicanal con sub-agentes, tool calling y orquestación multi-modelo (n8n + ElevenLabs). 90% autoservicio.',
      },
      en: {
        title: 'Jacobo: Multi-Agent AI — 90% Self-Service',
        description: 'Case study: omnichannel AI agent with sub-agents, tool calling & multi-model orchestration (n8n + ElevenLabs). 90% self-service.',
      },
    },
    sectionLabels: {
      es: {
        'the-problem': 'El Problema',
        'architecture': 'Arquitectura',
        'e2e-flows': 'Flujos E2E',
        'main-router': 'Los Dos Cerebros',
        'natural-language-booking': 'Deep Dive: Citas',
        'deep-dive-quotes': 'Deep Dive: Presupuestos',
        'deep-dive-others': 'Deep Dive: Tools',
        'results': 'Resultados',
        'decisions': 'ADRs',
        'platform-evolution': 'Evolución',
        'what-id-do-differently': 'Lecciones',
        'enterprise-patterns': 'Patrones',
        'run-it-yourself': 'Workflows',
        'faq': 'FAQ',
        'resources': 'Recursos',
      },
      en: {
        'the-problem': 'The Problem',
        'architecture': 'Architecture',
        'e2e-flows': 'E2E Flows',
        'main-router': 'The Two Brains',
        'natural-language-booking': 'Deep Dive: Booking',
        'deep-dive-quotes': 'Deep Dive: Quotes',
        'deep-dive-others': 'Deep Dive: Tools',
        'results': 'Results',
        'decisions': 'ADRs',
        'platform-evolution': 'Evolution',
        'what-id-do-differently': 'Lessons',
        'enterprise-patterns': 'Patterns',
        'run-it-yourself': 'Workflows',
        'faq': 'FAQ',
        'resources': 'Resources',
      },
    },
    type: 'case-study',
    ogImage: 'https://santifer.io/jacobo/og-jacobo-agent.png',
    component: () => import('../JacoboAgent.tsx'),
  },
  {
    id: 'business-os',
    slugs: { es: 'business-os-para-airtable', en: 'business-os-for-airtable' },
    titles: { es: 'Business OS', en: 'Business OS' },
    seo: {
      es: {
        title: 'Business OS Custom: Airtable + n8n — 170h/Mes',
        description: 'Case study: Business OS custom con 12 bases Airtable, 2100 campos y n8n que ahorra 170h/mes en reparación de móviles.',
      },
      en: {
        title: 'Custom Business OS: Airtable + n8n — 170h/Mo',
        description: 'Case study: custom Business OS with 12 Airtable bases, 2100 fields, and n8n saving 170h/month at a phone repair business.',
      },
    },
    sectionLabels: {
      es: {
        'why-custom': '¿Por Qué Custom?',
        'overview': 'Vista General',
        'e2e-flows': 'Flujos E2E',
        'cross-cutting': 'Transversales',
        'day-in-life': 'Un Día',
        'before-after': 'Antes/Después',
        'impact': 'Impacto',
        'decisions': 'ADRs',
        'platform-evolution': 'Evolución',
        'lessons': 'Lecciones',
        'replicability': 'Patrones',
        'faq': 'FAQ',
        'resources': 'Recursos',
      },
      en: {
        'why-custom': 'Why Custom?',
        'overview': 'Overview',
        'e2e-flows': 'E2E Flows',
        'cross-cutting': 'Cross-Cutting',
        'day-in-life': 'A Day',
        'before-after': 'Before/After',
        'impact': 'Impact',
        'decisions': 'ADRs',
        'platform-evolution': 'Evolution',
        'lessons': 'Lessons',
        'replicability': 'Patterns',
        'faq': 'FAQ',
        'resources': 'Resources',
      },
    },
    type: 'case-study',
    ogImage: 'https://santifer.io/business-os/og-business-os.png',
    component: () => import('../BusinessOS.tsx'),
  },
  {
    id: 'programmatic-seo',
    slugs: { es: 'seo-programatico', en: 'programmatic-seo' },
    titles: { es: 'SEO Programático', en: 'Programmatic SEO' },
    seo: {
      es: {
        title: 'SEO Programático: 4.000+ Páginas desde un ERP | santifer.io',
        description: 'Case study: cómo generé 4.730 landing pages estáticas con Airtable, DataForSEO y crawl budget optimization. 2M+ impresiones, 19K+ clicks, cero IA.',
      },
      en: {
        title: 'Programmatic SEO: 4,000+ Pages from an ERP | santifer.io',
        description: 'Case study: how I built 4,730 static landing pages with Airtable as headless CMS, DataForSEO for crawl budget optimization, and Astro SSG. 2M+ impressions, 19K+ clicks.',
      },
    },
    sectionLabels: {
      es: {
        'the-numbers': 'Los Números',
        'opportunity': 'La Oportunidad',
        'two-strategies': 'Dos Estrategias',
        'url-taxonomy': 'Taxonomía URLs',
        'architecture': 'La Arquitectura',
        'cms-deep-dive': 'El CMS',
        'page-anatomy': 'Anatomía de Página',
        'decision-engine': 'Motor de Decisión',
        'crawl-budget': 'Crawl Budget',
        'pipeline': 'Pipeline',
        'content-automation': 'Automatización',
        'growth': 'Crecimiento',
        'results': 'Resultados',
        'image-pipeline': 'Pipeline de Imágenes',
        'reviews-pipeline': 'Pipeline de Reseñas',
        'before-after-pipeline': 'Pipeline Antes/Después',
        'stack': 'Stack',
        'lessons': 'Lecciones',
        'faq': 'FAQ',
        'resources': 'Recursos',
      },
      en: {
        'the-numbers': 'The Numbers',
        'opportunity': 'The Opportunity',
        'two-strategies': 'Two Strategies',
        'url-taxonomy': 'URL Taxonomy',
        'architecture': 'The Architecture',
        'cms-deep-dive': 'The CMS',
        'page-anatomy': 'Page Anatomy',
        'decision-engine': 'Decision Engine',
        'crawl-budget': 'Crawl Budget',
        'pipeline': 'Pipeline',
        'content-automation': 'Automation',
        'growth': 'Growth',
        'results': 'Results',
        'image-pipeline': 'Image Pipeline',
        'reviews-pipeline': 'Reviews Pipeline',
        'before-after-pipeline': 'Before/After Pipeline',
        'stack': 'Stack',
        'lessons': 'Lessons',
        'faq': 'FAQ',
        'resources': 'Resources',
      },
    },
    type: 'case-study',
    ogImage: 'https://santifer.io/pseo/og-programmatic-seo.png',
    component: () => import('../ProgrammaticSeo.tsx'),
  },
  {
    id: 'santifer-irepair',
    slugs: { es: 'santifer-irepair', en: 'santifer-irepair-founder' },
    titles: { es: 'Santifer iRepair', en: 'Santifer iRepair' },
    seo: {
      es: {
        title: 'Santifer iRepair Sevilla | Reparación de Móviles desde 2009',
        description: 'La tienda de reparación de móviles fundada por Santiago en 2009 sigue abierta en Sevilla. 30.000+ reparaciones. Encuentra la tienda o conoce al fundador.',
      },
      en: {
        title: 'Santifer iRepair Seville | Phone Repair since 2009',
        description: 'The phone repair shop founded by Santiago in 2009 is still open in Seville, Spain. 30,000+ repairs. Find the shop or meet the founder.',
      },
    },
    sectionLabels: { es: {}, en: {} },
    type: 'bridge',
    ogImage: 'https://santifer.io/business-os/og-business-os.png',
    component: () => import('../SantiferIRepair.tsx'),
    xDefaultSlug: 'santifer-irepair',
  },
]

// Derived maps for GlobalNav and routing
export function getAltPaths(): Record<string, string> {
  const map: Record<string, string> = {
    '/': '/en',
    '/en': '/',
  }
  for (const article of articleRegistry) {
    map[`/${article.slugs.es}`] = `/${article.slugs.en}`
    map[`/${article.slugs.en}`] = `/${article.slugs.es}`
  }
  return map
}

export function getPageTitles(): Record<string, string> {
  const map: Record<string, string> = {}
  for (const article of articleRegistry) {
    map[`/${article.slugs.es}`] = article.titles.es
    map[`/${article.slugs.en}`] = article.titles.en
  }
  return map
}

export function getSectionLabels(): Record<string, Record<string, string>> {
  const map: Record<string, Record<string, string>> = {}
  for (const article of articleRegistry) {
    map[`/${article.slugs.es}`] = article.sectionLabels.es
    map[`/${article.slugs.en}`] = article.sectionLabels.en
  }
  return map
}

/** All ES slugs (for lang detection: if pathname matches an ES slug → lang is 'es') */
export function getEsSlugs(): Set<string> {
  const slugs = new Set<string>(['/'])
  for (const article of articleRegistry) {
    slugs.add(`/${article.slugs.es}`)
  }
  return slugs
}
