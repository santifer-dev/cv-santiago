import KpiCard from '../components/KpiCard'
import { useOpsApi } from '../hooks/useOpsApi'
import type { TabProps, OpsPromptVersion, OpsRagStats } from '../types'

const MODEL_PRICING = [
  { model: 'Claude Sonnet 4.5', input: '$3.00', output: '$15.00', use: 'Generation + Tool decision' },
  { model: 'Claude Haiku 3.5', input: '$0.80', output: '$4.00', use: 'Reranking + Scoring' },
  { model: 'text-embedding-3-small', input: '$0.02', output: '—', use: 'RAG embeddings' },
  { model: 'OpenAI Realtime (gpt-4o)', input: '$5.00', output: '$20.00', use: 'Voice mode' },
]

export default function SystemTab({ stats, loading }: TabProps) {
  const { data: promptVersions, loading: promptLoading } = useOpsApi<OpsPromptVersion[]>({
    endpoint: 'prompts',
  })
  const { data: ragStats, loading: ragLoading } = useOpsApi<OpsRagStats>({
    endpoint: 'rag-stats',
  })

  const isLoading = loading || promptLoading || ragLoading
  const activeVersion = promptVersions?.find(v => v.isActive)

  if (isLoading && !stats && !promptVersions && !ragStats) {
    return <div className="h-48 sm:h-64 bg-card border border-white/[0.06] rounded-lg animate-pulse" />
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* System KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <KpiCard label="Active Prompt" value={activeVersion ? `v${activeVersion.version}` : '—'} />
        <KpiCard label="Prompt Versions" value={promptVersions?.length ?? 0} format="number" />
        <KpiCard label="RAG Chunks" value={ragStats?.totalChunks ?? 0} format="number" />
        <KpiCard label="Error Rate" value={0} format="percent" />
      </div>

      {/* Prompt versions table */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Prompt Versions</h3>
        {promptVersions && promptVersions.length > 0 ? (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Version</th>
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Created</th>
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Labels</th>
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Hash</th>
                <th className="text-center text-muted-foreground py-2 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {promptVersions.map(pv => (
                <tr
                  key={pv.version}
                  className={`border-b border-white/[0.06] hover:bg-white/[0.03] ${
                    pv.isActive ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="py-2 px-2 text-foreground font-medium">v{pv.version}</td>
                  <td className="py-2 px-2 text-muted-foreground">
                    {new Date(pv.createdAt).toLocaleDateString('en-GB', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex flex-wrap gap-1">
                      {pv.labels.map(label => (
                        <span
                          key={label}
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            label === 'production'
                              ? 'bg-green-500/20 text-green-400'
                              : label === 'latest'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-white/10 text-muted-foreground'
                          }`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-muted-foreground font-mono text-xs">
                    {pv.hash ? pv.hash.slice(0, 8) : '—'}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {pv.isActive ? (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">ACTIVE</span>
                    ) : (
                      <span className="text-[10px] bg-white/10 text-muted-foreground px-2 py-0.5 rounded-full">inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : (
          <div className="py-6 text-center text-muted-foreground text-sm">
            {promptLoading ? 'Loading...' : 'No prompt versions available'}
          </div>
        )}
      </div>

      {/* RAG documents */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
          RAG Documents ({ragStats?.totalChunks?.toLocaleString() ?? 0} total chunks)
        </h3>
        {ragStats?.byArticle && ragStats.byArticle.length > 0 ? (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Article</th>
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Slug</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Chunks</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {ragStats.byArticle.map(article => (
                <tr key={article.articleId} className="border-b border-white/[0.06] hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-foreground">{article.articleId}</td>
                  <td className="py-2 px-2 text-muted-foreground font-mono text-xs">{article.slug}</td>
                  <td className="py-2 px-2 text-right text-foreground font-medium">{article.chunkCount}</td>
                  <td className="py-2 px-2 text-right text-muted-foreground">
                    {ragStats.totalChunks > 0
                      ? ((article.chunkCount / ragStats.totalChunks) * 100).toFixed(1) + '%'
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : (
          <div className="py-6 text-center text-muted-foreground text-sm">
            {ragLoading ? 'Loading...' : 'No RAG documents indexed'}
          </div>
        )}
      </div>

      {/* Model pricing reference */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Model Costs Reference (per 1M tokens)</h3>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-muted-foreground py-2 px-2 font-medium">Model</th>
              <th className="text-right text-muted-foreground py-2 px-2 font-medium">Input</th>
              <th className="text-right text-muted-foreground py-2 px-2 font-medium">Output</th>
              <th className="text-left text-muted-foreground py-2 px-2 font-medium">Usage</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_PRICING.map(m => (
              <tr key={m.model} className="border-b border-white/[0.06] hover:bg-white/[0.03]">
                <td className="py-2 px-2 text-foreground font-medium whitespace-nowrap">{m.model}</td>
                <td className="py-2 px-2 text-right text-muted-foreground">{m.input}</td>
                <td className="py-2 px-2 text-right text-muted-foreground">{m.output}</td>
                <td className="py-2 px-2 text-muted-foreground">{m.use}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
