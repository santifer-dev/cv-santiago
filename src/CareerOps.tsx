import { Link } from 'react-router-dom'
import { type CareerOpsLang as Lang } from './career-ops-i18n'
import { buildArticleJsonLd } from './articles/json-ld'
import { useArticleSeo } from './articles/use-article-seo'
import {
  ArticleLayout,
  ArticleHeader,
  ArticleFooter,
  FaqSection,
  LessonsSection,
  MetricsGrid,
  StatusBadge,
  CaseStudyCta,
} from './articles/components'
import {
  H2,
  H3,
  Prose,
  Callout,
  CardStack,
  StepList,
  DataTable,
  StackGrid,
  FloatingToc,
  DiagramZoom,
  ToolList,
} from './articles/content-types'
import { careerOpsContent } from './career-ops-i18n'

// ---------------------------------------------------------------------------
// Stack icons
// ---------------------------------------------------------------------------
const stackIcons: Record<string, React.ReactNode> = {
  'Claude Code': (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#D97757"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>
  ),
  Playwright: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M23.996 7.462c-.056.837-.257 2.135-.716 3.85c-.995 3.715-4.27 10.874-10.42 9.227c-6.15-1.65-5.407-9.487-4.412-13.201c.46-1.716.934-2.94 1.305-3.694c.42-.853.846-.289 1.815.523c.684.573 2.41 1.791 5.011 2.488s4.706.506 5.583.352c1.245-.219 1.897-.494 1.834.455m-9.807 3.863s-.127-1.819-1.773-2.286c-1.644-.467-2.613 1.04-2.613 1.04Zm4.058 4.539l-7.769-2.172s.446 2.306 3.338 3.153c2.862.836 4.43-.98 4.43-.981Zm2.701-2.51s-.13-1.818-1.773-2.286c-1.644-.469-2.612 1.038-2.612 1.038ZM8.57 18.23c-4.749 1.279-7.261-4.224-8.021-7.08C.197 9.831.044 8.832.003 8.188c-.047-.73.455-.52 1.415-.354c.677.118 2.3.261 4.308-.28a11.3 11.3 0 0 0 2.41-.956q-.087.295-.17.61c-.433 1.618-.827 4.055-.632 6.426c-1.976.732-2.267 2.423-2.267 2.423l2.524-.715c.227 1.002.6 1.987 1.15 2.838zm-4.188-6.298c1.265-.333 1.363-1.631 1.363-1.631l-3.374.888s.745 1.076 2.01.743Z"/></svg>
  ),
  Puppeteer: (
    <svg viewBox="0 0 256 383" className="w-8 h-8"><path fill="#DFDEDF" d="M253.4 214.2H2.2v-14.2c0-9.5 7.7-17.2 17.2-17.2h216.8c9.5 0 17.2 7.7 17.2 17.2v14.2z"/><path fill="currentColor" opacity="0.15" d="M235.9 378.6H19.7c-9.7 0-17.5-7.8-17.5-17.5V214.2h253.2v147c0 9.6-7.8 17.4-17.5 17.4"/><polygon fill="#00D8A2" points="211.1 132.6 241.8 117.8 241.8 103 170.8 69 241.8 32.5 241.8 18.2 212.2 4.4 128.1 46.2 42.5 4.4 15 19.2 15 31.9 81.8 68.5 15 102.4 15 117.8 43.6 132.6 128.4 89.2"/><circle fill="currentColor" cx="21.2" cy="198.7" r="4.3"/><circle fill="currentColor" cx="35.9" cy="198.7" r="4.3"/><circle fill="currentColor" cx="50.1" cy="198.7" r="4.3"/></svg>
  ),
  'Node.js': (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="#339933"><path d="M15.998 28.895c-0.337 0-0.673-0.088-0.969-0.259l-3.086-1.826c-0.46-0.257-0.235-0.349-0.083-0.402 0.614-0.213 0.739-0.262 1.394-0.635 0.069-0.038 0.159-0.024 0.231 0.018l2.37 1.407c0.087 0.048 0.207 0.048 0.287 0l9.241-5.333c0.086-0.049 0.141-0.149 0.141-0.25v-10.665c0-0.104-0.055-0.202-0.143-0.255l-9.237-5.329c-0.086-0.050-0.199-0.050-0.285 0l-9.235 5.331c-0.090 0.051-0.146 0.152-0.146 0.253v10.666c0 0.102 0.056 0.198 0.145 0.247l2.532 1.462c1.374 0.687 2.215-0.122 2.215-0.935v-10.53c0-0.149 0.12-0.266 0.269-0.266h1.172c0.146 0 0.267 0.117 0.267 0.266v10.53c0 1.833-0.998 2.885-2.736 2.885-0.534 0-0.955 0-2.129-0.579l-2.423-1.395c-0.598-0.346-0.969-0.993-0.969-1.686v-10.665c0-0.693 0.371-1.339 0.969-1.684l9.242-5.34c0.585-0.331 1.362-0.331 1.942 0l9.241 5.34c0.599 0.346 0.971 0.992 0.971 1.684v10.665c0 0.693-0.372 1.337-0.971 1.686l-9.241 5.335c-0.296 0.171-0.631 0.259-0.973 0.259z"/></svg>
  ),
  tmux: (
    <svg viewBox="0 0 160 160" className="w-8 h-8"><path fill="#1BB91F" d="m0 116h160v29c0 8.286-6.722 15-15 15h-130c-8.283 0-15-6.707-15-15v-29z"/><path fill="currentColor" d="m83 70v-70h-6v146h6v-70h77v-6h-77zm-83-54.99c0-8.288 6.722-15.01 15-15.01h130c8.283 0 15 6.725 15 15.01v131h-160v-131z"/></svg>
  ),
}

// ---------------------------------------------------------------------------
// buildJsonLd
// ---------------------------------------------------------------------------
function buildJsonLd(lang: Lang) {
  const t = careerOpsContent[lang]
  return buildArticleJsonLd({
    lang,
    url: `https://santifer.io/${t.slug}`,
    altUrl: `https://santifer.io/${t.altSlug}`,
    headline: t.header.h1,
    alternativeHeadline: t.seo.title,
    description: t.seo.description,
    datePublished: '2026-03-17',
    dateModified: '2026-03-17',
    keywords: [
      'multi-agent job search', 'job search automation', 'Claude Code', 'ATS-optimized CV',
      'ai resume builder', 'ai resume', 'ai powered job search', 'multi agent system',
      'multi agent orchestration', 'automated job application', 'ai auto apply', 'career-ops',
    ],
    images: ['https://santifer.io/career-ops/og-career-ops.webp'],
    breadcrumbHome: t.nav.breadcrumbHome,
    breadcrumbCurrent: t.nav.breadcrumbCurrent,
    faq: t.faq.items,
    articleType: 'TechArticle',
    about: [
      { '@type': 'SoftwareApplication', name: 'Claude Code', url: 'https://claude.ai', applicationCategory: 'AI Agent' },
      { '@type': 'SoftwareApplication', name: 'Playwright', url: 'https://playwright.dev', applicationCategory: 'Browser Automation' },
      { '@type': 'Thing', name: 'Multi-Agent Orchestration' },
      { '@type': 'Thing', name: 'Job Search Automation' },
    ],
    extra: { proficiencyLevel: 'Expert', dependencies: 'Claude Code, Playwright, Puppeteer, Node.js, tmux' },
  })
}

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================
export default function CareerOps({ lang = 'en' }: { lang?: Lang }) {
  const t = careerOpsContent[lang]

  useArticleSeo({
    lang,
    slug: t.slug,
    altSlug: t.altSlug,
    title: t.seo.title,
    description: t.seo.description,
    image: 'https://santifer.io/career-ops/og-career-ops.webp',
    publishedTime: '2026-03-17',
    modifiedTime: '2026-03-17',
    articleTags: 'multi-agent,job search,Claude Code,ATS,batch processing,HITL,automation',
    jsonLd: buildJsonLd(lang),
    xDefaultSlug: 'career-ops',
  })

  const s = t.sections

  return (
    <ArticleLayout lang={lang}>
      <FloatingToc />
      <ArticleHeader
        kicker={t.header.kicker}
        h1={t.header.h1}
        subtitle={t.header.subtitle}
        date={t.header.date}
        readingTime={t.readingTime}
      />

      <img
        src="/career-ops/hero-career-ops.webp"
        alt={lang === 'es'
          ? 'Career Pipeline: dashboard del tracker con 516 ofertas evaluadas, scores 4.0-4.5, empresas como Datadog, Langfuse, OpenAI, LangChain'
          : 'Career Pipeline: tracker dashboard with 516 evaluated offers, scores 4.0-4.5, companies like Datadog, Langfuse, OpenAI, LangChain'}
        className="w-full rounded-2xl mb-8"
        width={1400}
        height={782}
        fetchPriority="high"
      />

      <StatusBadge text={t.header.badge} />
      <MetricsGrid items={t.heroMetrics} columns={5} compact />
      <Callout className="bg-accent/10 border-accent/40">{t.tldr}</Callout>
      <Callout>{t.metaCallout}</Callout>

      <article className="prose-custom">
        {/* ================================================================ */}
        {/*  INTRO                                                           */}
        {/* ================================================================ */}
        <Prose variant="hook">{s.intro.hook}</Prose>
        <Prose>{s.intro.body}</Prose>

        {/* ================================================================ */}
        {/*  THE PROBLEM                                                     */}
        {/* ================================================================ */}
        <H2 id="the-problem">{s.theProblem.heading}</H2>
        <Prose>{s.theProblem.body}</Prose>
        <StepList items={s.theProblem.painPoints.map(p => ({
          label: p.label,
          detail: p.detail,
        }))} />
        <Callout>{s.theProblem.punchline}</Callout>

        {/* ================================================================ */}
        {/*  ARCHITECTURE                                                    */}
        {/* ================================================================ */}
        <H2 id="architecture">{s.architecture.heading}</H2>
        <Prose>{s.architecture.body}</Prose>

        <H3>{s.architecture.whyModes.heading}</H3>
        <CardStack items={s.architecture.whyModes.items.map(item => ({
          title: item.label,
          detail: item.detail,
        }))} />

        <ToolList items={s.architecture.modes.map(m => ({
          name: m.name,
          desc: m.desc,
        }))} />

        <DiagramZoom
          src="/career-ops/scan.webp"
          hdSrc="/career-ops/scan.webp"
          alt={lang === 'es'
            ? 'Modo scan en acción: agente Claude Code lanzando búsqueda en DailyRemote con 8 queries, leyendo pipeline.md y scan-history.tsv para dedup'
            : 'Scan mode in action: Claude Code agent launching DailyRemote search with 8 queries, reading pipeline.md and scan-history.tsv for dedup'}
          caption={lang === 'es'
            ? 'Modo scan: agente background buscando ofertas AI/LLM en DailyRemote con dedup automático'
            : 'Scan mode: background agent searching AI/LLM offers on DailyRemote with automatic dedup'}
        />

        {/* ================================================================ */}
        {/*  SCORING                                                         */}
        {/* ================================================================ */}
        <H2 id="scoring">{s.scoring.heading}</H2>
        <Prose>{s.scoring.body}</Prose>
        <DataTable
          headers={[...s.scoring.dimensions.headers]}
          rows={s.scoring.dimensions.rows.map(r => [...r])}
          highlightColumn={2}
        />

        <DiagramZoom
          src="/career-ops/datadog.webp"
          hdSrc="/career-ops/datadog.webp"
          alt={lang === 'es'
            ? 'Evaluación real: Datadog Staff AI Engineer, MCP Services — Score 4.55/5, arquetipo AI Platform + Agentic Workflows, resumen del rol con 7 dimensiones'
            : 'Real evaluation: Datadog Staff AI Engineer, MCP Services — Score 4.55/5, archetype AI Platform + Agentic Workflows, role summary with 7 dimensions'}
          caption={lang === 'es'
            ? 'Evaluación real: Datadog Staff AI Engineer — score 4.55/5, arquetipo detectado, resumen estructurado del rol'
            : 'Real evaluation: Datadog Staff AI Engineer — score 4.55/5, detected archetype, structured role summary'}
        />
        <DiagramZoom
          src="/career-ops/report1.webp"
          hdSrc="/career-ops/report1.webp"
          alt={lang === 'es'
            ? 'CV Match: tabla de 6 requisitos de la JD mapeados contra proof points del CV con strength rating (Strong/Very Strong/Moderate)'
            : 'CV Match: table of 6 JD requirements mapped against CV proof points with strength rating (Strong/Very Strong/Moderate)'}
          caption={lang === 'es'
            ? 'Bloque B) CV Match: cada requisito de la JD mapeado contra proof points reales del CV'
            : 'Block B) CV Match: each JD requirement mapped against real CV proof points'}
        />
        <DiagramZoom
          src="/career-ops/report2.webp"
          hdSrc="/career-ops/report2.webp"
          alt={lang === 'es'
            ? 'CV Match (cont.) + Gaps and Mitigation: requisitos 7-10 y análisis de gaps con severidad y plan de mitigación'
            : 'CV Match (cont.) + Gaps and Mitigation: requirements 7-10 and gap analysis with severity and mitigation plan'}
          caption={lang === 'es'
            ? 'CV Match (cont.) + Gaps: el sistema identifica gaps y propone mitigación con severidad'
            : 'CV Match (cont.) + Gaps: the system identifies gaps and proposes mitigation with severity'}
        />
        <DiagramZoom
          src="/career-ops/report3.webp"
          hdSrc="/career-ops/report3.webp"
          alt={lang === 'es'
            ? 'Gaps (cont.) + Nivel y Estrategia: detección de nivel IC5, plan "Sell Staff without lying" con framing de experiencia'
            : 'Gaps (cont.) + Level and Strategy: IC5 level detection, "Sell Staff without lying" plan with experience framing'}
          caption={lang === 'es'
            ? 'Bloque C) Nivel y Estrategia: detección de seniority + plan de posicionamiento honesto'
            : 'Block C) Level and Strategy: seniority detection + honest positioning plan'}
        />

        <H3>{s.scoring.distribution.heading}</H3>
        <MetricsGrid items={s.scoring.distribution.items} columns={4} />
        <Callout>{s.scoring.callout}</Callout>

        {/* ================================================================ */}
        {/*  PIPELINE                                                        */}
        {/* ================================================================ */}
        <H2 id="pipeline">{s.pipeline.heading}</H2>
        <Prose>{s.pipeline.body}</Prose>
        <StepList items={s.pipeline.steps.map(step => ({
          label: step.label,
          detail: step.detail,
        }))} />

        <figure className="rounded-lg overflow-hidden border border-border shadow-lg mb-6">
          <div className="relative w-full" style={{ paddingBottom: '62.5%' }}>
            <iframe
              src="https://player.mux.com/Zhl5qjj02PoD2g01ZsOwJptHNTvThw7udv47tnza1VLUc?accent-color=%2300D9FF"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <figcaption className="px-4 py-2 text-sm text-muted-foreground text-center bg-card">
            {lang === 'es'
              ? 'Demo: auto-pipeline evaluando la oferta de Datadog Staff AI Engineer en tiempo real'
              : 'Demo: auto-pipeline evaluating the Datadog Staff AI Engineer offer in real time'}
          </figcaption>
        </figure>

        <H3>{s.pipeline.batch.heading}</H3>
        <Prose>{s.pipeline.batch.body}</Prose>
        <MetricsGrid items={s.pipeline.batch.metrics} columns={3} compact />
        <Prose>{s.pipeline.batch.details}</Prose>

        {/* ================================================================ */}
        {/*  PDF                                                             */}
        {/* ================================================================ */}
        <H2 id="pdf">{s.pdf.heading}</H2>
        <Prose>{s.pdf.body}</Prose>
        <StepList items={s.pdf.steps.map(step => ({
          label: step.label,
          detail: step.detail,
        }))} />

        <div className="grid grid-cols-2 gap-3 mb-6">
          <DiagramZoom
            src="/career-ops/pdf-wave-cv.webp"
            hdSrc="/career-ops/pdf-wave-cv.webp"
            alt={lang === 'es'
              ? 'CV personalizado para Wave: summary reescrito, competencias adaptadas a Voice AI + Multi-Agent, bullets reordenados por relevancia'
              : 'Personalized CV for Wave: rewritten summary, competencies adapted to Voice AI + Multi-Agent, bullets reordered by relevance'}
            caption={lang === 'es' ? 'CV ATS-optimized' : 'ATS-optimized CV'}
          />
          <DiagramZoom
            src="/career-ops/pdf-wave-cover.webp"
            hdSrc="/career-ops/pdf-wave-cover.webp"
            alt={lang === 'es'
              ? 'Cover letter para Wave: header gradient, Jacobo como proof point de voz + WhatsApp, links a case studies y dashboard'
              : 'Cover letter for Wave: gradient header, Jacobo as voice + WhatsApp proof point, links to case studies and dashboard'}
            caption={lang === 'es' ? 'Cover letter personalizada' : 'Personalized cover letter'}
          />
        </div>

        <H3>{s.pdf.archetypes.heading}</H3>
        <DataTable
          headers={[...s.pdf.archetypes.headers]}
          rows={s.pdf.archetypes.rows.map(r => [...r])}
          highlightColumn={1}
        />
        <Callout>{s.pdf.callout}</Callout>

        {/* ================================================================ */}
        {/*  BEFORE / AFTER                                                  */}
        {/* ================================================================ */}
        <H2 id="before-after">{s.beforeAfter.heading}</H2>
        <DataTable
          headers={[...s.beforeAfter.headers]}
          rows={s.beforeAfter.rows.map(r => [...r])}
          highlightColumn={2}
        />

        {/* ================================================================ */}
        {/*  RESULTS                                                         */}
        {/* ================================================================ */}
        <H2 id="results">{s.results.heading}</H2>
        <Prose>{s.results.body}</Prose>
        <MetricsGrid items={s.results.metrics} columns={4} />

        {/* ================================================================ */}
        {/*  STACK                                                           */}
        {/* ================================================================ */}
        <H3>{s.stack.heading}</H3>
        <StackGrid items={s.stack.items.map(item => ({
          icon: stackIcons[item.name] ?? <span className="w-8 h-8 flex items-center justify-center text-lg font-bold text-primary">{item.name[0]}</span>,
          name: item.name,
          desc: item.role,
        }))} columns={3} />

        {/* ================================================================ */}
        {/*  LESSONS                                                         */}
        {/* ================================================================ */}
        <LessonsSection
          heading={s.lessons.heading}
          items={s.lessons.items.map(l => ({
            title: l.title,
            detail: l.detail,
          }))}
        />

        {/* ================================================================ */}
        {/*  FAQ                                                             */}
        {/* ================================================================ */}
        <FaqSection heading={t.faq.heading} items={t.faq.items} />

        {/* ================================================================ */}
        {/*  RELATED SYSTEMS                                                 */}
        {/* ================================================================ */}
        <H2 id="related">{lang === 'es' ? 'Sistemas Relacionados' : 'Related Systems'}</H2>
        <Prose>{lang === 'es'
          ? 'Career-Ops demuestra las mismas competencias que estos sistemas. Cada uno es un case study completo con arquitectura, métricas y lecciones.'
          : 'Career-Ops demonstrates the same competencies as these systems. Each one is a full case study with architecture, metrics, and lessons.'
        }</Prose>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {Object.values(t.internalLinks).map(link => (
            <Link key={link.href} to={link.href} className="block p-4 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors">
              <p className="text-sm font-medium text-primary">{link.text}</p>
            </Link>
          ))}
        </div>

        {/* ================================================================ */}
        {/*  CTA                                                             */}
        {/* ================================================================ */}
        <CaseStudyCta
          heading={s.cta.heading}
          body={s.cta.body}
          ctaLabel={s.cta.ctaLabel}
          ctaHref={s.cta.ctaHref}
        />
      </article>

      <ArticleFooter lang={lang} utmCampaign="career-ops" />
    </ArticleLayout>
  )
}
