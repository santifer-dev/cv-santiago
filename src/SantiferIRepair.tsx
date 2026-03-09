import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, MapPin, ArrowRight } from 'lucide-react'
import { irepairContent, type IRepairLang } from './irepair-i18n'
import { useArticleSeo } from './articles/use-article-seo'
import { ArticleLayout, MetricsGrid, CaseStudyCta } from './articles/components'

export default function SantiferIRepair({ lang }: { lang: IRepairLang }) {
  const t = irepairContent[lang]

  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://santifer.io/#person',
        name: 'Santiago Fernández de Valderrama',
        url: 'https://santifer.io',
        jobTitle: 'Product Manager & AI Builder',
        sameAs: [
          'https://linkedin.com/in/santifer',
          'https://github.com/santifer',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://santifer.io/#website',
        url: 'https://santifer.io',
        name: 'santifer.io',
        publisher: { '@id': 'https://santifer.io/#person' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.nav.breadcrumbHome, item: `https://santifer.io${lang === 'en' ? '/en' : '/'}` },
          { '@type': 'ListItem', position: 2, name: t.nav.breadcrumbCurrent, item: `https://santifer.io/${t.slug}` },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `https://santifer.io/${t.slug}#webpage`,
        url: `https://santifer.io/${t.slug}`,
        name: t.seo.title,
        description: t.seo.description,
        about: { '@id': 'https://santifer.io/#person' },
        isPartOf: { '@id': 'https://santifer.io/#website' },
        inLanguage: ['es', 'en'],
      },
    ],
  }), [lang, t])

  useArticleSeo({
    lang,
    slug: t.slug,
    altSlug: t.altSlug,
    title: t.seo.title,
    description: t.seo.description,
    image: 'https://santifer.io/business-os/og-business-os.png',
    publishedTime: '2026-03-08',
    articleTags: 'Santifer iRepair, phone repair, Seville, exit, founder',
    jsonLd,
    xDefaultSlug: 'santifer-irepair',
  })

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const homePath = lang === 'en' ? '/en' : '/'
  const businessOsPath = lang === 'en' ? '/business-os-for-airtable' : '/business-os-para-airtable'
  const jacoboPath = lang === 'en' ? '/ai-agent-jacobo' : '/agente-ia-jacobo'
  const pseoPath = lang === 'en' ? '/programmatic-seo' : '/seo-programatico'

  return (
    <ArticleLayout lang={lang}>
      {/* Hero — storefront photo with glassmorphism text card */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 md:-mt-12 mb-8 rounded-b-2xl overflow-hidden">
        <img
          src="/irepair/storefront.webp"
          alt="Santifer iRepair storefront — Seville"
          className="w-full h-[360px] sm:h-[420px] object-cover object-center scale-110"
          width={960}
          height={712}
        />
        <div className="absolute inset-0 bg-background/20" />
        <div className="absolute inset-0 flex items-end justify-start px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl px-5 py-4 sm:px-6 sm:py-5 max-w-lg border border-white/10">
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight whitespace-pre-line">
              {t.hero.headline}
            </h1>
            <p className="text-white/70 text-sm sm:text-base mt-2">
              {t.hero.sub}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics strip */}
      <MetricsGrid items={t.metrics} columns={4} compact />

      {/* Two-card grid — subgrid aligns CTAs across cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {/* Card: Shop */}
        <div className="bg-card border border-border rounded-xl overflow-hidden grid grid-rows-[auto_1fr_auto_auto]">
          <div className="flex items-center gap-4 p-6 pb-0">
            <img
              src="/logo-santifer.webp"
              alt="Santifer iRepair logo"
              className="w-16 h-16 rounded-full border-2 border-primary/20 shrink-0 object-cover"
              width={64}
              height={64}
            />
            <h2 className="font-display font-semibold text-foreground text-lg">{t.cards.shop.title}</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed px-6 pt-3 whitespace-pre-line">{t.cards.shop.body}</p>
          <div className="px-6 pb-2">
            <a
              href="https://www.google.com/maps/search/Santifer+iRepair+Sevilla"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              {t.cards.shop.mapLabel}
            </a>
          </div>
          <div className="px-6 pb-6">
            <a
              href="https://santiferirepair.es"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              {t.cards.shop.cta}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card: Founder */}
        <div className="bg-card border border-border rounded-xl overflow-hidden grid grid-rows-[auto_1fr_auto]">
          <div className="flex items-center gap-4 p-6 pb-0">
            <img
              src="/foto-avatar-sm.webp"
              alt="Santiago Fernández de Valderrama"
              className="w-16 h-16 rounded-full border-2 border-primary/20 shrink-0"
              width={64}
              height={64}
            />
            <h2 className="font-display font-semibold text-foreground text-lg">{t.cards.founder.title}</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed px-6 pt-3">{t.cards.founder.body}</p>
          <div className="px-6 pt-4 pb-6">
            <Link
              to={homePath}
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              {t.cards.founder.cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTAs → case studies */}
      <CaseStudyCta
        heading={t.businessOsCta.heading}
        body={t.businessOsCta.body}
        ctaLabel={t.businessOsCta.ctaLabel}
        ctaHref={businessOsPath}
      />
      <CaseStudyCta
        heading={t.jacoboCta.heading}
        body={t.jacoboCta.body}
        ctaLabel={t.jacoboCta.ctaLabel}
        ctaHref={jacoboPath}
      />
      <CaseStudyCta
        heading={t.pseoCta.heading}
        body={t.pseoCta.body}
        ctaLabel={t.pseoCta.ctaLabel}
        ctaHref={pseoPath}
      />
    </ArticleLayout>
  )
}
