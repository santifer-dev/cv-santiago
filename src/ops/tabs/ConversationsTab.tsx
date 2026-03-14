import { useState, useEffect } from 'react'
import FilterBar from '../components/FilterBar'
import ConversationList from '../components/ConversationList'
import ConversationDetail from '../components/ConversationDetail'
import { useTraces, type TraceFilters } from '../hooks/useTraces'
import type { TabProps } from '../types'

export default function ConversationsTab({ loading: _statsLoading }: TabProps) {
  const [filters, setFilters] = useState<TraceFilters>({ days: 7 })
  const [selected, setSelected] = useState<string | null>(null)
  const { traces, total, loading, loadMore, resetFilters } = useTraces(filters)

  useEffect(() => {
    resetFilters()
  }, [filters.days, filters.lang, filters.mode, filters.rag, filters.jailbreak, resetFilters])

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <FilterBar filters={filters} onChange={setFilters} />
        <span className="text-xs sm:text-sm text-muted-foreground shrink-0">{total} conversations</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Conversation list */}
        <div className="lg:col-span-2">
          <ConversationList
            traces={traces}
            selected={selected}
            onSelect={setSelected}
            loading={loading}
          />
          {traces.length < total && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full mt-2 py-1.5 sm:py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          )}
        </div>

        {/* Conversation detail */}
        <div className="lg:col-span-3 bg-card border border-white/[0.06] rounded-lg min-h-[300px] sm:min-h-[400px]">
          {selected ? (
            <ConversationDetail traceId={selected} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-6 sm:p-8">
              Select a conversation to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
