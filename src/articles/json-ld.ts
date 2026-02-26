type Lang = 'es' | 'en'

interface JsonLdOptions {
  lang: Lang
  url: string
  altUrl: string
  headline: string
  alternativeHeadline: string
  description: string
  datePublished: string
  dateModified: string
  keywords: string[]
  images: string[]
  breadcrumbHome: string
  breadcrumbCurrent: string
  /** Publisher org — only for collabs (e.g. Marily) */
  publisher?: { name: string; url: string }
  /** FAQ items — generates FAQPage schema */
  faq?: readonly { q: string; a: string }[]
  /** HowTo schema */
  howTo?: {
    name: string
    description: string
    steps: Array<{ name: string; text: string }>
    tools?: Array<{ name: string }>
  }
  /** Article type — default 'Article' */
  articleType?: 'Article' | 'TechArticle'
  /** Extra 'about' entities */
  about?: Array<Record<string, string>>
  /** Extra fields like proficiencyLevel, dependencies */
  extra?: Record<string, string>
}

const PERSON = {
  '@type': 'Person',
  '@id': 'https://santifer.io/#person',
  name: 'Santiago Fernández de Valderrama Aparicio',
  url: 'https://santifer.io',
  jobTitle: 'AI Product Manager',
  sameAs: [
    'https://www.linkedin.com/in/santifer',
    'https://github.com/santifer-dev',
  ],
}

const WEBSITE = {
  '@type': 'WebSite',
  '@id': 'https://santifer.io/#website',
  name: 'santifer.io',
  url: 'https://santifer.io',
}

export function buildArticleJsonLd(opts: JsonLdOptions) {
  const inLanguage = opts.lang === 'es' ? 'es' : 'en'

  const graph: Record<string, unknown>[] = [
    {
      '@type': opts.articleType || 'Article',
      '@id': `${opts.url}/#article`,
      headline: opts.headline,
      alternativeHeadline: opts.alternativeHeadline,
      description: opts.description,
      author: { '@id': 'https://santifer.io/#person' },
      ...(opts.publisher ? {
        publisher: {
          '@type': 'Organization',
          name: opts.publisher.name,
          url: opts.publisher.url,
        },
      } : {}),
      datePublished: opts.datePublished,
      dateModified: opts.dateModified,
      keywords: opts.keywords,
      url: opts.url,
      mainEntityOfPage: opts.url,
      image: opts.images,
      inLanguage,
      isPartOf: { '@id': 'https://santifer.io/#website' },
      ...(opts.about ? { about: opts.about } : {}),
      ...(opts.extra || {}),
      workTranslation: { '@id': `${opts.altUrl}/#article` },
    },
    PERSON,
    WEBSITE,
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: opts.breadcrumbHome, item: 'https://santifer.io' },
        { '@type': 'ListItem', position: 2, name: opts.breadcrumbCurrent, item: opts.url },
      ],
    },
  ]

  if (opts.faq && opts.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: opts.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
  }

  if (opts.howTo) {
    graph.push({
      '@type': 'HowTo',
      name: opts.howTo.name,
      description: opts.howTo.description,
      inLanguage,
      step: opts.howTo.steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
      ...(opts.howTo.tools ? {
        tool: opts.howTo.tools.map((t) => ({ '@type': 'HowToTool', name: t.name })),
      } : {}),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
