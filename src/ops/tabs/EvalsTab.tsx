import { useState } from 'react'
import KpiCard from '../components/KpiCard'
import MetricChart from '../components/MetricChart'
import { useOpsApi } from '../hooks/useOpsApi'
import type { TabProps, OpsEvalReport } from '../types'

function getPassRateColor(rate: number): string {
  if (rate >= 0.9) return '#22c55e'
  if (rate >= 0.7) return '#eab308'
  return '#ef4444'
}

export default function EvalsTab(_props: TabProps) {
  const { data: evalReport, loading } = useOpsApi<OpsEvalReport>({ endpoint: 'evals' })
  const [expandedTest, setExpandedTest] = useState<string | null>(null)

  if (loading) {
    return <div className="h-48 sm:h-64 bg-card border border-white/[0.06] rounded-lg animate-pulse" />
  }

  if (!evalReport) {
    return <div className="flex items-center justify-center h-48 sm:h-64 text-muted-foreground text-sm">No eval data available</div>
  }

  const lastRun = new Date(evalReport.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Chart data: pass rate per category (as 0-100 for readability)
  const categoryChartData = evalReport.categories.map(c => ({
    name: c.name,
    passRate: Math.round(c.passRate * 100),
    passed: c.passed,
    total: c.total,
  }))

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        <KpiCard label="Pass Rate" value={evalReport.passRate} format="percent" />
        <KpiCard label="Total Tests" value={evalReport.totalTests} format="number" />
        <KpiCard label="Last Run" value={lastRun} />
      </div>

      {/* Pass/Fail summary */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="bg-card border border-white/[0.06] rounded-lg p-4 sm:p-6 text-center">
          <span className="text-[11px] sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Passed</span>
          <div className="text-xl sm:text-3xl font-display font-bold text-[#22c55e] mt-1 sm:mt-2">{evalReport.passed}</div>
        </div>
        <div className="bg-card border border-white/[0.06] rounded-lg p-4 sm:p-6 text-center">
          <span className="text-[11px] sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Failed</span>
          <div className="text-xl sm:text-3xl font-display font-bold text-red-400 mt-1 sm:mt-2">{evalReport.failed}</div>
        </div>
      </div>

      {/* Category breakdown — horizontal bar chart */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Pass Rate by Category</h3>
        {categoryChartData.length > 0 ? (
          <div className="space-y-3">
            {categoryChartData.map(cat => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {cat.passed}/{cat.total} ({cat.passRate}%)
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${cat.passRate}%`,
                      background: getPassRateColor(cat.passRate / 100),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No category data</div>
        )}
      </div>

      {/* Category donut overview */}
      {categoryChartData.length > 0 && (
        <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Tests by Category</h3>
          <MetricChart
            data={categoryChartData.map(c => ({ name: c.name, value: c.total }))}
            type="donut"
            xKey="name"
            height={220}
            series={categoryChartData.map((c, i) => ({
              key: 'value',
              color: [
                'hsl(var(--primary))',
                '#8b5cf6',
                '#22c55e',
                'hsl(var(--accent))',
                '#eab308',
                '#ef4444',
                '#ec4899',
              ][i % 7],
              label: c.name,
            }))}
          />
        </div>
      )}

      {/* Failed tests list */}
      {evalReport.failedTests.length > 0 && (
        <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
            Failed Tests ({evalReport.failedTests.length})
          </h3>
          <div className="space-y-1">
            {evalReport.failedTests.map(test => {
              const isExpanded = expandedTest === test.name
              return (
                <div key={test.name} className="border-b border-white/[0.06] last:border-0">
                  <button
                    onClick={() => setExpandedTest(isExpanded ? null : test.name)}
                    className="w-full flex items-center justify-between py-2.5 px-2 hover:bg-white/[0.03] rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-red-400 text-xs font-mono">FAIL</span>
                      <span className="text-sm text-foreground">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-white/10 text-muted-foreground px-2 py-0.5 rounded-full">
                        {test.category}
                      </span>
                      <span className="text-muted-foreground text-xs">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-2 pb-3 ml-10">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-white/5 rounded-lg p-3">
                        {test.reason}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
