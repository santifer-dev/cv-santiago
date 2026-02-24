import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Download, Copy, Check, ExternalLink, Clock, ChevronRight, ArrowLeft, Sun, Moon, Globe } from 'lucide-react'
import { n8nContent, CLASSIFICATION_PROMPT, type N8nLang } from './n8n-i18n'

function buildJsonLd(lang: N8nLang) {
  const t = n8nContent[lang]
  const url = `https://santifer.io/${t.slug}`
  const altUrl = `https://santifer.io/${t.altSlug}`
  const inLanguage = lang === 'es' ? 'es' : 'en'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}/#article`,
        headline: t.header.h1 + ' — Cheat Sheet',
        alternativeHeadline: t.seo.title,
        description: t.seo.description,
        author: { '@id': 'https://santifer.io/#person' },
        publisher: {
          '@type': 'Organization',
          name: 'AI Product Academy',
          url: 'https://maven.com/marily-nika/ai-pm-bootcamp',
        },
        datePublished: '2026-02-24',
        dateModified: '2026-02-24',
        keywords: ['n8n', 'product manager', 'automation', 'AI', 'workflow', 'sprint report', 'feedback classification', 'no-code'],
        url,
        mainEntityOfPage: url,
        image: [
          'https://santifer.io/workflows/n8n-sprint-report-automation-workflow.webp',
          'https://santifer.io/workflows/n8n-ai-feedback-classification-workflow.webp',
        ],
        inLanguage,
        isPartOf: { '@id': 'https://santifer.io/#website' },
        about: [
          { '@type': 'SoftwareApplication', name: 'n8n', url: 'https://n8n.io', applicationCategory: 'Workflow Automation' },
          { '@type': 'Thing', name: 'Product Management Automation' },
        ],
        proficiencyLevel: 'Beginner',
        dependencies: 'n8n Cloud (free tier), Airtable, Slack',
        workTranslation: { '@id': `${altUrl}/#article` },
      },
      {
        '@type': 'Person',
        '@id': 'https://santifer.io/#person',
        name: 'Santiago Fernández de Valderrama Aparicio',
        url: 'https://santifer.io',
        jobTitle: 'AI Product Manager',
        sameAs: [
          'https://www.linkedin.com/in/santifer',
          'https://github.com/santifer-dev',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://santifer.io/#website',
        name: 'santifer.io',
        url: 'https://santifer.io',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.nav.breadcrumbHome, item: 'https://santifer.io' },
          { '@type': 'ListItem', position: 2, name: t.nav.breadcrumbCurrent, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: t.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'HowTo',
        name: lang === 'es' ? 'Cómo Importar Workflow Templates de n8n' : 'How to Import n8n Workflow Templates',
        description: t.import.description,
        inLanguage,
        step: [
          { '@type': 'HowToStep', position: 1, name: lang === 'es' ? 'Regístrate en n8n' : 'Sign up for n8n', text: lang === 'es' ? 'Crea una cuenta gratuita en n8n.io Cloud.' : 'Create a free account at n8n.io Cloud.' },
          { '@type': 'HowToStep', position: 2, name: lang === 'es' ? 'Descarga el JSON del workflow' : 'Download the workflow JSON', text: lang === 'es' ? 'Descarga el archivo JSON del workflow template desde esta página.' : 'Download the workflow template JSON file from this page.' },
          { '@type': 'HowToStep', position: 3, name: lang === 'es' ? 'Importa en n8n' : 'Import into n8n', text: lang === 'es' ? 'En n8n, pulsa el botón +, selecciona "Import from File" y elige el JSON descargado.' : 'In n8n, click the + button, select "Import from File", and choose the downloaded JSON file.' },
          { '@type': 'HowToStep', position: 4, name: lang === 'es' ? 'Conecta tus credenciales' : 'Connect your credentials', text: lang === 'es' ? 'Conecta tus credenciales de Slack, Airtable e IA (Anthropic/OpenAI) a los nodos del workflow importado.' : 'Connect your own Slack, Airtable, and AI (Anthropic/OpenAI) credentials to the imported workflow nodes.' },
        ],
        tool: [
          { '@type': 'HowToTool', name: 'n8n Cloud (free tier)' },
          { '@type': 'HowToTool', name: 'Slack workspace' },
          { '@type': 'HowToTool', name: 'Airtable account' },
        ],
      },
    ],
  }
}

function CopyButton({ text, copyLabel, copiedLabel }: { text: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? copiedLabel : copyLabel}
    </button>
  )
}

function DownloadButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors font-medium text-foreground"
    >
      <Download className="w-4 h-4 text-primary" />
      {label}
    </a>
  )
}

function AnchorHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="group font-display text-2xl md:text-3xl font-bold text-foreground mt-16 mb-6 scroll-mt-8">
      <a href={`#${id}`} className="hover:text-primary transition-colors">
        {children}
        <span className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">#</span>
      </a>
    </h2>
  )
}

export default function N8nForPMs({ lang = 'en' }: { lang?: N8nLang }) {
  const t = n8nContent[lang]
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  // Meta tags + hreflang
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
      'og:image': 'https://santifer.io/workflows/n8n-ai-feedback-classification-workflow.webp',
      'og:site_name': 'santifer.io',
      'og:locale': lang === 'es' ? 'es_ES' : 'en_US',
      'og:locale:alternate': lang === 'es' ? 'en_US' : 'es_ES',
      'article:published_time': '2026-02-24',
      'article:author': 'https://www.linkedin.com/in/santifer',
      'article:tag': 'n8n,product manager,automation,AI,workflow,no-code',
    }
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': t.seo.title,
      'twitter:description': t.seo.description,
      'twitter:image': 'https://santifer.io/workflows/n8n-ai-feedback-classification-workflow.webp',
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

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = url

    // hreflang
    const hreflangTags: Array<{ hreflang: string; href: string }> = [
      { hreflang: lang, href: url },
      { hreflang: altLang, href: altUrl },
      { hreflang: 'x-default', href: `https://santifer.io/n8n-para-pms` },
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

    // JSON-LD
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(buildJsonLd(lang))
    document.head.appendChild(script)

    return () => {
      script.remove()
      createdLinks.forEach((link) => link.remove())
    }
  }, [lang, t])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const altLabel = lang === 'es' ? 'EN' : 'ES'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            {t.nav.back}
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to={`/${t.altSlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {altLabel}
            </Link>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1">
            <li><Link to="/" className="hover:text-primary transition-colors">{t.nav.breadcrumbHome}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-foreground font-medium">{t.nav.breadcrumbCurrent}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="text-primary font-medium text-sm mb-3 tracking-wide uppercase">
            {t.header.kicker.includes('<a>') ? (
              t.header.kicker.split(/<a>|<\/a>/).map((part, i) =>
                i === 1 ? (
                  <a key={i} href="https://maven.com/marily-nika/ai-pm-bootcamp?utm_source=santifer&utm_medium=cheatsheet&utm_campaign=n8n-for-pms" target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">{part}</a>
                ) : (
                  <span key={i}>{part}</span>
                )
              )
            ) : t.header.kicker}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            {t.header.h1}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {t.header.subtitle}
          </p>

          {/* Author byline */}
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <img
              src="/foto-avatar-sm.webp"
              alt="Santiago Fernández de Valderrama"
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href="https://linkedin.com/in/santifer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  Santiago Fernández de Valderrama
                </a>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{t.header.date}</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{t.readingTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="prose-custom">

          {/* Intro narrative */}
          <p className="text-lg text-foreground leading-relaxed mb-4">
            {t.intro.hook}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t.intro.body}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {t.intro.punchline.split(lang === 'es' ? 'Era un router de datos muy caro.' : 'I was a very expensive data router.').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>{part}<strong className="text-foreground">{lang === 'es' ? 'Era un router de datos muy caro.' : 'I was a very expensive data router.'}</strong></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>

          {/* Preview CTA */}
          <div className="mb-10 relative rounded-2xl p-[1.5px] bg-gradient-theme">
            <div className="px-5 py-4 rounded-[calc(1rem-1.5px)] bg-card text-sm text-muted-foreground leading-relaxed">
              {t.previewCta.text.split(/<a>|<\/a>/).map((part, i) =>
                i === 1 ? (
                  <a key={i} href="https://maven.com/marily-nika/ai-pm-bootcamp?utm_source=santifer&utm_medium=cheatsheet&utm_campaign=n8n-for-pms" target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline font-medium">{part}</a>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </div>
          </div>

          {/* Time Sinks Table */}
          <AnchorHeading id="time-sinks">{t.timeSinks.heading}</AnchorHeading>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-3 text-muted-foreground font-medium text-sm">{t.timeSinks.columns.num}</th>
                  <th className="py-3 px-3 text-muted-foreground font-medium text-sm">{t.timeSinks.columns.sink}</th>
                  <th className="py-3 px-3 text-muted-foreground font-medium text-sm">{t.timeSinks.columns.hours}</th>
                  <th className="py-3 px-3 text-muted-foreground font-medium text-sm hidden sm:table-cell">{t.timeSinks.columns.pattern}</th>
                </tr>
              </thead>
              <tbody>
                {t.timeSinks.rows.map((row) => (
                  <tr key={row.num} className="border-b border-border/50">
                    <td className="py-3 px-3 text-primary font-bold">{row.num}</td>
                    <td className="py-3 px-3 font-medium">{row.sink}</td>
                    <td className="py-3 px-3 text-muted-foreground">{row.hours}</td>
                    <td className="py-3 px-3 text-muted-foreground text-sm hidden sm:table-cell font-mono">{row.pattern}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Workflow 1 */}
          <AnchorHeading id="workflow-1">{t.workflow1.heading}</AnchorHeading>
          <p className="text-muted-foreground mb-4 leading-relaxed">{t.workflow1.description}</p>

          <div className="bg-muted/30 rounded-lg p-4 mb-6 font-mono text-sm overflow-x-auto">
            {t.workflow1.pipelineLabels.map((step, i) => (
              <span key={i}>
                {i > 0 && <span className="text-muted-foreground"> &rarr; </span>}
                <span className="text-primary">{step.name}</span>{step.detail ? ` ${step.detail}` : ''}
              </span>
            ))}
          </div>

          <figure className="rounded-lg overflow-hidden border border-border mb-6">
            <img
              src="/workflows/n8n-sprint-report-automation-workflow.webp"
              alt={t.workflow1.imgAlt}
              title={t.workflow1.imgTitle}
              className="w-full h-auto"
              width={1200}
              height={499}
              loading="lazy"
            />
            <figcaption className="text-xs text-muted-foreground text-center py-2 bg-muted/20">
              {t.workflow1.figcaption}
            </figcaption>
          </figure>

          <div className="bg-card border border-border rounded-lg p-5 mb-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">{t.workflow1.nodesHeading}</h3>
            <ul className="space-y-2 text-muted-foreground">
              {t.workflow1.nodes.map((node) => (
                <li key={node.name} className="flex gap-2"><span className="text-primary font-medium shrink-0">{node.name}</span> {node.detail}</li>
              ))}
            </ul>
          </div>

          <blockquote className="border-l-4 border-primary/40 pl-4 py-1 text-foreground italic mb-6">
            {t.workflow1.quote}
          </blockquote>

          <DownloadButton href="/workflows/workflow-1-automatable-friday.json" label={t.workflow1.downloadLabel} />

          {/* Transition: dumb pipe → smart pipe */}
          <div className="my-12 py-8 border-y border-border/40 text-center">
            <p className="text-lg text-foreground font-medium mb-2">{t.transition.line1}</p>
            <p className="text-muted-foreground">{t.transition.line2}</p>
          </div>

          {/* Workflow 2 */}
          <AnchorHeading id="workflow-2">{t.workflow2.heading}</AnchorHeading>
          <p className="text-muted-foreground mb-4 leading-relaxed">{t.workflow2.description}</p>

          <div className="bg-muted/30 rounded-lg p-4 mb-6 font-mono text-sm overflow-x-auto">
            {t.workflow2.pipelineLabels.map((step, i) => (
              <span key={i}>
                {i > 0 && <span className="text-muted-foreground"> &rarr; </span>}
                <span className="text-primary">{step.name}</span>{step.detail ? ` ${step.detail}` : ''}
              </span>
            ))}
          </div>

          <figure className="rounded-lg overflow-hidden border border-border mb-6">
            <img
              src="/workflows/n8n-ai-feedback-classification-workflow.webp"
              alt={t.workflow2.imgAlt}
              title={t.workflow2.imgTitle}
              className="w-full h-auto"
              width={1200}
              height={499}
              loading="lazy"
            />
            <figcaption className="text-xs text-muted-foreground text-center py-2 bg-muted/20">
              {t.workflow2.figcaption}
            </figcaption>
          </figure>

          <div className="bg-card border border-border rounded-lg p-5 mb-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">{t.workflow2.nodesHeading}</h3>
            <ul className="space-y-2 text-muted-foreground">
              {t.workflow2.nodes.map((node) => (
                <li key={node.name} className="flex gap-2"><span className="text-primary font-medium shrink-0">{node.name}</span> {node.detail}</li>
              ))}
            </ul>
          </div>

          {/* Classification Prompt */}
          <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">{t.workflow2.promptHeading}</h3>
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <CopyButton text={CLASSIFICATION_PROMPT} copyLabel={t.workflow2.promptCopyLabel} copiedLabel={t.workflow2.promptCopiedLabel} />
            </div>
            <pre className="bg-muted/30 border border-border rounded-lg p-5 pt-12 sm:pt-5 overflow-x-auto text-sm leading-relaxed font-mono text-foreground whitespace-pre-wrap">
              {CLASSIFICATION_PROMPT}
            </pre>
          </div>

          <div className="bg-card border border-border rounded-lg p-5 mt-6 mb-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">{t.workflow2.whyWorksHeading}</h3>
            <ul className="space-y-2 text-muted-foreground">
              {t.workflow2.whyWorks.map((item) => (
                <li key={item.label} className="flex gap-2"><span className="text-primary font-medium shrink-0">{item.label}</span> {item.detail}</li>
              ))}
            </ul>
          </div>

          <blockquote className="border-l-4 border-primary/40 pl-4 py-1 text-foreground italic mb-6">
            {t.workflow2.quote}
          </blockquote>

          {/* The ambiguous test */}
          <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">{t.workflow2.ambiguousHeading}</h3>
          <div className="bg-card border border-border rounded-lg p-5 mb-4">
            <p className="text-muted-foreground italic">{t.workflow2.ambiguousExample}</p>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {t.workflow2.ambiguousExplanation1.split(lang === 'es' ? 'clasificar como BUG' : 'classify as BUG').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>{part}<strong className="text-foreground">{lang === 'es' ? 'clasificar como BUG' : 'classify as BUG'}</strong></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {t.workflow2.ambiguousExplanation2}
          </p>

          <DownloadButton href="/workflows/workflow-2-intelligent-router.json" label={t.workflow2.downloadLabel} />

          {/* The Pattern */}
          <AnchorHeading id="the-pattern">{t.pattern.heading}</AnchorHeading>
          <p className="text-muted-foreground mb-4 leading-relaxed">{t.pattern.description}</p>

          <div className="bg-muted/30 rounded-lg p-4 mb-6 font-mono text-sm text-center">
            <span className="text-primary">{t.pattern.labels.trigger}</span> ({t.pattern.labels.when}) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">{t.pattern.labels.read}</span> ({t.pattern.labels.getData}) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">{t.pattern.labels.process}</span> ({t.pattern.labels.transform}) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">{t.pattern.labels.act}</span> ({t.pattern.labels.notify})
          </div>

          <p className="text-muted-foreground mb-3">{t.pattern.worksFor}</p>
          <ul className="space-y-1.5 text-muted-foreground mb-6 ml-4">
            {t.pattern.useCases.map((useCase) => (
              <li key={useCase} className="flex items-start gap-2"><span className="text-primary mt-1.5 text-xs">&#9679;</span>{useCase}</li>
            ))}
          </ul>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mb-6">
            <p className="text-foreground font-medium">{t.pattern.punchline}</p>
          </div>

          {/* Bootcamp CTA */}
          <div className="my-10 relative rounded-2xl p-[1.5px] bg-gradient-theme">
            <div className="p-6 sm:p-8 rounded-[calc(1rem-1.5px)] bg-card">
              <p className="font-display font-semibold text-foreground text-lg mb-2">{t.bootcampCta.heading}</p>
              <p className="text-muted-foreground leading-relaxed mb-4">{t.bootcampCta.body}</p>
              <a
                href="https://maven.com/marily-nika/ai-pm-bootcamp?utm_source=santifer&utm_medium=cheatsheet&utm_campaign=n8n-for-pms"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                {t.bootcampCta.cta}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Get Started */}
          <AnchorHeading id="get-started">{t.getStarted.heading}</AnchorHeading>
          <ol className="space-y-3 text-muted-foreground mb-8 ml-1">
            {t.getStarted.steps.map((step) => (
              <li key={step.num} className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{step.num}</span>
                <span>
                  {step.text.includes('<a>') ? (
                    <>
                      <a href="https://n8n.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                        {step.text.match(/<a>(.*?)<\/a>/)?.[1]}
                      </a>
                      {step.text.replace(/<a>.*?<\/a>/, '')}
                    </>
                  ) : step.text}
                </span>
              </li>
            ))}
          </ol>

          {/* Bonus step — bootcamp */}
          <div className="flex items-start gap-3 mt-3 mb-8 ml-1 text-muted-foreground">
            <span className="bg-card border border-primary/30 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
            <span>
              {t.getStarted.bonusStep.split(/<a>|<\/a>/).map((part, i) =>
                i === 1 ? (
                  <a
                    key={i}
                    href="https://maven.com/marily-nika/ai-pm-bootcamp?utm_source=santifer&utm_medium=cheatsheet&utm_campaign=n8n-for-pms"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-primary hover:underline font-medium"
                  >
                    {part}
                  </a>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </span>
          </div>

          <blockquote className="border-l-4 border-primary/40 pl-4 py-1 text-foreground italic mb-8">
            {t.getStarted.quote}
          </blockquote>

          {/* Lessons Learned */}
          <AnchorHeading id="lessons">{t.lessons.heading}</AnchorHeading>
          <div className="space-y-4 mb-8">
            {t.lessons.items.map((lesson, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-primary font-bold text-lg shrink-0">{i + 1}.</span>
                <div>
                  <p className="font-medium text-foreground">{lesson.title}</p>
                  <p className="text-muted-foreground">{lesson.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ visible */}
          <AnchorHeading id="faq">{t.faq.heading}</AnchorHeading>
          <div className="space-y-4 mb-8">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group bg-card border border-border rounded-lg">
                <summary className="px-5 py-4 cursor-pointer font-medium text-foreground flex items-center justify-between">
                  {item.q}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-5 pb-4 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>

          {/* Import Workflows */}
          <AnchorHeading id="import">{t.import.heading}</AnchorHeading>
          <p className="text-muted-foreground mb-5 leading-relaxed">
            {t.import.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <DownloadButton href="/workflows/workflow-1-automatable-friday.json" label={t.import.wf1Label} />
            <DownloadButton href="/workflows/workflow-2-intelligent-router.json" label={t.import.wf2Label} />
          </div>

          <div className="bg-card border border-border rounded-lg p-5 mb-6">
            <h3 className="font-display font-semibold text-foreground mb-2">{t.import.howToHeading}</h3>
            <p className="text-muted-foreground">{t.import.howToText}</p>
          </div>

          {/* Resources */}
          <AnchorHeading id="resources">{t.resources.heading}</AnchorHeading>
          <ul className="space-y-2 text-muted-foreground mb-8">
            {t.resources.items.map((item) => (
              <li key={item.url} className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{item.label}</a>
              </li>
            ))}
          </ul>
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/foto-avatar-sm.webp"
              alt="Santiago Fernández de Valderrama"
              className="w-12 h-12 rounded-full"
              width={48}
              height={48}
            />
            <div>
              <p className="font-medium text-foreground">Santiago Fernández de Valderrama</p>
              <p className="text-sm text-muted-foreground">
                {t.footer.role} · {t.footer.fellowAt}{' '}
                <a
                  href="https://maven.com/marily-nika/ai-pm-bootcamp?utm_source=santifer&utm_medium=cheatsheet&utm_campaign=n8n-for-pms"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-primary hover:underline"
                >
                  {t.footer.fellowLink}
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            <a href="https://santifer.io" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-border text-sm hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground">
              santifer.io
            </a>
            <a href="https://linkedin.com/in/santifer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-border text-sm hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground">
              LinkedIn
            </a>
            <a href="https://github.com/santifer-dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-border text-sm hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground">
              GitHub
            </a>
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Santiago Fernández de Valderrama. {t.footer.copyright}</p>
        </footer>
      </main>
    </div>
  )
}
