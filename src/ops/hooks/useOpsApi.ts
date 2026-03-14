import { useState, useEffect, useCallback, useRef } from 'react'
import type { UseOpsApiOptions, UseOpsApiResult } from '../types'

const OPS_TOKEN_KEY = 'ops_token'

function buildCacheKey(endpoint: string, params?: Record<string, string>): string {
  const paramStr = params ? JSON.stringify(params, Object.keys(params).sort()) : ''
  return `ops_cache_${endpoint}_${paramStr}`
}

function getCached<T>(key: string, ttl: number): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > ttl) {
      sessionStorage.removeItem(key)
      return null
    }
    return data as T
  } catch {
    return null
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // sessionStorage full — ignore
  }
}

export function useOpsApi<T>(options: UseOpsApiOptions): UseOpsApiResult<T> {
  const { endpoint, params, enabled = true, cacheTtlMs = 30000 } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Stabilize params reference — inline objects cause infinite re-render loops
  const paramsKey = params ? JSON.stringify(params, Object.keys(params).sort()) : ''
  const paramsRef = useRef(params)
  if (paramsKey !== JSON.stringify(paramsRef.current, paramsRef.current ? Object.keys(paramsRef.current).sort() : undefined)) {
    paramsRef.current = params
  }
  const stableParams = paramsRef.current

  const fetchData = useCallback(async () => {
    const token = sessionStorage.getItem(OPS_TOKEN_KEY)
    if (!token) return

    const cacheKey = buildCacheKey(endpoint, stableParams)
    const cached = getCached<T>(cacheKey, cacheTtlMs)
    if (cached) {
      setData(cached)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const url = new URL(`/api/ops/${endpoint}`, window.location.origin)
      if (stableParams) {
        Object.entries(stableParams).forEach(([k, v]) => url.searchParams.set(k, v))
      }

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })

      if (res.status === 401) {
        sessionStorage.removeItem(OPS_TOKEN_KEY)
        window.location.reload()
        return
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const json = await res.json() as T
      setCache(cacheKey, json)
      setData(json)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, paramsKey, cacheTtlMs])

  useEffect(() => {
    if (enabled) fetchData()
    return () => abortRef.current?.abort()
  }, [enabled, fetchData])

  return { data, loading, error, refetch: fetchData }
}
