import { createContext, useContext, useState, useEffect, useCallback, useMemo, Fragment, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { ChevronRight, List, Copy, Check, ZoomIn } from 'lucide-react'

// ---------------------------------------------------------------------------
// Editor Mode
//   ?editor=true  → labels on each component
//   ?editor=full  → labels + colored dotted outlines for layout debugging
// ---------------------------------------------------------------------------

type EditorMode = false | 'true' | 'full'
const EditorModeContext = createContext<EditorMode>(false)

export function EditorModeProvider({ children }: { children: ReactNode }) {
  const raw =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('editor')
      : null
  const mode: EditorMode = raw === 'full' ? 'full' : raw === 'true' ? 'true' : false
  return <EditorModeContext.Provider value={mode}>{children}</EditorModeContext.Provider>
}

// Deterministic color per component name for outline debugging
const OUTLINE_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e',
] as const

function hashColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0
  return OUTLINE_COLORS[Math.abs(h) % OUTLINE_COLORS.length]
}

export function EditorLabel({ name, id, children }: { name: string; id?: string; children: ReactNode }) {
  const mode = useContext(EditorModeContext)
  if (!mode) return <>{children}</>

  const isFull = mode === 'full'
  const color = hashColor(name)

  // Both modes: label in right margin with dotted connector (xl+)
  // full mode adds: colored outline around the element
  return (
    <div
      className="relative"
      style={isFull ? { outline: `1px dotted ${color}`, outlineOffset: '2px' } : undefined}
    >
      {/* Dotted connector line from content to label */}
      <span
        className="absolute top-1 pointer-events-none hidden xl:block"
        style={{
          left: '100%',
          width: '2rem',
          borderTop: `1px dotted ${color}88`,
          marginTop: '0.5em',
        }}
      />
      {/* Label badge in right margin */}
      <span
        className="absolute top-0 text-[10px] font-mono px-1.5 py-0.5 rounded pointer-events-none hidden xl:block opacity-80 hover:opacity-100 transition-opacity"
        style={{
          left: 'calc(100% + 2rem)',
          whiteSpace: 'nowrap',
          color,
          backgroundColor: `${color}18`,
          border: `1px solid ${color}66`,
        }}
      >
        {name}{id && <span style={{ opacity: 0.7 }}> #{id}</span>}
      </span>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 0. H2
// ---------------------------------------------------------------------------

export function H2({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <EditorLabel name="H2" id={id}>
      <h2 id={id} className={`group font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground mt-16 mb-6 scroll-mt-24 ${className ?? ''}`}>
        <a href={`#${id}`} className="hover:text-primary transition-colors">
          {children}
          <span className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">#</span>
        </a>
      </h2>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 1. H3
// ---------------------------------------------------------------------------

interface HeadingProps {
  id?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function H3({ id, icon, children, className }: HeadingProps) {
  const base = 'font-display text-2xl font-semibold text-foreground mt-10 mb-4 scroll-mt-24'
  const withIcon = icon ? 'flex items-center gap-2' : ''
  return (
    <EditorLabel name="H3" id={id}>
      <h3 id={id} className={`${base} ${withIcon} ${className ?? ''}`}>
        {icon}{children}
      </h3>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 2. H4
// ---------------------------------------------------------------------------

export function H4({ id, icon, children, className }: HeadingProps) {
  const base = 'font-display text-xl font-medium text-foreground mt-8 mb-3 scroll-mt-24'
  const withIcon = icon ? 'flex items-center gap-2' : ''
  return (
    <EditorLabel name="H4" id={id}>
      <h4 id={id} className={`${base} ${withIcon} ${className ?? ''}`}>
        {icon}{children}
      </h4>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 3. Prose
// ---------------------------------------------------------------------------

interface ProseProps {
  variant?: 'hook' | 'body'
  className?: string
  children: ReactNode
  editorId?: string
}

const proseVariants = {
  hook: 'text-lg text-foreground leading-relaxed mb-4',
  body: 'text-base md:text-lg text-muted-foreground leading-relaxed mb-5',
} as const

export function Prose({ variant = 'body', className, children, editorId }: ProseProps) {
  return (
    <EditorLabel name={`Prose:${variant}`} id={editorId}>
      <p className={`${proseVariants[variant]} ${className ?? ''}`}>{children}</p>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 4. LabeledText
// ---------------------------------------------------------------------------

interface LabeledTextProps {
  label: ReactNode
  children: ReactNode
  className?: string
}

export function LabeledText({ label, children, className }: LabeledTextProps) {
  return (
    <EditorLabel name="LabeledText">
      <div className={className}>
        <p className="font-medium text-foreground text-sm mb-1">{label}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{children}</p>
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 5. Callout
// ---------------------------------------------------------------------------

interface CalloutProps {
  children: ReactNode
  className?: string
  editorId?: string
}

export function Callout({ children, className, editorId }: CalloutProps) {
  return (
    <EditorLabel name="Callout" id={editorId}>
      <div className={`bg-primary/5 border-l-4 border-primary/40 rounded-r-lg pl-5 pr-4 py-4 mb-6 ${className ?? ''}`}>
        <p className="text-base text-foreground font-medium leading-relaxed">{children}</p>
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 6. InfoCard
// ---------------------------------------------------------------------------

interface InfoCardProps {
  heading?: ReactNode
  children: ReactNode
  className?: string
  editorId?: string
}

export function InfoCard({ heading, children, className, editorId }: InfoCardProps) {
  return (
    <EditorLabel name="InfoCard" id={editorId}>
      <div className={`bg-card border border-border rounded-lg p-5 mb-6 hover:border-primary/20 transition-colors ${className ?? ''}`}>
        {heading && <p className="font-medium text-foreground mb-2">{heading}</p>}
        {children}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 7. CardStack
// ---------------------------------------------------------------------------

interface CardStackItem {
  title: ReactNode
  detail: ReactNode
}

interface CardStackProps {
  items: readonly CardStackItem[]
  className?: string
  editorId?: string
}

export function CardStack({ items, className, editorId }: CardStackProps) {
  return (
    <EditorLabel name="CardStack" id={editorId}>
      <div className={`space-y-3 mb-4 ${className ?? ''}`}>
        {items.map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 hover:border-primary/20 transition-colors">
            <p className="font-medium text-foreground text-sm mb-1">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 8. BulletList (unified — accepts simple items or label+detail pairs)
// ---------------------------------------------------------------------------

interface BulletItemStructured {
  label: ReactNode
  detail: ReactNode
}

type BulletItem = ReactNode | BulletItemStructured

function isStructured(item: BulletItem): item is BulletItemStructured {
  return typeof item === 'object' && item !== null && !('$$typeof' in (item as unknown as Record<string, unknown>)) && 'label' in (item as unknown as Record<string, unknown>)
}

interface BulletListProps {
  items: readonly BulletItem[]
  marker?: 'number' | 'bullet'
  variant?: 'standalone' | 'in-card'
  className?: string
  editorId?: string
}

export function BulletList({ items, marker = 'bullet', variant = 'standalone', className, editorId }: BulletListProps) {
  const outer = variant === 'standalone' ? 'space-y-3 mb-4' : 'space-y-3'
  return (
    <EditorLabel name="BulletList" id={editorId}>
      <div className={`${outer} ${className ?? ''}`}>
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <span className={`text-primary font-bold shrink-0 w-6 text-center mt-0.5 ${marker === 'number' ? 'text-lg' : 'text-xs'}`}>
              {marker === 'number' ? i + 1 : '●'}
            </span>
            {isStructured(item) ? (
              <div>
                <p className="font-medium text-foreground text-base">{item.label}</p>
                <p className="text-base text-muted-foreground">{item.detail}</p>
              </div>
            ) : (
              <p className="text-base text-muted-foreground">{item}</p>
            )}
          </div>
        ))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 9. StepList (numbered BulletList)
// ---------------------------------------------------------------------------

export function StepList({ items, className, editorId }: Omit<BulletListProps, 'marker' | 'variant'>) {
  const outer = `space-y-3 mb-6 ${className ?? ''}`
  return (
    <EditorLabel name="StepList" id={editorId}>
      <div className={outer}>
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-primary font-bold shrink-0 w-6 text-center text-lg leading-snug">
              {i + 1}
            </span>
            {isStructured(item) ? (
              <div>
                <p className="font-medium text-foreground text-base leading-snug">{item.label}</p>
                <p className="text-base text-muted-foreground">{item.detail}</p>
              </div>
            ) : (
              <p className="text-base text-muted-foreground">{item}</p>
            )}
          </div>
        ))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 10. CardGrid
// ---------------------------------------------------------------------------

interface CardGridProps<T> {
  items: readonly T[]
  columns?: 1 | 2 | 3 | 4 | 5
  gap?: string
  className?: string
  editorId?: string
  renderItem: (item: T, index: number) => ReactNode
}

const colsMap = {
  1: 'grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
} as const

export function CardGrid<T>({ items, columns = 2, gap = 'gap-3', className, editorId, renderItem }: CardGridProps<T>) {
  return (
    <EditorLabel name="CardGrid" id={editorId}>
      <div className={`grid ${colsMap[columns]} ${gap} ${className ?? ''}`}>
        {items.map((item, i) => renderItem(item, i))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 10b. StackGrid — icon + name + description cards
// ---------------------------------------------------------------------------

interface StackItem {
  icon: ReactNode
  name: string
  desc: ReactNode
}

interface StackGridProps {
  items: readonly StackItem[]
  columns?: 2 | 3 | 4
  align?: 'center' | 'left'
  className?: string
  editorId?: string
}

export function StackGrid({ items, columns = 4, align = 'center', className, editorId }: StackGridProps) {
  const isLeft = align === 'left'
  return (
    <EditorLabel name="StackGrid" id={editorId}>
      <div className={`grid grid-cols-2 ${colsMap[columns]} gap-3 mb-8 ${className ?? ''}`}>
        {items.map(s => (
          <div key={s.name} className={`bg-card border border-border rounded-lg p-5 ${isLeft ? 'flex items-start gap-3' : 'flex flex-col items-center text-center'}`}>
            <div className={isLeft ? 'shrink-0 mt-0.5' : 'mb-3'}>{s.icon}</div>
            <div>
              <p className="font-medium text-foreground text-sm mb-1">{s.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 11. Photo1 / Photo2 / Photo3 — image layouts by column count
// ---------------------------------------------------------------------------

interface PhotoItem {
  src: string
  alt: string
  loading?: 'lazy' | 'eager'
}

interface Photo1Props extends PhotoItem {
  caption?: string
  className?: string
  editorId?: string
}

export function Photo1({ src, alt, caption, loading = 'lazy', className, editorId }: Photo1Props) {
  return (
    <EditorLabel name="Photo1" id={editorId}>
      <figure className={`rounded-lg overflow-hidden border border-border shadow-lg mb-6 ${className ?? ''}`}>
        <img src={src} alt={alt} className="w-full h-auto min-h-[200px] object-contain bg-card" loading={loading} decoding="async" />
        {caption && <figcaption className="px-4 py-2 text-sm text-muted-foreground text-center bg-card">{caption}</figcaption>}
      </figure>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 11a. DiagramZoom — thumbnail + HD lightbox on click
// ---------------------------------------------------------------------------

interface DiagramZoomProps {
  src: string
  hdSrc: string
  alt: string
  caption?: string
  loading?: 'lazy' | 'eager'
  className?: string
  editorId?: string
}

export function DiagramZoom({ src, hdSrc, alt, caption, loading = 'lazy', className, editorId }: DiagramZoomProps) {
  const [lightbox, setLightbox] = useState(false)

  return (
    <EditorLabel name="DiagramZoom" id={editorId}>
      <figure
        className={`relative rounded-lg overflow-hidden border border-border shadow-lg mb-6 group cursor-zoom-in ${className ?? ''}`}
        onClick={() => setLightbox(true)}
      >
        <img src={src} alt={alt} className="w-full h-auto min-h-[200px] object-contain bg-card" loading={loading} decoding="async" />
        <span className="absolute top-3 right-3 p-1.5 rounded-md bg-black/40 text-white/50 group-hover:text-white/90 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </span>
        {caption && <figcaption className="px-4 py-2 text-sm text-muted-foreground text-center bg-card">{caption}</figcaption>}
      </figure>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out p-4"
          onClick={() => setLightbox(false)}
        >
          <img src={hdSrc} alt={alt} className="max-w-full max-h-full rounded-lg shadow-2xl" />
        </div>
      )}
    </EditorLabel>
  )
}

interface Photo2Props {
  items: readonly [PhotoItem, PhotoItem]
  caption?: string
  className?: string
  editorId?: string
}

export function Photo2({ items, caption, className, editorId }: Photo2Props) {
  return (
    <EditorLabel name="Photo2" id={editorId}>
      <figure className={`rounded-lg overflow-hidden border border-border shadow-lg mb-6 ${className ?? ''}`}>
        <div className="grid grid-cols-2 gap-0">
          {items.map(item => (
            <div key={item.src} className="overflow-hidden">
              <img src={item.src} alt={item.alt} className="w-full h-auto min-h-[200px] object-contain bg-card" loading={item.loading ?? 'lazy'} decoding="async" />
            </div>
          ))}
        </div>
        {caption && <figcaption className="px-4 py-2 text-sm text-muted-foreground text-center bg-card">{caption}</figcaption>}
      </figure>
    </EditorLabel>
  )
}

interface Photo3Props {
  items: readonly [PhotoItem, PhotoItem, PhotoItem]
  className?: string
  editorId?: string
}

export function Photo3({ items, className, editorId }: Photo3Props) {
  return (
    <EditorLabel name="Photo3" id={editorId}>
      <div className={`grid grid-cols-3 gap-3 mb-6 ${className ?? ''}`}>
        {items.map(item => (
          <figure key={item.src} className="rounded-lg overflow-hidden border border-border shadow-md">
            <img src={item.src} alt={item.alt} className="w-full h-auto" loading={item.loading ?? 'lazy'} decoding="async" />
          </figure>
        ))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 11b. ToolList — code name + description pairs
// ---------------------------------------------------------------------------

interface ToolListItem {
  name: string
  desc: ReactNode
}

interface ToolListProps {
  items: readonly ToolListItem[]
  className?: string
  editorId?: string
}

export function ToolList({ items, className, editorId }: ToolListProps) {
  return (
    <EditorLabel name="ToolList" id={editorId}>
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 ${className ?? ''}`}>
        {items.map(tool => (
          <div key={tool.name} className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
            <code className="text-sm text-primary font-mono font-semibold">{tool.name}</code>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{tool.desc}</p>
          </div>
        ))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 11c. ConditionList — condition → action pairs
// ---------------------------------------------------------------------------

interface ConditionItem {
  condition: ReactNode
  action: ReactNode
}

interface ConditionListProps {
  items: readonly ConditionItem[]
  className?: string
  editorId?: string
}

export function ConditionList({ items, className, editorId }: ConditionListProps) {
  return (
    <EditorLabel name="ConditionList" id={editorId}>
      <div className={`space-y-3 mb-6 ${className ?? ''}`}>
        {items.map((f, i) => (
          <div key={i} className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
            <span className="text-sm font-semibold text-primary">{f.condition}</span>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.action}</p>
          </div>
        ))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 11d. NodeLabel — monospace workflow node count
// ---------------------------------------------------------------------------

export function NodeLabel({ children, className, editorId }: { children: ReactNode; className?: string; editorId?: string }) {
  return (
    <EditorLabel name="NodeLabel" id={editorId}>
      <p className={`text-xs text-muted-foreground font-mono mb-3 ${className ?? ''}`}>{children}</p>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 12. CodeBlock (simple code or code + annotations)
// ---------------------------------------------------------------------------

interface CodeSegment {
  code: string
  annotations?: readonly { label: string; detail: string }[]
}

interface CodeBlockProps {
  children?: ReactNode
  segments?: readonly CodeSegment[]
  highlight?: 'code' | 'template'
  className?: string
  editorId?: string
}

// Token color classes via CSS variables (respect dark/light theme)
const CK = 'text-[hsl(var(--code-keyword))]'   // keywords: const, return, if
const CS = 'text-[hsl(var(--code-string))]'     // strings, "toolNames"
const CC = 'text-[hsl(var(--code-comment))]'    // comments, bullets, list numbers
const CN = 'text-[hsl(var(--code-number))]'     // numbers, booleans
const CH = 'text-[hsl(var(--code-heading))] font-semibold' // ## headers
const CV = 'text-[hsl(var(--code-var))]'        // {{vars}}, $('refs')

/** Tokenize a line into colored spans (full JS highlighting) */
function highlightLine(text: string, mode: 'code' | 'template' = 'code'): ReactNode[] {
  const parts: ReactNode[] = []
  const regex = mode === 'code'
    ? /(\/\/.*$|##\s.*$|\b(?:const|let|var|return|if|else|function|new|true|false|null|undefined)\b|'[^']*'|"[^"]*"|`[^`]*`|\{\{[^}]+\}\}|\$\('[^']+'\)[.\w]*|\b\d+\b)/gm
    : /(##\s.*$|\{\{[^}]+\}\}|\$\('[^']+'\)[.\w]*|\b\d+\b)/gm
  let last = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const val = match[0]
    let cls: string

    if (val.startsWith('##')) {
      cls = CH // heading
    } else if (val.startsWith('{{') || val.startsWith('$')) {
      cls = CV // template var
    } else if (/^\d+$/.test(val)) {
      cls = CN // number
    } else if (mode === 'code') {
      if (val.startsWith('//')) {
        cls = CC // comment
      } else if (/^(const|let|var|return|if|else|function|new)$/.test(val)) {
        cls = CK // keyword
      } else if (/^(true|false|null|undefined)$/.test(val)) {
        cls = CN // boolean/null
      } else if (val.startsWith("'") || val.startsWith('"') || val.startsWith('`')) {
        cls = CS // string
      } else {
        parts.push(val)
        last = match.index + val.length
        continue
      }
    } else {
      parts.push(val)
      last = match.index + val.length
      continue
    }

    parts.push(<span key={match.index} className={cls}>{val}</span>)
    last = match.index + val.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

/** Highlight code: handles both prompt syntax and JS */
function highlightCode(text: string, mode: 'code' | 'template' = 'code'): ReactNode[] {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    let node: ReactNode

    if (/^-\s/.test(line)) {
      node = <span><span className={CC}>- </span>{highlightLine(line.slice(2), mode)}</span>
    } else if (/^\s*\d+[\.\)]\s/.test(line)) {
      const m = line.match(/^(\s*\d+[\.\)]\s)(.*)/)!
      node = <span><span className={CC}>{m[1]}</span>{highlightLine(m[2], mode)}</span>
    } else {
      node = <span>{highlightLine(line, mode)}</span>
    }

    return <Fragment key={i}>{node}{i < lines.length - 1 ? '\n' : ''}</Fragment>
  })
}

function CodeCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-[hsl(var(--codeblock-text)/0.1)] hover:bg-[hsl(var(--codeblock-text)/0.2)] text-[hsl(var(--codeblock-text)/0.5)] hover:text-[hsl(var(--codeblock-text)/0.8)] transition-colors"
      title="Copy code"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

export function CodeBlock({ children, segments, highlight = 'code', className, editorId }: CodeBlockProps) {
  if (segments) {
    const fullCode = segments.map(s => s.code).join('\n\n')
    return (
      <EditorLabel name="CodeBlock" id={editorId}>
        <div className={`relative bg-[hsl(var(--codeblock))] border border-border rounded-lg overflow-hidden mb-6 ${className ?? ''}`}>
          <CodeCopyButton text={fullCode} />
          {segments.map((seg, i) => (
            <div key={i}>
              <pre className="p-5 text-sm leading-[1.7] whitespace-pre-wrap font-mono text-[hsl(var(--codeblock-text))] overflow-x-auto">
                {highlightCode(seg.code, highlight)}
              </pre>
              {seg.annotations?.map((ann, j) => (
                <div key={j} className="mx-3 mb-3 bg-primary/5 border-l-2 border-primary/40 rounded-r-md px-3 py-2">
                  <p className="text-xs font-semibold text-primary mb-0.5">{ann.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ann.detail}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </EditorLabel>
    )
  }
  const text = typeof children === 'string' ? children : ''
  return (
    <EditorLabel name="CodeBlock" id={editorId}>
      <div className="relative">
        {text && <CodeCopyButton text={text} />}
        <pre className={`bg-[hsl(var(--codeblock))] border border-border rounded-lg p-5 text-sm leading-[1.7] overflow-x-auto whitespace-pre-wrap font-mono text-[hsl(var(--codeblock-text))] mb-6 ${className ?? ''}`}>
          {text ? highlightCode(text, highlight) : children}
        </pre>
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 13. Accordion
// ---------------------------------------------------------------------------

interface AccordionSimpleItem {
  title: ReactNode
  detail: ReactNode
}

interface AccordionRichItem {
  icon?: string
  name: ReactNode
  trigger?: ReactNode
  summary?: ReactNode
  tags?: readonly string[]
  details: readonly ReactNode[]
}

interface AccordionProps {
  items: readonly AccordionSimpleItem[] | readonly AccordionRichItem[]
  variant?: 'simple' | 'rich'
  className?: string
  editorId?: string
}

function isRichItem(item: AccordionSimpleItem | AccordionRichItem): item is AccordionRichItem {
  return 'details' in item
}

export function Accordion({ items, variant = 'simple', className, editorId }: AccordionProps) {
  return (
    <EditorLabel name="Accordion" id={editorId}>
      <div className={`space-y-3 mb-8 ${className ?? ''}`}>
        {variant === 'simple'
          ? (items as readonly AccordionSimpleItem[]).map((item, i) => (
              <details key={i} className="group bg-card border border-border rounded-lg">
                <summary className="px-5 py-4 cursor-pointer font-medium text-foreground text-sm flex items-center justify-between">
                  {item.title}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-4 border-t border-border pt-3">
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </details>
            ))
          : (items as readonly AccordionRichItem[]).filter(isRichItem).map((flow, i) => (
              <details key={i} className="group bg-card border border-border rounded-lg">
                <summary className="px-5 py-4 cursor-pointer flex items-start gap-3">
                  {flow.icon && <span className="text-lg">{flow.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{flow.name}</p>
                    {flow.trigger && <p className="text-xs text-muted-foreground mt-0.5">{flow.trigger}</p>}
                    {flow.summary && <p className="text-xs text-muted-foreground mt-1">{flow.summary}</p>}
                    {flow.tags && flow.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {flow.tags.map(a => (
                          <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </summary>
                <div className="px-5 pb-5 border-t border-border pt-3">
                  <StepList items={flow.details} />
                </div>
              </details>
            ))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 14. DataTable
// ---------------------------------------------------------------------------

interface DataTableProps {
  headers: readonly string[]
  rows: readonly (readonly string[])[]
  highlightColumn?: number
  className?: string
  editorId?: string
}

export function DataTable({ headers, rows, highlightColumn, className, editorId }: DataTableProps) {
  return (
    <EditorLabel name="DataTable" id={editorId}>
      <div className={`overflow-x-auto mb-6 ${className ?? ''}`}>
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-border">
              {headers.map((h, i) => (
                <th key={i} className="py-2.5 pr-6 text-left font-semibold text-muted-foreground text-sm tracking-wider uppercase last:pr-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`py-4 pr-6 text-sm last:pr-0 ${
                      highlightColumn !== undefined && j === highlightColumn
                        ? 'text-primary'
                        : j === 0
                          ? 'text-muted-foreground font-medium'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 15. Timeline
// ---------------------------------------------------------------------------

interface TimelineItem {
  year: string
  event: string
  detail: string
  punchline?: string
}

interface TimelineProps {
  items: readonly TimelineItem[]
  variant?: 'dot' | 'pill'
  className?: string
  editorId?: string
}

function HighlightBraces({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\{|\}/)
  if (parts.length <= 1) return <p className={className}>{text}</p>
  return (
    <p className={className}>
      {parts.map((part, i) =>
        i === 1 ? <span key={i} className="underline decoration-primary/40 underline-offset-2">{part}</span> : part
      )}
    </p>
  )
}

export function Timeline({ items, variant = 'dot', className, editorId }: TimelineProps) {
  if (variant === 'pill') {
    return (
      <EditorLabel name="Timeline" id={editorId}>
        <div className={`relative mb-6 ${className ?? ''}`}>
          <div className="absolute left-[1.35rem] top-3 bottom-3 w-px bg-primary/20" aria-hidden="true" />
          <div className="space-y-6">
            {items.map((step, i) => (
              <div key={i} className="relative flex gap-4">
                <div className="flex flex-col items-center shrink-0 z-10">
                  <span className="inline-flex items-center justify-center w-11 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold font-display tracking-tight">{step.year}</span>
                </div>
                <div className="pt-0.5 min-w-0">
                  <p className="font-display font-semibold text-foreground leading-snug">{step.event}</p>
                  <p className="text-sm text-muted-foreground mt-1">{step.detail}</p>
                  {step.punchline && (
                    <HighlightBraces text={step.punchline} className="text-sm font-medium text-primary mt-2 italic" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </EditorLabel>
    )
  }

  return (
    <EditorLabel name="Timeline" id={editorId}>
      <div className={`space-y-0 mb-6 border-l-2 border-primary/20 ml-2 pl-6 ${className ?? ''}`}>
        {items.map((step, i) => (
          <div key={i} className="relative pb-6 last:pb-0">
            <div className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
            <p className="text-sm text-primary font-medium mb-0.5">{step.year}</p>
            <p className="font-semibold text-foreground text-base mb-1">{step.event}</p>
            <p className="text-base text-muted-foreground">{step.detail}</p>
            {step.punchline && (
              <HighlightBraces text={step.punchline} className="text-sm font-medium text-primary mt-2 italic" />
            )}
          </div>
        ))}
      </div>
    </EditorLabel>
  )
}


// ---------------------------------------------------------------------------
// 16. StoryBridge — cinematic reveal text for narrative transitions
// ---------------------------------------------------------------------------

interface StoryBridgeProps {
  lines: readonly string[]
  className?: string
  editorId?: string
}

export function StoryBridge({ lines, className, editorId }: StoryBridgeProps) {
  const mid = Math.floor(lines.length / 2)
  return (
    <EditorLabel name="StoryBridge" id={editorId}>
      <div className={`text-center py-8 mb-8 ${className ?? ''}`}>
        {[lines.slice(0, mid), lines.slice(mid)].map((block, bIdx) => (
          <motion.div
            key={bIdx}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2 * bIdx, ease: 'easeOut' }}
            className={`space-y-2 ${bIdx > 0 ? 'mt-6' : ''}`}
          >
            {block.map((line, idx) => {
              const parts = line.split(/\{|\}/)
              return (
                <p key={idx} className="font-display text-lg sm:text-xl text-foreground leading-snug">
                  {parts.length > 1
                    ? parts.map((part, i) =>
                        i === 1 ? <span key={i} className="text-primary font-semibold">{part}</span> : part
                      )
                    : line}
                </p>
              )
            })}
          </motion.div>
        ))}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 17. ScreenshotGrid + ScreenshotCaption (moved from JacoboAgent)
// ---------------------------------------------------------------------------

function ScreenshotFigure({ src, alt, summaryEn, lang, className }: { src: string; alt: string; summaryEn: string; lang: 'es' | 'en'; className?: string }) {
  const showOverlay = lang === 'en'
  const [hovered, setHovered] = useState(false)
  return (
    <figure
      className={`bg-card border border-border rounded-lg overflow-hidden relative ${showOverlay ? 'cursor-pointer' : ''} ${className ?? ''}`}
      onMouseEnter={showOverlay ? () => setHovered(true) : undefined}
      onMouseLeave={showOverlay ? () => setHovered(false) : undefined}
      onClick={showOverlay ? () => setHovered(h => !h) : undefined}
    >
      <img src={src} alt={alt} className="w-full h-auto min-h-[120px] object-contain bg-card dark:brightness-[0.85]" loading="lazy" decoding="async" />
      {showOverlay && (
        <div
          className="absolute inset-0 flex items-center justify-center p-3 transition-opacity duration-200"
          style={{ backgroundColor: 'hsl(var(--background) / 0.92)', opacity: hovered ? 1 : 0, pointerEvents: hovered ? 'auto' : 'none' }}
        >
          <p className="text-xs text-foreground leading-relaxed text-center">{summaryEn}</p>
        </div>
      )}
    </figure>
  )
}

export interface ScreenshotItem {
  src: string
  altEs: string
  altEn: string
}

interface ScreenshotGridProps {
  items: readonly ScreenshotItem[]
  lang: 'es' | 'en'
  basePath?: string
  editorId?: string
}

export function ScreenshotGrid({ items, lang, basePath = '/jacobo/screenshots', editorId }: ScreenshotGridProps) {
  if (items.length < 3) {
    return (
      <EditorLabel name="ScreenshotGrid" id={editorId}>
        <div className="flex justify-center gap-3 mb-6">
          {items.map(n => (
            <ScreenshotFigure
              key={n.src}
              src={`${basePath}/${n.src}`}
              alt={lang === 'es' ? n.altEs : n.altEn}
              summaryEn={n.altEn}
              lang={lang}
              className="w-1/2 sm:w-1/3"
            />
          ))}
        </div>
      </EditorLabel>
    )
  }
  return (
    <EditorLabel name="ScreenshotGrid" id={editorId}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {items.map(n => (
          <ScreenshotFigure
            key={n.src}
            src={`${basePath}/${n.src}`}
            alt={lang === 'es' ? n.altEs : n.altEn}
            summaryEn={n.altEn}
            lang={lang}
          />
        ))}
      </div>
    </EditorLabel>
  )
}

interface ScreenshotCaptionProps {
  es: string
  en: string
  lang: 'es' | 'en'
  editorId?: string
}

export function ScreenshotCaption({ es, en, lang, editorId }: ScreenshotCaptionProps) {
  return (
    <EditorLabel name="ScreenshotCaption" id={editorId}>
      <p className="text-xs text-muted-foreground mb-6 -mt-4 px-1">{lang === 'es' ? es : en}</p>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 18. DetailCard — icon + title + description + optional children
// ---------------------------------------------------------------------------

interface DetailCardProps {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
  editorId?: string
}

export function DetailCard({ icon, title, description, children, className, editorId }: DetailCardProps) {
  return (
    <EditorLabel name="DetailCard" id={editorId}>
      <div className={`bg-card border border-border rounded-lg p-5 hover:border-primary/20 transition-colors ${className ?? ''}`}>
        {icon && (
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <p className="font-display font-semibold text-foreground text-base">{title}</p>
          </div>
        )}
        {!icon && <p className="font-medium text-foreground text-base mb-1">{title}</p>}
        {description && <p className="text-base text-muted-foreground mb-3">{description}</p>}
        {children}
      </div>
    </EditorLabel>
  )
}

// ---------------------------------------------------------------------------
// 19. FloatingToc — auto-generated table of contents from DOM headings
// ---------------------------------------------------------------------------

interface TocItem { id: string; label: string; children?: TocItem[] }

function useAutoToc(): TocItem[] {
  const [sections, setSections] = useState<TocItem[]>([])

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('main h2[id], main h3[id]'),
    )
    const tree: TocItem[] = []
    let currentH2: TocItem | null = null

    for (const el of headings) {
      const id = el.id
      const clone = el.cloneNode(true) as HTMLElement
      clone.querySelectorAll('span').forEach(s => {
        if (s.textContent?.trim() === '#') s.remove()
      })
      const label = clone.textContent?.trim() ?? id
      if (el.tagName === 'H2') {
        currentH2 = { id, label, children: [] }
        tree.push(currentH2)
      } else if (el.tagName === 'H3' && currentH2) {
        currentH2.children!.push({ id, label })
      }
    }
    tree.forEach(s => { if (s.children?.length === 0) delete s.children })
    setSections(tree)
  }, [])

  return sections
}

export function FloatingToc() {
  const sections = useAutoToc()
  const [activeId, setActiveId] = useState('')
  const [tocOpen, setTocOpen] = useState(false)

  const allIds = useMemo(
    () => sections.flatMap(s => [s.id, ...(s.children?.map(c => c.id) ?? [])]),
    [sections],
  )
  const parentMap = useMemo(() => {
    const map = new Map<string, string>()
    sections.forEach(s => s.children?.forEach(c => map.set(c.id, s.id)))
    return map
  }, [sections])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    setTocOpen(false)
    requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: 'instant' })
    })
  }, [])

  useEffect(() => {
    const elements = allIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!elements.length) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [allIds])

  const activeParent = parentMap.get(activeId) ?? activeId

  if (sections.length === 0) return null

  const tocNav = (
    <nav aria-label="Table of contents">
      <ul className="space-y-0.5">
        {sections.map(section => {
          const isActive = activeParent === section.id
          const showChildren = isActive && section.children && section.children.length > 0
          return (
            <li key={section.id}>
              <button
                onClick={() => scrollTo(section.id)}
                className={`
                  text-left w-full px-2 py-1 rounded text-sm transition-colors
                  ${activeId === section.id ? 'text-primary font-medium bg-primary/10' : isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {section.label}
              </button>
              {showChildren && (
                <ul className="ml-3 mt-0.5 mb-1 border-l border-border pl-2 space-y-0.5">
                  {section.children!.map(child => (
                    <li key={child.id}>
                      <button
                        onClick={() => scrollTo(child.id)}
                        className={`
                          text-left w-full px-2 py-0.5 rounded text-sm transition-colors
                          ${activeId === child.id ? 'text-primary font-medium bg-primary/5' : 'text-muted-foreground hover:text-foreground'}
                        `}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <div className="hidden xl:block fixed top-24 left-[max(1rem,calc(50%-38rem))] w-52 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
        {tocNav}
      </div>

      {/* Mobile: floating button + drawer */}
      <button
        onClick={() => setTocOpen(o => !o)}
        className="xl:hidden fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        aria-label="Toggle table of contents"
      >
        <List className="w-5 h-5" />
      </button>
      {tocOpen && (
        <>
          <div className="xl:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={() => setTocOpen(false)} />
          <div className="xl:hidden fixed bottom-20 right-6 z-50 w-64 max-h-[70vh] overflow-y-auto bg-card border border-border rounded-xl shadow-xl p-4">
            {tocNav}
          </div>
        </>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// AudioPlayer — inline audio with transcript
// ---------------------------------------------------------------------------

interface AudioItem {
  src: string
  label: string
  transcript: string
  transcriptOriginal?: string
  highlight?: string
}

export function AudioPlayer({ editorId, items, lang }: { editorId?: string; items: AudioItem[]; lang?: string }) {
  return (
    <EditorLabel name="AudioPlayer" id={editorId}>
      <div className="space-y-4 mb-6">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.label}</span>
            </div>
            <audio controls preload="metadata" className="w-full h-10 mb-3" style={{ colorScheme: 'dark' }}>
              <source src={item.src} type="audio/mpeg" />
            </audio>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              {item.highlight
                ? formatHighlight(item.transcriptOriginal ?? item.transcript, lang === 'en' ? item.highlight : item.highlight)
                : (item.transcriptOriginal ?? item.transcript)}
            </p>
            {lang === 'en' && item.transcriptOriginal && (
              <p className="text-xs text-muted-foreground/70 leading-relaxed mt-1.5">
                {item.highlight
                  ? formatHighlight(item.transcript, item.highlight)
                  : item.transcript}
              </p>
            )}
          </div>
        ))}
      </div>
    </EditorLabel>
  )
}

function formatHighlight(text: string, highlight: string) {
  const idx = text.indexOf(highlight)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-semibold not-italic">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  )
}
