import { useEffect } from 'react'
import { type N8nLang as Lang } from './n8n-i18n'
import { buildArticleJsonLd } from './articles/json-ld'
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
import { jacoboContent } from './jacobo-i18n'

function buildJsonLd(lang: Lang) {
  const t = jacoboContent[lang]
  return buildArticleJsonLd({
    lang,
    url: `https://santifer.io/${t.slug}`,
    altUrl: `https://santifer.io/${t.altSlug}`,
    headline: t.seo.title,
    alternativeHeadline: t.seo.title,
    description: t.seo.description,
    datePublished: '2026-02-25',
    dateModified: '2026-02-25',
    keywords: ['AI agent', 'customer service', 'n8n', 'Claude', 'WhatsApp', 'chatbot', 'HITL', 'phone repair', 'agentic workflows'],
    images: [],
    breadcrumbHome: t.nav.breadcrumbHome,
    breadcrumbCurrent: t.nav.breadcrumbCurrent,
    faq: t.faq.items,
  })
}

export default function JacoboAgent({ lang = 'en' }: { lang?: Lang }) {
  const t = jacoboContent[lang]

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
      'article:published_time': '2026-02-25',
      'article:author': 'https://www.linkedin.com/in/santifer',
      'article:tag': 'AI agent,customer service,n8n,Claude,HITL,phone repair',
    }
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': t.seo.title,
      'twitter:description': t.seo.description,
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
      { hreflang: 'x-default', href: `https://santifer.io/agente-ia-jacobo` },
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

      <article className="prose-custom">
        {/* Intro */}
        <p className="text-lg text-foreground leading-relaxed mb-4">{t.intro.hook}</p>
        <p className="text-muted-foreground leading-relaxed mb-8">{t.intro.body}</p>

        {/* The Problem */}
        <AnchorHeading id="the-problem">{t.sections.theProblem.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">{t.sections.theProblem.body}</p>
        <div className="bg-card border border-border rounded-lg p-5 mb-6">
          <ul className="space-y-2 text-muted-foreground">
            {t.sections.theProblem.painPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">&#9679;</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture */}
        <AnchorHeading id="architecture">{t.sections.architecture.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.architecture.body}</p>

        {/* Sub-agent cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {t.sections.architecture.agents.map((agent) => (
            <div key={agent.name} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{agent.icon}</span>
                <h3 className="font-display font-semibold text-foreground">{agent.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{agent.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <AnchorHeading id="how-it-works">{t.sections.howItWorks.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.howItWorks.body}</p>

        {/* Conversation flow */}
        <div className="bg-muted/30 rounded-lg p-5 mb-8 space-y-3">
          {t.sections.howItWorks.flow.map((step, i) => (
            <div key={i} className={`flex gap-3 ${step.from === 'user' ? '' : 'flex-row-reverse text-right'}`}>
              <div className={`px-4 py-2 rounded-lg text-sm max-w-[80%] ${
                step.from === 'user'
                  ? 'bg-primary/10 text-foreground'
                  : 'bg-card border border-border text-foreground'
              }`}>
                <p className="text-xs text-muted-foreground mb-1 font-medium">{step.label}</p>
                <p>{step.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* HITL Handoff */}
        <AnchorHeading id="hitl">{t.sections.hitl.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">{t.sections.hitl.body}</p>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mb-8">
          <p className="text-foreground font-medium">{t.sections.hitl.punchline}</p>
        </div>

        {/* Results */}
        <AnchorHeading id="results">{t.sections.results.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.results.body}</p>
        <MetricsGrid items={t.sections.results.metrics} />

        {/* Stack */}
        <AnchorHeading id="stack">{t.sections.stack.heading}</AnchorHeading>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {t.sections.stack.items.map((item) => (
            <div key={item.name} className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
              <span className="text-primary font-medium shrink-0">{item.name}</span>
              <span className="text-sm text-muted-foreground">{item.role}</span>
            </div>
          ))}
        </div>

        {/* Lessons */}
        <LessonsSection heading={t.sections.lessons.heading} items={t.sections.lessons.items} />

        {/* CTA */}
        <CaseStudyCta
          heading={t.cta.heading}
          body={t.cta.body}
          ctaLabel={t.cta.label}
          ctaHref="mailto:hola@santifer.io?subject=Jacobo Architecture"
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
