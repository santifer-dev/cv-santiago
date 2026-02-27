import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Copy, Check, ExternalLink, Clock, ChevronRight } from 'lucide-react'

// ---------------------------------------------------------------------------
// Inline utilities
// ---------------------------------------------------------------------------

export function CopyButton({ text, copyLabel, copiedLabel }: { text: string; copyLabel: string; copiedLabel: string }) {
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

export function DownloadButton({ href, label }: { href: string; label: string }) {
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

export function AnchorHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="group font-display text-2xl md:text-3xl font-bold text-foreground mt-16 mb-6 scroll-mt-24">
      <a href={`#${id}`} className="hover:text-primary transition-colors">
        {children}
        <span className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">#</span>
      </a>
    </h2>
  )
}

// ---------------------------------------------------------------------------
// Layout shells
// ---------------------------------------------------------------------------

export function ArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

interface ArticleHeaderProps {
  kicker: string
  kickerLink?: string
  h1: string
  subtitle: string
  date: string
  readingTime: string
  authorName?: string
  authorUrl?: string
  avatarSrc?: string
}

export function ArticleHeader({
  kicker,
  kickerLink,
  h1,
  subtitle,
  date,
  readingTime,
  authorName = 'Santiago Fernández de Valderrama',
  authorUrl = 'https://linkedin.com/in/santifer',
  avatarSrc = '/foto-avatar-sm.webp',
}: ArticleHeaderProps) {
  return (
    <header className="mb-10">
      <p className="text-primary font-medium text-sm mb-3 tracking-wide uppercase">
        {kickerLink ? (
          kicker.split(/<a>|<\/a>/).map((part, i) =>
            i === 1 ? (
              <a key={i} href={kickerLink} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">{part}</a>
            ) : (
              <span key={i}>{part}</span>
            )
          )
        ) : kicker}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
        {h1}
      </h1>
      <p className="text-xl text-muted-foreground leading-relaxed mb-6">
        {subtitle}
      </p>
      <div className="flex items-center gap-3 pb-6 border-b border-border">
        <img
          src={avatarSrc}
          alt={authorName}
          className="w-10 h-10 rounded-full"
          width={40}
          height={40}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {authorName}
            </a>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{date}</span>
            <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{readingTime}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

interface ArticleFooterProps {
  role: string
  fellowAt?: string
  fellowLink?: string
  fellowUrl?: string
  copyright: string
}

export function ArticleFooter({ role, fellowAt, fellowLink, fellowUrl, copyright }: ArticleFooterProps) {
  return (
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
            {role}
            {fellowAt && (
              <>
                {' · '}{fellowAt}{' '}
                {fellowUrl ? (
                  <a
                    href={fellowUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-primary hover:underline"
                  >
                    {fellowLink}
                  </a>
                ) : fellowLink}
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex gap-3 mb-8">
        <a href="https://linkedin.com/in/santifer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-sm font-medium text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
        <a href="https://github.com/santifer-dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          GitHub
        </a>
      </div>
      <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Santiago Fernández de Valderrama. {copyright}</p>
    </footer>
  )
}

// ---------------------------------------------------------------------------
// FAQ Section
// ---------------------------------------------------------------------------

interface FaqItem {
  q: string
  a: string
}

export function FaqSection({ heading, items }: { heading: string; items: readonly FaqItem[] }) {
  return (
    <>
      <AnchorHeading id="faq">{heading}</AnchorHeading>
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <details key={item.q} className="group bg-card border border-border rounded-lg">
            <summary className="px-5 py-4 cursor-pointer font-medium text-foreground flex items-center justify-between">
              {item.q}
              <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
            </summary>
            <p className="px-5 pb-4 text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Resources List
// ---------------------------------------------------------------------------

interface ResourceItem {
  label: string
  url: string
}

export function ResourcesList({ heading, items }: { heading: string; items: readonly ResourceItem[] }) {
  return (
    <>
      <AnchorHeading id="resources">{heading}</AnchorHeading>
      <ul className="space-y-2 text-muted-foreground mb-8">
        {items.map((item) => (
          <li key={item.url} className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{item.label}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

// ---------------------------------------------------------------------------
// Lessons Section
// ---------------------------------------------------------------------------

interface LessonItem {
  title: string
  detail: string
}

export function LessonsSection({ heading, items }: { heading: string; items: readonly LessonItem[] }) {
  return (
    <>
      <AnchorHeading id="lessons">{heading}</AnchorHeading>
      <div className="space-y-4 mb-8">
        {items.map((lesson, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-primary font-bold text-lg shrink-0">{i + 1}.</span>
            <div>
              <p className="font-medium text-foreground">{lesson.title}</p>
              <p className="text-muted-foreground">{lesson.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Metrics Grid (for case studies)
// ---------------------------------------------------------------------------

interface MetricCard {
  value: string
  label: string
  detail?: string
}

export function MetricsGrid({ items }: { items: readonly MetricCard[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {items.map((item) => (
        <div key={item.label} className="bg-card border border-border rounded-lg p-5 text-center">
          <p className="text-3xl font-bold text-primary mb-1">{item.value}</p>
          <p className="font-medium text-foreground text-sm">{item.label}</p>
          {item.detail && <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Case Study CTA
// ---------------------------------------------------------------------------

interface CaseStudyCtaProps {
  heading: string
  body: string
  ctaLabel: string
  ctaHref: string
  external?: boolean
}

export function CaseStudyCta({ heading, body, ctaLabel, ctaHref, external }: CaseStudyCtaProps) {
  return (
    <div className="my-10 relative rounded-2xl p-[1.5px] bg-gradient-theme">
      <div className="p-6 sm:p-8 rounded-[calc(1rem-1.5px)] bg-card">
        <p className="font-display font-semibold text-foreground text-lg mb-2">{heading}</p>
        <p className="text-muted-foreground leading-relaxed mb-4">{body}</p>
        {external ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            {ctaLabel}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Article Figure (reusable image with caption)
// ---------------------------------------------------------------------------

interface ArticleFigureProps {
  src: string
  alt: string
  title?: string
  caption: string
  width?: number
  height?: number
  priority?: boolean
}

export function ArticleFigure({ src, alt, title, caption, width = 1200, height = 675, priority = false }: ArticleFigureProps) {
  return (
    <figure className="rounded-lg overflow-hidden border border-border mb-6">
      <img
        src={src}
        alt={alt}
        title={title}
        className="w-full h-auto"
        width={width}
        height={height}
        loading={priority ? undefined : 'lazy'}
      />
      <figcaption className="text-xs text-muted-foreground text-center py-2 bg-muted/20">
        {caption}
      </figcaption>
    </figure>
  )
}
