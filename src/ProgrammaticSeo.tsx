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
import { pseoContent } from './pseo-i18n'

function buildJsonLd(lang: Lang) {
  const t = pseoContent[lang]
  return buildArticleJsonLd({
    lang,
    url: `https://santifer.io/${t.slug}`,
    altUrl: `https://santifer.io/${t.altSlug}`,
    headline: t.seo.title,
    alternativeHeadline: t.seo.title,
    description: t.seo.description,
    datePublished: '2026-02-25',
    dateModified: '2026-02-25',
    keywords: ['programmatic SEO', 'Airtable', 'headless CMS', 'Astro', 'n8n', 'DataForSEO', 'crawl budget', 'phone repair', 'static site generation'],
    images: [],
    breadcrumbHome: t.nav.breadcrumbHome,
    breadcrumbCurrent: t.nav.breadcrumbCurrent,
    faq: t.faq.items,
  })
}

export default function ProgrammaticSeo({ lang = 'en' }: { lang?: Lang }) {
  const t = pseoContent[lang]

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
      'article:tag': 'programmatic SEO,Airtable,Astro,n8n,DataForSEO,crawl budget,phone repair',
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
      { hreflang: 'x-default', href: `https://santifer.io/seo-programatico` },
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

        {/* The Opportunity */}
        <AnchorHeading id="opportunity">{t.sections.opportunity.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">{t.sections.opportunity.body}</p>
        <div className="bg-card border border-border rounded-lg p-5 mb-6">
          <ul className="space-y-2 text-muted-foreground">
            {t.sections.opportunity.points.map((point, i) => (
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

        {/* Architecture layer cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {t.sections.architecture.layers.map((layer) => (
            <div key={layer.name} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{layer.icon}</span>
                <h3 className="font-display font-semibold text-foreground">{layer.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{layer.desc}</p>
            </div>
          ))}
        </div>

        {/* Decision Engine */}
        <AnchorHeading id="decision-engine">{t.sections.decisionEngine.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.decisionEngine.body}</p>

        {/* Decision engine flow visual */}
        <div className="bg-muted/30 rounded-lg p-6 mb-4 space-y-4">
          {t.sections.decisionEngine.rules.map((rule, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="bg-card border border-border rounded-lg p-4 sm:w-1/3 flex items-center justify-center text-center">
                <span className="text-sm font-medium text-foreground">{rule.condition}</span>
              </div>
              <div className="hidden sm:flex items-center justify-center text-muted-foreground text-xl">
                &rarr;
              </div>
              <div className="flex sm:hidden items-center justify-center text-muted-foreground text-xl">
                &darr;
              </div>
              <div className={`rounded-lg p-4 sm:flex-1 border ${
                i === 0
                  ? 'bg-primary/10 border-primary/30'
                  : i === 1
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-muted/50 border-border'
              }`}>
                <p className="text-sm font-semibold text-foreground mb-1">{rule.action}</p>
                <p className="text-xs text-muted-foreground">{rule.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground italic mb-8">{t.sections.decisionEngine.taxonomy}</p>

        {/* Build Pipeline */}
        <AnchorHeading id="pipeline">{t.sections.pipeline.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.pipeline.body}</p>

        {/* Pipeline diagram */}
        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <div className="flex flex-col gap-3">
            {t.sections.pipeline.steps.map((step, i) => (
              <div key={i}>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <div className="flex-1 bg-card border border-border rounded-lg p-4">
                    <span className="font-medium text-foreground text-sm">{step.label}</span>
                    <span className="text-muted-foreground text-sm ml-2">&mdash; {step.desc}</span>
                  </div>
                </div>
                {i < t.sections.pipeline.steps.length - 1 && (
                  <div className="flex items-center ml-4 py-1">
                    <span className="text-muted-foreground/50 text-xs">&darr;</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <AnchorHeading id="results">{t.sections.results.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.results.body}</p>
        <MetricsGrid items={t.sections.results.metrics} />

        {/* Crawl Budget Optimization */}
        <AnchorHeading id="crawl-budget">{t.sections.crawlBudget.heading}</AnchorHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.sections.crawlBudget.body}</p>

        {/* Before/After comparison: index vs noindex */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {t.sections.crawlBudget.strategies.map((strategy) => (
            <div key={strategy.title} className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-display font-semibold text-foreground mb-2">{strategy.title}</h3>
              <p className="text-sm text-muted-foreground">{strategy.detail}</p>
            </div>
          ))}
        </div>

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
          ctaHref="mailto:hola@santifer.io?subject=Programmatic SEO Playbook"
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
