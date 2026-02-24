import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Download, Copy, Check, ExternalLink, Clock, ChevronRight, ArrowLeft, Sun, Moon } from 'lucide-react'

const READING_TIME = '5 min read'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    // TechArticle — main entity
    {
      '@type': 'TechArticle',
      '@id': 'https://santifer.io/n8n-for-pms/#article',
      headline: 'n8n for Product Managers — Cheat Sheet',
      alternativeHeadline: 'How to Automate Sprint Reports and Classify Feedback with AI Using n8n',
      description: 'Practical cheat sheet for Product Managers: automate sprint reports and AI-powered feedback classification with n8n workflows. Includes 2 importable workflow templates, a ready-to-use classification prompt, and step-by-step instructions.',
      author: { '@id': 'https://santifer.io/#person' },
      publisher: {
        '@type': 'Organization',
        name: 'AI Product Academy',
        url: 'https://maven.com/marily-nika/ai-pm-bootcamp',
      },
      datePublished: '2026-02-24',
      dateModified: '2026-02-24',
      keywords: ['n8n', 'product manager', 'automation', 'AI', 'workflow', 'sprint report', 'feedback classification', 'no-code', 'n8n for PMs', 'n8n tutorial product manager', 'automate sprint report', 'AI feedback classification workflow'],
      url: 'https://santifer.io/n8n-for-pms',
      mainEntityOfPage: 'https://santifer.io/n8n-for-pms',
      image: [
        'https://santifer.io/workflows/n8n-sprint-report-automation-workflow.webp',
        'https://santifer.io/workflows/n8n-ai-feedback-classification-workflow.webp',
      ],
      inLanguage: 'en',
      isPartOf: { '@id': 'https://santifer.io/#website' },
      about: [
        { '@type': 'SoftwareApplication', name: 'n8n', url: 'https://n8n.io', applicationCategory: 'Workflow Automation' },
        { '@type': 'Thing', name: 'Product Management Automation' },
      ],
      proficiencyLevel: 'Beginner',
      dependencies: 'n8n Cloud (free tier), Airtable, Slack',
      wordCount: 1200,
    },
    // Author — links to home page entity
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
    // WebSite
    {
      '@type': 'WebSite',
      '@id': 'https://santifer.io/#website',
      name: 'santifer.io',
      url: 'https://santifer.io',
    },
    // BreadcrumbList — SERP breadcrumb
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://santifer.io' },
        { '@type': 'ListItem', position: 2, name: 'n8n for Product Managers', item: 'https://santifer.io/n8n-for-pms' },
      ],
    },
    // FAQPage — targets People Also Ask
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How can product managers use n8n to automate sprint reports?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Product managers can set up an n8n workflow with 4 nodes: a Schedule Trigger (every Friday at 9am), an Airtable node to read sprint data filtered by status, a Code node to group tasks by assignee and format as Slack markdown, and a Slack node to post the report. The entire workflow runs automatically — zero manual effort after setup.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you classify customer feedback with AI in n8n?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use an n8n Form Trigger to collect feedback, connect it to a Basic LLM Chain node with a classification prompt that categorizes input as BUG, FEATURE, or QUESTION. A Switch node routes each category to the appropriate Slack channel, and an Airtable node logs everything. The prompt includes signal words per category, a tiebreaker rule (bugs > features > questions), and strict single-word output for reliable routing.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the automation pattern for product managers in n8n?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The universal pattern is: TRIGGER (when) → READ (get data) → PROCESS (transform or classify) → ACT (notify or log). This pattern works for sprint reports, feedback classification, support ticket prioritization, sales lead routing, NPS response classification, and form processing. The structure stays the same — only the prompt and data source change.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is n8n free for product managers to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, n8n offers a free cloud tier that is sufficient for product managers to build and run automation workflows. You can import ready-made workflow templates (JSON files) directly into your n8n instance and connect your own Slack, Airtable, and AI credentials.',
          },
        },
      ],
    },
    // HowTo — for workflow import steps
    {
      '@type': 'HowTo',
      name: 'How to Import n8n Workflow Templates',
      description: 'Import ready-made n8n workflow templates for sprint report automation and AI feedback classification.',
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Sign up for n8n', text: 'Create a free account at n8n.io Cloud.' },
        { '@type': 'HowToStep', position: 2, name: 'Download the workflow JSON', text: 'Download the workflow template JSON file from this page.' },
        { '@type': 'HowToStep', position: 3, name: 'Import into n8n', text: 'In n8n, click the + button, select "Import from File", and choose the downloaded JSON file.' },
        { '@type': 'HowToStep', position: 4, name: 'Connect your credentials', text: 'Connect your own Slack, Airtable, and AI (Anthropic/OpenAI) credentials to the imported workflow nodes.' },
      ],
      tool: [
        { '@type': 'HowToTool', name: 'n8n Cloud (free tier)' },
        { '@type': 'HowToTool', name: 'Slack workspace' },
        { '@type': 'HowToTool', name: 'Airtable account' },
      ],
    },
  ],
}

const CLASSIFICATION_PROMPT = `You are a product feedback classifier for a SaaS company.

Your task: classify the feedback below into exactly ONE category.

Categories:
- BUG — The user reports something broken, crashing, erroring, or not
  working as expected. Look for words like: crash, error, broken, fail,
  wrong, doesn't work, can't.
- FEATURE — The user requests new functionality or an improvement to
  existing features. Look for words like: add, would be nice, wish,
  could you, suggestion, improve.
- QUESTION — The user asks how to do something or needs help
  understanding the product. Look for words like: how do I, where is,
  can I, is it possible, help.

Rules:
- If the feedback contains BOTH a bug and a feature request, classify
  as BUG (broken things take priority).
- If unclear, classify as QUESTION (safest default — a human will review).
- Respond with ONLY the category name in caps. No explanation, no punctuation.

Feedback: {{ $json.Feedback }}`

function CopyButton({ text }: { text: string }) {
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
      {copied ? 'Copied!' : 'Copy prompt'}
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

export default function N8nForPMs() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  // Meta tags
  useEffect(() => {
    document.title = 'n8n for Product Managers: Automate Sprint Reports & Classify Feedback with AI'

    const desc = 'Practical cheat sheet for Product Managers: automate sprint reports and classify feedback with AI using n8n. 2 importable workflow templates, a ready-to-use prompt, and step-by-step guide.'
    const metaTags: Record<string, string> = {
      description: desc,
      author: 'Santiago Fernández de Valderrama',
      robots: 'index, follow',
    }
    const ogTags: Record<string, string> = {
      'og:type': 'article',
      'og:url': 'https://santifer.io/n8n-for-pms',
      'og:title': 'n8n for Product Managers: Automate Sprint Reports & Classify Feedback with AI',
      'og:description': desc,
      'og:image': 'https://santifer.io/workflows/n8n-ai-feedback-classification-workflow.webp',
      'og:site_name': 'santifer.io',
      'article:published_time': '2026-02-24',
      'article:author': 'https://www.linkedin.com/in/santifer',
      'article:tag': 'n8n,product manager,automation,AI,workflow,no-code',
    }
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': 'n8n for Product Managers: Automate Sprint Reports & Classify Feedback with AI',
      'twitter:description': desc,
      'twitter:image': 'https://santifer.io/workflows/n8n-ai-feedback-classification-workflow.webp',
    }

    // Set name-based meta
    Object.entries(metaTags).forEach(([name, content]) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.content = content
    })
    // Set property-based meta (OG)
    Object.entries(ogTags).forEach(([prop, content]) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el) }
      el.content = content
    })
    // Set twitter meta
    Object.entries(twitterTags).forEach(([name, content]) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.content = content
    })

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = 'https://santifer.io/n8n-for-pms'

    // JSON-LD
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(script)

    return () => { script.remove() }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            santifer.io
          </Link>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-foreground font-medium">n8n for PMs</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="text-primary font-medium text-sm mb-3 tracking-wide uppercase">Lightning Session — AI Product Academy</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            n8n for Product Managers
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            Practical cheat sheet: automate your sprint reports and classify feedback with AI — no code required.
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
                <span>Feb 24, 2026</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{READING_TIME}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="prose-custom">

          {/* Intro narrative */}
          <p className="text-lg text-foreground leading-relaxed mb-4">
            How many hours a week do you spend on work that has nothing to do with product?
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            I tracked mine. It was twenty. Some weeks, thirty. Sprint reports that take a full day. Feedback scattered across five tools that I had to read, classify, and turn into tickets one by one. Status updates typed from scratch every Monday.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            I wasn't a product manager. <strong className="text-foreground">I was a very expensive data router.</strong> Moving information between tools that should have been talking to each other. I spent 170 hours a month on this at my own company before I automated all of it. Today I'll show you how to do the same with two workflows you can build in an afternoon.
          </p>

          {/* Time Sinks Table */}
          <AnchorHeading id="time-sinks">The 5 PM Time Sinks (20-30 hours/week)</AnchorHeading>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-3 text-muted-foreground font-medium text-sm">#</th>
                  <th className="py-3 px-3 text-muted-foreground font-medium text-sm">Time Sink</th>
                  <th className="py-3 px-3 text-muted-foreground font-medium text-sm">Hours/Week</th>
                  <th className="py-3 px-3 text-muted-foreground font-medium text-sm hidden sm:table-cell">Automation Pattern</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1', 'Sprint reports', '8-12/sprint', 'Schedule \u2192 Query \u2192 Format \u2192 Send'],
                  ['2', 'Classifying feedback', '5-10', 'Trigger \u2192 AI Classify \u2192 Route'],
                  ['3', 'Moving data between tools', '3-5', 'Trigger \u2192 Extract \u2192 Create \u2192 Notify'],
                  ['4', 'Keeping team in sync', '2-4', 'Schedule \u2192 Aggregate \u2192 Summarize \u2192 Post'],
                  ['5', 'Preparing for decisions', '1-2/meeting', 'Schedule \u2192 Multi-query \u2192 Compile \u2192 Send'],
                ].map(([num, sink, hours, pattern]) => (
                  <tr key={num} className="border-b border-border/50">
                    <td className="py-3 px-3 text-primary font-bold">{num}</td>
                    <td className="py-3 px-3 font-medium">{sink}</td>
                    <td className="py-3 px-3 text-muted-foreground">{hours}</td>
                    <td className="py-3 px-3 text-muted-foreground text-sm hidden sm:table-cell font-mono">{pattern}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Workflow 1 */}
          <AnchorHeading id="workflow-1">Workflow 1: The Automatable Friday</AnchorHeading>
          <p className="text-muted-foreground mb-4 leading-relaxed">Automated sprint report that posts to Slack every Friday at 9am.</p>

          <div className="bg-muted/30 rounded-lg p-4 mb-6 font-mono text-sm overflow-x-auto">
            <span className="text-primary">Schedule</span> (Fri 9am) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">Airtable</span> (read sprint) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">Code</span> (format) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">Slack</span> (post)
          </div>

          <figure className="rounded-lg overflow-hidden border border-border mb-6">
            <img
              src="/workflows/n8n-sprint-report-automation-workflow.webp"
              alt="n8n automated sprint report workflow for product managers: Schedule Trigger every Friday → Read Sprint Data from Airtable → Format Report with Code node → Post to Slack channel"
              title="Workflow 1: Automated Sprint Report with n8n"
              className="w-full h-auto"
              width={1200}
              height={499}
              loading="lazy"
            />
            <figcaption className="text-xs text-muted-foreground text-center py-2 bg-muted/20">
              Workflow 1 in n8n: automated sprint report — Schedule → Airtable → Code → Slack
            </figcaption>
          </figure>

          <div className="bg-card border border-border rounded-lg p-5 mb-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">Key nodes:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Schedule Trigger:</span> Every week, Friday, 9:00 AM</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Airtable:</span> Filter by Sprint = Current, Status = Done</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Code node:</span> Group by assignee, count story points, format as Slack markdown</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Slack:</span> Post to #sprint-updates</li>
            </ul>
          </div>

          <blockquote className="border-l-4 border-primary/40 pl-4 py-1 text-foreground italic mb-6">
            Your sprint report arrives every Friday at 9:05am. You did nothing.
          </blockquote>

          <DownloadButton href="/workflows/workflow-1-automatable-friday.json" label="Download Workflow 1 JSON" />

          {/* Transition: dumb pipe → smart pipe */}
          <div className="my-12 py-8 border-y border-border/40 text-center">
            <p className="text-lg text-foreground font-medium mb-2">There's no AI in Workflow 1. It's pure plumbing.</p>
            <p className="text-muted-foreground">Four nodes that save you 4-6 hours every sprint. Now imagine what happens when we add intelligence.</p>
          </div>

          {/* Workflow 2 */}
          <AnchorHeading id="workflow-2">Workflow 2: The Intelligent Router</AnchorHeading>
          <p className="text-muted-foreground mb-4 leading-relaxed">AI-powered feedback classification that routes bugs, features, and questions to the right Slack channel. One AI node turns a dumb pipe into a smart pipe.</p>

          <div className="bg-muted/30 rounded-lg p-4 mb-6 font-mono text-sm overflow-x-auto">
            <span className="text-primary">Form Trigger</span> <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">AI Classify</span> (LLM) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">Switch</span> (Bug/Feature/Question) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">Slack</span> + <span className="text-primary">Airtable</span>
          </div>

          <figure className="rounded-lg overflow-hidden border border-border mb-6">
            <img
              src="/workflows/n8n-ai-feedback-classification-workflow.webp"
              alt="n8n AI feedback classification workflow for product managers: Form Trigger → AI Classifier with Claude → Switch node routes bugs, features, and questions to separate Slack channels → Log to Airtable"
              title="Workflow 2: AI-Powered Feedback Classification with n8n"
              className="w-full h-auto"
              width={1200}
              height={499}
              loading="lazy"
            />
            <figcaption className="text-xs text-muted-foreground text-center py-2 bg-muted/20">
              Workflow 2 in n8n: AI feedback classifier — Form → Claude AI → Switch → Slack + Airtable
            </figcaption>
          </figure>

          <div className="bg-card border border-border rounded-lg p-5 mb-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">Key nodes:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">n8n Form Trigger:</span> Name, Email, Feedback Text, Product Area</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Basic LLM Chain:</span> Classify feedback using AI</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Switch:</span> Route based on LLM output (BUG / FEATURE / QUESTION)</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Slack:</span> Different channel per category</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Airtable:</span> Log every classified feedback</li>
            </ul>
          </div>

          {/* Classification Prompt */}
          <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">The Classification Prompt</h3>
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <CopyButton text={CLASSIFICATION_PROMPT} />
            </div>
            <pre className="bg-muted/30 border border-border rounded-lg p-5 pt-12 sm:pt-5 overflow-x-auto text-sm leading-relaxed font-mono text-foreground whitespace-pre-wrap">
              {CLASSIFICATION_PROMPT}
            </pre>
          </div>

          <div className="bg-card border border-border rounded-lg p-5 mt-6 mb-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">Why this prompt works:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Role</span> sets context ("product feedback classifier")</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Signal words</span> per category guide the LLM's pattern matching</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Tiebreaker rule</span> handles ambiguous cases (bugs &gt; features &gt; questions)</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Safe default</span> ensures nothing gets lost</li>
              <li className="flex gap-2"><span className="text-primary font-medium shrink-0">Strict output</span> makes the Switch node reliable</li>
            </ul>
          </div>

          <blockquote className="border-l-4 border-primary/40 pl-4 py-1 text-foreground italic mb-6">
            One AI node turned a dumb pipe into a smart pipe.
          </blockquote>

          {/* The ambiguous test */}
          <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">The Ambiguous Test</h3>
          <div className="bg-card border border-border rounded-lg p-5 mb-4">
            <p className="text-muted-foreground italic">"It would be really nice if the export could handle more than 100 rows without crashing."</p>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Is this a feature request ("it would be nice") or a bug ("crashing")? The tiebreaker rule in the prompt handles it: <strong className="text-foreground">if feedback contains both a bug and a feature request, classify as BUG</strong> — broken things take priority.
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            If you disagree with that classification, you change one line of the prompt. Not a model retrain. Not a ticket to data science. One line of text. You wrote acceptance criteria, not code — and that's a product decision, not an engineering decision.
          </p>

          <DownloadButton href="/workflows/workflow-2-intelligent-router.json" label="Download Workflow 2 JSON" />

          {/* The Pattern */}
          <AnchorHeading id="the-pattern">The Pattern</AnchorHeading>
          <p className="text-muted-foreground mb-4 leading-relaxed">Both workflows follow the same structure:</p>

          <div className="bg-muted/30 rounded-lg p-4 mb-6 font-mono text-sm text-center">
            <span className="text-primary">TRIGGER</span> (when) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">READ</span> (get data) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">PROCESS</span> (transform/classify) <span className="text-muted-foreground">&rarr;</span>{' '}
            <span className="text-primary">ACT</span> (notify/log)
          </div>

          <p className="text-muted-foreground mb-3">This pattern works for:</p>
          <ul className="space-y-1.5 text-muted-foreground mb-6 ml-4">
            <li className="flex items-start gap-2"><span className="text-primary mt-1.5 text-xs">&#9679;</span>Prioritizing support tickets</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1.5 text-xs">&#9679;</span>Routing sales leads</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1.5 text-xs">&#9679;</span>Triaging customer complaints</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1.5 text-xs">&#9679;</span>Classifying NPS responses</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1.5 text-xs">&#9679;</span>Processing form submissions</li>
          </ul>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mb-6">
            <p className="text-foreground font-medium">The pipe stays the same. The prompt changes.</p>
          </div>

          {/* Get Started */}
          <AnchorHeading id="get-started">Get Started</AnchorHeading>
          <ol className="space-y-3 text-muted-foreground mb-8 ml-1">
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <span><a href="https://n8n.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">n8n Cloud (free tier)</a> — sign up and start building</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <span>Pick your most boring Friday task</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <span>Build one workflow this week</span>
            </li>
          </ol>

          <blockquote className="border-l-4 border-primary/40 pl-4 py-1 text-foreground italic mb-8">
            The first automation is the hardest. The second takes half the time.
          </blockquote>

          {/* Lessons Learned */}
          <AnchorHeading id="lessons">What I Learned Automating 170 Hours a Month</AnchorHeading>
          <div className="space-y-4 mb-8">
            <div className="flex gap-3">
              <span className="text-primary font-bold text-lg shrink-0">1.</span>
              <div>
                <p className="font-medium text-foreground">Automate the boring task first.</p>
                <p className="text-muted-foreground">The flashy use case is tempting. But sprint reports won me 12 hours back every two weeks — more than any clever integration I built.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold text-lg shrink-0">2.</span>
              <div>
                <p className="font-medium text-foreground">Your database is the brain.</p>
                <p className="text-muted-foreground">Don't build a separate "automation database." Jira, Airtable, and Sheets already contain 90% of the data your workflows need.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold text-lg shrink-0">3.</span>
              <div>
                <p className="font-medium text-foreground">Automate the trigger, not just the task.</p>
                <p className="text-muted-foreground">A workflow that runs "when I click a button" saves time. A workflow that runs "when a deal closes" saves time AND removes you from the loop entirely. The second kind is worth 10x more.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold text-lg shrink-0">4.</span>
              <div>
                <p className="font-medium text-foreground">Start with one.</p>
                <p className="text-muted-foreground">I tried to automate everything at once and ended up with 14 half-broken workflows and zero time savings. One workflow running reliably beats five in draft mode.</p>
              </div>
            </div>
          </div>

          {/* FAQ visible */}
          <AnchorHeading id="faq">Common Questions</AnchorHeading>
          <div className="space-y-4 mb-8">
            {[
              ['Can n8n connect to Jira / Salesforce / my tool?', 'Yes. Over 400 integrations — Jira, Salesforce, Notion, Linear, HubSpot, Zendesk, Google Sheets. If you use it, n8n probably connects to it.'],
              ['Is n8n free?', 'Free tier on cloud, or self-host for free. The free tier is enough for everything shown here.'],
              ['What LLM should I use for the classifier?', 'Whatever your company already pays for. The prompt works the same with Claude, GPT-4, or Gemini. The classification pattern doesn\'t change with the model.'],
              ['How is this different from Zapier or Make?', 'Open source, self-hostable, AI nodes built in, and a visual canvas that lets you see the branching logic. Zapier is great for simple triggers. n8n is for when you need branching, AI, loops, and full control.'],
              ['What if the AI classifies something wrong?', 'You change the prompt. Add a new signal word, adjust the tiebreaker rule, add a category. You iterate in plain English, not in code. And the Airtable log lets you review and correct.'],
            ].map(([q, a]) => (
              <details key={q} className="group bg-card border border-border rounded-lg">
                <summary className="px-5 py-4 cursor-pointer font-medium text-foreground flex items-center justify-between">
                  {q}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-5 pb-4 text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>

          {/* Import Workflows */}
          <AnchorHeading id="import">Import the Workflows</AnchorHeading>
          <p className="text-muted-foreground mb-5 leading-relaxed">
            Download the JSON files and import them directly into your n8n instance:
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <DownloadButton href="/workflows/workflow-1-automatable-friday.json" label="Workflow 1 — The Automatable Friday" />
            <DownloadButton href="/workflows/workflow-2-intelligent-router.json" label="Workflow 2 — The Intelligent Router" />
          </div>

          <div className="bg-card border border-border rounded-lg p-5 mb-6">
            <h3 className="font-display font-semibold text-foreground mb-2">How to import:</h3>
            <p className="text-muted-foreground">
              In n8n, click the <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm">+</code> button &rarr; "Import from File" &rarr; select the JSON.
              Then connect your own Slack, Airtable, and AI credentials.
            </p>
          </div>

          {/* Resources */}
          <AnchorHeading id="resources">Resources</AnchorHeading>
          <ul className="space-y-2 text-muted-foreground mb-8">
            <li className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
              <a href="https://docs.n8n.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">n8n Documentation</a>
            </li>
            <li className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
              <a href="https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.airtable/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Airtable node docs</a>
            </li>
            <li className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
              <a href="https://docs.n8n.io/integrations/builtin/cluster-nodes/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">AI nodes guide</a>
            </li>
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
              <p className="text-sm text-muted-foreground">AI Product Manager · Solutions Architect</p>
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
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Santiago Fernández de Valderrama. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}
