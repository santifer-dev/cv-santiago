import KpiCard from '../components/KpiCard'
import MetricChart from '../components/MetricChart'
import type { TabProps } from '../types'

const COMPONENT_KEYS = ['toolDecision', 'embedding', 'reranking', 'generation', 'voice'] as const
const COMPONENT_COLORS: Record<string, string> = {
  toolDecision: 'hsl(var(--primary))',
  embedding: '#8b5cf6',
  reranking: '#22c55e',
  generation: 'hsl(var(--accent))',
  voice: '#eab308',
}

function formatCost(val: number): string {
  if (val === 0) return '$0.00'
  if (val < 0.0001) return '<$0.001'
  if (val < 0.01) return `$${val.toFixed(4)}`
  return `$${val.toFixed(2)}`
}

export default function CostsTab({ stats, loading }: TabProps) {
  if (loading) {
    return <div className="h-48 sm:h-64 bg-card border border-white/[0.06] rounded-lg animate-pulse" />
  }

  if (!stats) {
    return <div className="flex items-center justify-center h-48 sm:h-64 text-muted-foreground text-sm">No data available</div>
  }

  const daily = stats.daily ?? []

  // 24h cost = last day entry
  const cost24h = daily.length > 0 ? daily[daily.length - 1].cost.total : 0
  // 7d cost
  const cost7d = daily.slice(-7).reduce((sum, d) => sum + d.cost.total, 0)

  // Stacked bar data for MetricChart
  const stackedData = daily.map(d => ({
    date: d.date.slice(5),
    toolDecision: d.cost.toolDecision,
    embedding: d.cost.embedding,
    reranking: d.cost.reranking,
    generation: d.cost.generation,
    voice: d.cost.voice,
  }))

  // Trend line data
  const trendData = daily.map(d => ({
    date: d.date.slice(5),
    cost: d.cost.total,
  }))

  // Text vs Voice aggregate cost
  const textCost = daily.reduce(
    (sum, d) => sum + d.cost.toolDecision + d.cost.embedding + d.cost.reranking + d.cost.generation,
    0,
  )
  const voiceCost = daily.reduce((sum, d) => sum + d.cost.voice, 0)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        <KpiCard label="Cost (24h)" value={formatCost(cost24h)} />
        <KpiCard label="Cost (7d)" value={formatCost(cost7d)} />
        <KpiCard label="Avg / Conv" value={formatCost(stats.totals.avgCostPerConversation)} />
      </div>

      {/* Text vs Voice comparison */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="bg-card border border-white/[0.06] rounded-lg p-4 sm:p-6 text-center">
          <span className="text-[11px] sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Text Cost</span>
          <div className="text-xl sm:text-3xl font-display font-bold text-foreground mt-1 sm:mt-2">{formatCost(textCost)}</div>
        </div>
        <div className="bg-card border border-white/[0.06] rounded-lg p-4 sm:p-6 text-center">
          <span className="text-[11px] sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Voice Cost</span>
          <div className="text-xl sm:text-3xl font-display font-bold text-[#eab308] mt-1 sm:mt-2">{formatCost(voiceCost)}</div>
        </div>
      </div>

      {/* Stacked area chart: cost by component */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Cost by Component (daily)</h3>
        {stackedData.length > 0 ? (
          <MetricChart
            data={stackedData}
            type="area"
            xKey="date"
            stacked
            height={280}
            series={COMPONENT_KEYS.map(key => ({
              key,
              color: COMPONENT_COLORS[key],
              label: key,
            }))}
          />
        ) : (
          <div className="h-48 sm:h-64 flex items-center justify-center text-muted-foreground text-sm">No daily data</div>
        )}
      </div>

      {/* Cost trend */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Total Cost Trend</h3>
        {trendData.length > 0 ? (
          <MetricChart
            data={trendData}
            type="area"
            xKey="date"
            height={220}
            series={[{ key: 'cost', color: 'hsl(var(--primary))', label: 'Cost' }]}
          />
        ) : (
          <div className="h-36 sm:h-48 flex items-center justify-center text-muted-foreground text-sm">No trend data</div>
        )}
      </div>

      {/* Daily cost table */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Daily Cost Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Date</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Tool</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Embed</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Rerank</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Gen</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Voice</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {daily.slice().reverse().map(d => (
                <tr key={d.date} className="border-b border-white/[0.06] hover:bg-white/[0.03]">
                  <td className="py-1.5 px-2 text-foreground">{d.date}</td>
                  <td className="py-1.5 px-2 text-right text-muted-foreground">{formatCost(d.cost.toolDecision)}</td>
                  <td className="py-1.5 px-2 text-right text-muted-foreground">{formatCost(d.cost.embedding)}</td>
                  <td className="py-1.5 px-2 text-right text-muted-foreground">{formatCost(d.cost.reranking)}</td>
                  <td className="py-1.5 px-2 text-right text-muted-foreground">{formatCost(d.cost.generation)}</td>
                  <td className="py-1.5 px-2 text-right text-muted-foreground">{formatCost(d.cost.voice)}</td>
                  <td className="py-1.5 px-2 text-right text-foreground font-medium">{formatCost(d.cost.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
