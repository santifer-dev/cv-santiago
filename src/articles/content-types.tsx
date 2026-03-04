import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { ChevronRight, List } from 'lucide-react'

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
  const outer = `space-y-3 mb-4 ${className ?? ''}`
  return (
    <EditorLabel name="StepList" id={editorId}>
      <div className={outer}>
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-primary font-bold shrink-0 w-6 text-center mt-0.5 text-lg">
              {i + 1}
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
  className?: string
  editorId?: string
}

export function StackGrid({ items, columns = 4, className, editorId }: StackGridProps) {
  return (
    <EditorLabel name="StackGrid" id={editorId}>
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
  caption?: string
  className?: string
  editorId?: string
}

export function Photo1({ src, alt, caption, loading = 'lazy', className, editorId }: Photo1Props) {
  return (
    <EditorLabel name="Photo1" id={editorId}>
      <figure className={`rounded-lg overflow-hidden border border-border shadow-lg mb-6 ${className ?? ''}`}>
        <img src={src} alt={alt} className="w-full h-auto" loading={loading} />
        {caption && <figcaption className="px-4 py-2 text-sm text-muted-foreground text-center bg-card">{caption}</figcaption>}
      </figure>
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
              <img src={item.src} alt={item.alt} className="w-full h-auto" loading={item.loading ?? 'lazy'} />
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
            <img src={item.src} alt={item.alt} className="w-full h-auto" loading={item.loading ?? 'lazy'} />
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
  className?: string
  editorId?: string
}

export function CodeBlock({ children, segments, className, editorId }: CodeBlockProps) {
  if (segments) {
    return (
      <EditorLabel name="CodeBlock" id={editorId}>
        <div className={`bg-[#0F172A] border border-white/10 rounded-lg overflow-hidden mb-6 ${className ?? ''}`}>
          {segments.map((seg, i) => (
            <div key={i}>
              <pre className="p-5 text-sm leading-[1.7] whitespace-pre-wrap font-mono text-foreground overflow-x-auto">
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
    <EditorLabel name="CodeBlock" id={editorId}>
      <pre className={`bg-[#0F172A] border border-white/10 rounded-lg p-5 text-sm leading-[1.7] overflow-x-auto whitespace-pre-wrap font-mono text-foreground mb-6 ${className ?? ''}`}>
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
}

interface TimelineProps {
  items: readonly TimelineItem[]
  className?: string
  editorId?: string
}

export function Timeline({ items, className, editorId }: TimelineProps) {
  return (
    <EditorLabel name="Timeline" id={editorId}>
      <div className={`space-y-0 mb-6 border-l-2 border-primary/20 ml-2 pl-6 ${className ?? ''}`}>
        {items.map((step, i) => (
          <div key={i} className="relative pb-6 last:pb-0">
            <div className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
            <p className="text-sm text-primary font-medium mb-0.5">{step.year}</p>
            <p className="font-semibold text-foreground text-base mb-1">{step.event}</p>
            <p className="text-base text-muted-foreground">{step.detail}</p>
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
      <img src={src} alt={alt} className="w-full h-auto brightness-[0.85]" loading="lazy" />
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
  editorId?: string
}

export function ScreenshotGrid({ items, lang, editorId }: ScreenshotGridProps) {
  if (items.length < 3) {
    return (
      <EditorLabel name="ScreenshotGrid" id={editorId}>
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
    <EditorLabel name="ScreenshotGrid" id={editorId}>
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
    setTocOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top, behavior: 'smooth' })
    }
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
