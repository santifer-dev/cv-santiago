import { useMemo } from 'react'
import KpiCard from '../components/KpiCard'
import MetricChart from '../components/MetricChart'
import { useOpsApi } from '../hooks/useOpsApi'
import type { TabProps, OpsRagStats, OpsTrace } from '../types'

// ---------------------------------------------------------------------------
// Voice Intelligence helpers
// ---------------------------------------------------------------------------

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

interface VoiceMetrics {
  p50: number
  p95: number
  max: number
  ragPct: number
  avgTurns: number
  avgDurationSec: number
  jailbreakPct: number
  costPerMinute: number
  textAvgCost: number
  voiceAvgCost: number
}

function computeVoiceMetrics(
  voiceTraces: OpsTrace[],
  textCost: number,
  textCount: number,
): VoiceMetrics {
  const latencies = voiceTraces
    .map(t => t.metadata?.latencyBreakdown?.totalMs ?? t.metadata?.latency?.totalMs)
    .filter((v): v is number => v != null && v > 0)
    .sort((a, b) => a - b)

  const ragYes = voiceTraces.filter(t => (t.tags || []).includes('rag:yes')).length
  const ragTotal = voiceTraces.length || 1

  const turns = voiceTraces
    .map(t => t.metadata?.turnCount)
    .filter((v): v is number => v != null)
  const avgTurns = turns.length > 0 ? turns.reduce((a, b) => a + b, 0) / turns.length : 0

  const durations = voiceTraces
    .map(t => t.metadata?.durationMs)
    .filter((v): v is number => v != null && v > 0)
  const avgDurationMs = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
  const totalDurationMinutes = durations.reduce((a, b) => a + b, 0) / 60000

  const jailbreaks = voiceTraces.filter(t =>
    (t.tags || []).includes('jailbreak-attempt') || t.metadata?.jailbreakDetected
  ).length

  const voiceTotalCost = voiceTraces
    .map(t => t.metadata?.cost?.total ?? 0)
    .reduce((a, b) => (a as number) + (b as number), 0) as number

  const costPerMinute = totalDurationMinutes > 0 ? voiceTotalCost / totalDurationMinutes : 0
  const voiceAvgCost = voiceTraces.length > 0 ? voiceTotalCost / voiceTraces.length : 0
  const textAvgCost = textCount > 0 ? textCost / textCount : 0

  return {
    p50: percentile(latencies, 50),
    p95: percentile(latencies, 95),
    max: latencies.length > 0 ? latencies[latencies.length - 1] : 0,
    ragPct: (ragYes / ragTotal) * 100,
    avgTurns,
    avgDurationSec: avgDurationMs / 1000,
    jailbreakPct: (jailbreaks / ragTotal) * 100,
    costPerMinute,
    textAvgCost,
    voiceAvgCost,
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function VoiceTab({ stats, loading }: TabProps) {
  const { data: ragStats, loading: ragLoading } = useOpsApi<OpsRagStats>({ endpoint: 'rag-stats' })

  // Fetch voice traces for per-trace metrics
  const voiceParams = useMemo(() => ({ mode: 'voice', days: '30', limit: '50' }), [])
  const { data: voiceData, loading: voiceLoading } = useOpsApi<{ data: OpsTrace[]; total: number }>({
    endpoint: 'traces',
    params: voiceParams,
  })

  const voiceSessions = stats?.totals?.voiceConversations ?? 0
  const textSessions = stats?.totals?.textConversations ?? 0
  const totalSessions = textSessions + voiceSessions

  // Voice cost from daily data
  const voiceCost = useMemo(() => {
    if (!stats?.daily) return 0
    return stats.daily.reduce((sum, d) => sum + d.cost.voice, 0)
  }, [stats])

  // Text cost from daily data
  const textCost = useMemo(() => {
    if (!stats?.daily) return 0
    return stats.daily.reduce((sum, d) => sum + d.cost.total - d.cost.voice, 0)
  }, [stats])

  // Voice sessions per day
  const voiceTimeline = useMemo(() => {
    if (!stats?.daily) return []
    return stats.daily.map(d => ({
      date: d.date.slice(5),
      sessions: d.voiceConversations,
    }))
  }, [stats])

  // Donut data
  const splitData = [
    { name: 'Text', value: textSessions },
    { name: 'Voice', value: voiceSessions },
  ]

  // Rate limits
  const rateLimits = ragStats?.voiceRateLimits ?? []

  // Voice intelligence metrics
  const voiceTraces = voiceData?.data ?? []
  const metrics = useMemo(
    () => computeVoiceMetrics(voiceTraces, textCost, textSessions),
    [voiceTraces, textCost, textSessions]
  )

  if (loading) {
    return <div className="h-48 sm:h-64 bg-card border border-white/[0.06] rounded-lg animate-pulse" />
  }

  if (!stats) {
    return <div className="flex items-center justify-center h-48 sm:h-64 text-muted-foreground text-sm">No data available</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        <KpiCard label="Voice Sessions" value={voiceSessions} format="number" />
        <KpiCard label="Avg Duration" value={voiceSessions > 0 ? '~45s' : '\u2014'} />
        <KpiCard label="Voice Cost" value={voiceCost > 0 ? `$${voiceCost.toFixed(4)}` : '$0.00'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        {/* Voice sessions timeline */}
        <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Voice Sessions per Day</h3>
          {voiceTimeline.some(d => d.sessions > 0) ? (
            <MetricChart
              data={voiceTimeline}
              type="area"
              xKey="date"
              height={220}
              series={[{ key: 'sessions', color: '#eab308', label: 'Sessions' }]}
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No voice sessions recorded yet
            </div>
          )}
        </div>

        {/* Text vs Voice donut */}
        <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Text vs Voice Split</h3>
          {totalSessions > 0 ? (
            <>
              <MetricChart
                data={splitData}
                type="donut"
                xKey="name"
                height={180}
                series={[
                  { key: 'value', color: 'hsl(var(--primary))', label: 'Text' },
                  { key: 'value', color: '#eab308', label: 'Voice' },
                ]}
              />
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))]" />
                  <span className="text-muted-foreground">Text ({textSessions})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                  <span className="text-muted-foreground">Voice ({voiceSessions})</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No session data</div>
          )}
        </div>
      </div>

      {/* Voice Intelligence section */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
          Voice Intelligence
        </h3>
        {voiceLoading ? (
          <div className="py-6 text-center text-muted-foreground text-sm">Loading voice metrics...</div>
        ) : voiceTraces.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground text-sm">No voice traces available</div>
        ) : (
          <div className="space-y-4">
            {/* Latency percentiles */}
            <div>
              <h4 className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Latency Percentiles</h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <KpiCard label="P50" value={metrics.p50} format="ms" />
                <KpiCard label="P95" value={metrics.p95} format="ms" />
                <KpiCard label="Max" value={metrics.max} format="ms" />
              </div>
            </div>

            {/* Session outcomes + RAG usage */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <StatCard label="RAG Tool Usage" value={`${metrics.ragPct.toFixed(0)}%`} sub="of voice sessions" />
              <StatCard label="Avg Turns" value={metrics.avgTurns.toFixed(1)} sub="per session" />
              <StatCard label="Avg Duration" value={`${metrics.avgDurationSec.toFixed(0)}s`} sub="per session" />
              <StatCard label="Jailbreak Rate" value={`${metrics.jailbreakPct.toFixed(1)}%`} sub="of sessions" alert={metrics.jailbreakPct > 5} />
            </div>

            {/* Cost efficiency */}
            <div>
              <h4 className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Cost Efficiency</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <StatCard
                  label="Voice Cost/Min"
                  value={metrics.costPerMinute > 0 ? `$${metrics.costPerMinute.toFixed(4)}` : '\u2014'}
                  sub="per minute of audio"
                />
                <StatCard
                  label="Voice Avg Cost"
                  value={metrics.voiceAvgCost > 0 ? `$${metrics.voiceAvgCost.toFixed(4)}` : '\u2014'}
                  sub="per conversation"
                />
                <StatCard
                  label="Text Avg Cost"
                  value={metrics.textAvgCost > 0 ? `$${metrics.textAvgCost.toFixed(4)}` : '\u2014'}
                  sub="per conversation"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rate limits */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
          Voice Rate Limits ({rateLimits.length} active)
        </h3>
        {rateLimits.length > 0 ? (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">IP</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Requests</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Window Start</th>
              </tr>
            </thead>
            <tbody>
              {rateLimits.map((rl, i) => (
                <tr key={i} className="border-b border-white/[0.06] hover:bg-white/[0.03]">
                  <td className="py-1.5 px-2 text-foreground font-mono text-xs">{rl.ip}</td>
                  <td className="py-1.5 px-2 text-right text-foreground">{rl.count}</td>
                  <td className="py-1.5 px-2 text-right text-muted-foreground">
                    {new Date(rl.windowStart).toLocaleString('en-GB', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : (
          <div className="py-6 text-center text-muted-foreground text-sm">
            {ragLoading ? 'Loading...' : 'No active rate limits'}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Small stat card (lighter weight than KpiCard, for inline metrics)
// ---------------------------------------------------------------------------

function StatCard({ label, value, sub, alert }: { label: string; value: string; sub: string; alert?: boolean }) {
  return (
    <div className="bg-background/50 border border-white/[0.04] rounded-md px-3 py-2.5">
      <div className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider font-medium truncate">{label}</div>
      <div className={`text-lg sm:text-xl font-display font-bold mt-0.5 ${alert ? 'text-red-400' : 'text-foreground'}`}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  )
}
