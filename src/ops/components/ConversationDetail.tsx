import { useOpsApi } from '../hooks/useOpsApi'
import TraceTimeline from './TraceTimeline'
import type { OpsTraceDetail } from '../types'

interface ConversationDetailProps {
  traceId: string
}

export default function ConversationDetail({ traceId }: ConversationDetailProps) {
  const { data: trace, loading } = useOpsApi<OpsTraceDetail & { langfuseUrl?: string }>({
    endpoint: `trace/${traceId}`,
    cacheTtlMs: 60000,
  })

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
        <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
        <div className="h-32 bg-white/5 rounded animate-pulse" />
        <div className="h-24 bg-white/5 rounded animate-pulse" />
      </div>
    )
  }

  if (!trace) {
    return <p className="text-muted-foreground text-sm p-3 sm:p-4">Trace not found</p>
  }

  const messages = extractMessages(trace)
  const latency = trace.metadata?.latencyBreakdown || trace.metadata?.latency
  const cost = trace.metadata?.cost
  const isVoice = trace.tags?.includes('voice')

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 overflow-y-auto max-h-[calc(100vh-240px)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Header with Langfuse link */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Trace {trace.id.slice(0, 8)}...
        </h3>
        {trace.langfuseUrl && (
          <a
            href={trace.langfuseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Open in Langfuse &rarr;
          </a>
        )}
      </div>

      {/* Message thread */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Messages</h3>
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-white/5 text-foreground'
                  : 'bg-primary/5 border border-primary/10 text-foreground'
              }`}
            >
              <span className="text-xs font-medium text-muted-foreground uppercase mb-1 block">
                {msg.role}
              </span>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))
        ) : (
          <>
            {/* Fallback: show lastUserMessage from metadata if available */}
            {trace.metadata?.lastUserMessage ? (
              <div className="space-y-2">
                <div className="p-3 rounded-lg text-sm bg-white/5 text-foreground">
                  <span className="text-xs font-medium text-muted-foreground uppercase mb-1 block">user</span>
                  <p className="whitespace-pre-wrap">{trace.metadata.lastUserMessage}</p>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Only last message preview available.{' '}
                  {trace.langfuseUrl && (
                    <a href={trace.langfuseUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      View full conversation in Langfuse
                    </a>
                  )}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No messages stored.{' '}
                {trace.langfuseUrl && (
                  <a href={trace.langfuseUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    View in Langfuse
                  </a>
                )}
              </p>
            )}
          </>
        )}
      </section>

      {/* Span timeline */}
      {trace.observations && trace.observations.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Spans</h3>
          <TraceTimeline observations={trace.observations} />
        </section>
      )}

      {/* Latency breakdown */}
      {latency && (
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Latency</h3>
          <div className="space-y-2">
            {latency.toolDecisionMs != null && <LatencyBar label="Tool decision" value={latency.toolDecisionMs} max={latency.totalMs ?? 3000} />}
            {latency.embeddingMs != null && <LatencyBar label="Embedding" value={latency.embeddingMs} max={latency.totalMs ?? 3000} />}
            {latency.rerankMs != null && <LatencyBar label="Reranking" value={latency.rerankMs} max={latency.totalMs ?? 3000} />}
            {latency.generationMs != null && <LatencyBar label="Generation" value={latency.generationMs} max={latency.totalMs ?? 3000} />}
            {latency.totalMs != null && (
              <div className="pt-1 border-t border-white/[0.06] text-sm text-foreground font-medium">
                Total: {Math.round(latency.totalMs)}ms
              </div>
            )}
          </div>
        </section>
      )}

      {/* Cost breakdown */}
      {cost && (
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Cost</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-sm">
            {cost.toolDecision != null && <CostRow label="Tool decision" value={cost.toolDecision} />}
            {cost.embedding != null && <CostRow label="Embedding" value={cost.embedding} />}
            {cost.reranking != null && <CostRow label="Reranking" value={cost.reranking} />}
            {cost.generation != null && <CostRow label="Generation" value={cost.generation} />}
            {cost.voice != null && <CostRow label="Voice" value={cost.voice} />}
            {cost.total != null && (
              <div className="sm:col-span-2 pt-1 border-t border-white/[0.06] font-medium text-foreground">
                Total: ${cost.total.toFixed(4)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Scores */}
      {trace.scores && Object.keys(trace.scores).length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Scores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-sm">
            {Object.entries(trace.scores).map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground">{key.replace(/_/g, ' ')}</span>
                <span className="text-foreground font-medium">{typeof val === 'number' ? val.toFixed(2) : val}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {trace.tags && trace.tags.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Tags</h3>
          <div className="flex flex-wrap gap-1">
            {trace.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Voice-specific */}
      {isVoice && (
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Voice</h3>
          <div className="text-sm space-y-1">
            {trace.metadata?.durationMs != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="text-foreground">{(trace.metadata.durationMs / 1000).toFixed(1)}s</span>
              </div>
            )}
            {trace.metadata?.turnCount != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Turns</span>
                <span className="text-foreground">{trace.metadata.turnCount}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

function LatencyBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{Math.round(value)}ms</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">${value.toFixed(4)}</span>
    </div>
  )
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function extractMessages(trace: OpsTraceDetail): Message[] {
  const messages: Message[] = []

  // 1. Try trace.input — Langfuse stores the messages array at trace level
  if (trace.input) {
    const input = trace.input as { role?: string; content?: string }[] | { messages?: { role: string; content: string }[] }
    if (Array.isArray(input)) {
      // trace.input is directly an array of {role, content}
      for (const m of input) {
        if ((m.role === 'user' || m.role === 'assistant') && m.content) {
          messages.push({ role: m.role, content: m.content })
        }
      }
    } else if (input && typeof input === 'object' && Array.isArray(input.messages)) {
      // trace.input is { messages: [...] }
      for (const m of input.messages) {
        if ((m.role === 'user' || m.role === 'assistant') && m.content) {
          messages.push({ role: m.role, content: m.content })
        }
      }
    }
  }

  // 2. Add trace.output as the final assistant message
  if (trace.output && typeof trace.output === 'string') {
    messages.push({ role: 'assistant', content: trace.output })
  }

  // 3. For voice traces, check observations named voice-transcript
  if (trace.observations) {
    for (const obs of trace.observations) {
      if (obs.name === 'voice-transcript') {
        if (obs.input && typeof obs.input === 'string') {
          messages.push({ role: 'user', content: obs.input })
        }
        if (obs.output && typeof obs.output === 'string') {
          messages.push({ role: 'assistant', content: obs.output })
        }
      }
    }
  }

  // 4. Fallback: scan generation observations if no messages found yet
  if (messages.length === 0 && trace.observations) {
    for (const obs of trace.observations) {
      if (obs.type === 'generation') {
        if (obs.input && typeof obs.input === 'object' && Array.isArray((obs.input as { messages?: unknown }).messages)) {
          const msgs = (obs.input as { messages: Array<{ role: string; content: string }> }).messages
          for (const m of msgs) {
            if ((m.role === 'user' || m.role === 'assistant') && m.content) {
              messages.push({ role: m.role, content: m.content })
            }
          }
        }
        if (obs.output && typeof obs.output === 'string') {
          messages.push({ role: 'assistant', content: obs.output })
        }
      }
    }
  }

  // Deduplicate consecutive same-role messages with same content
  return messages.filter((m, i) => i === 0 || m.content !== messages[i - 1].content)
}
