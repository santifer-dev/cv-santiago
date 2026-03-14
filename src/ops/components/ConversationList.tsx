import type { OpsTrace } from '../types'

interface ConversationListProps {
  traces: OpsTrace[]
  selected: string | null
  onSelect: (id: string) => void
  loading: boolean
}

function qualityColor(score: number): string {
  if (score >= 0.8) return 'bg-green-500/20 text-green-400'
  if (score >= 0.5) return 'bg-yellow-500/20 text-yellow-400'
  return 'bg-red-500/20 text-red-400'
}

function formatTime(ts: string): string {
  const d = new Date(ts)
  return d.toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function langEmoji(lang?: string): string {
  if (lang === 'es') return '\uD83C\uDDEA\uD83C\uDDF8'
  if (lang === 'en') return '\uD83C\uDDEC\uD83C\uDDE7'
  return '\uD83C\uDF10'
}

export default function ConversationList({ traces, selected, onSelect, loading }: ConversationListProps) {
  if (loading && traces.length === 0) {
    return (
      <div className="space-y-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 sm:h-16 bg-card border border-white/[0.06] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (traces.length === 0) {
    return <p className="text-muted-foreground text-sm py-8 text-center">No conversations found</p>
  }

  return (
    <div className="space-y-0.5 overflow-y-auto max-h-[calc(100vh-240px)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {traces.map(trace => {
        const quality = typeof trace.scores?.quality === 'number' ? trace.scores.quality : null
        const isVoice = trace.tags?.includes('voice')
        const cost = trace.metadata?.cost?.total

        return (
          <button
            key={trace.id}
            onClick={() => onSelect(trace.id)}
            className={`w-full text-left px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-colors ${
              selected === trace.id
                ? 'bg-primary/10 border border-primary/30'
                : 'hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <span className="text-[10px] sm:text-xs">{langEmoji(trace.metadata?.lang)}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">{isVoice ? '\uD83C\uDF99\uFE0F' : '\uD83D\uDCAC'}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground flex-1">{formatTime(trace.timestamp)}</span>
              {cost !== undefined && (
                <span className="text-[10px] sm:text-xs text-muted-foreground">${cost.toFixed(4)}</span>
              )}
              {quality !== null && (
                <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${qualityColor(quality)}`}>
                  {(quality * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-foreground truncate">
              {trace.metadata?.lastUserMessage ?? 'No message'}
            </p>
            {trace.tags && trace.tags.length > 0 && (
              <div className="flex gap-1 mt-0.5 sm:mt-1 flex-wrap">
                {trace.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
