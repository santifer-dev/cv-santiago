// === API Response Types (lo que devuelven los edge functions) ===

export interface OpsStats {
  period: { days: number; from: string; to: string }
  totals: {
    conversations: number
    textConversations: number
    voiceConversations: number
    totalCost: number
    avgCostPerConversation: number
    avgLatencyMs: number
    avgSafetyScore: number
    evalPassRate: number
  }
  daily: Array<{
    date: string  // YYYY-MM-DD
    conversations: number
    textConversations: number
    voiceConversations: number
    cost: { toolDecision: number; embedding: number; reranking: number; generation: number; voice: number; total: number }
    avgLatencyMs: number
  }>
  distributions: {
    languages: Record<string, number>
    intents: Record<string, number>
    ragActivation: { yes: number; no: number }
  }
}

export interface OpsTrace {
  id: string
  timestamp: string
  tags: string[]
  metadata: {
    lang?: string
    messageCount?: number
    lastUserMessage?: string
    promptVersion?: string
    cost?: { toolDecision?: number; embedding?: number; reranking?: number; generation?: number; voice?: number; total?: number }
    latency?: { toolDecisionMs?: number; embeddingMs?: number; rerankMs?: number; generationMs?: number; totalMs?: number }
    latencyBreakdown?: { toolDecisionMs?: number; embeddingMs?: number; rerankMs?: number; generationMs?: number; totalMs?: number }
    ragUsed?: boolean
    sources?: string[]
    ragDegraded?: boolean
    degradedReason?: string
    durationMs?: number
    turnCount?: number
    userMessageCount?: number
    jailbreakDetected?: boolean
    leakDetected?: boolean
  }
  scores?: Record<string, number | string>
  observations?: OpsObservation[]
}

export interface OpsObservation {
  name: string
  type: string
  startTime: string
  endTime?: string
  metadata?: Record<string, unknown>
  input?: unknown
  output?: unknown
}

export interface OpsTraceDetail extends OpsTrace {
  input?: unknown
  output?: unknown
  observations: OpsObservation[]
}

export interface OpsEvalReport {
  date: string
  passRate: number
  totalTests: number
  passed: number
  failed: number
  categories: Array<{ name: string; total: number; passed: number; passRate: number }>
  failedTests: Array<{ name: string; category: string; reason: string }>
}

export interface OpsPromptVersion {
  version: number
  createdAt: string
  labels: string[]
  hash?: string
  isActive: boolean
}

export interface OpsRagStats {
  totalChunks: number
  byArticle: Array<{ articleId: string; slug: string; chunkCount: number }>
  voiceRateLimits: Array<{ ip: string; count: number; windowStart: string }>
}

// === Hook interfaces ===

export interface UseOpsApiOptions {
  endpoint: string
  params?: Record<string, string>
  enabled?: boolean
  cacheTtlMs?: number  // default 30000
}

export interface UseOpsApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

// === Tab component props ===
export interface TabProps {
  stats: OpsStats | null
  loading: boolean
}
