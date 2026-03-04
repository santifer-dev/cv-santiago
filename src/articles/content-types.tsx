import { createContext, useContext, useState, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

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

export function EditorLabel({ name, children }: { name: string; children: ReactNode }) {
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
          borderTop: `1px dotted ${color}`,
          marginTop: '0.5em',
        }}
      />
      {/* Label badge in right margin */}
      <span
        className="absolute top-0 text-[10px] font-mono px-1.5 py-0.5 rounded pointer-events-none hidden xl:block opacity-50 hover:opacity-100 transition-opacity"
        style={{
          left: 'calc(100% + 2rem)',
          whiteSpace: 'nowrap',
          color,
          border: `1px dotted ${color}`,
        }}
      >
        {name}
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
    <EditorLabel name="H2">
      <h2 id={id} className={`group font-display text-2xl md:text-3xl font-bold text-foreground mt-16 mb-6 scroll-mt-24 ${className ?? ''}`}>
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
  const base = 'font-display text-xl font-bold text-foreground mt-10 mb-4 scroll-mt-24'
  const withIcon = icon ? 'flex items-center gap-2' : ''
  return (
    <EditorLabel name="H3">
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
  const base = 'font-display text-lg font-bold text-foreground mt-8 mb-3 scroll-mt-24'
  const withIcon = icon ? 'flex items-center gap-2' : ''
  return (
    <EditorLabel name="H4">
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
}

const proseVariants = {
  hook: 'text-lg text-foreground leading-relaxed mb-4',
  body: 'text-muted-foreground leading-relaxed mb-4',
} as const

export function Prose({ variant = 'body', className, children }: ProseProps) {
  return (
    <EditorLabel name={`Prose:${variant}`}>
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
}

export function Callout({ children, className }: CalloutProps) {
  return (
    <EditorLabel name="Callout">
      <div className={`bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 ${className ?? ''}`}>
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
}

export function InfoCard({ heading, children, className }: InfoCardProps) {
  return (
    <EditorLabel name="InfoCard">
      <div className={`bg-card border border-border rounded-lg p-5 mb-6 ${className ?? ''}`}>
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
}

export function CardStack({ items, className }: CardStackProps) {
  return (
    <EditorLabel name="CardStack">
      <div className={`space-y-3 mb-4 ${className ?? ''}`}>
        {items.map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
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
}

export function BulletList({ items, marker = 'bullet', variant = 'standalone', className }: BulletListProps) {
  const outer = variant === 'standalone' ? 'space-y-3 mb-4' : 'space-y-3'
  return (
    <EditorLabel name="BulletList">
      <div className={`${outer} ${className ?? ''}`}>
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <span className={`text-primary font-bold shrink-0 w-6 text-center mt-0.5 ${marker === 'number' ? 'text-lg' : 'text-xs'}`}>
              {marker === 'number' ? i + 1 : '●'}
            </span>
            {isStructured(item) ? (
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-muted-foreground">{item.detail}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">{item}</p>
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

export function StepList({ items, className }: Omit<BulletListProps, 'marker' | 'variant'>) {
  const outer = `space-y-3 mb-4 ${className ?? ''}`
  return (
    <EditorLabel name="StepList">
      <div className={outer}>
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-primary font-bold shrink-0 w-6 text-center mt-0.5 text-lg">
              {i + 1}
            </span>
            {isStructured(item) ? (
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-muted-foreground">{item.detail}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">{item}</p>
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
  columns?: 2 | 3 | 4 | 5
  gap?: string
  className?: string
  renderItem: (item: T, index: number) => ReactNode
}

const colsMap = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
} as const

export function CardGrid<T>({ items, columns = 2, gap = 'gap-3', className, renderItem }: CardGridProps<T>) {
  return (
    <EditorLabel name="CardGrid">
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
  className?: string
}

export function StackGrid({ items, columns = 4, className }: StackGridProps) {
  return (
    <EditorLabel name="StackGrid">
      <div className={`grid grid-cols-2 ${colsMap[columns]} gap-3 mb-8 ${className ?? ''}`}>
        {items.map(s => (
          <div key={s.name} className="bg-card border border-border rounded-lg p-5 flex flex-col items-center text-center">
            <div className="mb-3">{s.icon}</div>
            <p className="font-medium text-foreground text-sm mb-1">{s.name}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
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
  className?: string
}

export function Photo1({ src, alt, loading = 'lazy', className }: Photo1Props) {
  return (
    <EditorLabel name="Photo1">
      <figure className={`rounded-lg overflow-hidden border border-border mb-6 ${className ?? ''}`}>
        <img src={src} alt={alt} className="w-full h-auto" loading={loading} />
      </figure>
    </EditorLabel>
  )
}

interface Photo2Props {
  items: readonly [PhotoItem, PhotoItem]
  className?: string
}

export function Photo2({ items, className }: Photo2Props) {
  return (
    <EditorLabel name="Photo2">
      <div className={`grid grid-cols-2 gap-3 mb-6 ${className ?? ''}`}>
        {items.map(item => (
          <figure key={item.src} className="rounded-lg overflow-hidden border border-border">
            <img src={item.src} alt={item.alt} className="w-full h-auto" loading={item.loading ?? 'lazy'} />
          </figure>
        ))}
      </div>
    </EditorLabel>
  )
}

interface Photo3Props {
  items: readonly [PhotoItem, PhotoItem, PhotoItem]
  className?: string
}

export function Photo3({ items, className }: Photo3Props) {
  return (
    <EditorLabel name="Photo3">
      <div className={`grid grid-cols-3 gap-3 mb-6 ${className ?? ''}`}>
        {items.map(item => (
          <figure key={item.src} className="rounded-lg overflow-hidden border border-border">
            <img src={item.src} alt={item.alt} className="w-full h-auto" loading={item.loading ?? 'lazy'} />
          </figure>
        ))}
      </div>
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
  className?: string
}

export function CodeBlock({ children, segments, className }: CodeBlockProps) {
  if (segments) {
    return (
      <EditorLabel name="CodeBlock">
        <div className={`bg-muted/30 border border-border rounded-lg overflow-hidden mb-6 ${className ?? ''}`}>
          {segments.map((seg, i) => (
            <div key={i}>
              <pre className="px-4 py-3 text-xs whitespace-pre-wrap font-mono text-foreground overflow-x-auto">
                {seg.code}
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
  return (
    <EditorLabel name="CodeBlock">
      <pre className={`bg-muted/30 border border-border rounded-lg p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono text-foreground mb-6 ${className ?? ''}`}>
        {children}
      </pre>
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
}

function isRichItem(item: AccordionSimpleItem | AccordionRichItem): item is AccordionRichItem {
  return 'details' in item
}

export function Accordion({ items, variant = 'simple', className }: AccordionProps) {
  return (
    <EditorLabel name="Accordion">
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
}

export function DataTable({ headers, rows, highlightColumn, className }: DataTableProps) {
  return (
    <EditorLabel name="DataTable">
      <div className={`overflow-x-auto mb-6 ${className ?? ''}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {headers.map((h, i) => (
                <th key={i} className="py-2.5 pr-4 text-left font-medium text-foreground text-xs last:pr-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`py-3 pr-4 text-xs last:pr-0 ${
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
}

interface TimelineProps {
  items: readonly TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <EditorLabel name="Timeline">
      <div className={`space-y-0 mb-6 border-l-2 border-primary/20 ml-2 pl-6 ${className ?? ''}`}>
        {items.map((step, i) => (
          <div key={i} className="relative pb-6 last:pb-0">
            <div className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
            <p className="text-xs text-primary font-medium mb-0.5">{step.year}</p>
            <p className="font-medium text-foreground text-sm mb-1">{step.event}</p>
            <p className="text-sm text-muted-foreground">{step.detail}</p>
          </div>
        ))}
      </div>
    </EditorLabel>
  )
}


// ---------------------------------------------------------------------------
// 17. ScreenshotGrid + ScreenshotCaption (moved from JacoboAgent)
// ---------------------------------------------------------------------------

function ScreenshotFigure({ src, alt, summaryEn, className }: { src: string; alt: string; summaryEn: string; className?: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <figure
      className={`bg-card border border-border rounded-lg overflow-hidden relative cursor-pointer ${className ?? ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(h => !h)}
    >
      <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
      <div
        className="absolute inset-0 flex items-center justify-center p-3 transition-opacity duration-200"
        style={{ backgroundColor: 'hsl(var(--background) / 0.92)', opacity: hovered ? 1 : 0, pointerEvents: hovered ? 'auto' : 'none' }}
      >
        <p className="text-xs text-foreground leading-relaxed text-center">{summaryEn}</p>
      </div>
    </figure>
  )
}

export interface ScreenshotItem {
  src: string
  altEs: string
  altEn: string
}

interface ScreenshotGridProps {
  items: ScreenshotItem[]
  lang: 'es' | 'en'
}

export function ScreenshotGrid({ items, lang }: ScreenshotGridProps) {
  if (items.length < 3) {
    return (
      <EditorLabel name="ScreenshotGrid">
        <div className="flex justify-center gap-3 mb-6">
          {items.map(n => (
            <ScreenshotFigure
              key={n.src}
              src={`/jacobo/screenshots/${n.src}`}
              alt={lang === 'es' ? n.altEs : n.altEn}
              summaryEn={n.altEn}
              className="w-1/2 sm:w-1/3"
            />
          ))}
        </div>
      </EditorLabel>
    )
  }
  return (
    <EditorLabel name="ScreenshotGrid">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {items.map(n => (
          <ScreenshotFigure
            key={n.src}
            src={`/jacobo/screenshots/${n.src}`}
            alt={lang === 'es' ? n.altEs : n.altEn}
            summaryEn={n.altEn}
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
}

export function ScreenshotCaption({ es, en, lang }: ScreenshotCaptionProps) {
  return (
    <EditorLabel name="ScreenshotCaption">
      <p className="text-xs text-muted-foreground mb-6 -mt-4 px-1">{lang === 'es' ? es : en}</p>
    </EditorLabel>
  )
}
