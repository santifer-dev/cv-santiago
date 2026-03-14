import KpiCard from '../components/KpiCard'
import MetricChart from '../components/MetricChart'
import { useOpsApi } from '../hooks/useOpsApi'
import type { TabProps, OpsRagStats } from '../types'

export default function RagTab({ stats, loading }: TabProps) {
  const { data: ragStats, loading: ragLoading } = useOpsApi<OpsRagStats>({ endpoint: 'rag-stats' })

  if (loading && ragLoading) {
    return <div className="h-48 sm:h-64 bg-card border border-white/[0.06] rounded-lg animate-pulse" />
  }

  const ragActivation = stats?.distributions?.ragActivation ?? { yes: 0, no: 0 }
  const totalActivation = ragActivation.yes + ragActivation.no
  const activationRate = totalActivation > 0 ? ragActivation.yes / totalActivation : 0

  // Donut data
  const donutData = [
    { name: 'RAG used', value: ragActivation.yes },
    { name: 'No RAG', value: ragActivation.no },
  ]

  // Bar chart data — chunks per article
  const articleData = ragStats?.byArticle?.map(a => ({
    name: a.slug.length > 22 ? a.slug.slice(0, 20) + '...' : a.slug,
    chunks: a.chunkCount,
  })) ?? []

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        <KpiCard label="RAG Activation" value={activationRate} format="percent" />
        <KpiCard label="Total Chunks" value={ragStats?.totalChunks ?? 0} format="number" />
        <KpiCard label="Articles Indexed" value={ragStats?.byArticle?.length ?? 0} format="number" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        {/* RAG activation donut */}
        <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">RAG Activation</h3>
          {totalActivation > 0 ? (
            <>
              <MetricChart
                data={donutData}
                type="donut"
                xKey="name"
                height={220}
                series={[
                  { key: 'value', color: '#8b5cf6', label: 'RAG used' },
                  { key: 'value', color: 'rgba(255,255,255,0.1)', label: 'No RAG' },
                ]}
              />
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                  <span className="text-muted-foreground">RAG used ({ragActivation.yes})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="text-muted-foreground">No RAG ({ragActivation.no})</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No activation data</div>
          )}
        </div>

        {/* Chunks per article — horizontal bar */}
        <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Chunks per Article</h3>
          {articleData.length > 0 ? (
            <MetricChart
              data={articleData}
              type="bar"
              xKey="name"
              height={Math.max(200, articleData.length * 40)}
              series={[{ key: 'chunks', color: '#8b5cf6', label: 'Chunks' }]}
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              {ragLoading ? 'Loading...' : 'No article data'}
            </div>
          )}
        </div>
      </div>

      {/* Article details table */}
      {ragStats?.byArticle && ragStats.byArticle.length > 0 && (
        <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Article Index Details</h3>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Article ID</th>
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Slug</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Chunks</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {ragStats.byArticle.map(a => (
                <tr key={a.articleId} className="border-b border-white/[0.06] hover:bg-white/[0.03]">
                  <td className="py-1.5 px-2 text-foreground">{a.articleId}</td>
                  <td className="py-1.5 px-2 text-muted-foreground font-mono text-xs">{a.slug}</td>
                  <td className="py-1.5 px-2 text-right text-foreground font-medium">{a.chunkCount}</td>
                  <td className="py-1.5 px-2 text-right text-muted-foreground">
                    {ragStats.totalChunks > 0
                      ? ((a.chunkCount / ragStats.totalChunks) * 100).toFixed(1) + '%'
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}
    </div>
  )
}
