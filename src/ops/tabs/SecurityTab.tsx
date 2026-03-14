import { useMemo } from 'react'
import KpiCard from '../components/KpiCard'
import MetricChart from '../components/MetricChart'
import { useOpsApi } from '../hooks/useOpsApi'
import type { TabProps, OpsTrace } from '../types'

interface FunnelStep {
  label: string
  count: number
  color: string
}

function SecurityFunnel({ steps }: { steps: FunnelStep[] }) {
  const maxCount = Math.max(...steps.map(s => s.count), 1)

  return (
    <div className="space-y-1.5 sm:space-y-2">
      {steps.map((step, i) => {
        const widthPct = Math.max((step.count / maxCount) * 100, 8)
        return (
          <div key={i} className="flex items-center gap-2 sm:gap-3">
            <div className="w-24 sm:w-36 text-right text-[10px] sm:text-xs text-muted-foreground shrink-0">{step.label}</div>
            <div className="flex-1 relative h-6 sm:h-8">
              <div
                className="h-full rounded-r-md flex items-center px-2 sm:px-3 transition-all"
                style={{ width: `${widthPct}%`, background: step.color }}
              >
                <span className="text-[10px] sm:text-xs font-medium text-white whitespace-nowrap">
                  {step.count.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function SecurityTab({ stats, loading }: TabProps) {
  const { data: jailbreakData, loading: jbLoading } = useOpsApi<{ data: OpsTrace[]; total: number }>({
    endpoint: 'traces',
    params: { jailbreak: 'true', days: '30', limit: '50' },
  })

  const jailbreakTraces = jailbreakData?.data ?? []

  // Security funnel
  const funnelSteps = useMemo<FunnelStep[]>(() => {
    if (!stats) return []
    const totalConv = stats.totals.conversations
    const jailbreakAttempts = jailbreakData?.total ?? 0
    const leakDetected = jailbreakTraces.filter(t => t.tags?.includes('prompt-leak-detected')).length
    const leakBlocked = jailbreakTraces.filter(t => t.tags?.includes('prompt-leak-blocked')).length
    const alertsSent = jailbreakTraces.filter(t =>
      t.tags?.includes('alert-sent') || t.metadata?.jailbreakDetected,
    ).length

    return [
      { label: 'Total requests', count: totalConv, color: 'hsl(var(--accent))' },
      { label: 'Keyword detections', count: jailbreakAttempts, color: '#eab308' },
      { label: 'Leak detected', count: leakDetected, color: '#f97316' },
      { label: 'Leaks blocked', count: leakBlocked, color: '#ef4444' },
      { label: 'Alerts sent', count: alertsSent, color: '#dc2626' },
    ]
  }, [stats, jailbreakData, jailbreakTraces])

  // Safety score histogram buckets
  const safetyBuckets = useMemo(() => {
    const buckets = [
      { range: '0-0.2', count: 0 },
      { range: '0.2-0.4', count: 0 },
      { range: '0.4-0.6', count: 0 },
      { range: '0.6-0.8', count: 0 },
      { range: '0.8-1.0', count: 0 },
    ]
    jailbreakTraces.forEach(t => {
      const score = t.scores?.safety
      if (typeof score !== 'number') return
      const idx = Math.min(Math.floor(score * 5), 4)
      buckets[idx].count++
    })
    return buckets
  }, [jailbreakTraces])

  if (loading && jbLoading) {
    return <div className="h-48 sm:h-64 bg-card border border-white/[0.06] rounded-lg animate-pulse" />
  }

  const blockRate = jailbreakTraces.length > 0
    ? jailbreakTraces.filter(t => t.tags?.includes('prompt-leak-blocked')).length / jailbreakTraces.length
    : 1

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        <KpiCard
          label="Avg Safety"
          value={stats ? stats.totals.avgSafetyScore : 0}
          format="percent"
        />
        <KpiCard label="Jailbreak (30d)" value={jailbreakData?.total ?? 0} format="number" />
        <KpiCard label="Block Rate" value={blockRate} format="percent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        {/* Security funnel */}
        <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Security Funnel (30d)</h3>
          {funnelSteps.length > 0 ? (
            <SecurityFunnel steps={funnelSteps} />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No data</div>
          )}
        </div>

        {/* Safety score distribution */}
        <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Safety Score Distribution</h3>
          {safetyBuckets.some(b => b.count > 0) ? (
            <MetricChart
              data={safetyBuckets}
              type="bar"
              xKey="range"
              height={220}
              series={[{ key: 'count', color: '#22c55e', label: 'Traces' }]}
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No scored traces in jailbreak data
            </div>
          )}
        </div>
      </div>

      {/* Recent jailbreak attempts */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
          Recent Jailbreak Attempts ({jailbreakTraces.length})
        </h3>
        {jailbreakTraces.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {jailbreakTraces.map(trace => {
              const ts = new Date(trace.timestamp)
              return (
                <div
                  key={trace.id}
                  className="flex items-start gap-3 py-2 border-b border-white/[0.06] last:border-0"
                >
                  <div className="shrink-0 mt-0.5">
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                      {trace.metadata?.lang?.toUpperCase() ?? '??'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {trace.metadata?.lastUserMessage || 'No preview'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {ts.toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {trace.tags?.map(tag => (
                        <span
                          key={tag}
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            tag.includes('blocked') ? 'bg-green-500/20 text-green-400' :
                            tag.includes('leak') ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-white/10 text-muted-foreground'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {trace.scores?.safety != null && (
                    <div className="shrink-0 text-xs text-muted-foreground">
                      Safety: {typeof trace.scores.safety === 'number'
                        ? (trace.scores.safety * 100).toFixed(0) + '%'
                        : trace.scores.safety}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">
            {jbLoading ? 'Loading...' : 'No jailbreak attempts found'}
          </div>
        )}
      </div>
    </div>
  )
}
