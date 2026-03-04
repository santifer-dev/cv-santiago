import { useEffect, useState, useCallback, type ReactNode } from 'react'
import { type N8nLang as Lang } from './n8n-i18n'
import { buildArticleJsonLd } from './articles/json-ld'
import { Compass, Mic, CalendarDays, Receipt, Package, Calculator, HandHelping, List, Smartphone, MessageCircle, PhoneMissed, Download } from 'lucide-react'
import {
  ArticleLayout,
  ArticleHeader,
  ArticleFooter,
  FaqSection,
  ResourcesList,
  LessonsSection,
  MetricsGrid,
  CaseStudyCta,
  InlineWorkflowDownload,
  WorkflowDownloadCard,
} from './articles/components'
import {
  H2,
  H3,
  H4,
  Prose,
  LabeledText,
  Callout,
  InfoCard,
  CardStack,
  BulletList,
  StepList,
  CardGrid,
  StackGrid,
  Photo1,
  Photo2,
  CodeBlock,
  Accordion,
  DataTable,
  Timeline,
  ScreenshotGrid,
  ScreenshotCaption,
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
// TOC_SECTIONS
// ---------------------------------------------------------------------------
interface TocItem { id: string; label: string; children?: TocItem[] }

const TOC_SECTIONS: Record<Lang, TocItem[]> = {
  es: [
    { id: 'the-problem', label: 'El Problema' },
    { id: 'architecture', label: 'Arquitectura', children: [
      { id: 'stack', label: 'Stack' },
      { id: 'channels', label: 'Los Dos Canales' },
      { id: 'missed-call-recovery', label: 'Llamadas Perdidas' },
      { id: 'why-sub-agents', label: 'Por qué sub-agentes' },
      { id: 'the-seven-agents', label: 'Los 7 Agentes' },
      { id: 'memory', label: 'Memoria' },
    ]},
    { id: 'main-router', label: 'Router Principal (n8n)', children: [
      { id: 'pre-filtering', label: 'Pre-filtrado' },
      { id: 'tool-calling', label: 'Tool Calling' },
      { id: 'prompt-engineering', label: 'Prompt Engineering' },
      { id: 'business-hours', label: 'Horario comercial' },
      { id: 'main-prompt', label: 'Prompt principal' },
      { id: 'voice-prompt', label: 'Prompt de voz' },
      { id: 'iteration-examples', label: 'Iteraciones reales' },
    ]},
    { id: 'natural-language-booking', label: 'Deep Dive: Citas', children: [
      { id: 'appointments-prompt', label: 'Prompt de citas' },
      { id: 'repair-appointment', label: 'Flujo: Cita de reparación' },
    ]},
    { id: 'deep-dive-quotes', label: 'Deep Dive: Presupuestos', children: [
      { id: 'quotes-prompt', label: 'Prompt de presupuestos' },
      { id: 'price-inquiry', label: 'Flujo: Consulta de precios' },
    ]},
    { id: 'deep-dive-others', label: 'Deep Dive: Tools', children: [
      { id: 'orders-agent', label: 'Pedidos' },
      { id: 'calculator-agent', label: 'Calculadora' },
      { id: 'hitl-agent', label: 'HITL Handoff' },
      { id: 'whatsapp-agent', label: 'Cross-Channel' },
    ]},
    { id: 'results', label: 'Resultados', children: [
      { id: 'before-after', label: 'Antes vs Después' },
    ]},
    { id: 'decisions', label: 'ADRs' },
    { id: 'platform-evolution', label: 'Evolución' },
    { id: 'what-id-do-differently', label: 'Qué Haría Diferente' },
    { id: 'enterprise-patterns', label: 'Enterprise Patterns', children: [
      { id: 'applicability', label: 'Por industria' },
    ]},
    { id: 'run-it-yourself', label: 'Descarga los Workflows' },
    { id: 'faq', label: 'FAQ' },
  ],
  en: [
    { id: 'the-problem', label: 'The Problem' },
    { id: 'architecture', label: 'Architecture', children: [
      { id: 'stack', label: 'Stack' },
      { id: 'channels', label: 'The Two Channels' },
      { id: 'missed-call-recovery', label: 'Missed Calls' },
      { id: 'why-sub-agents', label: 'Why Sub-agents' },
      { id: 'the-seven-agents', label: 'The 7 Agents' },
      { id: 'memory', label: 'Memory' },
    ]},
    { id: 'main-router', label: 'Main Router (n8n)', children: [
      { id: 'pre-filtering', label: 'Pre-filtering' },
      { id: 'tool-calling', label: 'Tool Calling' },
      { id: 'prompt-engineering', label: 'Prompt Engineering' },
      { id: 'business-hours', label: 'Business Hours' },
      { id: 'main-prompt', label: 'Main Prompt' },
      { id: 'voice-prompt', label: 'Voice Prompt' },
      { id: 'iteration-examples', label: 'Real Iterations' },
    ]},
    { id: 'natural-language-booking', label: 'Deep Dive: Appointments', children: [
      { id: 'appointments-prompt', label: 'Appointments Prompt' },
      { id: 'repair-appointment', label: 'Flow: Repair Appointment' },
    ]},
    { id: 'deep-dive-quotes', label: 'Deep Dive: Quotes', children: [
      { id: 'quotes-prompt', label: 'Quotes Prompt' },
      { id: 'price-inquiry', label: 'Flow: Price Inquiry' },
    ]},
    { id: 'deep-dive-others', label: 'Deep Dive: Tools', children: [
      { id: 'orders-agent', label: 'Orders' },
      { id: 'calculator-agent', label: 'Calculator' },
      { id: 'hitl-agent', label: 'HITL Handoff' },
      { id: 'whatsapp-agent', label: 'Cross-Channel' },
    ]},
    { id: 'results', label: 'Results', children: [
      { id: 'before-after', label: 'Before vs After' },
    ]},
    { id: 'decisions', label: 'ADRs' },
    { id: 'platform-evolution', label: 'Evolution' },
    { id: 'what-id-do-differently', label: "What I'd Do Differently" },
    { id: 'enterprise-patterns', label: 'Enterprise Patterns', children: [
      { id: 'applicability', label: 'By industry' },
    ]},
    { id: 'run-it-yourself', label: 'Download Workflows' },
    { id: 'faq', label: 'FAQ' },
  ],
}

// ---------------------------------------------------------------------------
// FloatingToc — sticky sidebar on xl, drawer on mobile
// ---------------------------------------------------------------------------
function FloatingToc({ lang }: { lang: Lang }) {
  const sections = TOC_SECTIONS[lang]
  const [activeId, setActiveId] = useState('')
  const [tocOpen, setTocOpen] = useState(false)

  const allIds = sections.flatMap(s => [s.id, ...(s.children?.map(c => c.id) ?? [])])
  const parentMap = new Map<string, string>()
  sections.forEach(s => s.children?.forEach(c => parentMap.set(c.id, s.id)))

  const scrollTo = useCallback((id: string) => {
    setTocOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const elements = allIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!elements.length) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [allIds])

  const activeParent = parentMap.get(activeId) ?? activeId

  const tocNav = (
    <nav aria-label="Table of contents">
      <ul className="space-y-0.5">
        {sections.map(section => {
          const isActive = activeParent === section.id
          const showChildren = isActive && section.children && section.children.length > 0
          return (
            <li key={section.id}>
              <button
                onClick={() => scrollTo(section.id)}
                className={`
                  text-left w-full px-2 py-1 rounded text-xs transition-colors
                  ${activeId === section.id ? 'text-primary font-medium bg-primary/10' : isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {section.label}
              </button>
              {showChildren && (
                <ul className="ml-3 mt-0.5 mb-1 border-l border-border pl-2 space-y-0.5">
                  {section.children!.map(child => (
                    <li key={child.id}>
                      <button
                        onClick={() => scrollTo(child.id)}
                        className={`
                          text-left w-full px-2 py-0.5 rounded text-xs transition-colors
                          ${activeId === child.id ? 'text-primary font-medium bg-primary/5' : 'text-muted-foreground hover:text-foreground'}
                        `}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <div className="hidden xl:block fixed top-24 left-[max(1rem,calc(50%-38rem))] w-52 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
        {tocNav}
      </div>

      {/* Mobile: floating button + drawer */}
      <button
        onClick={() => setTocOpen(o => !o)}
        className="xl:hidden fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        aria-label="Toggle table of contents"
      >
        <List className="w-5 h-5" />
      </button>
      {tocOpen && (
        <>
          <div className="xl:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={() => setTocOpen(false)} />
          <div className="xl:hidden fixed bottom-20 right-6 z-50 w-64 max-h-[70vh] overflow-y-auto bg-card border border-border rounded-xl shadow-xl p-4">
            {tocNav}
          </div>
        </>
      )}
    </>
  )
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
    dateModified: '2026-03-02',
    keywords: [
      'multi-agent AI', 'multi agent orchestration', 'AI agent', 'sub-agent architecture', 'tool calling production',
      'n8n workflows', 'n8n ai agent', 'ai agent case study', 'customer service AI',
      'WhatsApp AI agent', 'ElevenLabs voice agent', 'voice AI', 'HITL', 'human in the loop',
      'ia para pymes', 'agente ia whatsapp', 'multi-model orchestration', 'OpenRouter',
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

  // ---- SEO meta tags ----
  useEffect(() => {
    const url = `https://santifer.io/${t.slug}`
    const altUrl = `https://santifer.io/${t.altSlug}`
    const altLang = lang === 'es' ? 'en' : 'es'

    document.title = t.seo.title

    const metaTags: Record<string, string> = {
      description: t.seo.description,
      author: 'Santiago Fernández de Valderrama',
      robots: 'index, follow',
    }
    const ogTags: Record<string, string> = {
      'og:type': 'article',
      'og:url': url,
      'og:title': t.seo.title,
      'og:description': t.seo.description,
      'og:image': 'https://santifer.io/jacobo/og-jacobo-agent.png',
      'og:site_name': 'santifer.io',
      'og:locale': lang === 'es' ? 'es_ES' : 'en_US',
      'og:locale:alternate': lang === 'es' ? 'en_US' : 'es_ES',
      'article:published_time': '2026-02-25',
      'article:modified_time': '2026-03-02',
      'article:author': 'https://www.linkedin.com/in/santifer',
      'article:tag': 'AI agent,multi-agent,n8n,ElevenLabs,HITL,tool calling,WhatsApp,voice AI',
    }
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': t.seo.title,
      'twitter:description': t.seo.description,
      'twitter:image': 'https://santifer.io/jacobo/og-jacobo-agent.png',
    }

    Object.entries(metaTags).forEach(([name, content]) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.content = content
    })
    Object.entries(ogTags).forEach(([prop, content]) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el) }
      el.content = content
    })
    Object.entries(twitterTags).forEach(([name, content]) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.content = content
    })

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = url

    const hreflangTags = [
      { hreflang: lang, href: url },
      { hreflang: altLang, href: altUrl },
      { hreflang: 'x-default', href: 'https://santifer.io/agente-ia-jacobo' },
    ]
    const createdLinks: HTMLLinkElement[] = []
    hreflangTags.forEach(({ hreflang, href }) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = hreflang
      link.href = href
      document.head.appendChild(link)
      createdLinks.push(link)
    })

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(buildJsonLd(lang))
    document.head.appendChild(script)

    return () => {
      script.remove()
      createdLinks.forEach(link => link.remove())
    }
  }, [lang, t])

  // ---- Render ----
  return (
    <ArticleLayout>
      <FloatingToc lang={lang} />
      <ArticleHeader kicker={t.header.kicker} h1={t.header.h1} subtitle={t.header.subtitle} date={t.header.date} readingTime={t.readingTime} />

      {/* Proof of exit badge */}
      {'badge' in t.header && (
        <div className="flex items-center gap-2 mb-6 -mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {(t.header as any).badge}
          </span>
        </div>
      )}

      {/* Hero metrics banner */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6 -mx-2 sm:mx-0">
        {t.heroMetrics.map((m) => (
          <div key={m.label} className="bg-card border border-border rounded-lg p-2.5 sm:p-3 text-center">
            <p className="text-lg sm:text-xl font-display font-bold text-primary">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* TL;DR */}
      <Callout className="-mx-2 sm:mx-0">{t.tldr}</Callout>

      {/* Open source badge */}
      <div className="flex items-center gap-2 text-xs text-primary mb-6">
        <Download className="w-3.5 h-3.5" />
        <span>{t.downloads.badge}</span>
      </div>

      {/* Hero images */}
      <Photo2 items={[
        { src: '/jacobo/shop-counter-smart-displays.webp', alt: lang === 'es' ? 'Mostrador de Santifer iRepair con smart displays' : 'Santifer iRepair counter with smart displays', loading: 'eager' },
        { src: '/jacobo/shop-diagnostic-screen.webp', alt: lang === 'es' ? 'Pantalla de diagnóstico en la tienda' : 'Diagnostic screen in the shop', loading: 'eager' },
      ]} />

      <article className="prose-custom">
        {/* ---- Intro ---- */}
        <Prose variant="hook">{t.intro.hook}</Prose>
        <Prose className="mb-8">{t.intro.body}</Prose>

        {/* ================================================================ */}
        {/*  THE PROBLEM                                                     */}
        {/* ================================================================ */}
        <H2 id="the-problem">{t.sections.theProblem.heading}</H2>
        <Prose>{t.sections.theProblem.body}</Prose>

        {/* Pain points card */}
        <InfoCard>
          <BulletList items={t.sections.theProblem.painPoints} variant="in-card" />
        </InfoCard>

        {/* Santiago + Microsoldering */}
        <Photo2 items={[
          { src: '/jacobo/santiago-headphones-thinking.webp', alt: 'Santiago Fernández de Valderrama' },
          { src: '/jacobo/shop-microsoldering-station.webp', alt: lang === 'es' ? 'Estación de microsoldadura en Santifer iRepair' : 'Microsoldering station at Santifer iRepair' },
        ]} />

        {/* Alternatives */}
        <Prose>{t.sections.theProblem.alternatives.body}</Prose>
        <CardStack items={t.sections.theProblem.alternatives.items.map(item => ({ title: item.tool, detail: item.issue }))} />
        <Callout>{t.sections.theProblem.alternatives.punchline}</Callout>

        {/* POS photo + Business OS cross-link */}
        <Photo1 src="/jacobo/before-checkout-pos.webp" alt={lang === 'es' ? 'POS legacy antes de la transformación' : 'Legacy POS before transformation'} />

        <CaseStudyCta
          heading={lang === 'es' ? 'Este POS fue el primer problema que resolví' : 'This POS was the first problem I solved'}
          body={lang === 'es'
            ? 'Antes de construir Jacobo, reemplacé este sistema legacy por un ERP custom sobre Airtable. Esa base de datos es la que Jacobo consulta hoy.'
            : 'Before building Jacobo, I replaced this legacy system with a custom ERP on Airtable. That database is what Jacobo queries today.'}
          ctaLabel={t.internalLinks.businessOs.text}
          ctaHref={lang === 'es' ? '/business-os-para-airtable' : '/en/business-os-for-airtable'}
        />

        {/* ================================================================ */}
        {/*  ARCHITECTURE                                                    */}
        {/* ================================================================ */}
        <H2 id="architecture">{t.sections.architecture.heading}</H2>
        <Prose>{t.sections.architecture.body}</Prose>

        {/* Architecture diagram */}
        <Photo1 src={`/jacobo/architecture-${lang === 'es' ? 'es' : 'en'}.webp`} alt={lang === 'es' ? 'Diagrama de arquitectura de Jacobo' : 'Jacobo architecture diagram'} />

        {/* Stack */}
        <H3 id="stack">Stack</H3>
        <Prose>{t.sections.architecture.stackIntro}</Prose>
        <StackGrid items={t.sections.architecture.stack.map(s => ({ icon: stackIcons[s.name], name: s.name, desc: s.role }))} />

        {/* Why sub-agents */}
        <H3 id="why-sub-agents">{t.sections.architecture.whySubAgents.heading}</H3>
        <BulletList items={t.sections.architecture.whySubAgents.reasons.map(r => ({ label: r.title, detail: r.detail }))} className="mb-8" />

        {/* The 7 agents */}
        <H3 id="the-seven-agents">{t.sections.architecture.agentsHeading}</H3>
        <Prose className="mb-6">{t.sections.architecture.agentsBody}</Prose>

        {/* Agents grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {t.sections.architecture.agents.filter(a => a.kind === 'agent').map(agent => {
            const Icon = AGENT_ICONS[agent.icon] ?? Compass
            return (
              <div key={agent.name} className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <h4 className="font-display font-semibold text-foreground text-sm">{agent.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{agent.desc}</p>
                <ul className="space-y-1.5">
                  {agent.details.map((d, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary/60 mt-0.5">&#8226;</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Tools grid */}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{t.sections.architecture.toolsLabel}</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {t.sections.architecture.agents.filter(a => a.kind === 'tool').map(tool => {
            const Icon = AGENT_ICONS[tool.icon] ?? Package
            return (
              <div key={tool.name} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <h4 className="font-display font-semibold text-foreground text-xs">{tool.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{tool.desc}</p>
                <ul className="space-y-1">
                  {tool.details.map((d, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-primary/60 mt-0.5">&#8226;</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Memory */}
        <H3 id="memory">{t.sections.architecture.memory.heading}</H3>
        <Prose>{t.sections.architecture.memory.body}</Prose>
        <StepList items={t.sections.architecture.memory.steps} />
        <Callout>{t.sections.architecture.memory.punchline}</Callout>

        {/* Memory screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'memory-animals.webp', altEs: 'Test de memoria: Perro, Gato, Elefante — Jacobo recuerda los tres', altEn: 'Memory test: Dog, Cat, Elephant — Jacobo recalls all three' },
          { src: 'memory-cities.webp', altEs: 'Test de ciudades: Sevilla, Madrid, Barcelona — recuerdo correcto', altEn: 'Cities test: Seville, Madrid, Barcelona — correct recall' },
          { src: 'memory-cities-correction.webp', altEs: 'Autocorrección: "Tienes razón, dije Sevilla, no Valencia" — Jacobo se autocorrige', altEn: `Self-correction: "You're right, I said Seville, not Valencia" — Jacobo self-corrects` },
        ]} />
        <ScreenshotCaption lang={lang} es="Tests de memoria episódica: animales, ciudades y autocorrección cuando Jacobo olvida Barcelona" en="Episodic memory tests: animals, cities and self-correction when Jacobo forgets Barcelona" />
        <ScreenshotGrid lang={lang} items={[
          { src: 'memory-brands.webp', altEs: 'Test de marcas: Apple, Samsung, Huawei — recuerdo correcto', altEn: 'Brand test: Apple, Samsung, Huawei — correct recall' },
          { src: 'memory-preference.webp', altEs: 'Jacobo recuerda preferencia horaria: "como mencionaste antes, prefieres por la mañana"', altEn: 'Jacobo recalls time preference: "as you mentioned earlier, you prefer mornings"' },
          { src: 'memory-lost-appointment.webp', altEs: 'Cliente perdió la conversación — Jacobo recuerda la cita completa', altEn: 'Customer lost the conversation — Jacobo recalls the full appointment' },
        ]} />
        <ScreenshotCaption lang={lang} es="Memoria en acción: marcas recordadas, preferencia horaria recuperada y cita completa desde el estado del sistema" en="Memory in action: brands recalled, time preference recovered and full appointment from system state" />

        {/* Debug screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'stress-test-112.webp', altEs: 'Comando "Borrar memoria" → MEMORIA BORRADA: debug para resetear contexto', altEn: '"Borrar memoria" command → MEMORY CLEARED: debug tool for context reset' },
          { src: 'debug-json-dump.webp', altEs: 'Comando HISTORIAL: JSON crudo del buffer de memoria expuesto en el chat', altEn: 'HISTORIAL command: raw JSON from memory buffer exposed in chat' },
        ]} />
        <ScreenshotCaption lang={lang} es="Borrar memoria reseteaba el buffer; HISTORIAL volcaba el JSON crudo — la filtración que enseñó a blindar respuestas" en="Borrar memoria reset the buffer; HISTORIAL dumped raw JSON — the leak that taught us to sanitize responses" />

        {/* Production debug tools */}
        <LabeledText label={t.sections.architecture.debugTools.heading}>{t.sections.architecture.debugTools.body}</LabeledText>

        {/* Pseudo-streaming */}
        <LabeledText label={t.sections.architecture.pseudoStreaming.heading}>{t.sections.architecture.pseudoStreaming.body}</LabeledText>

        {/* ================================================================ */}
        {/*  CHANNELS                                                        */}
        {/* ================================================================ */}
        <H2 id="channels">{t.sections.channels.heading}</H2>
        <Prose>{t.sections.channels.body}</Prose>

        {/* Dual orchestrator — callout card */}
        <InfoCard heading={t.sections.channels.dualOrchestrator.heading}>
          <p className="text-muted-foreground text-sm leading-relaxed">{t.sections.channels.dualOrchestrator.body}</p>
        </InfoCard>

        {/* WhatsApp channel */}
        <H4 icon={<MessageCircle className="w-5 h-5 text-primary" />}>
          {t.sections.channels.whatsapp.name}
        </H4>
        <Prose>{t.sections.channels.whatsapp.detail}</Prose>
        <BulletList items={t.sections.channels.whatsapp.highlights} className="mb-8" />

        {/* Voice channel */}
        <H4 icon={<Mic className="w-5 h-5 text-primary" />}>
          {t.sections.channels.voice.name}
        </H4>
        <Prose>{t.sections.channels.voice.detail}</Prose>

        {/* Aircall routing diagram */}
        <Photo1 src={`/jacobo/aircall-routing-${lang === 'es' ? 'es' : 'en'}.webp`} alt={lang === 'es' ? 'Diagrama de routing Aircall' : 'Aircall routing diagram'} />

        <BulletList items={t.sections.channels.voice.highlights} className="mb-8" />

        {/* Missed call recovery */}
        <H3 id="missed-call-recovery" icon={<PhoneMissed className="w-5 h-5 text-primary" />}>{t.sections.channels.missedCallRecovery.heading}</H3>
        <Prose>{t.sections.channels.missedCallRecovery.body}</Prose>

        <ScreenshotGrid lang={lang} items={[
          { src: 'missed-call-template.webp', altEs: 'Template de WhatsApp tras llamada perdida: botones Pedir presupuesto, Tomar cita', altEn: 'WhatsApp template after missed call: buttons Get a quote, Book appointment' },
          { src: 'missed-call-hitl.webp', altEs: 'Cliente elige "Que me llamen" → Jacobo escala a HITL y confirma notificación', altEn: 'Customer picks "Call me back" → Jacobo escalates to HITL and confirms notification' },
        ]} />
        <ScreenshotCaption lang={lang} es="Aircall → Make.com → template WhatsApp con botones → Jacobo retoma la conversación con contexto completo" en="Aircall → Make.com → WhatsApp template with buttons → Jacobo picks up the conversation with full context" />

        {/* Event routing / Pre-filtering */}
        <H3 id="pre-filtering">{t.sections.channels.eventRouting.heading}</H3>
        <Prose>{t.sections.channels.eventRouting.body}</Prose>
        <StepList items={t.sections.channels.eventRouting.steps} />
        <Callout className="mb-8">{t.sections.channels.eventRouting.punchline}</Callout>

        {/* ================================================================ */}
        {/*  E2E FLOWS (render as expandable cards)                          */}
        {/* ================================================================ */}
        <H3>{t.sections.e2eFlows.heading}</H3>
        <Prose>{t.sections.e2eFlows.body}</Prose>
        <Accordion
          variant="rich"
          items={t.sections.e2eFlows.items.map(flow => ({
            icon: flow.icon,
            name: flow.name,
            trigger: flow.trigger,
            summary: flow.summary,
            tags: flow.agentsTouched,
            details: flow.details,
          }))}
        />

        {/* ================================================================ */}
        {/*  MAIN ROUTER                                                     */}
        {/* ================================================================ */}
        <H2 id="main-router">{t.sections.mainRouter.heading}</H2>
        <Prose>{t.sections.mainRouter.body}</Prose>

        {/* n8n workflow screenshot */}
        <Photo1 src="/jacobo/n8n-router-principal.webp" alt={lang === 'es' ? 'Workflow del Router Principal en n8n: 37 nodos' : 'Main Router workflow in n8n: 37 nodes'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['jacobo-chatbot-v2'].href} label={t.downloads.inlineLabel} fileSize={wfById['jacobo-chatbot-v2'].fileSize} />
        <div className="mb-6" />

        {/* Tool Calling */}
        <H3 id="tool-calling">{t.sections.toolCalling.heading}</H3>
        <Prose>{t.sections.toolCalling.body}</Prose>
        <div className="space-y-2 mb-6">
          {t.sections.toolCalling.tools.map(tool => (
            <div key={tool.name} className="flex items-start gap-3 bg-card border border-border rounded-lg p-4">
              <code className="text-xs text-primary font-mono shrink-0 mt-0.5">{tool.name}</code>
              <p className="text-xs text-muted-foreground">{tool.desc}</p>
            </div>
          ))}
        </div>

        {/* Wait message */}
        <LabeledText label={t.sections.toolCalling.waitMessage.heading}>{t.sections.toolCalling.waitMessage.body}</LabeledText>

        {/* Think tool */}
        <LabeledText label={t.sections.toolCalling.thinkTool.heading}>{t.sections.toolCalling.thinkTool.body}</LabeledText>

        {/* Stock-aware routing */}
        <LabeledText label={t.sections.toolCalling.stockAware.heading}>{t.sections.toolCalling.stockAware.body}</LabeledText>
        <div className="space-y-2 mb-6">
          {t.sections.toolCalling.stockAware.flows.map(f => (
            <div key={f.condition} className="flex items-start gap-2 text-xs">
              <span className="font-medium text-foreground shrink-0">{f.condition}</span>
              <span className="text-muted-foreground">{f.action}</span>
            </div>
          ))}
        </div>

        {/* Detail photos */}
        <Photo2 items={[
          { src: '/jacobo/microscope-pcb-view.webp', alt: lang === 'es' ? 'Vista de PCB bajo microscopio' : 'PCB view under microscope' },
          { src: '/jacobo/chip-bga-fingertip.webp', alt: lang === 'es' ? 'Chip BGA en la punta del dedo' : 'BGA chip on fingertip' },
        ]} />

        {/* ---- Prompt Engineering ---- */}
        <H3 id="prompt-engineering">{t.sections.promptEngineering.heading}</H3>
        <Prose>{t.sections.promptEngineering.body}</Prose>

        {/* Why not fine-tuning */}
        <H4>{t.sections.promptEngineering.whyNotFineTuning.heading}</H4>
        <BulletList items={t.sections.promptEngineering.whyNotFineTuning.reasons} />

        {/* Business hours */}
        <H4 id="business-hours">{t.sections.promptEngineering.businessHours.heading}</H4>
        <Prose className="mb-3">{t.sections.promptEngineering.businessHours.body}</Prose>
        <CodeBlock>{t.sections.promptEngineering.businessHours.code}</CodeBlock>

        {/* Business hours screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'hours-closed.webp', altEs: '"¿Estáis abiertos?" a las 11:56 → "La tienda está cerrada" con horario completo', altEn: '"Are you open?" at 11:56 → "The shop is closed" with full schedule' },
          { src: 'hours-open.webp', altEs: '"¿Estáis abiertos?" a las 13:12 → "¡Sí! Estamos abiertos ahora mismo"', altEn: `"Are you open?" at 13:12 → "Yes! We're open right now"` },
        ]} />
        <ScreenshotCaption lang={lang} es="La misma pregunta, respuestas opuestas: a las 11:56 cerrado (pausa mediodía), a las 13:12 abierto. Consciencia de horario en tiempo real." en="Same question, opposite answers: at 11:56 closed (midday break), at 13:12 open. Real-time schedule awareness." />

        {/* Main prompt */}
        <H4 id="main-prompt">{t.sections.promptEngineering.mainPrompt.heading}</H4>
        <Prose>{t.sections.promptEngineering.mainPrompt.body}</Prose>

        <Photo1 src="/jacobo/n8n-prompt-principal.webp" alt={lang === 'es' ? 'System prompt del router principal en n8n' : 'Main router system prompt in n8n'} className="mb-4" />

        <CodeBlock segments={t.sections.promptEngineering.mainPrompt.segments} />

        {/* Voice prompt */}
        <H4 id="voice-prompt">{t.sections.promptEngineering.voicePrompt.heading}</H4>
        <Prose>{t.sections.promptEngineering.voicePrompt.body}</Prose>
        <CodeBlock segments={t.sections.promptEngineering.voicePrompt.segments} />

        {/* Iteration examples */}
        <H4 id="iteration-examples">{t.sections.promptEngineering.iterationExamples.heading}</H4>
        <CardStack items={t.sections.promptEngineering.iterationExamples.items.map(item => ({ title: item.rule, detail: item.origin }))} className="mb-6" />

        {/* Diagnostic screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'diagnostic-free-1.webp', altEs: 'Jacobo dice "diagnóstico totalmente gratuito" — simplificación incorrecta', altEn: 'Jacobo says "completely free diagnosis" — incorrect simplification' },
          { src: 'diagnostic-correction.webp', altEs: 'Autocorrección: "19€ solo si no reparas con nosotros" — la política real', altEn: `Self-correction: "€19 only if you don't repair with us" — the real policy` },
        ]} />
        <ScreenshotCaption lang={lang} es="Iteración real: Jacobo simplificó la política de diagnóstico → el prompt se refinó para incluir la condición exacta" en="Real iteration: Jacobo oversimplified the diagnostic policy → prompt refined to include the exact condition" />

        {/* Stress test screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'stress-test-1.webp', altEs: 'Stress test: "Pídeme 100 baterías" → rechazo por seguridad + "Ayúdame coño!" → HITL', altEn: 'Stress test: "Order 100 batteries" → security rejection + profanity → HITL' },
          { src: 'quote-triple-2.webp', altEs: 'Presupuesto desglosado: 3 reparaciones con total 255,70€ con estado de stock', altEn: 'Itemized quote: 3 repairs totaling €255.70 with stock status' },
        ]} />
        <ScreenshotCaption lang={lang} es="Guardrails en acción: rechazo de pedidos masivos, escalada ante frustración y presupuestos complejos calculados al vuelo" en="Guardrails in action: bulk order rejection, escalation on frustration, and complex quotes calculated on the fly" />

        {/* ================================================================ */}
        {/*  DEEP DIVE: BOOKING                                              */}
        {/* ================================================================ */}
        <H2 id="natural-language-booking">{t.sections.deepDiveBooking.heading}</H2>
        <Prose>{t.sections.deepDiveBooking.body}</Prose>

        {/* Challenge */}
        <LabeledText label={t.sections.deepDiveBooking.challenge.heading} className="mb-6">{t.sections.deepDiveBooking.challenge.body}</LabeledText>

        {/* Workflow screenshot */}
        <Photo1 src="/jacobo/n8n-subagente-citas.webp" alt={lang === 'es' ? 'Workflow del sub-agente de citas en n8n: 18 nodos' : 'Appointments sub-agent workflow in n8n: 18 nodes'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['subagente-citas'].href} label={t.downloads.inlineLabel} fileSize={wfById['subagente-citas'].fileSize} />
        <div className="mb-6" />

        {/* NL to calendar diagram */}
        <Photo1 src={`/jacobo/nl-to-calendar-${lang === 'es' ? 'es' : 'en'}.webp`} alt={lang === 'es' ? 'De lenguaje natural a slots de calendario' : 'From natural language to calendar slots'} />

        {/* Steps */}
        <StepList items={t.sections.deepDiveBooking.steps} />
        <Callout>{t.sections.deepDiveBooking.punchline}</Callout>

        {/* Booking screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'booking-confirmation.webp', altEs: 'Booking: "Tómame cita" → disponibilidad mañana → "A las 17"', altEn: 'Booking: "Book me an appointment" → tomorrow availability → "At 17"' },
          { src: 'booking-nl-1.webp', altEs: 'Booking: email → cita confirmada + template WhatsApp de confirmación', altEn: 'Booking: email → confirmed appointment + WhatsApp confirmation template' },
          { src: 'booking-nl-2.webp', altEs: 'Reserva con refinamiento: "no, mejor el jueves" → nueva búsqueda', altEn: 'Booking with refinement: "no, Thursday instead" → new search' },
        ]} />

        {/* Appointments prompt */}
        <H4 id="appointments-prompt">{t.sections.promptEngineering.citasPrompt.heading}</H4>
        <Prose>{t.sections.promptEngineering.citasPrompt.body}</Prose>

        <Photo1 src="/jacobo/n8n-prompt-citas.webp" alt={lang === 'es' ? 'System prompt del sub-agente de citas' : 'Appointments sub-agent system prompt'} className="mb-4" />

        <CodeBlock segments={t.sections.promptEngineering.citasPrompt.segments} />

        {/* Repair appointment E2E flow */}
        <H4 id="repair-appointment">{t.sections.e2eFlows.items[0].name}</H4>
        <StepList items={t.sections.e2eFlows.items[0].details} className="mb-8" />

        {/* ================================================================ */}
        {/*  DEEP DIVE: QUOTES                                               */}
        {/* ================================================================ */}
        <H2 id="deep-dive-quotes">{t.sections.deepDiveQuotes.heading}</H2>
        <Prose>{t.sections.deepDiveQuotes.body}</Prose>

        {/* Challenge */}
        <LabeledText label={t.sections.deepDiveQuotes.challenge.heading} className="mb-6">{t.sections.deepDiveQuotes.challenge.body}</LabeledText>

        {/* Workflow screenshot */}
        <Photo1 src="/jacobo/n8n-subagente-presupuestos.webp" alt={lang === 'es' ? 'Workflow del sub-agente de presupuestos en n8n: 11 nodos' : 'Quotes sub-agent workflow in n8n: 11 nodes'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['presupuesto-modelo'].href} label={t.downloads.inlineLabel} fileSize={wfById['presupuesto-modelo'].fileSize} />
        <div className="mb-6" />

        {/* Steps */}
        <StepList items={t.sections.deepDiveQuotes.steps} />
        <Callout>{t.sections.deepDiveQuotes.punchline}</Callout>

        {/* Quotes prompt */}
        <H4 id="quotes-prompt">{t.sections.deepDiveQuotes.presupuestoPrompt.heading}</H4>
        <Prose>{t.sections.deepDiveQuotes.presupuestoPrompt.body}</Prose>

        <Photo1 src="/jacobo/n8n-prompt-presupuestos.webp" alt={lang === 'es' ? 'System prompt del sub-agente de presupuestos' : 'Quotes sub-agent system prompt'} className="mb-4" />

        <CodeBlock segments={t.sections.deepDiveQuotes.presupuestoPrompt.segments} />

        {/* Quote screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'resolution-camera-lens.webp', altEs: 'iPhone 13 Mini lente rota → diagnóstico + precio 55,90€ + enlace', altEn: 'iPhone 13 Mini broken lens → diagnosis + price €55.90 + link' },
          { src: 'quote-triple-1.webp', altEs: 'Presupuesto triple: batería + puerto carga + cristal trasero iPhone 13', altEn: 'Triple quote: battery + charging port + back glass iPhone 13' },
        ]} />

        {/* Price inquiry E2E flow */}
        <H4 id="price-inquiry">{t.sections.e2eFlows.items[1].name}</H4>
        <StepList items={t.sections.e2eFlows.items[1].details} className="mb-8" />

        {/* ================================================================ */}
        {/*  DEEP DIVE: OTHER TOOLS                                          */}
        {/* ================================================================ */}
        <H2 id="deep-dive-others">{t.sections.deepDiveOthers.heading}</H2>
        <Prose>{t.sections.deepDiveOthers.body}</Prose>

        {/* Orders */}
        <H4 id="orders-agent">{t.sections.deepDiveOthers.orders.heading}</H4>
        <Prose className="mb-2">{t.sections.deepDiveOthers.orders.body}</Prose>
        <p className="text-xs text-muted-foreground font-mono mb-3">{t.sections.deepDiveOthers.orders.nodes}</p>
        <Photo1 src="/jacobo/n8n-hacer-pedido.webp" alt={lang === 'es' ? 'Workflow de Pedidos en n8n' : 'Orders workflow in n8n'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['hacer-pedido'].href} label={t.downloads.inlineLabel} fileSize={wfById['hacer-pedido'].fileSize} />
        <div className="mb-6" />
        <BulletList items={t.sections.deepDiveOthers.orders.details} className="mb-8" />

        {/* Calculator */}
        <H4 id="calculator-agent">{t.sections.deepDiveOthers.calculator.heading}</H4>
        <Prose className="mb-2">{t.sections.deepDiveOthers.calculator.body}</Prose>
        <p className="text-xs text-muted-foreground font-mono mb-3">{t.sections.deepDiveOthers.calculator.nodes}</p>
        <Photo1 src="/jacobo/n8n-calculadora.webp" alt={lang === 'es' ? 'Workflow de la Calculadora de Descuentos en n8n: Webhook → Code (lógica de descuentos) → Response' : 'Discount Calculator workflow in n8n: Webhook → Code (discount logic) → Response'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['calculadora-santifer'].href} label={t.downloads.inlineLabel} fileSize={wfById['calculadora-santifer'].fileSize} />
        <div className="mb-6" />
        <BulletList items={t.sections.deepDiveOthers.calculator.details} className="mb-4" />
        <CodeBlock segments={t.sections.deepDiveOthers.calculator.segments} />

        {/* HITL */}
        <H4 id="hitl-agent">{t.sections.deepDiveOthers.hitl.heading}</H4>
        <Prose className="mb-2">{t.sections.deepDiveOthers.hitl.body}</Prose>
        <p className="text-xs text-muted-foreground font-mono mb-3">{t.sections.deepDiveOthers.hitl.nodes}</p>
        <Photo1 src="/jacobo/n8n-hitl-slack.webp" alt={lang === 'es' ? 'Workflow de HITL Handoff en n8n' : 'HITL Handoff workflow in n8n'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['contactar-agente-humano'].href} label={t.downloads.inlineLabel} fileSize={wfById['contactar-agente-humano'].fileSize} />
        <div className="mb-6" />
        <BulletList items={t.sections.deepDiveOthers.hitl.details} />

        {/* HITL screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'hitl-warranty.webp', altEs: 'HITL: reclamación de garantía → escalada inmediata al equipo humano', altEn: 'HITL: warranty claim → immediate escalation to human team' },
          { src: 'hitl-insistent.webp', altEs: 'HITL insistente: 4 peticiones de humano → compostura + teléfono de respaldo', altEn: 'Persistent HITL: 4 human requests → composure + fallback phone number' },
        ]} />

        <ScreenshotGrid lang={lang} items={[
          { src: 'hitl-moha.webp', altEs: 'Edge case: "Dile a un agente que salude a Moha" → Jacobo escala con emojis de mano → agente real confirma "Hecho"', altEn: 'Edge case: "Tell an agent to greet Moha" → Jacobo escalates with wave emojis → real agent confirms "Done"' },
        ]} />

        {/* WhatsApp cross-channel */}
        <H4 id="whatsapp-agent">{t.sections.deepDiveOthers.whatsapp.heading}</H4>
        <Prose className="mb-2">{t.sections.deepDiveOthers.whatsapp.body}</Prose>
        <p className="text-xs text-muted-foreground font-mono mb-3">{t.sections.deepDiveOthers.whatsapp.nodes}</p>
        <Photo1 src="/jacobo/n8n-enviar-whatsapp.webp" alt={lang === 'es' ? 'Workflow de EnviarMensajeWati en n8n' : 'EnviarMensajeWati workflow in n8n'} className="mb-4" />
        <InlineWorkflowDownload href={wfById['enviar-mensaje-wati'].href} label={t.downloads.inlineLabel} fileSize={wfById['enviar-mensaje-wati'].fileSize} />
        <div className="mb-6" />
        <BulletList items={t.sections.deepDiveOthers.whatsapp.details} className="mb-8" />

        {/* ================================================================ */}
        {/*  RESULTS                                                         */}
        {/* ================================================================ */}
        <H2 id="results">{t.sections.results.heading}</H2>
        <Prose>{t.sections.results.body}</Prose>

        {/* Before-after automation diagram */}
        <Photo1 src={`/jacobo/before-after-automation-${lang === 'es' ? 'es' : 'en'}.webp`} alt={lang === 'es' ? 'Antes y después de la automatización' : 'Before and after automation'} />

        {/* Before-after photos */}
        <Photo2 items={[
          { src: '/jacobo/before-chaos-desktop.webp', alt: lang === 'es' ? 'Antes: escritorio caótico' : 'Before: chaotic desktop' },
          { src: '/jacobo/after-digital-counter.webp', alt: lang === 'es' ? 'Después: mostrador digital organizado' : 'After: organized digital counter' },
        ]} />

        <MetricsGrid items={t.sections.results.metrics} />

        {/* Before vs After table */}
        <H3 id="before-after">{t.sections.results.beforeAfter.heading}</H3>
        <DataTable
          headers={[lang === 'es' ? 'Área' : 'Area', lang === 'es' ? 'Antes' : 'Before', lang === 'es' ? 'Después' : 'After']}
          rows={t.sections.results.beforeAfter.items.map(item => [item.area, item.before, item.after])}
          highlightColumn={2}
        />

        {/* ROI punchline */}
        <Callout className="mb-8">{t.sections.results.roi}</Callout>

        {/* ================================================================ */}
        {/*  DECISIONS (ADRs)                                                */}
        {/* ================================================================ */}
        <H2 id="decisions">{t.sections.decisions.heading}</H2>
        <Prose>{t.sections.decisions.body}</Prose>
        <Accordion items={t.sections.decisions.items} />

        {/* ================================================================ */}
        {/*  PLATFORM EVOLUTION                                              */}
        {/* ================================================================ */}
        <H2 id="platform-evolution">{t.sections.platformEvolution.heading}</H2>
        <Prose className="italic mb-6">{t.sections.platformEvolution.tagline}</Prose>

        {/* Santiago photo */}
        <Photo1 src="/jacobo/santiago-headphones-thinking.webp" alt="Santiago Fernández de Valderrama" />

        {/* Timeline */}
        <Timeline items={t.sections.platformEvolution.steps} />

        <Prose>{t.sections.platformEvolution.coda}</Prose>

        {/* Cross-link to Business OS */}
        <InfoCard>
          <a href={t.sections.platformEvolution.crossLink.href} className="text-primary text-sm font-medium hover:underline">
            {t.sections.platformEvolution.crossLink.text}
          </a>
        </InfoCard>

        {/* Timeline evolution image */}
        <Photo1 src={`/jacobo/timeline-evolution-${lang === 'es' ? 'es' : 'en'}.webp`} alt={lang === 'es' ? 'Línea de tiempo de la evolución de Jacobo' : 'Jacobo evolution timeline'} />

        {/* Early Jacobo screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'birth-first-test.webp', altEs: 'Primer test de Jacobo: mensaje de prueba básico', altEn: 'First Jacobo test: basic test message' },
          { src: 'birth-loyalty-iteration.webp', altEs: 'Iteración de lealtad: mejora en respuestas del agente', altEn: 'Loyalty iteration: improved agent responses' },
          { src: 'loyalty-diamond-template.webp', altEs: 'Template de diamante: programa de fidelidad automatizado', altEn: 'Diamond template: automated loyalty program' },
        ]} />
        <ScreenshotCaption lang={lang} es="Los primeros momentos de vida de Jacobo: pruebas de endpoints, iteración del copy de fidelización y el template CRM final" en="Jacobo's first moments of life: endpoint testing, loyalty copy iteration and the final CRM template" />

        {/* Email screenshots */}
        <ScreenshotGrid lang={lang} items={[
          { src: 'email-formal-1.webp', altEs: 'Jacobo responde como email formal: asunto, saludo, presupuesto Huawei P20 Pro', altEn: 'Jacobo responds as formal email: subject line, greeting, Huawei P20 Pro quote' },
          { src: 'email-formal-2.webp', altEs: 'Email: desglose batería + puerto carga = 85,80€ → descuento combo 70,80€', altEn: 'Email: battery + charging port = €85.80 → combo discount €70.80' },
          { src: 'email-formal-3.webp', altEs: 'Firma: "Un saludo, Jacobo — Santifer iRepair — dirección + teléfono + email"', altEn: 'Signature: "Best regards, Jacobo — Santifer iRepair — address + phone + email"' },
        ]} />
        <ScreenshotCaption lang={lang} es="Adaptabilidad: el cliente pide formato email y Jacobo responde con asunto, presupuesto desglosado, descuento combo y firma corporativa" en="Adaptability: customer asks for email format and Jacobo responds with subject line, itemized quote, combo discount and corporate signature" />

        {/* ================================================================ */}
        {/*  LESSONS LEARNED                                                 */}
        {/* ================================================================ */}
        <LessonsSection heading={t.sections.lessons.heading} items={t.sections.lessons.items} />

        {/* ================================================================ */}
        {/*  WHAT I'D DO DIFFERENTLY                                         */}
        {/* ================================================================ */}
        <H2 id="what-id-do-differently">{t.sections.whatIdDoDifferently.heading}</H2>
        <Prose>{t.sections.whatIdDoDifferently.body}</Prose>
        <StepList items={t.sections.whatIdDoDifferently.items.map(item => ({ label: item.title, detail: item.detail }))} className="mb-8" />

        {/* ================================================================ */}
        {/*  ENTERPRISE PATTERNS                                             */}
        {/* ================================================================ */}
        <H2 id="enterprise-patterns">{t.sections.enterprisePatterns.heading}</H2>
        <Prose>{t.sections.enterprisePatterns.body}</Prose>

        {/* Built vs Enterprise table */}
        <DataTable
          headers={[lang === 'es' ? 'Patrón' : 'Pattern', lang === 'es' ? 'Lo que construí' : 'What I built', 'Enterprise']}
          rows={t.sections.enterprisePatterns.builtVsEnterprise.map(row => [row.pattern, row.built, row.enterprise])}
          highlightColumn={2}
        />

        {/* Industry applicability */}
        <H4 id="applicability">{t.sections.enterprisePatterns.applicability.heading}</H4>
        <CardGrid
          items={t.sections.enterprisePatterns.applicability.examples as readonly { domain: string; detail: string }[]}
          columns={2}
          className="mb-8"
          renderItem={(ex) => (
            <div key={ex.domain} className="bg-card border border-border rounded-lg p-4">
              <p className="font-medium text-foreground text-sm mb-1">{ex.domain}</p>
              <p className="text-sm text-muted-foreground">{ex.detail}</p>
            </div>
          )}
        />

        {/* ================================================================ */}
        {/*  DOWNLOADS                                                       */}
        {/* ================================================================ */}
        <H2 id="run-it-yourself">{t.downloads.section.heading}</H2>
        <Prose>{t.downloads.section.intro}</Prose>

        {/* Workflow cards grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {t.downloads.workflows.map(wf => (
            <WorkflowDownloadCard
              key={wf.id}
              icon={wf.icon}
              name={wf.name}
              subtitle={wf.subtitle}
              description={wf.description}
              href={wf.href}
              fileSize={wf.fileSize}
              nodes={wf.nodes}
              llm={'llm' in wf ? (wf as any).llm : undefined}
              downloadLabel={t.downloads.inlineLabel}
            />
          ))}
        </div>

        {/* Download all ZIP */}
        <div className="flex justify-center mb-8">
          <a
            href="/jacobo/workflows/jacobo-all-workflows.zip"
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            {t.downloads.section.downloadAllLabel} <span className="text-primary-foreground/70">{t.downloads.section.downloadAllSize}</span>
          </a>
        </div>

        {/* Import instructions */}
        <H4>{t.downloads.section.importHeading}</H4>
        <StepList items={t.downloads.section.importSteps} className="mb-8" />

        {/* ================================================================ */}
        {/*  FAQ                                                             */}
        {/* ================================================================ */}
        <FaqSection heading={t.faq.heading} items={t.faq.items} />

        {/* ================================================================ */}
        {/*  RECRUITER CTA                                                   */}
        {/* ================================================================ */}
        <div className="my-10 relative rounded-2xl p-[1.5px] bg-gradient-theme">
          <div className="p-6 sm:p-8 rounded-[calc(1rem-1.5px)] bg-card">
            <p className="font-display font-semibold text-foreground text-lg mb-2">{t.cta.heading}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{t.cta.body}</p>
            <div className="flex gap-3">
              <a href="https://linkedin.com/in/santifer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-sm font-medium text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                {t.cta.label} &rarr;
              </a>
              <a href="mailto:hola@santifer.io" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                {(t.cta as any).labelSecondary} &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/*  RESOURCES                                                       */}
        {/* ================================================================ */}
        <ResourcesList heading={t.resources.heading} items={t.resources.items} />
      </article>

      <ArticleFooter
        role={t.footer.role}
        copyright={t.footer.copyright}
      />
    </ArticleLayout>
  )
}
