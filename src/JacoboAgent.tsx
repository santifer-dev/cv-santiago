import { type ReactNode } from 'react'
import { type N8nLang as Lang } from './n8n-i18n'
import { buildArticleJsonLd } from './articles/json-ld'
import { useArticleSeo } from './articles/use-article-seo'
import { Compass, Mic, CalendarDays, Receipt, Package, Calculator, HandHelping, Smartphone, MessageCircle, PhoneMissed, Download } from 'lucide-react'
import {
  ArticleLayout,
  ArticleHeader,
  ArticleFooter,
  FaqSection,
  ResourcesList,
  MetricsGrid,
  StatusBadge,
  CaseStudyCta,
  InlineWorkflowDownload,
  WorkflowGrid,
} from './articles/components'
import {
  H2,
  H3,
  H4,
  Prose,
  Callout,
  InfoCard,
  CardStack,
  BulletList,
  StepList,
  CardGrid,
  StackGrid,
  ToolList,
  ConditionList,
  NodeLabel,
  Photo1,
  Photo2,
  DiagramZoom,
  CodeBlock,
  Accordion,
  DataTable,
  Timeline,
  StoryBridge,
  ScreenshotGrid,
  ScreenshotCaption,
  DetailCard,
  FloatingToc,
  AudioPlayer,
} from './articles/content-types'
import { jacoboContent } from './jacobo-i18n'

// ---------------------------------------------------------------------------
// Stack service icons (Simple Icons / brand SVGs)
// ---------------------------------------------------------------------------
const stackIcons: Record<string, ReactNode> = {
  WATI: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
  ),
  Aircall: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#00B388"><path d="M23.451 5.906a6.978 6.978 0 0 0-5.375-5.39C16.727.204 14.508 0 12 0S7.273.204 5.924.516a6.978 6.978 0 0 0-5.375 5.39C.237 7.26.034 9.485.034 12s.203 4.74.515 6.094a6.978 6.978 0 0 0 5.375 5.39C7.273 23.796 9.492 24 12 24s4.727-.204 6.076-.516a6.978 6.978 0 0 0 5.375-5.39c.311-1.354.515-3.578.515-6.094 0-2.515-.203-4.74-.515-6.094zm-5.873 12.396l-.003.001c-.428.152-1.165.283-2.102.377l-.147.014a.444.444 0 0 1-.45-.271 1.816 1.816 0 0 0-1.296-1.074c-.351-.081-.928-.134-1.58-.134s-1.229.053-1.58.134a1.817 1.817 0 0 0-1.291 1.062.466.466 0 0 1-.471.281 8 8 0 0 0-.129-.012c-.938-.094-1.676-.224-2.105-.377l-.003-.001a.76.76 0 0 1-.492-.713c0-.032.003-.066.005-.098.073-.979.666-3.272 1.552-5.89C8.5 8.609 9.559 6.187 10.037 5.714a1.029 1.029 0 0 1 .404-.26l.004-.002c.314-.106.892-.178 1.554-.178.663 0 1.241.071 1.554.178l.005.002a1.025 1.025 0 0 1 .405.26c.478.472 1.537 2.895 2.549 5.887.886 2.617 1.479 4.91 1.552 5.89.002.032.005.066.005.098a.76.76 0 0 1-.491.713z"/></svg>
  ),
  n8n: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#EA4B71"><path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632"/></svg>
  ),
  OpenRouter: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#6366F1"><path d="M16.778 1.844v1.919q-.569-.026-1.138-.032-.708-.008-1.415.037c-1.93.126-4.023.728-6.149 2.237-2.911 2.066-2.731 1.95-4.14 2.75-.396.223-1.342.574-2.185.798-.841.225-1.753.333-1.751.333v4.229s.768.108 1.61.333c.842.224 1.789.575 2.185.799 1.41.798 1.228.683 4.14 2.75 2.126 1.509 4.22 2.11 6.148 2.236.88.058 1.716.041 2.555.005v1.918l7.222-4.168-7.222-4.17v2.176c-.86.038-1.611.065-2.278.021-1.364-.09-2.417-.357-3.979-1.465-2.244-1.593-2.866-2.027-3.68-2.508.889-.518 1.449-.906 3.822-2.59 1.56-1.109 2.614-1.377 3.978-1.466.667-.044 1.418-.017 2.278.02v2.176L24 6.014Z"/></svg>
  ),
  ElevenLabs: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M4.6035 0v24h4.9317V0zm9.8613 0v24h4.9317V0z"/></svg>
  ),
  Airtable: (
    <svg viewBox="0 0 24 24" className="w-8 h-8"><path fill="#18BFFF" d="M11.992 1.966c-.434 0-.87.086-1.28.257L1.779 5.917c-.503.208-.49.908.012 1.116l8.982 3.558a3.266 3.266 0 0 0 2.454 0l8.982-3.558c.503-.196.503-.908.012-1.116l-8.957-3.694a3.255 3.255 0 0 0-1.272-.257z"/><path fill="#FCB400" d="M23.4 8.056a.589.589 0 0 0-.222.045l-10.012 3.877a.612.612 0 0 0-.38.564v8.896a.6.6 0 0 0 .821.552L23.62 18.1a.583.583 0 0 0 .38-.551V8.653a.6.6 0 0 0-.6-.596z"/><path fill="#18BFFF" d="M.676 8.095a.644.644 0 0 0-.48.19C.086 8.396 0 8.53 0 8.69v8.355c0 .442.515.737.908.54l6.27-3.006.307-.147 2.969-1.436c.466-.22.43-.908-.061-1.092L.883 8.138a.57.57 0 0 0-.207-.044z"/></svg>
  ),
  YouCanBookMe: (
    <svg viewBox="0 0 24 24" className="w-8 h-8"><path fill="#4285F4" d="M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z"/></svg>
  ),
  Slack: (
    <svg viewBox="0 0 24 24" className="w-8 h-8"><path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/><path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/><path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/><path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
  ),
}


// ---------------------------------------------------------------------------
// Agent icon map (Lucide replacements for emoji)
// ---------------------------------------------------------------------------
const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  '🧭': Compass,
  '🎙️': Mic,
  '📅': CalendarDays,
  '💰': Receipt,
  '📦': Package,
  '🧮': Calculator,
  '🙋': HandHelping,
  '📱': Smartphone,
  '🔧': Compass,
  '💬': MessageCircle,
}


// ---------------------------------------------------------------------------
// buildJsonLd
// ---------------------------------------------------------------------------
function buildJsonLd(lang: Lang) {
  const t = jacoboContent[lang]
  return buildArticleJsonLd({
    lang,
    url: `https://santifer.io/${t.slug}`,
    altUrl: `https://santifer.io/${t.altSlug}`,
    headline: t.header.h1,
    alternativeHeadline: t.seo.title,
    description: t.seo.description,
    datePublished: '2026-02-25',
    dateModified: '2026-03-05',
    keywords: [
      'multi-agent AI', 'multi agent orchestration', 'AI agent', 'sub-agent architecture', 'tool calling production',
      'n8n workflows', 'n8n ai agent', 'ai agent case study', 'customer service AI',
      'WhatsApp AI agent', 'ElevenLabs voice agent', 'voice AI', 'HITL', 'human in the loop',
      'ia para pymes', 'agente ia whatsapp', 'multi-model orchestration', 'OpenRouter',
      'FDE portfolio', 'solutions architect AI', 'AI production manager', 'enterprise AI patterns',
      'voice AI platform', 'conversational AI case study', 'agentic workflows',
    ],
    images: ['https://santifer.io/jacobo/og-jacobo-agent.png'],
    breadcrumbHome: t.nav.breadcrumbHome,
    breadcrumbCurrent: t.nav.breadcrumbCurrent,
    faq: t.faq.items,
    articleType: 'TechArticle',
    about: [
      { '@type': 'SoftwareApplication', name: 'n8n', url: 'https://n8n.io', applicationCategory: 'Workflow Automation' },
      { '@type': 'SoftwareApplication', name: 'ElevenLabs', url: 'https://elevenlabs.io', applicationCategory: 'Voice AI' },
      { '@type': 'Thing', name: 'Multi-Agent Orchestration' },
      { '@type': 'Thing', name: 'AI Customer Service' },
    ],
    extra: { proficiencyLevel: 'Expert', dependencies: 'n8n, OpenRouter, ElevenLabs, WATI, Airtable, Aircall, YouCanBookMe' },
  })
}

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================
export default function JacoboAgent({ lang = 'en' }: { lang?: Lang }) {
  const t = jacoboContent[lang]
  const wfById = Object.fromEntries(t.downloads.workflows.map(w => [w.id, w]))

  useArticleSeo({
    lang,
    slug: t.slug,
    altSlug: t.altSlug,
    title: t.seo.title,
    description: t.seo.description,
    image: 'https://santifer.io/jacobo/og-jacobo-agent.png',
    publishedTime: '2026-02-25',
    modifiedTime: '2026-03-05',
    articleTags: 'AI agent,multi-agent,n8n,ElevenLabs,HITL,tool calling,WhatsApp,voice AI',
    jsonLd: buildJsonLd(lang),
    xDefaultSlug: 'agente-ia-jacobo',
  })

  // ---- Render ----
  return (
    <ArticleLayout lang={lang}>
      <FloatingToc />
      <ArticleHeader editorId="hero-header" kicker={t.header.kicker} h1={t.header.h1} subtitle={t.header.subtitle} date={t.header.date} readingTime={t.readingTime} />

      {'badge' in t.header && (
        <StatusBadge editorId="exit-badge" text={(t.header as any).badge} />
      )}

      <MetricsGrid editorId="hero-metrics" items={t.heroMetrics} columns={5} compact />

      {/* TL;DR */}
      <Callout editorId="tldr-callout" className="-mx-2 sm:mx-0">{t.tldr}</Callout>

      {/* Open source badge */}
      <div className="flex items-center gap-2 text-xs text-primary mb-6">
        <Download className="w-3.5 h-3.5" />
        <span>{t.downloads.badge}</span>
      </div>

      {/* Hero images */}
      <Photo2 editorId="hero-photos" items={[
        { src: '/jacobo/santiago-headphones-thinking.webp', alt: 'Santiago Fernández de Valderrama', loading: 'eager' },
        { src: '/jacobo/shop-microsoldering-station.webp', alt: lang === 'es' ? 'Estación de microsoldadura en Santifer iRepair' : 'Microsoldering station at Santifer iRepair', loading: 'eager' },
      ]} caption={lang === 'es' ? 'Cada llamada interrumpe una reparación en curso: el técnico deja la microsoldadura para atender al teléfono' : 'Every call interrupts a repair in progress: the technician leaves the microsoldering station to answer the phone'} />

      <article className="prose-custom">
        {/* ---- Intro ---- */}
        <Prose editorId="intro-hook" variant="hook">{t.intro.hook}</Prose>
        <Prose editorId="intro-body" className="mb-8">{t.intro.body}</Prose>

        {/* ================================================================ */}
        {/*  THE PROBLEM                                                     */}
        {/* ================================================================ */}
        <H2 id="the-problem">{t.sections.theProblem.heading}</H2>
        <Prose editorId="problem-body">{t.sections.theProblem.body}</Prose>

        {/* Pain points card */}
        <InfoCard editorId="problem-pain-points">
          <BulletList editorId="problem-pain-points-list" items={t.sections.theProblem.painPoints} variant="in-card" />
        </InfoCard>

        {/* Counter + Diagnostic screen */}
        <Photo2 editorId="problem-shop-counter" items={[
          { src: '/jacobo/shop-counter-smart-displays.webp', alt: lang === 'es' ? 'Mostrador de Santifer iRepair con smart displays' : 'Santifer iRepair counter with smart displays' },
          { src: '/jacobo/shop-diagnostic-screen.webp', alt: lang === 'es' ? 'Pantalla de diagnóstico en la tienda' : 'Diagnostic screen in the shop' },
        ]} caption={lang === 'es' ? 'El mostrador con smart displays y la pantalla de diagnóstico: el negocio que necesitaba un agente IA' : 'The counter with smart displays and the diagnostic screen: the business that needed an AI agent'} />

        {/* Alternatives */}
        <Prose editorId="problem-alternatives-body">{t.sections.theProblem.alternatives.body}</Prose>
        <CardStack editorId="problem-alternatives-stack" items={t.sections.theProblem.alternatives.items.map(item => ({ title: item.tool, detail: item.issue }))} />
        <Callout editorId="problem-alternatives-punchline">{t.sections.theProblem.alternatives.punchline}</Callout>

        {/* POS photo + Business OS cross-link */}
        <Photo1 editorId="problem-pos-legacy" src="/jacobo/before-checkout-pos.webp" alt={lang === 'es' ? 'POS legacy antes de la transformación' : 'Legacy POS before transformation'} caption={lang === 'es' ? 'El viejo POS: facturación, stock y precios de piezas en un software que no se integraba con nada' : 'The old POS system: invoicing, stock and part prices in software that integrated with nothing'} />

        <CaseStudyCta
          editorId="problem-business-os-cta"
          heading={lang === 'es' ? 'Este POS fue el primer problema que resolví' : 'This POS was the first problem I solved'}
          body={lang === 'es'
            ? 'Antes de construir Jacobo, reemplacé este sistema legacy por un ERP custom sobre Airtable. Esa base de datos es la que Jacobo consulta hoy.'
            : 'Before building Jacobo, I replaced this legacy system with a custom ERP on Airtable. That database is what Jacobo queries today.'}
          ctaLabel={t.internalLinks.businessOs.text}
          ctaHref={lang === 'es' ? '/business-os-para-airtable' : '/business-os-for-airtable'}
        />

        {/* ================================================================ */}
        {/*  ARCHITECTURE                                                    */}
        {/* ================================================================ */}
        <H2 id="architecture">{t.sections.architecture.heading}</H2>
        <Prose editorId="architecture-body">{t.sections.architecture.body}</Prose>

        {/* Architecture diagram */}
        <Photo1 editorId="architecture-diagram" src={`/jacobo/architecture-${lang === 'es' ? 'es' : 'en'}.webp`} alt={lang === 'es' ? 'Diagrama de arquitectura de Jacobo' : 'Jacobo architecture diagram'} />

        {/* Stack */}
        <H3 id="stack">Stack</H3>
        <Prose editorId="stack-intro">{t.sections.architecture.stackIntro}</Prose>
        <StackGrid editorId="stack-grid" items={t.sections.architecture.stack.map(s => ({ icon: stackIcons[s.name], name: s.name, desc: s.role }))} />

        {/* Why sub-agents */}
        <H3 id="why-sub-agents">{t.sections.architecture.whySubAgents.heading}</H3>
        <BulletList editorId="why-sub-agents-reasons" items={t.sections.architecture.whySubAgents.reasons.map(r => ({ label: r.title, detail: r.detail }))} className="mb-8" />

        {/* The 7 agents */}
        <H3 id="the-seven-agents">{t.sections.architecture.agentsHeading}</H3>
        <Prose editorId="agents-intro" className="mb-6">{t.sections.architecture.agentsBody}</Prose>

        {/* Agents grid */}
        <CardGrid
          editorId="agents-grid"
          items={t.sections.architecture.agents.filter(a => a.kind === 'agent')}
          columns={1}
          gap="gap-4"
          className="mb-4"
          renderItem={(agent) => {
            const Icon = AGENT_ICONS[agent.icon] ?? Compass
            return (
              <DetailCard key={agent.name} icon={<Icon className="w-5 h-5 text-primary" />} title={agent.name} description={agent.desc}>
                <BulletList items={agent.details} variant="in-card" />
              </DetailCard>
            )
          }}
        />

        {/* Tools grid */}
        <NodeLabel editorId="tools-label" className="uppercase tracking-wider font-medium">{t.sections.architecture.toolsLabel}</NodeLabel>
        <CardGrid
          editorId="tools-grid"
          items={t.sections.architecture.agents.filter(a => a.kind === 'tool')}
          columns={1}
          className="mb-8"
          renderItem={(tool) => {
            const Icon = AGENT_ICONS[tool.icon] ?? Package
            return (
              <DetailCard key={tool.name} icon={<Icon className="w-4 h-4 text-primary" />} title={tool.name} description={tool.desc} className="p-4">
                <BulletList items={tool.details} variant="in-card" />
              </DetailCard>
            )
          }}
        />

        {/* Memory */}
        <H3 id="memory">{t.sections.architecture.memory.heading}</H3>
        <Prose editorId="memory-body">{t.sections.architecture.memory.body}</Prose>
        <DiagramZoom editorId="memory-n8n-workflow" src="/jacobo/n8n-jacobo-memoria.webp" hdSrc="/jacobo/memory-n8n-workflow-2x.webp" alt={lang === 'es' ? 'Workflow de memoria conversacional de Jacobo en n8n' : 'Jacobo conversational memory workflow in n8n'} />
        <StepList editorId="memory-steps" items={t.sections.architecture.memory.steps} />
        <Callout editorId="memory-punchline">{t.sections.architecture.memory.punchline}</Callout>

        {/* Memory screenshots */}
        <ScreenshotGrid editorId="memory-animals-cities" lang={lang} items={[
          { src: 'memory-animals.webp', altEs: 'Test de memoria: Perro, Gato, Elefante — Jacobo recuerda los tres', altEn: 'Memory test: Dog, Cat, Elephant — Jacobo recalls all three' },
          { src: 'memory-cities.webp', altEs: 'Test de ciudades: Sevilla, Madrid, Barcelona — recuerdo correcto', altEn: 'Cities test: Seville, Madrid, Barcelona — correct recall' },
          { src: 'memory-cities-correction.webp', altEs: 'Autocorrección: "Tienes razón, dije Sevilla, no Valencia" — Jacobo se autocorrige', altEn: `Self-correction: "You're right, I said Seville, not Valencia" — Jacobo self-corrects` },
        ]} />
        <ScreenshotCaption editorId="memory-animals-cities-caption" lang={lang} es="Tests de memoria episódica: animales, ciudades y autocorrección cuando Jacobo olvida Barcelona" en="Episodic memory tests: animals, cities and self-correction when Jacobo forgets Barcelona" />
        <ScreenshotGrid editorId="memory-brands-preferences" lang={lang} items={[
          { src: 'memory-brands.webp', altEs: 'Test de marcas: Apple, Samsung, Huawei — recuerdo correcto', altEn: 'Brand test: Apple, Samsung, Huawei — correct recall' },
          { src: 'memory-lost-appointment.webp', altEs: 'Cliente perdió la conversación — Jacobo recuerda la cita completa', altEn: 'Customer lost the conversation — Jacobo recalls the full appointment' },
          { src: 'memory-preference.webp', altEs: 'Re-negociación: Jacobo recuerda preferencia horaria → no hay hueco a las 12 → sugiere alternativas', altEn: 'Re-negotiation: Jacobo recalls time preference → no slot at 12 → suggests alternatives' },
        ]} />
        <ScreenshotCaption editorId="memory-brands-preferences-caption" lang={lang} es="Memoria en acción: marcas recordadas en orden, cita recuperada desde el estado del sistema y re-negociación cuando no hay disponibilidad" en="Memory in action: brands recalled in order, appointment recovered from system state and re-negotiation when no availability" />

        {/* Production debug tools */}
        <H4>{t.sections.architecture.debugTools.heading}</H4>
        <Prose editorId="debug-tools-body">{t.sections.architecture.debugTools.body}</Prose>
        <ScreenshotGrid editorId="debug-tools-screenshots" lang={lang} items={[
          { src: 'debug-json-dump.webp', altEs: 'Comando HISTORIAL: JSON crudo del buffer de memoria expuesto en el chat', altEn: 'HISTORIAL command: raw JSON from memory buffer exposed in chat' },
          { src: 'stress-test-112.webp', altEs: 'Comando BORRAR MEMORIA: reset completo del buffer conversacional', altEn: 'BORRAR MEMORIA command: full conversational buffer reset' },
        ]} />
        <ScreenshotCaption editorId="debug-tools-caption" lang={lang} es="Comandos de debug en producción: HISTORIAL volcaba el JSON crudo del buffer y BORRAR MEMORIA reseteaba la conversación" en="Production debug commands: HISTORIAL dumped raw JSON from the buffer and BORRAR MEMORIA reset the conversation" />

        {/* Pseudo-streaming */}
        <H4>{t.sections.architecture.pseudoStreaming.heading}</H4>
        <Prose editorId="pseudo-streaming-body">{t.sections.architecture.pseudoStreaming.body}</Prose>
        <DiagramZoom editorId="pseudo-streaming-workflow" src="/jacobo/n8n-pseudo-splitter.webp" hdSrc="/jacobo/pseudo-streaming-workflow-2x.webp" alt={lang === 'es' ? 'Workflow de pseudo-streaming en n8n: splitter de mensajes largos para WhatsApp' : 'Pseudo-streaming workflow in n8n: long message splitter for WhatsApp'} />

        {/* Channels (H3 under Architecture) */}
        <H3 id="channels">{t.sections.channels.heading}</H3>
        <Prose editorId="channels-body">{t.sections.channels.body}</Prose>

        {/* Dual orchestrator — callout card */}
        <InfoCard editorId="dual-orchestrator" heading={t.sections.channels.dualOrchestrator.heading}>
          <p className="text-muted-foreground text-sm leading-relaxed">{t.sections.channels.dualOrchestrator.body}</p>
        </InfoCard>

        {/* WhatsApp channel */}
        <H4 icon={<MessageCircle className="w-5 h-5 text-primary" />}>
          {t.sections.channels.whatsapp.name}
        </H4>
        <Prose editorId="whatsapp-body">{t.sections.channels.whatsapp.detail}</Prose>
        <BulletList editorId="whatsapp-highlights" items={t.sections.channels.whatsapp.highlights} className="mb-8" />

        {/* Voice channel */}
        <H4 icon={<Mic className="w-5 h-5 text-primary" />}>
          {t.sections.channels.voice.name}
        </H4>
        <Prose editorId="voice-body">{t.sections.channels.voice.detail}</Prose>

        {/* Aircall routing diagram */}
        <Photo1 editorId="aircall-routing-diagram" src={`/jacobo/aircall-routing-${lang === 'es' ? 'es' : 'en'}.webp`} alt={lang === 'es' ? 'Diagrama de routing Aircall' : 'Aircall routing diagram'} />

        <BulletList editorId="voice-highlights" items={t.sections.channels.voice.highlights} className="mb-8" />

        {/* Coca-Cola production incident */}
        <DetailCard
          editorId="coca-cola-incident"
          icon={<Mic className="w-4 h-4 text-primary" />}
          title={t.sections.channels.cocaColaAnecdote.heading}
          description={t.sections.channels.cocaColaAnecdote.body}
        >
          <p className="font-medium text-foreground text-sm mb-2">{t.sections.channels.cocaColaAnecdote.diagnosis.heading}</p>
          <BulletList editorId="coca-cola-diagnosis" marker="number" variant="in-card" items={t.sections.channels.cocaColaAnecdote.diagnosis.items} />
          <Callout editorId="coca-cola-takeaway">{t.sections.channels.cocaColaAnecdote.takeaway}</Callout>
        </DetailCard>

        {/* Missed call recovery */}
        <H4 id="missed-call-recovery" icon={<PhoneMissed className="w-5 h-5 text-primary" />}>{t.sections.channels.missedCallRecovery.heading}</H4>
        <Prose editorId="missed-call-body">{t.sections.channels.missedCallRecovery.body}</Prose>

        <DiagramZoom editorId="aircall-dashboard" src="/jacobo/aircall-dashboard.webp" hdSrc="/jacobo/aircall-dashboard-2x.webp" alt={lang === 'es' ? 'Dashboard de Aircall — árbol de distribución de llamadas con Jacobo como nodo de la centralita' : 'Aircall dashboard — call distribution tree with Jacobo as a PBX node'} caption={lang === 'es' ? 'Árbol de distribución real en Aircall — Jacobo integrado como un nodo más de la centralita' : 'Actual call distribution tree in Aircall — Jacobo plugged in as another PBX node'} className="mb-4" />

        <ScreenshotGrid editorId="missed-call-flow" lang={lang} items={[
          { src: 'missed-call-template.webp', altEs: 'Template de WhatsApp tras llamada perdida: botones Pedir presupuesto, Tomar cita', altEn: 'WhatsApp template after missed call: buttons Get a quote, Book appointment' },
          { src: 'missed-call-hitl.webp', altEs: 'Cliente elige "Que me llamen" → Jacobo escala a HITL y confirma notificación', altEn: 'Customer picks "Call me back" → Jacobo escalates to HITL and confirms notification' },
        ]} />
        <ScreenshotCaption editorId="missed-call-flow-caption" lang={lang} es="Aircall → Make.com → template WhatsApp con botones → Jacobo retoma la conversación con contexto completo" en="Aircall → Make.com → WhatsApp template with buttons → Jacobo picks up the conversation with full context" />

        {/* Unified Voice UX */}
        <H4 id="unified-voice-ux">{t.sections.channels.unifiedVoiceUx.heading}</H4>
        <Prose editorId="unified-voice-ux-body">{t.sections.channels.unifiedVoiceUx.body}</Prose>
        <Callout editorId="unified-voice-punchline">{(t.sections.channels.unifiedVoiceUx as any).punchline}</Callout>
        <Prose editorId="unified-voice-audio-intro">{(t.sections.channels.unifiedVoiceUx as any).audioIntro}</Prose>
        <AudioPlayer editorId="pbx-audio" items={(t.sections.channels.unifiedVoiceUx as any).audios} lang={lang} />
        <DiagramZoom editorId="aircall-dashboard-detail" src="/jacobo/aircall-dashboard-detail.webp" hdSrc="/jacobo/aircall-dashboard-detail-2x.webp" alt={lang === 'es' ? 'Detalle de Aircall: audios de bienvenida e IVR generados con ElevenLabs con la voz de Jacobo' : 'Aircall detail: welcome and IVR audio generated with ElevenLabs using Jacobo\'s voice'} caption={lang === 'es' ? 'Los nodos "ElevenLabs" son audios pregrabados con la misma voz de Jacobo: bienvenida, IVR y buzón. Cuando salta el agente real, la voz es idéntica' : 'The "ElevenLabs" nodes are pre-recorded audio using Jacobo\'s same voice: welcome, IVR and voicemail. When the live agent picks up, the voice is identical'} className="mb-4" />

        {/* Event routing / Pre-filtering */}
        <H4 id="pre-filtering">{t.sections.channels.eventRouting.heading}</H4>
        <Prose editorId="event-routing-body">{t.sections.channels.eventRouting.body}</Prose>
        <DiagramZoom editorId="prefiltrado-n8n" src="/jacobo/n8n-prefiltrado.webp" hdSrc="/jacobo/prefiltrado-n8n-2x.webp" alt={lang === 'es' ? 'Pre-filtrado de eventos en n8n' : 'Event pre-filtering in n8n'} className="mb-4" />
        <StepList editorId="event-routing-steps" items={t.sections.channels.eventRouting.steps} />
        <Callout editorId="event-routing-punchline" className="mb-8">{t.sections.channels.eventRouting.punchline}</Callout>

        {/* ================================================================ */}
        {/*  E2E FLOWS                                                       */}
        {/* ================================================================ */}
        <H2 id="e2e-flows">{t.sections.e2eFlows.heading}</H2>
        <Prose editorId="e2e-flows-body">{t.sections.e2eFlows.body}</Prose>

        {/* Repair appointment E2E flow */}
        <H3 id="repair-appointment">{t.sections.e2eFlows.items[0].name}</H3>
        <StepList editorId="repair-appointment-steps" items={t.sections.e2eFlows.items[0].details} className="mb-8" />

        {/* Price inquiry E2E flow */}
        <H3 id="price-inquiry">{t.sections.e2eFlows.items[1].name}</H3>
        <StepList editorId="price-inquiry-steps" items={t.sections.e2eFlows.items[1].details} className="mb-8" />

        {/* HITL escalation E2E flow */}
        <H3 id="hitl-escalation">{t.sections.e2eFlows.items[2].name}</H3>
        <StepList editorId="hitl-escalation-steps" items={t.sections.e2eFlows.items[2].details} className="mb-8" />

        {/* ================================================================ */}
        {/*  MAIN ROUTER                                                     */}
        {/* ================================================================ */}
        <H2 id="main-router">{t.sections.mainRouter.heading}</H2>
        <Prose editorId="main-router-body">{t.sections.mainRouter.body}</Prose>

        {/* WhatsApp Router (n8n) */}
        <H3 id="whatsapp-router">{t.sections.mainRouter.whatsappRouter.heading}</H3>
        <Prose editorId="whatsapp-router-body">{t.sections.mainRouter.whatsappRouter.body}</Prose>
        <DiagramZoom editorId="main-router-workflow" src="/jacobo/n8n-router-principal.webp" hdSrc="/jacobo/main-router-workflow-2x.webp" alt={lang === 'es' ? 'Workflow del Router Principal en n8n: 37 nodos' : 'Main Router workflow in n8n: 37 nodes'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['jacobo-chatbot-v2'].href} label={t.downloads.inlineLabel} fileSize={wfById['jacobo-chatbot-v2'].fileSize} />

        {/* Voice Router (ElevenLabs) */}
        <H3 id="voice-router">{t.sections.mainRouter.voiceRouter.heading}</H3>
        <Prose editorId="voice-router-body">{t.sections.mainRouter.voiceRouter.body}</Prose>
        <Photo1 editorId="voice-router-elevenlabs" src="/jacobo/elevenlabs-agent-config.webp" alt={lang === 'es' ? 'Configuración del agente de voz en ElevenLabs: system prompt, modelo y tools' : 'Voice agent configuration in ElevenLabs: system prompt, model and tools'} className="mb-4" />

        {/* Tool Calling */}
        <H3 id="tool-calling">{t.sections.toolCalling.heading}</H3>
        <Prose editorId="tool-calling-body">{t.sections.toolCalling.body}</Prose>
        <DiagramZoom editorId="tool-calling-n8n" src="/jacobo/n8n-tool-calling.webp" hdSrc="/jacobo/tool-calling-n8n-2x.webp" alt={lang === 'es' ? 'Tool calling en n8n: 7 herramientas definidas como HTTP endpoints' : 'Tool calling in n8n: 7 tools defined as HTTP endpoints'} className="mb-4" />
        <ToolList editorId="tool-calling-tools" items={t.sections.toolCalling.tools} />

        {/* Wait message */}
        <H4>{t.sections.toolCalling.waitMessage.heading}</H4>
        <Prose editorId="wait-message-body">{t.sections.toolCalling.waitMessage.body}</Prose>
        <ScreenshotGrid editorId="email-formal-flow" lang={lang} items={[
          { src: 'email-formal-1.webp', altEs: 'Jacobo responde como email formal: asunto, saludo, presupuesto Huawei P20 Pro', altEn: 'Jacobo responds as formal email: subject line, greeting, Huawei P20 Pro quote' },
          { src: 'email-formal-2.webp', altEs: 'Email: desglose batería + puerto carga = 85,80€ → descuento combo 70,80€', altEn: 'Email: battery + charging port = €85.80 → combo discount €70.80' },
          { src: 'email-formal-3.webp', altEs: 'Firma: "Un saludo, Jacobo — Santifer iRepair — dirección + teléfono + email"', altEn: 'Signature: "Best regards, Jacobo — Santifer iRepair — address + phone + email"' },
        ]} />
        <ScreenshotCaption editorId="email-formal-flow-caption" lang={lang} es="Adaptabilidad: el cliente pide formato email y Jacobo responde con asunto, presupuesto desglosado, descuento combo y firma corporativa" en="Adaptability: customer asks for email format and Jacobo responds with subject line, itemized quote, combo discount and corporate signature" />

        {/* Think tool */}
        <H4>{t.sections.toolCalling.thinkTool.heading}</H4>
        <Prose editorId="think-tool-body">{t.sections.toolCalling.thinkTool.body}</Prose>

        {/* Stock-aware routing */}
        <H4>{t.sections.toolCalling.stockAware.heading}</H4>
        <Prose editorId="stock-routing-body">{t.sections.toolCalling.stockAware.body}</Prose>
        <ConditionList editorId="stock-routing-flows" items={t.sections.toolCalling.stockAware.flows} />

        {/* ---- Prompt Engineering ---- */}
        <H3 id="prompt-engineering">{t.sections.promptEngineering.heading}</H3>
        <Prose editorId="prompt-engineering-body">{t.sections.promptEngineering.body}</Prose>

        {/* Detail photos */}
        <Photo2 editorId="prompt-engineering-detail-photos" items={[
          { src: '/jacobo/microscope-pcb-view.webp', alt: lang === 'es' ? 'Vista de PCB bajo microscopio' : 'PCB view under microscope' },
          { src: '/jacobo/chip-bga-fingertip.webp', alt: lang === 'es' ? 'Chip BGA en la punta del dedo' : 'BGA chip on fingertip' },
        ]} caption={lang === 'es' ? 'La misma precisión que exige la microsoldadura se aplica al diseño de tool calls. Y como el dedo sujetando el chip, siempre hay un humano en el loop.' : 'The same precision microsoldering demands applies to tool call design. And like the finger holding the chip, there\'s always a human in the loop.'} />

        {/* Why not fine-tuning */}
        <H4>{t.sections.promptEngineering.whyNotFineTuning.heading}</H4>
        <BulletList editorId="why-not-fine-tuning-reasons" items={t.sections.promptEngineering.whyNotFineTuning.reasons} />

        {/* Business hours */}
        <H4 id="business-hours">{t.sections.promptEngineering.businessHours.heading}</H4>
        <Prose editorId="business-hours-body" className="mb-3">{t.sections.promptEngineering.businessHours.body}</Prose>
        <DiagramZoom editorId="business-hours-n8n" src="/jacobo/n8n-business-hours-check.webp" hdSrc="/jacobo/business-hours-n8n-2x.webp" alt={lang === 'es' ? 'Nodo isBusinessHours en n8n: lógica de horario comercial' : 'isBusinessHours node in n8n: business hours logic'} className="mb-4" />
        <CodeBlock editorId="business-hours-code">{t.sections.promptEngineering.businessHours.code}</CodeBlock>

        {/* Business hours screenshots */}
        <ScreenshotGrid editorId="business-hours-screenshots" lang={lang} items={[
          { src: 'hours-closed.webp', altEs: '"¿Estáis abiertos?" a las 11:56 → "La tienda está cerrada" con horario completo', altEn: '"Are you open?" at 11:56 → "The shop is closed" with full schedule' },
          { src: 'hours-open.webp', altEs: '"¿Estáis abiertos?" a las 13:12 → "¡Sí! Estamos abiertos ahora mismo"', altEn: `"Are you open?" at 13:12 → "Yes! We're open right now"` },
        ]} />
        <ScreenshotCaption editorId="business-hours-screenshots-caption" lang={lang} es="La misma pregunta, respuestas opuestas: a las 11:56 cerrado (pausa mediodía), a las 13:12 abierto. Consciencia de horario en tiempo real." en="Same question, opposite answers: at 11:56 closed (midday break), at 13:12 open. Real-time schedule awareness." />

        {/* Main prompt */}
        <H4 id="main-prompt">{t.sections.promptEngineering.mainPrompt.heading}</H4>
        <Prose editorId="main-prompt-body">{t.sections.promptEngineering.mainPrompt.body}</Prose>

        <DiagramZoom editorId="main-prompt-n8n" src="/jacobo/n8n-prompt-principal.webp" hdSrc="/jacobo/main-prompt-n8n-2x.webp" alt={lang === 'es' ? 'System prompt del router principal en n8n' : 'Main router system prompt in n8n'} className="mb-4" />

        <CodeBlock editorId="main-prompt-code" segments={t.sections.promptEngineering.mainPrompt.segments} />

        {/* Voice prompt */}
        <H4 id="voice-prompt">{t.sections.promptEngineering.voicePrompt.heading}</H4>
        <Prose editorId="voice-prompt-body">{t.sections.promptEngineering.voicePrompt.body}</Prose>
        <CodeBlock editorId="voice-prompt-code" segments={t.sections.promptEngineering.voicePrompt.segments} />

        {/* Iteration examples */}
        <H4 id="iteration-examples">{t.sections.promptEngineering.iterationExamples.heading}</H4>
        <CardStack editorId="iteration-examples" items={t.sections.promptEngineering.iterationExamples.items.map(item => ({ title: item.rule, detail: item.origin }))} className="mb-6" />

        {/* Diagnostic screenshots */}
        <ScreenshotGrid editorId="diagnostic-iteration" lang={lang} items={[
          { src: 'diagnostic-free-1.webp', altEs: 'Jacobo dice "diagnóstico totalmente gratuito" — simplificación incorrecta', altEn: 'Jacobo says "completely free diagnosis" — incorrect simplification' },
          { src: 'diagnostic-correction.webp', altEs: 'Autocorrección: "19€ solo si no reparas con nosotros" — la política real', altEn: `Self-correction: "€19 only if you don't repair with us" — the real policy` },
        ]} />
        <ScreenshotCaption editorId="diagnostic-iteration-caption" lang={lang} es="Iteración real: Jacobo simplificó la política de diagnóstico → el prompt se refinó para incluir la condición exacta" en="Real iteration: Jacobo oversimplified the diagnostic policy → prompt refined to include the exact condition" />

        {/* ================================================================ */}
        {/*  DEEP DIVE: BOOKING                                              */}
        {/* ================================================================ */}
        <H2 id="natural-language-booking">{t.sections.deepDiveBooking.heading}</H2>
        <Prose editorId="booking-body">{t.sections.deepDiveBooking.body}</Prose>
        <Photo1 editorId="booking-nl-to-calendar" src={`/jacobo/nl-to-calendar-${lang === 'es' ? 'es' : 'en'}.webp`} alt={lang === 'es' ? 'De lenguaje natural a slots de calendario' : 'From natural language to calendar slots'} />

        {/* Challenge */}
        <H4>{t.sections.deepDiveBooking.challenge.heading}</H4>
        <Prose editorId="booking-challenge-body" className="mb-6">{t.sections.deepDiveBooking.challenge.body}</Prose>

        {/* Workflow screenshot */}
        <DiagramZoom editorId="booking-n8n-workflow" src="/jacobo/n8n-subagente-citas.webp" hdSrc="/jacobo/booking-n8n-workflow-2x.webp" alt={lang === 'es' ? 'Workflow del sub-agente de citas en n8n: 18 nodos' : 'Appointments sub-agent workflow in n8n: 18 nodes'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['subagente-citas'].href} label={t.downloads.inlineLabel} fileSize={wfById['subagente-citas'].fileSize} />


        {/* Step 1: ParseURL */}
        <H3 id="parseurl">{t.sections.deepDiveBooking.parseUrl.heading}</H3>
        <DiagramZoom editorId="booking-parseurl-n8n" src="/jacobo/n8n-parseurl.webp" hdSrc="/jacobo/booking-parseurl-n8n-2x.webp" alt={lang === 'es' ? 'Nodo ParseURL en n8n: extrae subdomain y query params' : 'ParseURL node in n8n: extracts subdomain and query params'} className="mb-4" />
        <Prose editorId="booking-parseurl-body">{t.sections.deepDiveBooking.parseUrl.body}</Prose>

        {/* Step 2: AnalizarDisponibilidad */}
        <H3 id="analizar-disponibilidad">{t.sections.deepDiveBooking.analizarDisponibilidad.heading}</H3>
        <DiagramZoom editorId="booking-analizar-n8n" src="/jacobo/n8n-analizar-disponibilidad.webp" hdSrc="/jacobo/booking-analizar-n8n-2x.webp" alt={lang === 'es' ? 'Nodo AnalizarDisponibilidad en n8n: agente LLM con reglas temporales' : 'AnalizarDisponibilidad node in n8n: LLM agent with temporal rules'} className="mb-4" />
        <Prose editorId="booking-analizar-body">{t.sections.deepDiveBooking.analizarDisponibilidad.body}</Prose>
        <BulletList editorId="booking-analizar-rules" items={t.sections.deepDiveBooking.analizarDisponibilidad.rules} />

        {/* Step 3: YCBM API */}
        <H3 id="ycbm-api">{t.sections.deepDiveBooking.ycbmApi.heading}</H3>
        <DiagramZoom editorId="booking-ycbm-n8n" src="/jacobo/n8n-ycbm-api.webp" hdSrc="/jacobo/booking-ycbm-n8n-2x.webp" alt={lang === 'es' ? 'Pipeline YCBM API en n8n: 3 llamadas HTTP secuenciales' : 'YCBM API pipeline in n8n: 3 sequential HTTP requests'} className="mb-4" />
        <Prose editorId="booking-ycbm-body">{t.sections.deepDiveBooking.ycbmApi.body}</Prose>
        <StepList editorId="booking-ycbm-steps" items={t.sections.deepDiveBooking.ycbmApi.steps} />

        {/* Step 4: FilterSlots */}
        <H3 id="filter-slots">{t.sections.deepDiveBooking.filterSlots.heading}</H3>
        <DiagramZoom editorId="booking-filter-n8n" src="/jacobo/n8n-filter-slots.webp" hdSrc="/jacobo/booking-filter-n8n-2x.webp" alt={lang === 'es' ? 'Nodo FilterSlots en n8n: intersección de rangos LLM y slots YCBM' : 'FilterSlots node in n8n: intersection of LLM ranges and YCBM slots'} className="mb-4" />
        <Prose editorId="booking-filter-body">{t.sections.deepDiveBooking.filterSlots.body}</Prose>

        {/* Step 5: Auto-booking */}
        <H3 id="auto-booking">{t.sections.deepDiveBooking.autoBooking.heading}</H3>
        <DiagramZoom editorId="booking-auto-n8n" src="/jacobo/n8n-auto-booking.webp" hdSrc="/jacobo/booking-auto-n8n-2x.webp" alt={lang === 'es' ? 'Auto-booking condicional en n8n: 3 caminos según número de slots' : 'Conditional auto-booking in n8n: 3 paths based on slot count'} className="mb-4" />
        <Prose editorId="booking-auto-body">{t.sections.deepDiveBooking.autoBooking.body}</Prose>
        <ConditionList editorId="booking-auto-paths" items={t.sections.deepDiveBooking.autoBooking.paths} />

        <Callout editorId="booking-punchline">{t.sections.deepDiveBooking.punchline}</Callout>

        {/* Booking screenshots */}
        <ScreenshotGrid editorId="booking-flow" lang={lang} items={[
          { src: 'booking-nl-1.webp', altEs: 'Booking: email → cita confirmada + template WhatsApp de confirmación', altEn: 'Booking: email → confirmed appointment + WhatsApp confirmation template' },
          { src: 'booking-nl-2.webp', altEs: 'Reserva con refinamiento: "no, mejor el jueves" → nueva búsqueda', altEn: 'Booking with refinement: "no, Thursday instead" → new search' },
          { src: 'booking-confirmation.webp', altEs: 'Booking: "Tómame cita" → disponibilidad mañana → "A las 17"', altEn: 'Booking: "Book me an appointment" → tomorrow availability → "At 17"' },
        ]} />
        <ScreenshotCaption editorId="booking-flow-caption" lang={lang}
          es="Flujo completo de reserva: el cliente pide cita en lenguaje natural, Jacobo negocia horario, confirma en calendario y envía mensaje de confirmación — todo transparente para el usuario."
          en="Full booking flow: the customer requests an appointment in natural language, Jacobo negotiates the time slot, confirms in the calendar and sends a confirmation message — all transparent to the user."
        />
        {/* Appointments prompt */}
        <H3 id="appointments-prompt">{t.sections.promptEngineering.citasPrompt.heading}</H3>
        <Prose editorId="appointments-prompt-body">{t.sections.promptEngineering.citasPrompt.body}</Prose>

        <DiagramZoom editorId="appointments-prompt-n8n" src="/jacobo/n8n-prompt-citas.webp" hdSrc="/jacobo/appointments-prompt-n8n-2x.webp" alt={lang === 'es' ? 'System prompt del sub-agente de citas' : 'Appointments sub-agent system prompt'} className="mb-4" />

        <CodeBlock editorId="appointments-prompt-code" segments={t.sections.promptEngineering.citasPrompt.segments} />

        {/* ================================================================ */}
        {/*  DEEP DIVE: QUOTES                                               */}
        {/* ================================================================ */}
        <H2 id="deep-dive-quotes">{t.sections.deepDiveQuotes.heading}</H2>
        <Prose editorId="quotes-body">{t.sections.deepDiveQuotes.body}</Prose>

        {/* Challenge */}
        <H4>{t.sections.deepDiveQuotes.challenge.heading}</H4>
        <Prose editorId="quotes-challenge-body" className="mb-6">{t.sections.deepDiveQuotes.challenge.body}</Prose>

        {/* Workflow screenshot */}
        <DiagramZoom editorId="quotes-n8n-workflow" src="/jacobo/n8n-subagente-presupuestos.webp" hdSrc="/jacobo/quotes-n8n-workflow-2x.webp" alt={lang === 'es' ? 'Workflow del sub-agente de presupuestos en n8n: 11 nodos' : 'Quotes sub-agent workflow in n8n: 11 nodes'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['presupuesto-modelo'].href} label={t.downloads.inlineLabel} fileSize={wfById['presupuesto-modelo'].fileSize} />


        {/* CleanModel */}
        <H3 id="clean-model">{t.sections.deepDiveQuotes.cleanModel.heading}</H3>
        <DiagramZoom editorId="clean-model-n8n" src="/jacobo/n8n-presupuesto-clean-model.webp" hdSrc="/jacobo/clean-model-n8n-2x.webp" alt={lang === 'es' ? 'Nodo CleanModel en n8n: normalización de input' : 'CleanModel node in n8n: input normalization'} className="mb-4" />
        <Prose editorId="clean-model-body">{t.sections.deepDiveQuotes.cleanModel.body}</Prose>
        <Prose editorId="clean-model-detail">{t.sections.deepDiveQuotes.cleanModel.detail}</Prose>
        <Callout editorId="clean-model-insight">{t.sections.deepDiveQuotes.cleanModel.insight}</Callout>

        {/* AI Agent */}
        <H3 id="ai-agent-quotes">{t.sections.deepDiveQuotes.aiAgent.heading}</H3>
        <DiagramZoom editorId="ai-agent-quotes-n8n" src="/jacobo/n8n-presupuesto-ai-agent.webp" hdSrc="/jacobo/ai-agent-quotes-n8n-2x.webp" alt={lang === 'es' ? 'Nodo AI Agent del sub-agente de presupuestos en n8n' : 'AI Agent node in quotes sub-agent in n8n'} className="mb-4" />
        <Prose editorId="ai-agent-quotes-body">{t.sections.deepDiveQuotes.aiAgent.body}</Prose>
        <StepList editorId="ai-agent-quotes-tools" items={t.sections.deepDiveQuotes.aiAgent.tools} />
        <Prose editorId="ai-agent-quotes-fallback">{t.sections.deepDiveQuotes.aiAgent.fallback}</Prose>

        {/* FiltrarRespuesta */}
        <H3 id="filtrar-respuesta">{t.sections.deepDiveQuotes.filtrarRespuesta.heading}</H3>
        <DiagramZoom editorId="filtrar-respuesta-n8n" src="/jacobo/n8n-presupuesto-filtrar-respuesta.webp" hdSrc="/jacobo/filtrar-respuesta-n8n-2x.webp" alt={lang === 'es' ? 'Nodo FiltrarRespuesta en n8n: post-procesado determinista' : 'FiltrarRespuesta node in n8n: deterministic post-processing'} className="mb-4" />
        <Prose editorId="filtrar-respuesta-body">{t.sections.deepDiveQuotes.filtrarRespuesta.body}</Prose>
        <ConditionList editorId="filtrar-respuesta-rules" items={t.sections.deepDiveQuotes.filtrarRespuesta.rules} />

        <Callout editorId="quotes-punchline">{t.sections.deepDiveQuotes.punchline}</Callout>

        {/* Quotes prompt */}
        <H3 id="quotes-prompt">{t.sections.deepDiveQuotes.presupuestoPrompt.heading}</H3>
        <Prose editorId="quotes-prompt-body">{t.sections.deepDiveQuotes.presupuestoPrompt.body}</Prose>

        <DiagramZoom editorId="quotes-prompt-n8n" src="/jacobo/n8n-prompt-presupuestos.webp" hdSrc="/jacobo/quotes-prompt-n8n-2x.webp" alt={lang === 'es' ? 'System prompt del sub-agente de presupuestos' : 'Quotes sub-agent system prompt'} className="mb-4" />

        <CodeBlock editorId="quotes-prompt-code" segments={t.sections.deepDiveQuotes.presupuestoPrompt.segments} />

        {/* Quote screenshots */}
        <ScreenshotGrid editorId="quotes-real-examples" lang={lang} items={[
          { src: 'resolution-camera-lens.webp', altEs: 'iPhone 13 Mini lente rota → diagnóstico + precio 55,90€ + enlace', altEn: 'iPhone 13 Mini broken lens → diagnosis + price €55.90 + link' },
          { src: 'quote-triple-1.webp', altEs: 'Presupuesto triple: batería + puerto carga + cristal trasero iPhone 13', altEn: 'Triple quote: battery + charging port + back glass iPhone 13' },
          { src: 'quote-triple-2.webp', altEs: 'Presupuesto desglosado: 3 reparaciones con total 255,70€ con estado de stock', altEn: 'Itemized quote: 3 repairs totaling €255.70 with stock status' },
        ]} />
        <ScreenshotCaption editorId="quotes-real-examples-caption" lang={lang} es="Presupuestos reales: diagnóstico con precio y enlace, presupuesto triple con desglose y total con estado de stock" en="Real quotes: diagnosis with price and link, triple quote with breakdown and total with stock status" />

        {/* ================================================================ */}
        {/*  DEEP DIVE: OTHER TOOLS                                          */}
        {/* ================================================================ */}
        <H2 id="deep-dive-others">{t.sections.deepDiveOthers.heading}</H2>
        <Prose editorId="deep-dive-others-body">{t.sections.deepDiveOthers.body}</Prose>

        {/* Orders */}
        <H3 id="orders-agent">{t.sections.deepDiveOthers.orders.heading}</H3>
        <Prose editorId="orders-body" className="mb-2">{t.sections.deepDiveOthers.orders.body}</Prose>
        <NodeLabel editorId="orders-nodes">{t.sections.deepDiveOthers.orders.nodes}</NodeLabel>
        <DiagramZoom editorId="orders-n8n-workflow" src="/jacobo/n8n-hacer-pedido.webp" hdSrc="/jacobo/orders-n8n-workflow-2x.webp" alt={lang === 'es' ? 'Workflow de Pedidos en n8n' : 'Orders workflow in n8n'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['hacer-pedido'].href} label={t.downloads.inlineLabel} fileSize={wfById['hacer-pedido'].fileSize} />

        <BulletList editorId="orders-details" items={t.sections.deepDiveOthers.orders.details} className="mb-8" />

        {/* Calculator */}
        <H3 id="calculator-agent">{t.sections.deepDiveOthers.calculator.heading}</H3>
        <Prose editorId="calculator-body" className="mb-2">{t.sections.deepDiveOthers.calculator.body}</Prose>
        <NodeLabel editorId="calculator-nodes">{t.sections.deepDiveOthers.calculator.nodes}</NodeLabel>
        <DiagramZoom editorId="calculator-n8n-workflow" src="/jacobo/n8n-calculadora.webp" hdSrc="/jacobo/calculator-n8n-workflow-2x.webp" alt={lang === 'es' ? 'Workflow de la Calculadora de Descuentos en n8n: Webhook → Code (lógica de descuentos) → Response' : 'Discount Calculator workflow in n8n: Webhook → Code (discount logic) → Response'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['calculadora-santifer'].href} label={t.downloads.inlineLabel} fileSize={wfById['calculadora-santifer'].fileSize} />

        <BulletList editorId="calculator-details" items={t.sections.deepDiveOthers.calculator.details} className="mb-4" />
        <CodeBlock editorId="calculator-code" segments={t.sections.deepDiveOthers.calculator.segments} />

        {/* HITL */}
        <H3 id="hitl-agent">{t.sections.deepDiveOthers.hitl.heading}</H3>
        <Prose editorId="hitl-body" className="mb-2">{t.sections.deepDiveOthers.hitl.body}</Prose>
        <NodeLabel editorId="hitl-nodes">{t.sections.deepDiveOthers.hitl.nodes}</NodeLabel>
        <DiagramZoom editorId="hitl-n8n-workflow" src="/jacobo/n8n-hitl-slack.webp" hdSrc="/jacobo/hitl-n8n-workflow-2x.webp" alt={lang === 'es' ? 'Workflow de HITL Handoff en n8n' : 'HITL Handoff workflow in n8n'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['contactar-agente-humano'].href} label={t.downloads.inlineLabel} fileSize={wfById['contactar-agente-humano'].fileSize} />

        <BulletList editorId="hitl-details" items={t.sections.deepDiveOthers.hitl.details} />

        {/* HITL screenshots */}
        <ScreenshotGrid editorId="hitl-escalation" lang={lang} items={[
          { src: 'hitl-warranty.webp', altEs: 'HITL: reclamación de garantía → escalada inmediata al equipo humano', altEn: 'HITL: warranty claim → immediate escalation to human team' },
          { src: 'hitl-slack-chat.webp', altEs: 'Canal #chat en Slack: notificación de escalada HITL con contexto del cliente', altEn: '#chat Slack channel: HITL escalation notification with customer context' },
        ]} />
        <ScreenshotCaption editorId="hitl-escalation-caption" lang={lang} es="Cuando Jacobo escala a humano, llega un mensaje al canal #chat de Slack con el contexto completo de la conversación" en="When Jacobo escalates to a human, a message arrives in the #chat Slack channel with the full conversation context" />

        <ScreenshotGrid editorId="hitl-edge-cases" lang={lang} items={[
          { src: 'hitl-moha.webp', altEs: 'Edge case: "Dile a un agente que salude a Moha" → Jacobo escala con emojis de mano → agente real confirma "Hecho"', altEn: 'Edge case: "Tell an agent to greet Moha" → Jacobo escalates with wave emojis → real agent confirms "Done"' },
          { src: 'stress-test-1.webp', altEs: 'Guardrail: "Pídeme 100 baterías" → rechazo + "Ayúdame coño!" → escalada automática a humano', altEn: 'Guardrail: "Order 100 batteries" → rejection + profanity → automatic escalation to human' },
          { src: 'stress-test-112.webp', altEs: '"Borrar memoria" → reset + "3,2,1..." + emergencia falsa → Jacobo redirige a 112 y mantiene compostura', altEn: '"Borrar memoria" → reset + "3,2,1..." + fake emergency → Jacobo redirects to 112 and keeps composure' },
        ]} />
        <ScreenshotCaption editorId="hitl-edge-cases-caption" lang={lang} es="Edge cases reales: petición absurda, pedido masivo rechazado, escalada por frustración y respuesta ante emergencia falsa con redirección al 112" en="Real edge cases: absurd request, bulk order rejected, frustration escalation and fake emergency response with 112 redirect" />

        {/* WhatsApp cross-channel */}
        <H3 id="whatsapp-agent">{t.sections.deepDiveOthers.whatsapp.heading}</H3>
        <Prose editorId="whatsapp-cross-channel-body" className="mb-2">{t.sections.deepDiveOthers.whatsapp.body}</Prose>
        <NodeLabel editorId="whatsapp-nodes">{t.sections.deepDiveOthers.whatsapp.nodes}</NodeLabel>
        <DiagramZoom editorId="whatsapp-n8n-workflow" src="/jacobo/n8n-enviar-whatsapp.webp" hdSrc="/jacobo/whatsapp-n8n-workflow-2x.webp" alt={lang === 'es' ? 'Workflow de EnviarMensajeWati en n8n' : 'EnviarMensajeWati workflow in n8n'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['enviar-mensaje-wati'].href} label={t.downloads.inlineLabel} fileSize={wfById['enviar-mensaje-wati'].fileSize} />

        <BulletList editorId="whatsapp-cross-channel-details" items={t.sections.deepDiveOthers.whatsapp.details} className="mb-8" />

        {/* ================================================================ */}
        {/*  RESULTS                                                         */}
        {/* ================================================================ */}
        <H2 id="results">{t.sections.results.heading}</H2>
        <Prose editorId="results-body">{t.sections.results.body}</Prose>

        {/* Before-after photos */}
        <Photo2 editorId="results-before-after-photos" items={[
          { src: '/jacobo/before-chaos-desktop.webp', alt: lang === 'es' ? 'Antes: escritorio caótico' : 'Before: chaotic desktop' },
          { src: '/jacobo/after-digital-counter.webp', alt: lang === 'es' ? 'Después: mostrador digital organizado' : 'After: organized digital counter' },
        ]} />

        <MetricsGrid items={t.sections.results.metrics} />

        {/* Before vs After table */}
        <H3 id="before-after">{t.sections.results.beforeAfter.heading}</H3>
        <DataTable
          editorId="results-before-after-table"
          headers={[lang === 'es' ? 'Área' : 'Area', lang === 'es' ? 'Antes' : 'Before', lang === 'es' ? 'Después' : 'After']}
          rows={t.sections.results.beforeAfter.items.map(item => [item.area, item.before, item.after])}
          highlightColumn={2}
        />

        {/* ROI punchline */}
        <Callout editorId="results-roi-punchline" className="mb-4">{t.sections.results.roi}</Callout>

        {/* Industry benchmarks */}
        <Prose editorId="results-benchmarks" className="mb-4">{t.sections.results.benchmarks}</Prose>

        {/* Exit narrative */}
        <InfoCard editorId="results-exit-narrative" className="mb-8">
          <p className="text-base text-foreground leading-relaxed font-medium">{t.sections.results.exitNarrative}</p>
        </InfoCard>

        {/* CTA #1 — After Results */}
        <CaseStudyCta
          editorId="cta-after-results"
          heading={t.cta.heading}
          body={t.cta.body}
          ctaLabel={`${t.cta.label} →`}
          ctaHref="https://linkedin.com/in/santifer"
          external
          secondaryLabel={`${(t.cta as any).labelSecondary} →`}
          secondaryHref="mailto:hola@santifer.io"
        />

        {/* ================================================================ */}
        {/*  DECISIONS (ADRs)                                                */}
        {/* ================================================================ */}
        <H2 id="decisions">{t.sections.decisions.heading}</H2>
        <Prose editorId="decisions-body">{t.sections.decisions.body}</Prose>
        <Accordion editorId="decisions-accordion" items={t.sections.decisions.items} />

        {/* ================================================================ */}
        {/*  PLATFORM EVOLUTION                                              */}
        {/* ================================================================ */}
        <H2 id="platform-evolution">{t.sections.platformEvolution.heading}</H2>
        <Prose editorId="evolution-tagline" className="italic mb-6">{t.sections.platformEvolution.tagline}</Prose>

        {/* Timeline evolution image */}
        <Photo1 editorId="evolution-timeline-diagram" src={`/jacobo/timeline-evolution-${lang === 'es' ? 'es' : 'en'}.webp`} alt={lang === 'es' ? 'Línea de tiempo de la evolución de Jacobo' : 'Jacobo evolution timeline'} />

        {/* Timeline */}
        <Timeline editorId="evolution-timeline" items={t.sections.platformEvolution.steps} />

        <StoryBridge editorId="evolution-bridge" lines={t.sections.platformEvolution.bridge as readonly string[]} />

        {/* Cross-link to Business OS */}
        <CaseStudyCta
          editorId="evolution-business-os-cta"
          heading={lang === 'es' ? 'Business OS — El sistema detrás de Jacobo' : 'Business OS — The System Behind Jacobo'}
          body={t.sections.platformEvolution.crossLink.text}
          ctaLabel={lang === 'es' ? 'Leer case study →' : 'Read case study →'}
          ctaHref={t.sections.platformEvolution.crossLink.href}
        />

        {/* Early Jacobo screenshots */}
        <ScreenshotGrid editorId="evolution-birth-screenshots" lang={lang} items={[
          { src: 'birth-first-test.webp', altEs: 'Primer test de Jacobo: mensaje de prueba básico', altEn: 'First Jacobo test: basic test message' },
          { src: 'birth-loyalty-iteration.webp', altEs: 'Iteración de lealtad: mejora en respuestas del agente', altEn: 'Loyalty iteration: improved agent responses' },
          { src: 'loyalty-diamond-template.webp', altEs: 'Template de diamante: programa de fidelidad automatizado', altEn: 'Diamond template: automated loyalty program' },
        ]} />
        <ScreenshotCaption editorId="evolution-birth-screenshots-caption" lang={lang} es="Los primeros momentos de vida de Jacobo: pruebas de endpoints, iteración del copy de fidelización y el template CRM final" en="Jacobo's first moments of life: endpoint testing, loyalty copy iteration and the final CRM template" />

        {/* ================================================================ */}
        {/*  LESSONS LEARNED                                                 */}
        {/* ================================================================ */}
        <H2 id="lessons">{t.sections.lessons.heading}</H2>
        <StepList
          editorId="lessons-steps"
          items={t.sections.lessons.items.map((l: { title: string; detail: string }) => ({ label: l.title, detail: l.detail }))}
        />

        {/* ================================================================ */}
        {/*  WHAT I'D DO DIFFERENTLY                                         */}
        {/* ================================================================ */}
        <H2 id="what-id-do-differently">{t.sections.whatIdDoDifferently.heading}</H2>
        <Prose editorId="what-id-do-differently-body">{t.sections.whatIdDoDifferently.body}</Prose>
        <StepList editorId="what-id-do-differently-steps" items={t.sections.whatIdDoDifferently.items.map(item => ({ label: item.title, detail: item.detail }))} className="mb-8" />

        {/* ================================================================ */}
        {/*  ENTERPRISE PATTERNS                                             */}
        {/* ================================================================ */}
        <H2 id="enterprise-patterns">{t.sections.enterprisePatterns.heading}</H2>
        <Prose editorId="enterprise-patterns-body">{t.sections.enterprisePatterns.body}</Prose>

        {/* Built vs Enterprise table */}
        <DataTable
          editorId="enterprise-comparison"
          headers={[lang === 'es' ? 'Patrón' : 'Pattern', lang === 'es' ? 'Lo que construí' : 'What I built', 'Enterprise']}
          rows={t.sections.enterprisePatterns.builtVsEnterprise.map(row => [row.pattern, row.built, row.enterprise])}
          highlightColumn={2}
        />

        {/* Industry applicability */}
        <H3 id="applicability">{t.sections.enterprisePatterns.applicability.heading}</H3>
        <CardGrid
          editorId="applicability-grid"
          items={t.sections.enterprisePatterns.applicability.examples as readonly { domain: string; detail: string }[]}
          columns={2}
          className="mb-8"
          renderItem={(ex) => (
            <DetailCard key={ex.domain} title={ex.domain} description={ex.detail} className="p-4" />
          )}
        />

        {/* CTA #2 — After Enterprise Patterns */}
        <CaseStudyCta
          editorId="cta-after-enterprise"
          heading={(t as any).ctaAfterEnterprise.heading}
          body={t.cta.body}
          ctaLabel={`${t.cta.label} →`}
          ctaHref="https://linkedin.com/in/santifer"
          external
          secondaryLabel={`${(t.cta as any).labelSecondary} →`}
          secondaryHref="mailto:hola@santifer.io"
        />

        {/* ================================================================ */}
        {/*  DOWNLOADS                                                       */}
        {/* ================================================================ */}
        <H2 id="run-it-yourself">{t.downloads.section.heading}</H2>
        <Prose editorId="downloads-intro">{t.downloads.section.intro}</Prose>

        {/* Workflow cards grid */}
        <WorkflowGrid
          editorId="workflows-grid"
          workflows={t.downloads.workflows}
          iconMap={AGENT_ICONS}
          fallbackIcon={Compass}
          downloadLabel={t.downloads.inlineLabel}
        />

        {/* GitHub repo link */}
        <div className="flex justify-center mb-4">
          <a
            href="https://github.com/santifer-dev/jacobo-workflows"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            {(t.downloads as any).githubCta}
          </a>
        </div>
        <Prose editorId="downloads-github-note" className="text-center text-sm mb-6">{(t.downloads as any).githubNote}</Prose>

        {/* Import instructions */}
        <H3>{t.downloads.section.importHeading}</H3>
        <StepList editorId="downloads-import-steps" items={t.downloads.section.importSteps} className="mb-8" />

        {/* ================================================================ */}
        {/*  FAQ                                                             */}
        {/* ================================================================ */}
        <FaqSection editorId="faq" heading={t.faq.heading} items={t.faq.items} />

        {/* ================================================================ */}
        {/*  RECRUITER CTA #3 — After Downloads (short version)              */}
        {/* ================================================================ */}
        <CaseStudyCta
          editorId="cta-after-downloads"
          heading={(t as any).ctaAfterDownloads.heading}
          body=""
          ctaLabel={`${t.cta.label} →`}
          ctaHref="https://linkedin.com/in/santifer"
          external
          secondaryLabel={`${(t.cta as any).labelSecondary} →`}
          secondaryHref="mailto:hola@santifer.io"
        />

        {/* ================================================================ */}
        {/*  RESOURCES                                                       */}
        {/* ================================================================ */}
        <ResourcesList editorId="resources" heading={t.resources.heading} items={t.resources.items} />
      </article>

      <ArticleFooter
        editorId="footer"
        role={t.footer.role}
        bio={(t.footer as any).bio}
        fellowAt={(t.footer as any).fellowAt}
        fellowLink={(t.footer as any).fellowLink}
        fellowUrl="https://maven.com/marily-nika/ai-pm-bootcamp?utm_source=santifer&utm_medium=casestudy&utm_campaign=jacobo"
        copyright={t.footer.copyright}
      />
    </ArticleLayout>
  )
}
