import { type ReactNode, useState } from 'react'
import { type N8nLang as Lang } from './n8n-i18n'
import { buildArticleJsonLd } from './articles/json-ld'
import { useArticleSeo } from './articles/use-article-seo'
import {
  Database, Wrench, BarChart3, Zap,
  List, DollarSign, Clock, Camera, Star, Code,
  MapPin, Globe, Layers, Image,
} from 'lucide-react'
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
import {
  H3,
  Prose,
  Callout,
  BulletList,
  CardStack,
  CardGrid,
  StackGrid,
  Photo1,
  DiagramZoom,
  Photo2,
  Photo3,
  DataTable,
  StepList,
  DetailCard,
  FloatingToc,
  CodeBlock,
  ScreenshotGrid,
  ScreenshotCaption,
} from './articles/content-types'
import { pseoContent } from './pseo-i18n'

/* ------------------------------------------------------------------ */
/* Icon resolver — maps i18n icon strings to Lucide components         */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, ReactNode> = {
  'database': <Database className="w-5 h-5 text-primary" />,
  'wrench': <Wrench className="w-5 h-5 text-primary" />,
  'bar-chart': <BarChart3 className="w-5 h-5 text-primary" />,
  'zap': <Zap className="w-5 h-5 text-primary" />,
  'list': <List className="w-5 h-5 text-primary" />,
  'dollar-sign': <DollarSign className="w-5 h-5 text-primary" />,
  'clock': <Clock className="w-5 h-5 text-primary" />,
  'camera': <Camera className="w-5 h-5 text-primary" />,
  'star': <Star className="w-5 h-5 text-primary" />,
  'code': <Code className="w-5 h-5 text-primary" />,
  'image': <Image className="w-5 h-5 text-primary" />,
}

function resolveIcon(key: string): ReactNode {
  return ICON_MAP[key] ?? <Layers className="w-5 h-5 text-primary" />
}

/* ------------------------------------------------------------------ */
/* Overlay hover — shows composite on hover to demo the pipeline      */
/* ------------------------------------------------------------------ */

const OVERLAY_HOVER: { overlay: string; hover: string; model: string }[] = [
  { overlay: 'pantalla.png', hover: 'hover-pantalla.webp', model: 'iPhone 14 Pro' },
  { overlay: 'bateria.png', hover: 'hover-bateria.webp', model: 'Galaxy S23 Ultra' },
  { overlay: 'camara-trasera.png', hover: 'hover-camara-trasera.webp', model: 'Pixel 7a' },
  { overlay: 'puerto-carga.png', hover: 'hover-puerto-carga.webp', model: 'Huawei P30 Pro' },
  { overlay: 'tapa-trasera.png', hover: 'hover-tapa-trasera.webp', model: 'OnePlus 11' },
  { overlay: 'cristal.png', hover: 'hover-cristal.webp', model: 'Xiaomi 12' },
]

function OverlayCard({ overlay, hover, model, alt }: { overlay: string; hover: string; model: string; alt: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <figure
      className="bg-card border border-border rounded-lg overflow-hidden relative cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(h => !h)}
    >
      <div className="relative aspect-[3/2]">
        <img
          src={`/pseo/overlays/${overlay}`}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain bg-card transition-opacity duration-300"
          style={{ opacity: hovered ? 0 : 1 }}
          loading="lazy"
          decoding="async"
        />
        <img
          src={`/pseo/overlays/${hover}`}
          alt={`${alt} — ${model}`}
          className="absolute inset-0 w-full h-full object-contain bg-card transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
          decoding="async"
        />
      </div>
      <figcaption className="px-2 py-1.5 text-center border-t border-border">
        <span className={`text-xs transition-colors duration-200 ${hovered ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          {hovered ? model : alt}
        </span>
      </figcaption>
    </figure>
  )
}

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
    dateModified: '2026-03-09',
    keywords: ['programmatic SEO', 'Airtable', 'headless CMS', 'Astro', 'DataForSEO', 'crawl budget', 'phone repair', 'static site generation', 'local SEO', 'ERP'],
    images: ['https://santifer.io/pseo/og-programmatic-seo.png'],
    breadcrumbHome: t.nav.breadcrumbHome,
    breadcrumbCurrent: t.nav.breadcrumbCurrent,
    faq: t.faq.items,
    articleType: 'TechArticle',
    about: [
      { '@type': 'SoftwareApplication', name: 'Airtable', url: 'https://airtable.com', applicationCategory: 'Database Platform' },
      { '@type': 'SoftwareApplication', name: 'Astro', url: 'https://astro.build', applicationCategory: 'Static Site Generator' },
      { '@type': 'SoftwareApplication', name: 'DataForSEO', url: 'https://dataforseo.com', applicationCategory: 'SEO Data API' },
    ],
  })
}

export default function ProgrammaticSeo({ lang = 'en' }: { lang?: Lang }) {
  const t = pseoContent[lang]

  useArticleSeo({
    lang,
    slug: t.slug,
    altSlug: t.altSlug,
    title: t.seo.title,
    description: t.seo.description,
    image: 'https://santifer.io/pseo/og-programmatic-seo.png',
    publishedTime: '2026-02-25',
    modifiedTime: '2026-03-09',
    articleTags: 'programmatic SEO,Airtable,Astro,DataForSEO,crawl budget,phone repair,ERP,local SEO',
    jsonLd: buildJsonLd(lang),
    xDefaultSlug: 'seo-programatico',
  })

  return (
    <ArticleLayout lang={lang}>
      <FloatingToc />
      <ArticleHeader
        editorId="hero-header"
        kicker={t.header.kicker}
        kickerLink={(t.header as any).kickerLink}
        h1={t.header.h1}
        subtitle={t.header.subtitle}
        date={t.header.date}
        readingTime={t.readingTime}
      />

      <article className="prose-custom">
        {/* Intro */}
        <Prose variant="hook">{t.intro.hook}</Prose>
        <Prose>{t.intro.body}</Prose>
        <Prose>{(t.intro as any).context}</Prose>

        {/* The Numbers */}
        <AnchorHeading id="the-numbers">{t.sections.theNumbers.heading}</AnchorHeading>
        <MetricsGrid items={t.sections.theNumbers.metrics} columns={5} compact />
        <Callout>{(t.sections.theNumbers as any).timeline}</Callout>

        {/* Homepage screenshot */}
        <Photo1
          src="/pseo/ss-homepage.webp"
          alt={lang === 'es' ? 'Homepage de santiferirepair.es' : 'santiferirepair.es homepage'}
          caption={lang === 'es' ? 'santiferirepair.es: homepage generada con Astro SSG. Buscador de dispositivos, categorías y marcas.' : 'santiferirepair.es: homepage generated with Astro SSG. Device search, categories and brands.'}
        />

        {/* The Opportunity */}
        <AnchorHeading id="opportunity">{t.sections.opportunity.heading}</AnchorHeading>
        <Prose>{t.sections.opportunity.body}</Prose>
        <BulletList items={t.sections.opportunity.points} />

        {/* Query examples */}
        <H3 id="query-examples">{lang === 'es' ? 'Queries reales de GSC' : 'Real GSC queries'}</H3>
        <DataTable
          headers={['Query', 'Clicks', lang === 'es' ? 'Imp.' : 'Imp.', 'CTR', 'Pos.']}
          rows={t.sections.opportunity.queryExamples.map(q => [
            q.query,
            String(q.clicks),
            q.impressions.toLocaleString(),
            q.ctr,
            q.position,
          ])}
          highlightColumn={3}
        />

        {/* Two Strategies */}
        <AnchorHeading id="two-strategies">{t.sections.twoTypes.heading}</AnchorHeading>
        <Prose>{t.sections.twoTypes.body}</Prose>

        <CardGrid
          items={[t.sections.twoTypes.local, t.sections.twoTypes.national]}
          columns={2}
          className="mb-8"
          renderItem={(strategy) => (
            <DetailCard
              key={strategy.title}
              icon={strategy === t.sections.twoTypes.local ? <MapPin className="w-5 h-5 text-primary" /> : <Globe className="w-5 h-5 text-primary" />}
              title={strategy.title}
              description={strategy.description}
            >
              <div className="space-y-1.5 mt-3">
                {strategy.examples.map((ex) => (
                  <div key={ex.url} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-muted-foreground truncate mr-2">{ex.url}</span>
                    <span className="shrink-0 text-primary">{ex.clicks} clicks · {ex.ctr}</span>
                  </div>
                ))}
              </div>
            </DetailCard>
          )}
        />

        {/* URL Taxonomy */}
        <AnchorHeading id="url-taxonomy">{t.sections.urlTaxonomy.heading}</AnchorHeading>
        <Prose>{t.sections.urlTaxonomy.body}</Prose>

        <CardStack
          items={t.sections.urlTaxonomy.patterns.map(p => ({
            title: <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{p.pattern}</code>,
            detail: <><span className="font-mono text-xs text-muted-foreground">{p.example}</span><span className="text-muted-foreground"> · {p.description}</span></>,
          }))}
        />

        {/* Architecture */}
        <AnchorHeading id="architecture">{t.sections.architecture.heading}</AnchorHeading>
        <Prose>{t.sections.architecture.body}</Prose>

        <StackGrid
          items={t.sections.architecture.layers.map(layer => ({
            icon: resolveIcon(layer.icon),
            name: layer.name,
            desc: layer.desc,
          }))}
          columns={2}
          align="left"
        />

        {/* CMS Deep Dive */}
        <AnchorHeading id="cms-deep-dive">{t.sections.cmsDeepDive.heading}</AnchorHeading>
        <Prose>{t.sections.cmsDeepDive.body}</Prose>

        <DataTable
          headers={[
            lang === 'es' ? 'Tabla' : 'Table',
            lang === 'es' ? 'Propósito' : 'Purpose',
            lang === 'es' ? 'Campos clave' : 'Key Fields',
          ]}
          rows={t.sections.cmsDeepDive.tables.map(table => [
            table.name,
            table.purpose,
            table.keyFields,
          ])}
        />

        {/* Airtable taxonomy screenshot */}
        <DiagramZoom
          src="/pseo/ss-airtable-taxonomy.webp"
          hdSrc="/pseo/ss-airtable-taxonomy-hd.webp"
          alt={lang === 'es' ? 'Jerarquía de tablas en Airtable — CMS del SEO programático' : 'Airtable table hierarchy — programmatic SEO CMS'}
          caption={lang === 'es' ? 'Las 14 tablas del CMS conectadas al Business OS de 12 bases. Jerarquía de 6 niveles desde tipo de dispositivo hasta variante local.' : 'The 14 CMS tables connected to the 12-base Business OS. 6-level hierarchy from device type to local variant.'}
        />

        <H3 id="cms-highlights">{lang === 'es' ? 'Patrones clave del CMS' : 'Key CMS patterns'}</H3>
        <CardStack
          items={t.sections.cmsDeepDive.highlights.map(h => ({
            title: h.title,
            detail: h.detail,
          }))}
        />

        {/* Category page screenshot */}
        <Photo1
          src="/pseo/ss-category-samsung.webp"
          alt={lang === 'es' ? 'Página de categoría Samsung en santiferirepair.es' : 'Samsung category page on santiferirepair.es'}
          caption={lang === 'es' ? 'Página de categoría generada automáticamente. Cada marca tiene su landing con modelos, precios y reseñas.' : 'Auto-generated category page. Each brand gets its own landing with models, pricing, and reviews.'}
        />

        {/* Page Anatomy */}
        <AnchorHeading id="page-anatomy">{t.sections.pageAnatomy.heading}</AnchorHeading>
        <Prose>{t.sections.pageAnatomy.body}</Prose>

        <StackGrid
          items={t.sections.pageAnatomy.components.map(c => ({
            icon: resolveIcon(c.icon),
            name: c.name,
            desc: c.desc,
          }))}
          columns={2}
          align="left"
        />

        {/* Airtable repair fields */}
        <DiagramZoom
          src="/pseo/ss-airtable-repair-fields.webp"
          hdSrc="/pseo/ss-airtable-repair-fields-hd.webp"
          alt={lang === 'es' ? 'Campos de una reparación en Airtable' : 'Repair record fields in Airtable'}
          caption={lang === 'es' ? 'Cada reparación tiene ~60 campos: precios duales, flag indexable, specs del modelo que alimentan el copy dinámico.' : 'Each repair has ~60 fields: dual pricing, indexable flag, model specs that feed the dynamic copy.'}
        />

        {/* Repair page screenshot */}
        <Photo1
          src={t.sections.pageAnatomy.screenshot.src}
          alt={t.sections.pageAnatomy.screenshot.alt}
          caption={t.sections.pageAnatomy.screenshot.caption}
        />

        {/* Repair page hero screenshot */}
        <Photo1
          src="/pseo/ss-repair-page-hero.webp"
          alt={lang === 'es' ? 'Hero de una página de reparación en santiferirepair.es' : 'Repair page hero on santiferirepair.es'}
          caption={lang === 'es' ? 'Hero de página de reparación: precio dual (original/compatible), CTA de cita, y breadcrumb semántico.' : 'Repair page hero: dual pricing (original/compatible), booking CTA, and semantic breadcrumb.'}
        />

        {/* Storytelling / Conversion flow */}
        <H3 id="page-storytelling">{t.sections.pageAnatomy.storytelling.heading}</H3>
        <Prose>{t.sections.pageAnatomy.storytelling.body}</Prose>
        <BulletList items={t.sections.pageAnatomy.storytelling.steps as unknown as string[]} />
        <Prose>{(t.sections.pageAnatomy.storytelling as any).example}</Prose>

        {/* Dynamic per-model copy */}
        <H3 id="dynamic-copy">{t.sections.pageAnatomy.dynamicCopy.heading}</H3>
        <Prose>{t.sections.pageAnatomy.dynamicCopy.body}</Prose>

        {/* Context-aware search */}
        <H3 id="context-search">{(t.sections.pageAnatomy as any).contextSearch.heading}</H3>
        <Prose>{(t.sections.pageAnatomy as any).contextSearch.body}</Prose>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <DiagramZoom
            src="/pseo/ss-buscador.webp"
            hdSrc="/pseo/ss-buscador-hd.webp"
            alt={lang === 'es' ? 'Buscador en homepage: "12 pro" muestra resultados de todas las marcas' : 'Homepage search: "12 pro" shows results across all brands'}
            caption={lang === 'es' ? 'Home: "12 pro" → Xiaomi, Apple, Xiaomi...' : 'Home: "12 pro" → Xiaomi, Apple, Xiaomi...'}
          />
          <DiagramZoom
            src="/pseo/ss-buscador-iphone.webp"
            hdSrc="/pseo/ss-buscador-iphone-hd.webp"
            alt={lang === 'es' ? 'Buscador en página iPhone: "13" solo muestra modelos iPhone' : 'iPhone page search: "13" only shows iPhone models'}
            caption={lang === 'es' ? 'Página iPhone: "13" → solo iPhones' : 'iPhone page: "13" → iPhones only'}
          />
        </div>
        <Prose>{(t.sections.pageAnatomy as any).contextSearch.detail}</Prose>

        {/* Decision Engine */}
        <AnchorHeading id="decision-engine">{t.sections.decisionEngine.heading}</AnchorHeading>
        <Prose>{t.sections.decisionEngine.body}</Prose>

        <StepList
          items={t.sections.decisionEngine.rules.map(rule => ({
            label: `${rule.condition} → ${rule.action}`,
            detail: rule.detail,
          }))}
        />
        <Callout>{t.sections.decisionEngine.stats}</Callout>

        {/* Airtable indexable field */}
        <DiagramZoom
          src="/pseo/ss-airtable-indexable.webp"
          hdSrc="/pseo/ss-airtable-indexable-hd.webp"
          alt={lang === 'es' ? 'Campo indexable en Airtable alimentado por DataForSEO' : 'Indexable field in Airtable driven by DataForSEO'}
          caption={lang === 'es' ? 'Motor de decisiones: DataForSEO alimenta el campo indexable. Sin volumen → noindex.' : 'Decision engine: DataForSEO feeds the indexable field. No volume → noindex.'}
        />

        {/* Crawl Budget Optimization */}
        <AnchorHeading id="crawl-budget">{t.sections.crawlBudget.heading}</AnchorHeading>
        <Prose>{t.sections.crawlBudget.body}</Prose>
        <CardStack
          items={t.sections.crawlBudget.strategies.map(s => ({
            title: s.title,
            detail: s.detail,
          }))}
        />

        {/* Build Pipeline */}
        <AnchorHeading id="pipeline">{t.sections.pipeline.heading}</AnchorHeading>
        <Prose>{t.sections.pipeline.body}</Prose>

        <StepList
          items={t.sections.pipeline.steps.map(step => ({
            label: step.label,
            detail: step.desc,
          }))}
        />

        {/* Content Automation Pipeline */}
        <AnchorHeading id="content-automation">{t.sections.contentAutomation.heading}</AnchorHeading>
        <Prose>{t.sections.contentAutomation.body}</Prose>

        <StackGrid
          items={t.sections.contentAutomation.pipelines.map((p: any) => ({
            icon: resolveIcon(p.icon),
            name: p.name,
            desc: p.desc,
          }))}
          columns={2}
          align="left"
        />

        {/* Airtable image pipeline */}
        <DiagramZoom
          src="/pseo/ss-airtable-image-pipeline.webp"
          hdSrc="/pseo/ss-airtable-image-pipeline-hd.webp"
          alt={lang === 'es' ? 'Pipeline de imágenes en Airtable' : 'Image pipeline in Airtable'}
          caption={lang === 'es' ? 'Pipeline de imágenes: 1 foto de GSM Arena → 18 composiciones automáticas con overlays de reparación. Todo sincronizado con el Business OS.' : 'Image pipeline: 1 GSM Arena photo → 18 auto-composited repair overlays. All synced with the Business OS.'}
        />

        {/* Content Cascade */}
        <H3 id="content-cascade">{(t.sections.contentAutomation as any).cascade.heading}</H3>
        <Prose>{(t.sections.contentAutomation as any).cascade.body}</Prose>
        <DataTable
          headers={[lang === 'es' ? 'Página' : 'Page', lang === 'es' ? 'Nivel' : 'Level']}
          rows={(t.sections.contentAutomation as any).cascade.example.map((e: any) => [
            e.page,
            e.label,
          ])}
          highlightColumn={0}
        />
        <Prose>{(t.sections.contentAutomation as any).cascade.detail}</Prose>

        <Callout>{t.sections.contentAutomation.stats}</Callout>

        {/* Growth Curve */}
        <AnchorHeading id="growth">{t.sections.growth.heading}</AnchorHeading>
        <Prose>{t.sections.growth.body}</Prose>

        <Photo1
          src="/pseo/ss-gsc-growth.webp"
          alt={lang === 'es' ? 'Curva de crecimiento en Google Search Console — clicks e impresiones' : 'Growth curve in Google Search Console — clicks and impressions'}
          caption={lang === 'es' ? 'Google Search Console: clicks (azul) e impresiones (violeta) desde noviembre 2024 hasta septiembre 2025.' : 'Google Search Console: clicks (blue) and impressions (purple) from November 2024 through September 2025.'}
        />

        <DataTable
          headers={[
            lang === 'es' ? 'Mes' : 'Month',
            'Clicks',
            lang === 'es' ? 'Impresiones' : 'Impressions',
            '',
          ]}
          rows={t.sections.growth.monthly.map(m => [
            m.month,
            m.clicks.toLocaleString(),
            m.impressions.toLocaleString(),
            (m as any).note || '',
          ])}
          highlightColumn={1}
        />
        <Callout>{t.sections.growth.insight}</Callout>

        {/* Results */}
        <AnchorHeading id="results">{t.sections.results.heading}</AnchorHeading>
        <Prose>{t.sections.results.body}</Prose>
        <MetricsGrid items={t.sections.results.metrics} columns={3} />

        {/* Image Pipeline Deep Dive */}
        <AnchorHeading id="image-pipeline">{t.sections.imagePipeline.heading}</AnchorHeading>
        <Prose>{t.sections.imagePipeline.intro}</Prose>

        {/* Overlay showcase with hover-to-composite */}
        <H3 id="overlay-templates">{t.sections.imagePipeline.overlayShowcase.heading}</H3>
        <Prose>{t.sections.imagePipeline.overlayShowcase.body}</Prose>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {OVERLAY_HOVER.map((item, i) => (
            <OverlayCard
              key={item.overlay}
              overlay={item.overlay}
              hover={item.hover}
              model={item.model}
              alt={lang === 'es'
                ? t.sections.imagePipeline.overlayShowcase.items[i].altEs
                : t.sections.imagePipeline.overlayShowcase.items[i].altEn}
            />
          ))}
        </div>

        {/* Composition process */}
        <H3 id="composition-process">{t.sections.imagePipeline.compositionProcess.heading}</H3>
        <Prose>{t.sections.imagePipeline.compositionProcess.body}</Prose>
        <StepList
          items={t.sections.imagePipeline.compositionProcess.steps.map(step => ({
            label: step.label,
            detail: step.detail,
          }))}
        />

        {/* Code snippet */}
        <H3 id="sharp-code">{t.sections.imagePipeline.codeSnippet.heading}</H3>
        <Prose>{t.sections.imagePipeline.codeSnippet.body}</Prose>
        <CodeBlock segments={t.sections.imagePipeline.codeSnippet.segments} highlight="code" />

        {/* 1 photo → 18 variants demo */}
        <H3 id="one-photo-demo">{t.sections.imagePipeline.onePhotoDemo.heading}</H3>
        <Prose>{t.sections.imagePipeline.onePhotoDemo.body}</Prose>
        <Photo1
          src={t.sections.imagePipeline.onePhotoDemo.hero.src}
          alt={t.sections.imagePipeline.onePhotoDemo.hero.alt}
          caption={t.sections.imagePipeline.onePhotoDemo.hero.caption}
        />
        <ScreenshotGrid
          items={t.sections.imagePipeline.onePhotoDemo.variants}
          lang={lang}
          basePath="/pseo/demo/apple-iphone-14-pro"
        />
        <ScreenshotCaption
          es={t.sections.imagePipeline.onePhotoDemo.caption.es}
          en={t.sections.imagePipeline.onePhotoDemo.caption.en}
          lang={lang}
        />

        {/* Cross-device demo */}
        <H3 id="cross-device">{t.sections.imagePipeline.crossDeviceDemo.heading}</H3>
        <Prose>{t.sections.imagePipeline.crossDeviceDemo.body}</Prose>
        <Photo3
          items={t.sections.imagePipeline.crossDeviceDemo.heroes as unknown as readonly [any, any, any]}
        />
        <Photo2
          items={t.sections.imagePipeline.crossDeviceDemo.comparison as unknown as readonly [any, any]}
          caption={lang === 'es'
            ? t.sections.imagePipeline.crossDeviceDemo.comparisonCaption.es
            : t.sections.imagePipeline.crossDeviceDemo.comparisonCaption.en}
        />

        {/* Scale metrics */}
        <H3 id="pipeline-scale">{t.sections.imagePipeline.scale.heading}</H3>
        <MetricsGrid items={t.sections.imagePipeline.scale.metrics} columns={4} compact />

        {/* Reviews Pipeline */}
        <AnchorHeading id="reviews-pipeline">{t.sections.reviewsPipeline.heading}</AnchorHeading>
        <Prose>{t.sections.reviewsPipeline.intro}</Prose>

        <H3 id="review-source-sync">{t.sections.reviewsPipeline.sourceSync.heading}</H3>
        <Prose>{t.sections.reviewsPipeline.sourceSync.body}</Prose>
        <DataTable
          headers={t.sections.reviewsPipeline.sourceSync.table.headers}
          rows={t.sections.reviewsPipeline.sourceSync.table.rows}
        />

        <H3 id="review-image-processing">{t.sections.reviewsPipeline.imageProcessing.heading}</H3>
        <Prose>{t.sections.reviewsPipeline.imageProcessing.body}</Prose>
        <StepList
          items={t.sections.reviewsPipeline.imageProcessing.steps.map(step => ({
            label: step.label,
            detail: step.detail,
          }))}
        />

        <H3 id="review-code">{t.sections.reviewsPipeline.codeSnippet.heading}</H3>
        <Prose>{t.sections.reviewsPipeline.codeSnippet.body}</Prose>
        <CodeBlock segments={t.sections.reviewsPipeline.codeSnippet.segments} highlight="code" />

        <H3 id="review-cascade">{t.sections.reviewsPipeline.cascade.heading}</H3>
        <Prose>{t.sections.reviewsPipeline.cascade.body}</Prose>
        <BulletList items={t.sections.reviewsPipeline.cascade.points} />

        <H3 id="review-profiles">{t.sections.reviewsPipeline.profileDemo.heading}</H3>
        <Prose>{t.sections.reviewsPipeline.profileDemo.body}</Prose>
        <ScreenshotGrid
          items={t.sections.reviewsPipeline.profileDemo.items}
          lang={lang}
          basePath="/pseo/reviews"
        />
        <ScreenshotCaption
          es={t.sections.reviewsPipeline.profileDemo.caption.es}
          en={t.sections.reviewsPipeline.profileDemo.caption.en}
          lang={lang}
        />

        <H3 id="review-carousel">{t.sections.reviewsPipeline.carouselCro.heading}</H3>
        <Prose>{t.sections.reviewsPipeline.carouselCro.body}</Prose>
        <Callout>{t.sections.reviewsPipeline.carouselCro.callout}</Callout>

        <H3 id="review-scale">{t.sections.reviewsPipeline.scale.heading}</H3>
        <MetricsGrid items={t.sections.reviewsPipeline.scale.metrics} columns={4} compact />

        {/* Before/After Pipeline */}
        <AnchorHeading id="before-after-pipeline">{t.sections.repairedDevicesPipeline.heading}</AnchorHeading>
        <Prose>{t.sections.repairedDevicesPipeline.intro}</Prose>

        <H3 id="capture-protocol">{t.sections.repairedDevicesPipeline.captureProtocol.heading}</H3>
        <Prose>{t.sections.repairedDevicesPipeline.captureProtocol.body}</Prose>
        <StepList
          items={t.sections.repairedDevicesPipeline.captureProtocol.steps.map(step => ({
            label: step.label,
            detail: step.detail,
          }))}
        />
        <Callout>{t.sections.repairedDevicesPipeline.captureProtocol.privacyNote}</Callout>

        <H3 id="ba-processing">{t.sections.repairedDevicesPipeline.imageProcessing.heading}</H3>
        <Prose>{t.sections.repairedDevicesPipeline.imageProcessing.body}</Prose>
        <StepList
          items={t.sections.repairedDevicesPipeline.imageProcessing.steps.map(step => ({
            label: step.label,
            detail: step.detail,
          }))}
        />

        <H3 id="ba-code">{t.sections.repairedDevicesPipeline.codeSnippet.heading}</H3>
        <Prose>{t.sections.repairedDevicesPipeline.codeSnippet.body}</Prose>
        <CodeBlock segments={t.sections.repairedDevicesPipeline.codeSnippet.segments} highlight="code" />

        <H3 id="ba-demo">{t.sections.repairedDevicesPipeline.demo.heading}</H3>
        <Prose>{t.sections.repairedDevicesPipeline.demo.body}</Prose>
        <Photo2
          items={t.sections.repairedDevicesPipeline.demo.frontal as unknown as readonly [any, any]}
          caption={t.sections.repairedDevicesPipeline.demo.frontalCaption}
        />
        <Photo2
          items={t.sections.repairedDevicesPipeline.demo.trasera as unknown as readonly [any, any]}
          caption={t.sections.repairedDevicesPipeline.demo.traseraCaption}
        />

        <H3 id="ba-cross-device">{t.sections.repairedDevicesPipeline.crossDeviceDemo.heading}</H3>
        <Prose>{t.sections.repairedDevicesPipeline.crossDeviceDemo.body}</Prose>
        <Photo2
          items={t.sections.repairedDevicesPipeline.crossDeviceDemo.samsung as unknown as readonly [any, any]}
          caption={t.sections.repairedDevicesPipeline.crossDeviceDemo.samsungCaption}
        />
        <Photo2
          items={t.sections.repairedDevicesPipeline.crossDeviceDemo.xiaomi as unknown as readonly [any, any]}
          caption={t.sections.repairedDevicesPipeline.crossDeviceDemo.xiaomiCaption}
        />
        <ScreenshotCaption
          es={t.sections.repairedDevicesPipeline.crossDeviceDemo.caption.es}
          en={t.sections.repairedDevicesPipeline.crossDeviceDemo.caption.en}
          lang={lang}
        />

        <H3 id="ba-naming">{t.sections.repairedDevicesPipeline.naming.heading}</H3>
        <Prose>{t.sections.repairedDevicesPipeline.naming.body}</Prose>
        <Prose><code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{t.sections.repairedDevicesPipeline.naming.pattern}</code></Prose>
        <CardStack
          items={t.sections.repairedDevicesPipeline.naming.suffixes.map(s => ({
            title: s.title,
            detail: s.detail,
          }))}
        />

        <H3 id="ba-scale">{t.sections.repairedDevicesPipeline.scale.heading}</H3>
        <MetricsGrid items={t.sections.repairedDevicesPipeline.scale.metrics} columns={4} compact />

        {/* Stack */}
        <AnchorHeading id="stack">{t.sections.stack.heading}</AnchorHeading>
        <Prose>{(t.sections.stack as any).body}</Prose>
        <StackGrid
          items={t.sections.stack.items.map(item => ({
            icon: <Layers className="w-5 h-5 text-primary" />,
            name: item.name,
            desc: item.role,
          }))}
          columns={2}
          align="left"
        />

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
        editorId="article-footer"
        role={t.footer.role}
        bio={(t.footer as any).bio}
        fellowAt={(t.footer as any).fellowAt}
        fellowLink={(t.footer as any).fellowLink}
        fellowUrl="https://maven.com/marily-nika/ai-pm-bootcamp?utm_source=santifer&utm_medium=casestudy&utm_campaign=pseo"
        copyright={t.footer.copyright}
      />
    </ArticleLayout>
  )
}
