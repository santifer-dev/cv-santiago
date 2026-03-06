import { n8nContent, CLASSIFICATION_PROMPT, type N8nLang } from './n8n-i18n'
import { buildArticleJsonLd } from './articles/json-ld'
import { useArticleSeo } from './articles/use-article-seo'
import {
  DownloadButton,
  ArticleLayout,
  ArticleHeader,
  ArticleFooter,
  FaqSection,
  ResourcesList,
  LessonsSection,
  CaseStudyCta,
} from './articles/components'
import {
  H2,
  H3,
  Prose,
  Callout,
  InfoCard,
  BulletList,
  StepList,
  DiagramZoom,
  CodeBlock,
  FloatingToc,
} from './articles/content-types'

function buildJsonLd(lang: N8nLang) {
  const t = n8nContent[lang]
  return buildArticleJsonLd({
    lang,
    url: `https://santifer.io/${t.slug}`,
    altUrl: `https://santifer.io/${t.altSlug}`,
    headline: t.header.h1 + ' — Cheat Sheet',
    alternativeHeadline: t.seo.title,
    description: t.seo.description,
    datePublished: '2026-02-24',
    dateModified: '2026-03-05',
    keywords: ['n8n', 'product manager', 'automation', 'AI', 'workflow', 'sprint report', 'feedback classification', 'no-code', 'n8n tutorial', 'AI workflow automation'],
    images: [
      'https://santifer.io/workflows/n8n-sprint-report-automation-workflow.webp',
      'https://santifer.io/workflows/n8n-ai-feedback-classification-workflow.webp',
    ],
    breadcrumbHome: t.nav.breadcrumbHome,
    breadcrumbCurrent: t.nav.breadcrumbCurrent,
    faq: t.faq.items,
    articleType: 'TechArticle',
    about: [
      { '@type': 'SoftwareApplication', name: 'n8n', url: 'https://n8n.io', applicationCategory: 'Workflow Automation' },
      { '@type': 'Thing', name: 'Product Management Automation' },
    ],
    extra: { proficiencyLevel: 'Beginner', dependencies: 'n8n Cloud (free tier), Airtable, Slack' },
    howTo: {
      name: lang === 'es' ? 'Cómo Importar Workflow Templates de n8n' : 'How to Import n8n Workflow Templates',
      description: t.import.description,
      steps: [
        { name: lang === 'es' ? 'Regístrate en n8n' : 'Sign up for n8n', text: lang === 'es' ? 'Crea una cuenta gratuita en n8n.io Cloud.' : 'Create a free account at n8n.io Cloud.' },
        { name: lang === 'es' ? 'Descarga el JSON del workflow' : 'Download the workflow JSON', text: lang === 'es' ? 'Descarga el archivo JSON del workflow template desde esta página.' : 'Download the workflow template JSON file from this page.' },
        { name: lang === 'es' ? 'Importa en n8n' : 'Import into n8n', text: lang === 'es' ? 'En n8n, pulsa el botón +, selecciona "Import from File" y elige el JSON descargado.' : 'In n8n, click the + button, select "Import from File", and choose the downloaded JSON file.' },
        { name: lang === 'es' ? 'Conecta tus credenciales' : 'Connect your credentials', text: lang === 'es' ? 'Conecta tus credenciales de Slack, Airtable e IA (Anthropic/OpenAI) a los nodos del workflow importado.' : 'Connect your own Slack, Airtable, and AI (Anthropic/OpenAI) credentials to the imported workflow nodes.' },
      ],
      tools: [{ name: 'n8n Cloud (free tier)' }, { name: 'Slack workspace' }, { name: 'Airtable account' }],
    },
  })
}

export default function N8nForPMs({ lang = 'en' }: { lang?: N8nLang }) {
  const t = n8nContent[lang]

  useArticleSeo({
    lang,
    slug: t.slug,
    altSlug: t.altSlug,
    title: t.seo.title,
    description: t.seo.description,
    image: 'https://santifer.io/workflows/n8n-ai-feedback-classification-workflow.webp',
    publishedTime: '2026-02-24',
    modifiedTime: '2026-03-05',
    articleTags: 'n8n,product manager,automation,AI,workflow,no-code',
    jsonLd: buildJsonLd(lang),
    xDefaultSlug: 'n8n-para-pms',
  })

  const BOOTCAMP_URL = 'https://maven.com/marily-nika/ai-pm-bootcamp?utm_source=santifer&utm_medium=cheatsheet&utm_campaign=n8n-for-pms'

  return (
    <ArticleLayout lang={lang}>
        <FloatingToc />
        <ArticleHeader
          editorId="hero-header"
          kicker={t.header.kicker}
          kickerLink={BOOTCAMP_URL}
          h1={t.header.h1}
          subtitle={t.header.subtitle}
          date={t.header.date}
          readingTime={t.readingTime}
        />

        {/* Content */}
        <article className="prose-custom">

          {/* Intro narrative */}
          <Prose variant="hook">
            {t.intro.hook}
          </Prose>
          <Prose>
            {t.intro.body}
          </Prose>
          <Prose className="mb-8">
            {t.intro.punchline.split(lang === 'es' ? 'Era un router de datos muy caro.' : 'I was a very expensive data router.').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>{part}<strong className="text-foreground">{lang === 'es' ? 'Era un router de datos muy caro.' : 'I was a very expensive data router.'}</strong></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </Prose>

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
          <H2 id="time-sinks">{t.timeSinks.heading}</H2>
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
          <H2 id="workflow-1">{t.workflow1.heading}</H2>
          <Prose>{t.workflow1.description}</Prose>

          <div className="bg-muted/30 rounded-lg p-4 mb-6 font-mono text-sm overflow-x-auto">
            {t.workflow1.pipelineLabels.map((step, i) => (
              <span key={i}>
                {i > 0 && <span className="text-muted-foreground"> &rarr; </span>}
                <span className="text-primary">{step.name}</span>{step.detail ? ` ${step.detail}` : ''}
              </span>
            ))}
          </div>

          <DiagramZoom
            src="/workflows/n8n-sprint-report-automation-workflow.webp"
            hdSrc="/workflows/n8n-sprint-report-automation-workflow-hd.webp"
            alt={t.workflow1.imgAlt}
            caption={t.workflow1.figcaption}
          />

          <InfoCard heading={t.workflow1.nodesHeading}>
            <BulletList
              variant="in-card"
              items={t.workflow1.nodes.map((node) => ({ label: node.name, detail: node.detail }))}
            />
          </InfoCard>

          <Callout>{t.workflow1.quote}</Callout>

          <DownloadButton href="/workflows/workflow-1-automatable-friday.json" label={t.workflow1.downloadLabel} />

          {/* Transition: dumb pipe → smart pipe */}
          <div className="my-12 py-8 border-y border-border/40 text-center">
            <p className="text-lg text-foreground font-medium mb-2">{t.transition.line1}</p>
            <p className="text-muted-foreground">{t.transition.line2}</p>
          </div>

          {/* Workflow 2 */}
          <H2 id="workflow-2">{t.workflow2.heading}</H2>
          <Prose>{t.workflow2.description}</Prose>

          <div className="bg-muted/30 rounded-lg p-4 mb-6 font-mono text-sm overflow-x-auto">
            {t.workflow2.pipelineLabels.map((step, i) => (
              <span key={i}>
                {i > 0 && <span className="text-muted-foreground"> &rarr; </span>}
                <span className="text-primary">{step.name}</span>{step.detail ? ` ${step.detail}` : ''}
              </span>
            ))}
          </div>

          <DiagramZoom
            src="/workflows/n8n-ai-feedback-classification-workflow.webp"
            hdSrc="/workflows/n8n-ai-feedback-classification-workflow-hd.webp"
            alt={t.workflow2.imgAlt}
            caption={t.workflow2.figcaption}
          />

          <InfoCard heading={t.workflow2.nodesHeading}>
            <BulletList
              variant="in-card"
              items={t.workflow2.nodes.map((node) => ({ label: node.name, detail: node.detail }))}
            />
          </InfoCard>

          {/* Classification Prompt */}
          <H3 id="classification-prompt">{t.workflow2.promptHeading}</H3>
          <CodeBlock highlight="template">{CLASSIFICATION_PROMPT}</CodeBlock>

          <InfoCard heading={t.workflow2.whyWorksHeading}>
            <BulletList
              variant="in-card"
              items={t.workflow2.whyWorks.map((item) => ({ label: item.label, detail: item.detail }))}
            />
          </InfoCard>

          <Callout>{t.workflow2.quote}</Callout>

          {/* The ambiguous test */}
          <H3 id="ambiguous-test">{t.workflow2.ambiguousHeading}</H3>
          <InfoCard>
            <p className="text-muted-foreground italic">{t.workflow2.ambiguousExample}</p>
          </InfoCard>
          <Prose>
            {t.workflow2.ambiguousExplanation1.split(lang === 'es' ? 'clasificar como BUG' : 'classify as BUG').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>{part}<strong className="text-foreground">{lang === 'es' ? 'clasificar como BUG' : 'classify as BUG'}</strong></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </Prose>
          <Prose>
            {t.workflow2.ambiguousExplanation2}
          </Prose>

          <DownloadButton href="/workflows/workflow-2-intelligent-router.json" label={t.workflow2.downloadLabel} />

          {/* The Pattern */}
          <H2 id="the-pattern">{t.pattern.heading}</H2>
          <Prose>{t.pattern.description}</Prose>

          <div className="bg-muted/30 rounded-lg p-4 mb-6 font-mono text-sm text-center">
            <span className="text-primary">{t.pattern.labels.trigger}</span> ({t.pattern.labels.when}) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">{t.pattern.labels.read}</span> ({t.pattern.labels.getData}) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">{t.pattern.labels.process}</span> ({t.pattern.labels.transform}) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">{t.pattern.labels.act}</span> ({t.pattern.labels.notify})
          </div>

          <Prose>{t.pattern.worksFor}</Prose>
          <BulletList items={t.pattern.useCases} />

          <Callout>{t.pattern.punchline}</Callout>

          {/* Bootcamp CTA */}
          <CaseStudyCta
            heading={t.bootcampCta.heading}
            body={t.bootcampCta.body}
            ctaLabel={t.bootcampCta.cta}
            ctaHref={BOOTCAMP_URL}
            external
          />

          {/* Get Started */}
          <H2 id="get-started">{t.getStarted.heading}</H2>
          <StepList
            items={t.getStarted.steps.map((step) =>
              step.text.includes('<a>') ? (
                <>
                  <a href="https://n8n.io" target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline font-medium">
                    {step.text.match(/<a>(.*?)<\/a>/)?.[1]}
                  </a>
                  {step.text.replace(/<a>.*?<\/a>/, '')}
                </>
              ) : step.text
            )}
          />

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

          <Callout>{t.getStarted.quote}</Callout>

          {/* Lessons Learned */}
          <LessonsSection heading={t.lessons.heading} items={t.lessons.items} />

          {/* FAQ */}
          <FaqSection heading={t.faq.heading} items={t.faq.items} />

          {/* Import Workflows */}
          <H2 id="import">{t.import.heading}</H2>
          <Prose>
            {t.import.description}
          </Prose>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <DownloadButton href="/workflows/workflow-1-automatable-friday.json" label={t.import.wf1Label} />
            <DownloadButton href="/workflows/workflow-2-intelligent-router.json" label={t.import.wf2Label} />
          </div>

          <InfoCard heading={t.import.howToHeading}>
            <p className="text-muted-foreground">{t.import.howToText}</p>
          </InfoCard>

          {/* Resources */}
          <ResourcesList heading={t.resources.heading} items={t.resources.items} />
        </article>

        <ArticleFooter
          editorId="article-footer"
          role={t.footer.role}
          fellowAt={t.footer.fellowAt}
          fellowLink={t.footer.fellowLink}
          fellowUrl={BOOTCAMP_URL}
          copyright={t.footer.copyright}
        />
    </ArticleLayout>
  )
}
