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
  type: 'collab' | 'case-study'
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
        title: 'Qué es n8n y cómo lo usan los Product Managers para automatizar con IA',
        description: 'Guía práctica de n8n para Product Managers: qué es, cómo automatizar sprint reports y clasificar feedback con IA. 2 workflows importables gratis, prompt listo y tutorial paso a paso.',
      },
      en: {
        title: 'n8n for Product Managers: Automate Sprint Reports & Classify Feedback with AI',
        description: 'Practical cheat sheet for Product Managers: automate sprint reports and classify feedback with AI using n8n. 2 importable workflow templates, a ready-to-use prompt, and step-by-step guide.',
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
    component: () => import('../N8nForPMs.tsx'),
  },
  {
    id: 'jacobo',
    slugs: { es: 'agente-ia-jacobo', en: 'ai-agent-jacobo' },
    titles: { es: 'Agente IA Jacobo', en: 'AI Agent Jacobo' },
    seo: {
      es: {
        title: 'Jacobo: Agente IA de Atención al Cliente — 90% Autoservicio | santifer.io',
        description: 'Case study: cómo construí un agente IA omnicanal con n8n, Claude y Airtable que logra 90% de autoservicio en atención al cliente para reparación de móviles.',
      },
      en: {
        title: 'Jacobo: AI Customer Service Agent — 90% Self-Service Rate | santifer.io',
        description: 'Case study: how I built an omnichannel AI agent with n8n, Claude and Airtable that achieves 90% self-service rate for a phone repair business.',
      },
    },
    sectionLabels: {
      es: {
        'the-problem': 'El Problema',
        'architecture': 'La Arquitectura',
        'how-it-works': 'Cómo Funciona',
        'hitl': 'Handoff Humano',
        'results': 'Resultados',
        'stack': 'Stack',
        'lessons': 'Lecciones',
        'faq': 'FAQ',
        'resources': 'Recursos',
      },
      en: {
        'the-problem': 'The Problem',
        'architecture': 'The Architecture',
        'how-it-works': 'How It Works',
        'hitl': 'HITL Handoff',
        'results': 'Results',
        'stack': 'Stack',
        'lessons': 'Lessons',
        'faq': 'FAQ',
        'resources': 'Resources',
      },
    },
    type: 'case-study',
    component: () => import('../JacoboAgent.tsx'),
  },
  {
    id: 'business-os',
    slugs: { es: 'business-os-para-airtable', en: 'business-os-for-airtable' },
    titles: { es: 'Business OS', en: 'Business OS' },
    seo: {
      es: {
        title: 'Cómo Construí un Business OS Custom para +30.000 Reparaciones con Airtable y n8n (170h/Mes Ahorradas) | santifer.io',
        description: 'Case study: Business OS custom con 12 bases de Airtable, 2100 campos y n8n que ahorra 170h/mes en una empresa de reparación de móviles.',
      },
      en: {
        title: 'How I Built a Custom Business OS for 30,000+ Repairs with Airtable & n8n (170h/Month Saved) | santifer.io',
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
    component: () => import('../BusinessOS.tsx'),
  },
  {
    id: 'programmatic-seo',
    slugs: { es: 'seo-programatico', en: 'programmatic-seo' },
    titles: { es: 'SEO Programático', en: 'Programmatic SEO' },
    seo: {
      es: {
        title: 'SEO Programático: Caso de Éxito en Reparación de Móviles en España | santifer.io',
        description: 'Case study: cómo posicioné un negocio de reparación de móviles en +60 ciudades españolas con SEO programático, Airtable como CMS headless y Astro.',
      },
      en: {
        title: 'Programmatic SEO: How I Ranked a Repair Business in 60+ Cities | santifer.io',
        description: 'Case study: how I ranked a phone repair business in 60+ Spanish cities using programmatic SEO with Airtable as headless CMS and Astro.',
      },
    },
    sectionLabels: {
      es: {
        'opportunity': 'La Oportunidad',
        'architecture': 'La Arquitectura',
        'decision-engine': 'Motor de Decisión',
        'pipeline': 'Pipeline',
        'results': 'Resultados',
        'crawl-budget': 'Crawl Budget',
        'lessons': 'Lecciones',
        'faq': 'FAQ',
        'resources': 'Recursos',
      },
      en: {
        'opportunity': 'The Opportunity',
        'architecture': 'The Architecture',
        'decision-engine': 'Decision Engine',
        'pipeline': 'Pipeline',
        'results': 'Results',
        'crawl-budget': 'Crawl Budget',
        'lessons': 'Lessons',
        'faq': 'FAQ',
        'resources': 'Resources',
      },
    },
    type: 'case-study',
    component: () => import('../ProgrammaticSeo.tsx'),
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
