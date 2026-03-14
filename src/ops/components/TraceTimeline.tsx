import type { OpsObservation } from '../types'

interface TraceTimelineProps {
  observations: OpsObservation[]
}

const SPAN_COLORS: Record<string, string> = {
  tool_decision: 'hsl(var(--primary))',
  embedding: '#eab308',
  rerank: '#8b5cf6',
  generation: '#22c55e',
  voice: 'hsl(var(--accent))',
}

function getSpanColor(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z_]/g, '')
  return SPAN_COLORS[key] ?? '#6b7280'
}

export default function TraceTimeline({ observations }: TraceTimelineProps) {
  if (observations.length === 0) return null

  // Calculate time range
  const starts = observations.map(o => new Date(o.startTime).getTime())
  const ends = observations.map(o => o.endTime ? new Date(o.endTime).getTime() : new Date(o.startTime).getTime() + 100)
  const minTime = Math.min(...starts)
  const maxTime = Math.max(...ends)
  const totalMs = maxTime - minTime || 1

  return (
    <div className="space-y-1.5">
      {observations.map((obs, i) => {
        const start = new Date(obs.startTime).getTime()
        const end = obs.endTime ? new Date(obs.endTime).getTime() : start + 100
        const leftPct = ((start - minTime) / totalMs) * 100
        const widthPct = Math.max(((end - start) / totalMs) * 100, 2)
        const durationMs = end - start
        const color = getSpanColor(obs.name)

        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-24 truncate shrink-0">{obs.name}</span>
            <div className="flex-1 h-4 bg-white/5 rounded relative">
              <div
                className="absolute top-0 h-full rounded"
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  backgroundColor: color,
                  opacity: 0.7,
                }}
                title={`${obs.name}: ${Math.round(durationMs)}ms`}
              />
            </div>
            <span className="text-xs text-muted-foreground w-12 text-right shrink-0">
              {Math.round(durationMs)}ms
            </span>
          </div>
        )
      })}
      <div className="flex justify-between text-xs text-muted-foreground mt-1 px-26">
        <span>0ms</span>
        <span>{Math.round(totalMs)}ms</span>
      </div>
    </div>
  )
}
