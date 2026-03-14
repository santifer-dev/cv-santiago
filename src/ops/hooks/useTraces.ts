import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useOpsApi } from './useOpsApi'
import type { OpsTrace } from '../types'

export interface TraceFilters {
  days: number
  lang?: string
  mode?: string
  rag?: string
  jailbreak?: boolean
}

const PAGE_SIZE = 20

export function useTraces(filters: TraceFilters) {
  const [offset, setOffset] = useState(0)
  const [allTraces, setAllTraces] = useState<OpsTrace[]>([])
  const prevDataRef = useRef<{ data: OpsTrace[]; total: number } | null>(null)

  const params = useMemo(() => {
    const p: Record<string, string> = {
      days: String(filters.days),
      limit: String(PAGE_SIZE),
      offset: String(offset),
    }
    if (filters.lang) p.lang = filters.lang
    if (filters.mode) p.mode = filters.mode
    if (filters.rag) p.rag = filters.rag
    if (filters.jailbreak) p.jailbreak = 'true'
    return p
  }, [filters, offset])

  const { data, loading } = useOpsApi<{ data: OpsTrace[]; total: number }>({
    endpoint: 'traces',
    params,
    cacheTtlMs: 15000,
  })

  // Merge new results when data changes
  useEffect(() => {
    if (!data || data === prevDataRef.current) return
    prevDataRef.current = data

    if (offset === 0) {
      setAllTraces(data.data)
    } else {
      setAllTraces(prev => {
        const existingIds = new Set(prev.map(t => t.id))
        const newTraces = data.data.filter(t => !existingIds.has(t.id))
        return [...prev, ...newTraces]
      })
    }
  }, [data, offset])

  const loadMore = useCallback(() => {
    setOffset(prev => prev + PAGE_SIZE)
  }, [])

  const resetFilters = useCallback(() => {
    setOffset(0)
    setAllTraces([])
    prevDataRef.current = null
  }, [])

  return {
    traces: allTraces,
    total: data?.total ?? 0,
    loading,
    loadMore,
    resetFilters,
  }
}
