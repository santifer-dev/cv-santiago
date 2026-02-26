import { useEffect } from 'react'
import { type N8nLang as Lang } from './n8n-i18n'
import { buildArticleJsonLd } from './articles/json-ld'

function ReelCard({ reelId, caption }: { reelId: string; caption: string }) {
  return (
    <a
      href={`https://www.instagram.com/santifer/reel/${reelId}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden border border-border bg-card group"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px] shrink-0">
          <img
            src="/business-os/ig-avatar.jpg"
            alt="santifer"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <p className="text-xs font-semibold text-foreground leading-tight flex-1 min-w-0">santifer</p>
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
      {/* Thumbnail with hover overlay */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '9 / 16' }}>
        <img
          src={`/business-os/reel-${reelId}.jpg`}
          alt={caption}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay — fades in on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
        {/* Play button — instant appear, rounded triangle like Instagram's native */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translate(-3px, 1px)' }}>
          <svg viewBox="0 0 48 48" className="w-[72px] h-[72px] drop-shadow-lg" fill="none">
            <path d="M18 13.5C18 11.8 19.9 10.8 21.3 11.8L36.2 21.8C37.4 22.6 37.4 24.4 36.2 25.2L21.3 34.2C19.9 35.2 18 34.2 18 32.5V13.5Z" fill="white" fillOpacity="0.95" />
          </svg>
        </div>
      </div>
      {/* Caption */}
      <div className="px-3 py-2.5">
        <p className="text-xs text-muted-foreground leading-relaxed">{caption}</p>
      </div>
    </a>
  )
}
import {
  AnchorHeading,
  ArticleLayout,
  ArticleHeader,
  ArticleFooter,
  FaqSection,
  ResourcesList,
  LessonsSection,
  MetricsGrid,
  CaseStudyCta,
} from './articles/components'
import { businessOsContent } from './business-os-i18n'
import ArchitectureDiagram from './ArchitectureDiagram'

function buildJsonLd(lang: Lang) {
  const t = businessOsContent[lang]
  return buildArticleJsonLd({
    lang,
    url: `https://santifer.io/${t.slug}`,
    altUrl: `https://santifer.io/${t.altSlug}`,
    headline: t.header.h1,
    alternativeHeadline: t.seo.title,
    description: t.seo.description,
    datePublished: '2026-02-25',
    dateModified: '2026-02-25',
    keywords: ['Business OS', 'Airtable ERP', 'Airtable as ERP', 'no-code ERP', 'Airtable automation', 'CRM gamification', 'phone repair', 'inventory management', 'custom ERP case study', 'repair shop management'],
    images: ['https://santifer.io/business-os/og-business-os.png'],
    breadcrumbHome: t.nav.breadcrumbHome,
    breadcrumbCurrent: t.nav.breadcrumbCurrent,
    faq: t.faq.items,
    articleType: 'TechArticle',
    about: [
      { '@type': 'SoftwareApplication', name: 'Airtable', url: 'https://airtable.com', applicationCategory: 'Database Platform' },
      { '@type': 'Thing', name: 'Enterprise Resource Planning' },
      { '@type': 'Thing', name: 'Business Process Automation' },
    ],
    extra: { proficiencyLevel: 'Advanced', dependencies: 'Airtable Pro, YouCanBookMe, WATI (WhatsApp API)' },
  })
}

export default function BusinessOS({ lang = 'en' }: { lang?: Lang }) {
  const t = businessOsContent[lang]

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
      'og:site_name': 'santifer.io',
      'og:locale': lang === 'es' ? 'es_ES' : 'en_US',
      'og:locale:alternate': lang === 'es' ? 'en_US' : 'es_ES',
      'og:image': 'https://santifer.io/business-os/og-business-os.png',
      'article:published_time': '2026-02-25',
      'article:author': 'https://www.linkedin.com/in/santifer',
      'article:tag': 'Business OS,Airtable,n8n,ERP,CRM,automation,phone repair',
    }
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': t.seo.title,
      'twitter:description': t.seo.description,
      'twitter:image': 'https://santifer.io/business-os/og-business-os.png',
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
      { hreflang: 'x-default', href: `https://santifer.io/business-os-para-airtable` },
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
      createdLinks.forEach((link) => link.remove())
    }
  }, [lang, t])

  return (
    <ArticleLayout>
      <ArticleHeader
        kicker={t.header.kicker}
        h1={t.header.h1}
        subtitle={t.header.subtitle}
        date={t.header.date}
        readingTime={t.readingTime}
      />

      {/* Hero images — storefront */}
      <div className="grid grid-cols-2 gap-3 mb-8 -mx-2 sm:mx-0">
        <figure className="rounded-lg overflow-hidden border border-border">
          <img
            src="/business-os/hero-storefront.webp"
            alt={lang === 'es' ? 'Fachada de Santifer iRepair — tienda de reparación de móviles en Madrid' : 'Santifer iRepair storefront — phone repair shop in Madrid'}
            className="w-full h-full object-cover"
            width={900} height={1200}
          />
        </figure>
        <figure className="rounded-lg overflow-hidden border border-border">
          <img
            src="/business-os/hero-storefront-urban.webp"
            alt={lang === 'es' ? 'Santifer iRepair de noche — vista urbana con la tienda iluminada' : 'Santifer iRepair at night — urban view with the shop lit up'}
            className="w-full h-full object-cover"
            width={800} height={1067}
          />
        </figure>
      </div>

      <article className="prose-custom">
        {/* Intro */}
        <p className="text-lg text-foreground leading-relaxed mb-4">{t.intro.hook}</p>
        <p className="text-muted-foreground leading-relaxed mb-8">{t.intro.body}</p>

        {/* Day in Life */}
        <AnchorHeading id="day-in-life">{t.sections.dayInLife.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.dayInLife.body}</p>
        <div className="space-y-4 mb-4">
          {t.sections.dayInLife.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-card border border-border rounded-lg p-4">
              <span className="text-lg shrink-0">{step.emoji}</span>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <figure className="bg-card border border-border rounded-lg overflow-hidden">
            <img
              src="/business-os/counter-organized-front.webp"
              alt={lang === 'es' ? 'Interior de Santifer iRepair — lo que ve el cliente al entrar: mostrador con iMac, logo y lámpara esférica' : 'Santifer iRepair interior — what the customer sees walking in: counter with iMac, logo and spherical lamp'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {lang === 'es' ? 'Lo que ve el cliente al entrar — un iMac, un sistema' : 'What the customer sees walking in — one iMac, one system'}
            </figcaption>
          </figure>
          <figure className="bg-card border border-border rounded-lg overflow-hidden">
            <img
              src="/business-os/after-elevator-lamp.webp"
              alt={lang === 'es' ? 'Montacargas de madera junto a lámpara esférica y logo Santifer — conexión entre mostrador y taller' : 'Wooden dumbwaiter next to spherical lamp and Santifer logo — connection between counter and workshop'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {lang === 'es' ? 'El montacargas — terminales suben al taller y bajan reparados' : 'The dumbwaiter — devices go up to the workshop and come down repaired'}
            </figcaption>
          </figure>
        </div>
        <p className="text-sm text-muted-foreground mt-4 mb-4 italic">
          {lang === 'es'
            ? 'El cliente entra y ve un mostrador limpio. A su lado, el montacargas sube los terminales al taller y los baja reparados — la conexión física entre lo digital y lo real.'
            : 'The customer walks in and sees a clean counter. Next to it, the dumbwaiter takes devices up to the workshop and brings them back repaired — the physical connection between digital and real.'}
        </p>
        <CaseStudyCta
          heading={t.sections.dayInLife.jacoboCta.heading}
          body={t.sections.dayInLife.jacoboCta.body}
          ctaLabel={t.sections.dayInLife.jacoboCta.label}
          ctaHref={lang === 'es' ? 'mailto:hola@santifer.io?subject=Jacobo AI Agent' : 'mailto:hi@santifer.io?subject=Jacobo AI Agent'}
        />

        {/* Why Not Off-the-Shelf */}
        <AnchorHeading id="why-custom">{t.sections.whyCustom.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">{t.sections.whyCustom.body}</p>
        <div className="space-y-3 mb-4">
          {t.sections.whyCustom.reasons.map((reason) => (
            <div key={reason.tool} className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-display font-semibold text-foreground mb-1">{reason.tool}</h3>
              <p className="text-sm text-muted-foreground">{reason.issue}</p>
            </div>
          ))}
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mb-4">
          <p className="text-foreground font-medium">{t.sections.whyCustom.punchline}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <figure className="bg-card border border-border rounded-lg overflow-hidden">
            <img
              src="/business-os/before-chaos-desktop.webp"
              alt={lang === 'es' ? 'Escritorio con Checkout POS, calendario, notas y cajonera de piezas — julio 2015' : 'Desktop with Checkout POS, calendar, notes and parts drawers — July 2015'}
              className="w-full h-auto"
              loading="lazy"
            />
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {lang === 'es' ? 'Checkout POS + calendario + notas + cajonera etiquetada a mano (2015)' : 'Checkout POS + calendar + notes + hand-labeled drawer unit (2015)'}
            </figcaption>
          </figure>
          <figure className="bg-card border border-border rounded-lg overflow-hidden">
            <img
              src="/business-os/before-multisystem.webp"
              alt={lang === 'es' ? 'Checkout POS, Slack, scripts de facturación y recordatorios — todo abierto a la vez' : 'Checkout POS, Slack, invoicing scripts and reminders — all open at once'}
              className="w-full h-auto"
              loading="lazy"
            />
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {lang === 'es' ? 'POS + Slack + scripts de facturación + recordatorios — el "sistema" real (2019)' : 'POS + Slack + invoicing scripts + reminders — the real "system" (2019)'}
            </figcaption>
          </figure>
        </div>

        {/* Overview */}
        <AnchorHeading id="overview">{t.sections.overview.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.overview.body}</p>
        <MetricsGrid items={t.sections.overview.stats} />

        {/* Architecture Diagram */}
        <ArchitectureDiagram lang={lang} />

        {/* 12 Bases Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {t.sections.overview.bases.map((base) => (
            <div key={base.name} className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-display font-semibold text-foreground text-sm mb-1">{base.name}</h3>
              <p className="text-xs text-muted-foreground">{base.desc}</p>
            </div>
          ))}
        </div>

        {/* End-to-End Flows */}
        <AnchorHeading id="e2e-flows">{t.sections.e2eFlows.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.e2eFlows.body}</p>
        <div className="space-y-4 mb-8">
          {t.sections.e2eFlows.items.map((flow, idx) => (
            <details key={flow.name} open className="bg-card border border-border rounded-lg group">
              <summary className="flex items-center gap-3 p-5 cursor-pointer select-none">
                <span className="text-lg">{flow.icon}</span>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground">{flow.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{flow.summary}</p>
                </div>
                <span className="text-muted-foreground text-sm transition-transform group-open:rotate-180">&#9660;</span>
              </summary>
              <div className="px-5 pb-5 pt-0">
                {/* Trigger line */}
                <div className="flex items-center gap-2 text-sm text-primary mb-3">
                  <span>&#9889;</span>
                  <span className="font-medium">{flow.trigger}</span>
                </div>

                {/* Bases touched as pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {flow.basesTouched.map((base: string) => (
                    <span key={base} className="bg-primary/10 text-primary text-xs rounded-full px-2.5 py-0.5 font-medium">{base}</span>
                  ))}
                </div>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {flow.details.map((detail: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5 text-xs">&#9679;</span>
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* HP0: Repair Lifecycle */}
                {idx === 0 && (
                  <>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <figure className="rounded-lg overflow-hidden border border-border">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img
                            src="/business-os/after-counter-pov.webp"
                            alt={lang === 'es' ? 'Mostrador de Santifer desde el punto de vista del empleado — iMac con Airtable abierto, citas programadas' : 'Santifer counter from employee POV — iMac with Airtable open, appointments scheduled'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                          {lang === 'es' ? 'Planta baja — el empleado recibe al cliente con las citas del día en Airtable y la OT ya preparada' : 'Ground floor — the employee greets the customer with the day\'s appointments in Airtable and the work order ready'}
                        </figcaption>
                      </figure>
                      <figure className="rounded-lg overflow-hidden border border-border">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img
                            src="/business-os/after-apple-watch-booking.webp"
                            alt={lang === 'es' ? 'Apple Watch del técnico mostrando la próxima cita: Reparar pantalla iPhone, 13:00–13:30 — son las 13:11' : 'Technician Apple Watch showing next appointment: Repair iPhone screen, 13:00–13:30 — it\'s 13:11'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                          {lang === 'es' ? 'Planta alta — el técnico tiene la carga de trabajo en la muñeca. Son las 13:11, la cita era a las 13:00 🤷‍♂️' : 'Upstairs — the technician has their workload on their wrist. It\'s 13:11, appointment was at 13:00 🤷‍♂️'}
                        </figcaption>
                      </figure>
                    </div>
                    <figure className="rounded-lg overflow-hidden border border-border mt-3">
                      <img
                        src="/business-os/automatizacion.png"
                        alt={lang === 'es' ? 'Automatización Airtable — webhook unificado que decide el flujo según stock: crear OT, cancelar cita, crear pedido' : 'Airtable automation — unified webhook that routes the flow based on stock: create work order, cancel appointment, create purchase order'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'Webhook unificado — si hay stock crea la OT, si no lo hay cancela la cita y genera pedido automáticamente' : 'Unified webhook — if stock is available it creates the work order, if not it cancels the appointment and auto-generates a purchase order'}
                      </figcaption>
                    </figure>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <figure className="rounded-lg overflow-hidden border border-border">
                        <img
                          src="/business-os/parts-organized-screens.webp"
                          alt={lang === 'es' ? 'Pantallas de iPhone organizadas por modelo en estantería' : 'iPhone screens organized by model on shelf'}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                        <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                          {lang === 'es' ? 'Cada pantalla etiquetada por modelo — ubicación asignada por Airtable' : 'Each screen labeled by model — location assigned by Airtable'}
                        </figcaption>
                      </figure>
                      <figure className="rounded-lg overflow-hidden border border-border">
                        <img
                          src="/business-os/parts-pcb-microscope.webp"
                          alt={lang === 'es' ? 'Técnico trabajando con microscopio en placa PCB — microsoldadura de precisión' : 'Technician working with microscope on PCB board — precision microsoldering'}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                        <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                          {lang === 'es' ? 'Piezas ordenadas → el técnico se centra en lo que importa' : 'Parts organized → the technician focuses on what matters'}
                        </figcaption>
                      </figure>
                    </div>
                    <figure className="rounded-lg overflow-hidden border border-border mt-3">
                      <img
                        src="/business-os/airtable-ot-repair.webp"
                        alt={lang === 'es' ? 'Interfaz Airtable — pestaña de reparación con piezas, garantías y accesorios' : 'Airtable interface — repair tab with parts, warranties and accessories'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'OT en Airtable — reparación, garantías y accesorios' : 'Work order in Airtable — repair, warranties and accessories'}
                      </figcaption>
                    </figure>
                    <figure className="rounded-lg overflow-hidden border border-border mt-3">
                      <img
                        src="/business-os/airtable-warranties.png"
                        alt={lang === 'es' ? 'Interfaz Airtable de garantías — cada pieza vinculada a proveedor, estado y pedido original' : 'Airtable warranties interface — each part linked to supplier, status and original order'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'Gestión de garantías: cada pieza defectuosa vinculada a su proveedor, pedido original y estado de reclamación' : 'Warranty management: each defective part linked to its supplier, original order and claim status'}
                      </figcaption>
                    </figure>
                  </>
                )}

                {/* HP1: Procurement */}
                {idx === 1 && (
                  <>
                    <figure className="rounded-lg overflow-hidden border border-border mt-4">
                      <img
                        src="/business-os/airtable-inventory.png"
                        alt={lang === 'es' ? 'Interfaz Airtable de inventario — pieza con foto real, stock, ubicación física en tienda (armario, cajón) y proveedor' : 'Airtable inventory interface — part with real photo, stock, physical store location (cabinet, drawer) and supplier'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'Ficha de pieza: stock, proveedor, foto real y ubicación física en tienda (armario, cajón, posición). El técnico sabe exactamente dónde ir a buscarla.' : 'Part record: stock, supplier, real photo and physical store location (cabinet, drawer, position). The technician knows exactly where to find it.'}
                      </figcaption>
                    </figure>
                    <figure className="rounded-lg overflow-hidden border border-border mt-3">
                      <img
                        src="/business-os/airtable-inventory-2.png"
                        alt={lang === 'es' ? 'Segunda vista de inventario — foto de ubicación real en estantería junto a datos del componente' : 'Second inventory view — real shelf location photo next to component data'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'La foto de ubicación es real: el empleado ve en Airtable la estantería exacta donde está la pieza' : 'The location photo is real: the employee sees in Airtable the exact shelf where the part is'}
                      </figcaption>
                    </figure>
                    <figure className="rounded-lg overflow-hidden border border-border mt-3">
                      <img
                        src="/business-os/airtable-purchase-orders.png"
                        alt={lang === 'es' ? 'Interfaz Airtable de pedidos — detalle del pedido con proveedor, pieza, OT vinculada y botón de procesar' : 'Airtable purchase orders interface — order detail with supplier, part, linked work order and process button'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'Pedido a proveedor: pieza, OT vinculada, tracking y botón para procesar. Stock bajo → pedido automático → recepción → inventario actualizado.' : 'Supplier order: part, linked work order, tracking and process button. Low stock → auto order → reception → inventory updated.'}
                      </figcaption>
                    </figure>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <figure className="rounded-lg overflow-hidden border border-border">
                        <img
                          src="/business-os/accessories-cases-shelf.webp"
                          alt={lang === 'es' ? 'Mueble alto con fundas de móvil organizadas por modelo' : 'Tall shelf with phone cases organized by model'}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                        <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                          {lang === 'es' ? 'Fundas organizadas por modelo — cada SKU sincronizado con Airtable' : 'Cases organized by model — every SKU synced with Airtable'}
                        </figcaption>
                      </figure>
                      <figure className="rounded-lg overflow-hidden border border-border">
                        <img
                          src="/business-os/accessories-led-shelf.webp"
                          alt={lang === 'es' ? 'Mueble LED con accesorios expuestos — fundas AirPods, altavoces, cables y cargadores' : 'LED display shelf with accessories — AirPods cases, speakers, cables and chargers'}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                        <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                          {lang === 'es' ? 'Cada accesorio gestionado en Airtable — precio, margen, rotación' : 'Every accessory managed in Airtable — price, margin, rotation'}
                        </figcaption>
                      </figure>
                    </div>
                  </>
                )}

                {/* HP2: Content Pipeline */}
                {idx === 2 && (
                  <>
                    <figure className="rounded-lg overflow-hidden border border-border mt-4">
                      <img
                        src="/business-os/airtable-models-catalog.png"
                        alt={lang === 'es' ? 'Interfaz Airtable del catálogo de modelos — cada modelo con sus reparaciones disponibles, precios y fotos' : 'Airtable models catalog interface — each model with available repairs, prices and photos'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'Catálogo de modelos en Airtable: de aquí salen las landings, los precios y las fotos de cada reparación. Esto es lo que alimenta la web.' : 'Models catalog in Airtable: this is where the landings, prices and photos for each repair come from. This is what feeds the website.'}
                      </figcaption>
                    </figure>
                    <figure className="rounded-lg overflow-hidden border border-border mt-3">
                      <img
                        src="/business-os/web-landing-hero.png"
                        alt={lang === 'es' ? 'Landing de reparación iPhone 11 — precio, CTA, reseñas de Google y especificaciones, todo generado desde Airtable' : 'iPhone 11 repair landing — price, CTA, Google reviews and specs, all generated from Airtable'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'Landing generada al 100% desde Airtable: precio, reseñas de Google, specs del terminal (vía gsmarena-api) y texto SEO dinámico con fórmulas' : 'Landing 100% generated from Airtable: price, Google reviews, device specs (via gsmarena-api) and dynamic SEO copy from formulas'}
                      </figcaption>
                    </figure>
                    <figure className="rounded-lg overflow-hidden border border-border mt-3">
                      <img
                        src="/business-os/web-repairs-catalog.png"
                        alt={lang === 'es' ? 'Catálogo de reparaciones iPhone 11 — cada tarjeta con foto, precio y disponibilidad generados desde el ERP' : 'iPhone 11 repair catalog — each card with photo, price and availability generated from the ERP'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'Catálogo de averías por modelo: cada tarjeta (foto, precio, disponibilidad) generada desde el ERP' : 'Repair catalog by model: each card (photo, price, availability) generated from the ERP'}
                      </figcaption>
                    </figure>
                    <figure className="rounded-lg overflow-hidden border border-border mt-3">
                      <img
                        src="/business-os/web-before-after.png"
                        alt={lang === 'es' ? 'Before/after de reparaciones reales con reseñas — fotos y texto leídos del ERP automáticamente' : 'Real repair before/after with reviews — photos and text read from the ERP automatically'}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                        {lang === 'es' ? 'Before/after reales + reseñas: las fotos salen del ERP, el texto de las specs de gsmarena-api' : 'Real before/after + reviews: photos come from the ERP, spec text from gsmarena-api'}
                      </figcaption>
                    </figure>
                  </>
                )}

                {/* HP3: Customer Lifecycle */}
                {idx === 3 && (
                  <>
                    <div className="flex items-center justify-center gap-3 sm:gap-5 mt-4 py-5 bg-background/50 rounded-lg border border-border">
                      {[
                        { tier: 'Bronze', bg: '#CD7F32', shape: 'circle' },
                        { tier: 'Silver', bg: '#A8A8A8', shape: 'circle' },
                        { tier: 'Gold', bg: '#D4A017', shape: 'circle' },
                        { tier: 'Diamond', bg: '#62D4F0', shape: 'diamond' },
                        { tier: 'Platinum', bg: '#E5E4E2', shape: 'star' },
                      ].map((badge, i, arr) => (
                        <div key={badge.tier} className="flex items-center gap-3 sm:gap-5">
                          <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9">
                            {badge.shape === 'circle' && <circle cx="20" cy="20" r="18" fill={badge.bg} />}
                            {badge.shape === 'diamond' && <polygon points="20,2 38,20 20,38 2,20" fill={badge.bg} />}
                            {badge.shape === 'star' && <polygon points="20,2 25,14 38,14 28,23 32,36 20,28 8,36 12,23 2,14 15,14" fill={badge.bg} />}
                            <text x="20" y="26" textAnchor="middle" fontSize="15" fontWeight="800" fontFamily="Space Grotesk, system-ui" fill="#0c0c10">{badge.tier[0]}</text>
                          </svg>
                          {i < arr.length - 1 && (
                            <svg viewBox="0 0 24 24" className="w-3 h-3 text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Airtable automations — messaging */}
                    <figure className="rounded-lg overflow-hidden border border-border mt-3">
                      <img src="/business-os/automatizaciones-mensajes.png" alt={lang === 'es' ? 'Automatizaciones de mensajes en Airtable: reseñas por tier, pedidos, campañas y WhatsApp' : 'Airtable messaging automations: tier-based reviews, orders, campaigns and WhatsApp'} className="w-full" loading="lazy" />
                      <figcaption className="text-xs text-muted-foreground text-center py-2 px-3 bg-card">
                        {lang === 'es' ? 'Automatizaciones de comunicación: solicitudes de reseña por tier, notificaciones de pedido, campañas y WhatsApp' : 'Communication automations: tier-based review requests, order notifications, campaigns and WhatsApp'}
                      </figcaption>
                    </figure>

                    {/* Google review cards */}
                    <div className="space-y-3 mt-3">
                      <div className="bg-background/50 rounded-lg border border-border p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">M</div>
                          <span className="text-sm font-medium text-foreground">Marisa</span>
                          <div className="flex gap-0.5 ml-auto">
                            {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 20 20" className="w-3.5 h-3.5 text-yellow-400" fill="currentColor"><path d="M10 1l2.47 5.01L18 6.94l-4 3.89.94 5.51L10 13.88l-4.94 2.46.94-5.51-4-3.89 5.53-.93L10 1z"/></svg>)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground italic mb-3">
                          {lang === 'es'
                            ? '"Se nos estropeó un iPhone 8 y fuimos al servicio oficial de Apple. Nos dijeron que no tenía arreglo. Llevamos el móvil a Santifer y en 48 horas estaba como nuevo. Totalmente recomendable."'
                            : '"Our iPhone 8 broke and we went to the official Apple service. They said it couldn\'t be fixed. We took the phone to Santifer and in 48 hours it was like new. Totally recommended."'}
                        </p>
                        <div className="bg-primary/5 border-l-2 border-primary/30 pl-3 py-2">
                          <p className="text-xs text-muted-foreground mb-1 font-medium">
                            {lang === 'es' ? 'Respuesta de Santifer iRepair:' : 'Santifer iRepair response:'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lang === 'es'
                              ? '"¡Gracias Marisa! Nos alegra que tu iPhone 8 esté funcionando perfectamente. El problema de placa base que traía tiene solución con microsoldadura — algo que el servicio oficial no ofrece. ¡Un saludo!"'
                              : '"Thanks Marisa! Glad your iPhone 8 is working perfectly. The motherboard issue it had can be solved with micro-soldering — something the official service doesn\'t offer. Cheers!"'}
                          </p>
                          <p className="text-[10px] text-primary/50 mt-1.5 flex items-center gap-1">
                            <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#18BFFF]" fill="currentColor"><path d="M11.992 1.966c-.434 0-.87.086-1.28.257L1.779 5.917c-.503.208-.49.908.012 1.116l8.982 3.558a3.266 3.266 0 0 0 2.454 0l8.982-3.558c.503-.196.503-.908.012-1.116l-8.957-3.694a3.255 3.255 0 0 0-1.272-.257zM23.4 8.056a.589.589 0 0 0-.222.045l-10.012 3.877a.612.612 0 0 0-.38.564v8.896a.6.6 0 0 0 .821.552L23.62 18.1a.583.583 0 0 0 .38-.551V8.653a.6.6 0 0 0-.6-.596zM.676 8.095a.644.644 0 0 0-.48.19C.086 8.396 0 8.53 0 8.69v8.355c0 .442.515.737.908.54l6.27-3.006.307-.147 2.969-1.436c.466-.22.43-.908-.061-1.092L.883 8.138a.57.57 0 0 0-.207-.044z"/></svg>
                            {lang === 'es' ? 'Contexto del CRM: iPhone 8, microsoldadura placa base, técnico: Álvaro' : 'CRM context: iPhone 8, motherboard micro-soldering, technician: Álvaro'}
                          </p>
                        </div>
                      </div>
                      <div className="bg-background/50 rounded-lg border border-border p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shrink-0">B</div>
                          <span className="text-sm font-medium text-foreground">Bea</span>
                          <div className="flex gap-0.5 ml-auto">
                            {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 20 20" className="w-3.5 h-3.5 text-yellow-400" fill="currentColor"><path d="M10 1l2.47 5.01L18 6.94l-4 3.89.94 5.51L10 13.88l-4.94 2.46.94-5.51-4-3.89 5.53-.93L10 1z"/></svg>)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground italic mb-3">
                          {lang === 'es'
                            ? '"Es la segunda vez que voy a reparar otro modelo de teléfono. Muy bien organizado, el servicio excelente y el precio muy bueno."'
                            : '"This is the second time I\'ve gone to repair a different phone model. Very well organized, excellent service and great price."'}
                        </p>
                        <div className="bg-primary/5 border-l-2 border-primary/30 pl-3 py-2">
                          <p className="text-xs text-muted-foreground mb-1 font-medium">
                            {lang === 'es' ? 'Respuesta de Santifer iRepair:' : 'Santifer iRepair response:'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lang === 'es'
                              ? '"¡Gracias Bea! Nos encanta verte de vuelta. Ya sabes que como clienta Gold tienes prioridad en citas y garantía extendida. ¡Hasta la próxima!"'
                              : '"Thanks Bea! Love having you back. As a Gold customer you know you get priority booking and extended warranty. See you next time!"'}
                          </p>
                          <p className="text-[10px] text-primary/50 mt-1.5 flex items-center gap-1">
                            <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#18BFFF]" fill="currentColor"><path d="M11.992 1.966c-.434 0-.87.086-1.28.257L1.779 5.917c-.503.208-.49.908.012 1.116l8.982 3.558a3.266 3.266 0 0 0 2.454 0l8.982-3.558c.503-.196.503-.908.012-1.116l-8.957-3.694a3.255 3.255 0 0 0-1.272-.257zM23.4 8.056a.589.589 0 0 0-.222.045l-10.012 3.877a.612.612 0 0 0-.38.564v8.896a.6.6 0 0 0 .821.552L23.62 18.1a.583.583 0 0 0 .38-.551V8.653a.6.6 0 0 0-.6-.596zM.676 8.095a.644.644 0 0 0-.48.19C.086 8.396 0 8.53 0 8.69v8.355c0 .442.515.737.908.54l6.27-3.006.307-.147 2.969-1.436c.466-.22.43-.908-.061-1.092L.883 8.138a.57.57 0 0 0-.207-.044z"/></svg>
                            {lang === 'es' ? 'Contexto del CRM: clienta recurrente, tier Gold, 2ª reparación, Samsung Galaxy S21' : 'CRM context: returning customer, Gold tier, 2nd repair, Samsung Galaxy S21'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </details>
          ))}
        </div>
        <CaseStudyCta
          heading={t.sections.dayInLife.pseoCta.heading}
          body={t.sections.dayInLife.pseoCta.body}
          ctaLabel={t.sections.dayInLife.pseoCta.label}
          ctaHref={lang === 'es' ? 'mailto:hola@santifer.io?subject=Programmatic SEO' : 'mailto:hi@santifer.io?subject=Programmatic SEO'}
        />

        {/* Cross-Cutting Capabilities */}
        <AnchorHeading id="cross-cutting">{t.sections.crossCutting.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.crossCutting.body}</p>
        <div className="space-y-4 mb-8">
          {t.sections.crossCutting.items.map((cap, idx) => (
            <details key={cap.name} open className="bg-card border border-border rounded-lg group">
              <summary className="flex items-center gap-3 p-5 cursor-pointer select-none">
                <span className="text-lg">{cap.icon}</span>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground">{cap.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{cap.summary}</p>
                </div>
                <span className="text-muted-foreground text-sm transition-transform group-open:rotate-180">&#9660;</span>
              </summary>
              <div className="px-5 pb-5 pt-0">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {cap.details.map((detail: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5 text-xs">&#9679;</span>
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* CC0: Data Guardrails */}
                {idx === 0 && (
                  <figure className="rounded-lg overflow-hidden border border-border mt-4">
                    <img
                      src="/business-os/airtable-ot-terminal.webp"
                      alt={lang === 'es' ? 'Interfaz Airtable — orden de trabajo con datos del terminal, modelo y foto' : 'Airtable interface — work order with device data, model and photo'}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                    <figcaption className="px-3 py-2 text-xs text-muted-foreground bg-background/50">
                      {lang === 'es' ? 'Formulario de entrada — cada campo validado automáticamente' : 'Intake form — every field automatically validated'}
                    </figcaption>
                  </figure>
                )}

                {/* CC1: Event-Driven Notifications */}
                {idx === 1 && (
                  <div className="flex items-center justify-center gap-4 mt-4 py-6 bg-background/50 rounded-lg border border-border">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#25D366]" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="M8 10h.01M12 10h.01M16 10h.01" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#18BFFF]" fill="currentColor">
                      <path d="M11.992 1.966c-.434 0-.87.086-1.28.257L1.779 5.917c-.503.208-.49.908.012 1.116l8.982 3.558a3.266 3.266 0 0 0 2.454 0l8.982-3.558c.503-.196.503-.908.012-1.116l-8.957-3.694a3.255 3.255 0 0 0-1.272-.257zM23.4 8.056a.589.589 0 0 0-.222.045l-10.012 3.877a.612.612 0 0 0-.38.564v8.896a.6.6 0 0 0 .821.552L23.62 18.1a.583.583 0 0 0 .38-.551V8.653a.6.6 0 0 0-.6-.596zM.676 8.095a.644.644 0 0 0-.48.19C.086 8.396 0 8.53 0 8.69v8.355c0 .442.515.737.908.54l6.27-3.006.307-.147 2.969-1.436c.466-.22.43-.908-.061-1.092L.883 8.138a.57.57 0 0 0-.207-.044z" />
                    </svg>
                  </div>
                )}

                {/* CC2: AI Query Layer */}
                {idx === 2 && (
                  <div className="flex items-center justify-center gap-6 mt-4 py-6 bg-background/50 rounded-lg border border-border">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-muted-foreground" fill="currentColor">
                      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#18BFFF]" fill="currentColor">
                      <path d="M11.992 1.966c-.434 0-.87.086-1.28.257L1.779 5.917c-.503.208-.49.908.012 1.116l8.982 3.558a3.266 3.266 0 0 0 2.454 0l8.982-3.558c.503-.196.503-.908.012-1.116l-8.957-3.694a3.255 3.255 0 0 0-1.272-.257zM23.4 8.056a.589.589 0 0 0-.222.045l-10.012 3.877a.612.612 0 0 0-.38.564v8.896a.6.6 0 0 0 .821.552L23.62 18.1a.583.583 0 0 0 .38-.551V8.653a.6.6 0 0 0-.6-.596zM.676 8.095a.644.644 0 0 0-.48.19C.086 8.396 0 8.53 0 8.69v8.355c0 .442.515.737.908.54l6.27-3.006.307-.147 2.969-1.436c.466-.22.43-.908-.061-1.092L.883 8.138a.57.57 0 0 0-.207-.044z" />
                    </svg>
                  </div>
                )}

                {/* CC3: Generative AI Applied */}
                {idx === 3 && (
                  <>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <figure className="rounded-lg overflow-hidden border border-border">
                        <img
                          src="/business-os/digital-signage-storefront.webp"
                          alt={lang === 'es' ? 'Pantalla digital en escaparate — reparación de móviles' : 'Digital signage in storefront — mobile repair'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </figure>
                      <figure className="rounded-lg overflow-hidden border border-border">
                        <img
                          src="/business-os/digital-signage-storefront-2.webp"
                          alt={lang === 'es' ? 'Pantalla digital en escaparate — Apple Watch' : 'Digital signage in storefront — Apple Watch'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </figure>
                      <figcaption className="col-span-2 text-xs text-muted-foreground">
                        {lang === 'es' ? 'Digital signage en escaparate — imágenes generadas con IA desde el catálogo de Airtable' : 'Storefront digital signage — AI-generated images from the Airtable catalog'}
                      </figcaption>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {[
                        {
                          id: 'DHBkRjoI84t',
                          caption: lang === 'es'
                            ? 'Dedicado a ti, Carlos ❤️'
                            : 'Dedicated to you, Carlos ❤️',
                        },
                        {
                          id: 'DHI1cROoh41',
                          caption: lang === 'es'
                            ? '¿La pantalla nos separa… o nos une? Storytelling + Sora.'
                            : 'Does the screen separate us… or bring us together? Storytelling + Sora.',
                        },
                        {
                          id: 'DHMK2UqoC3M',
                          caption: lang === 'es'
                            ? 'Los "trucos virales" que destruyen tu móvil. Humor + Sora.'
                            : '"Viral tricks" that destroy your phone. Humor + Sora.',
                        },
                        {
                          id: 'DAltoufs6Bx',
                          caption: lang === 'es'
                            ? 'Canción original generada con Suno (IA). Letra, voz y música 100% sintéticas.'
                            : 'Original song generated with Suno (AI). Lyrics, voice and music 100% synthetic.',
                        },
                      ].map((reel) => (
                        <ReelCard key={reel.id} reelId={reel.id} caption={reel.caption} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </details>
          ))}
        </div>

        {/* Impact — 170h/Month Breakdown */}
        <AnchorHeading id="impact">{t.sections.impact.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.impact.body}</p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 text-foreground font-display font-semibold">{lang === 'es' ? 'Módulo' : 'Module'}</th>
                <th className="text-left p-3 text-foreground font-display font-semibold">{lang === 'es' ? 'Antes' : 'Before'}</th>
                <th className="text-left p-3 text-foreground font-display font-semibold">{lang === 'es' ? 'Después' : 'After'}</th>
                <th className="text-left p-3 text-foreground font-display font-semibold">{lang === 'es' ? 'Ahorro/mes' : 'Monthly Savings'}</th>
              </tr>
            </thead>
            <tbody>
              {t.sections.impact.savings.map((row) => (
                <tr key={row.module} className="border-t border-border">
                  <td className="p-3 text-muted-foreground">{row.module}</td>
                  <td className="p-3 text-muted-foreground">{row.before}</td>
                  <td className="p-3 text-primary font-medium">{row.after}</td>
                  <td className="p-3 text-foreground font-semibold">{row.monthly}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-primary/30 bg-primary/5">
                <td className="p-3 text-foreground font-display font-bold" colSpan={3}>Total</td>
                <td className="p-3 text-primary font-display font-bold">{t.sections.impact.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mb-8">
          <p className="text-foreground font-medium">{t.sections.impact.punchline}</p>
        </div>

        {/* Before vs After */}
        <AnchorHeading id="before-after">{t.sections.beforeAfter.heading}</AnchorHeading>

        {/* Before photos gallery */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            {lang === 'es' ? 'Así se gestionaba antes:' : 'How things were managed before:'}
          </p>

          {/* Row 1 (full width): Terminals backlog */}
          <figure className="bg-card border border-border rounded-lg overflow-hidden mb-3">
            <img
              src="/business-os/before-terminals-backlog.webp"
              alt={lang === 'es' ? 'Mesa de atención acumulada de terminales pendientes de recoger' : 'Counter piled with devices waiting to be picked up'}
              className="w-full h-auto"
              loading="lazy"
            />
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {lang === 'es' ? 'Terminales acumulados pendientes de recoger' : 'Devices piling up waiting for pickup'}
            </figcaption>
          </figure>

          {/* Row 2: iCloud Notes + Checkout POS Stock */}
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <figure className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="/business-os/before-icloud-notes.webp"
                  alt={lang === 'es' ? 'Notas de iCloud como sistema de pedidos — Cliente esperando' : 'iCloud Notes as order system — Customer waiting'}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {lang === 'es' ? 'Pedidos en Notas de iCloud' : 'Orders in iCloud Notes'}
              </figcaption>
            </figure>
            <figure className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="/business-os/before-checkout-pos-stock.webp"
                  alt={lang === 'es' ? 'Checkout POS Manager — inventario de piezas con stock manual' : 'Checkout POS Manager — parts inventory with manual stock'}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {lang === 'es' ? 'Stock en Checkout POS' : 'Stock in Checkout POS'}
              </figcaption>
            </figure>
          </div>

          {/* Row 4 (full width): Workshop chaos — breaks the rhythm */}
          <figure className="bg-card border border-border rounded-lg overflow-hidden mb-3">
            <img
              src="/business-os/before-workshop-chaos.webp"
              alt={lang === 'es' ? 'Taller con terminales acumulados por reparar — caos de órdenes de trabajo' : 'Workshop with devices piling up for repair — work order chaos'}
              className="w-full h-auto"
              loading="lazy"
            />
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {lang === 'es' ? 'Taller saturado — sin sistema de prioridades' : 'Overwhelmed workshop — no priority system'}
            </figcaption>
          </figure>

          {/* Row 5: Notebook sketch + Founder overwhelmed */}
          <div className="grid sm:grid-cols-2 gap-3">
            <figure className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="/business-os/before-notebook-sketch.webp"
                  alt={lang === 'es' ? 'Boceto en libreta — primer intento de diseño de integración antes de Airtable' : 'Notebook sketch — first integration design attempt before Airtable'}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {lang === 'es' ? 'Primer boceto de integración — a mano' : 'First integration sketch — by hand'}
              </figcaption>
            </figure>
            <figure className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="/business-os/before-founder-overwhelmed.webp"
                  alt={lang === 'es' ? 'Santiago con gafas de protección y bata en el taller — reparando antes de sistematizar' : 'Santiago with safety glasses and lab coat in the workshop — repairing before systematizing'}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {lang === 'es' ? 'De este caos nació un Product Builder' : 'This chaos built a Product Builder'}
              </figcaption>
            </figure>
          </div>

        </div>

        <div className="space-y-3 mb-8">
          {t.sections.beforeAfter.items.map((item) => (
            <div key={item.area} className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-display font-semibold text-foreground text-sm mb-3">{item.area}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 text-xs shrink-0">&#10005;</span>
                  <p className="text-sm text-muted-foreground">{item.before}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5 text-xs shrink-0">&#10003;</span>
                  <p className="text-sm text-muted-foreground">{item.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* After photos gallery */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            {lang === 'es' ? 'Después — todo en un solo sistema:' : 'After — everything in one system:'}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <figure className="bg-card border border-border rounded-lg overflow-hidden">
              <img
                src="/business-os/after-store-interior.webp"
                alt={lang === 'es' ? 'Interior de Santifer iRepair — lo que ve el cliente al entrar: mostrador con iMac y accesorios' : 'Santifer iRepair interior — what the customer sees: counter with iMac and accessories'}
                className="w-full h-auto"
                loading="lazy"
              />
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {lang === 'es' ? 'Un iMac, un sistema — todo corre sobre Airtable' : 'One iMac, one system — everything runs on Airtable'}
              </figcaption>
            </figure>
            <figure className="bg-card border border-border rounded-lg overflow-hidden">
              <img
                src="/business-os/after-orders-organized.webp"
                alt={lang === 'es' ? 'Órdenes de trabajo preparadas para mensajería — organizadas con Airtable durante el COVID' : 'Work orders ready for courier — organized with Airtable during COVID'}
                className="w-full h-auto"
                loading="lazy"
              />
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {lang === 'es' ? 'Envíos COVID organizados con Airtable — cada bolsa es una OT' : 'COVID shipments organized with Airtable — each bag is a work order'}
              </figcaption>
            </figure>
            <figure className="bg-card border border-border rounded-lg overflow-hidden">
              <img
                src="/business-os/after-workshop-organized.webp"
                alt={lang === 'es' ? 'Taller de reparación organizado — banco de trabajo limpio con cajoneras etiquetadas' : 'Organized repair workshop — clean workbench with labeled drawers'}
                className="w-full h-auto"
                loading="lazy"
              />
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {lang === 'es' ? 'Taller organizado — cada pieza tiene su ubicación asignada' : 'Organized workshop — every part has its assigned location'}
              </figcaption>
            </figure>
            {/* Estantería LED con accesorios — muestra el resultado visual del sistema de catálogo */}
            <figure className="bg-card border border-border rounded-lg overflow-hidden">
              <img
                src="/business-os/after-accessories-display.webp"
                alt={lang === 'es' ? 'Estantería LED con accesorios organizados — auriculares, cables, altavoces' : 'LED shelf with organized accessories — headphones, cables, speakers'}
                className="w-full h-auto"
                loading="lazy"
              />
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {lang === 'es' ? 'Cada accesorio con su ubicación, precio y stock sincronizado en Airtable' : 'Every accessory with its location, price, and stock synced in Airtable'}
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Architecture Decisions */}
        <AnchorHeading id="decisions">{t.sections.decisions.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.decisions.body}</p>
        <div className="space-y-4 mb-8">
          {t.sections.decisions.items.map((item) => (
            <div key={item.title} className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Lessons */}
        <LessonsSection heading={t.sections.lessons.heading} items={t.sections.lessons.items} />

        {/* Replicability */}
        <AnchorHeading id="replicability">{t.sections.replicability.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.replicability.body}</p>
        <div className="space-y-3 mb-4">
          {t.sections.replicability.examples.map((ex: { domain: string; detail: string }) => (
            <div key={ex.domain} className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-display font-semibold text-foreground mb-1">{ex.domain}</h3>
              <p className="text-sm text-muted-foreground">{ex.detail}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground leading-relaxed mb-8">{t.sections.replicability.closing}</p>

        {/* CTA */}
        <CaseStudyCta
          heading={t.cta.heading}
          body={t.cta.body}
          ctaLabel={t.cta.label}
          ctaHref="mailto:hola@santifer.io?subject=Business OS Architecture"
        />

        {/* FAQ */}
        <FaqSection heading={t.faq.heading} items={t.faq.items} />

        {/* Resources */}
        <ResourcesList heading={t.resources.heading} items={t.resources.items} />
      </article>

      <ArticleFooter
        role={t.footer.role}
        copyright={t.footer.copyright}
      />
    </ArticleLayout>
  )
}
