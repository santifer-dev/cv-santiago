# Chatbot — santifer.io

Sistema de chat IA dual (texto + voz) para el portfolio de Santiago.

## Contexto

Este chatbot empezó como un widget de 50 líneas y evolucionó a un sistema LLMOps de producción. Es el artículo más demostrable del portfolio: el recruiter puede probar el sistema mientras lee el case study.

**URLs:** https://santifer.io (widget flotante en todas las páginas)
**Case study:** `/chatbot-que-se-cura-solo` (ES) · `/self-healing-chatbot` (EN)
**Repo:** público en github.com/santifer/cv-santiago

## Arquitectura Actual (Text)

```
User → FloatingChat.tsx → api/chat.js (Vercel Edge)
                            ├── System prompt (Langfuse registry + fallback local)
                            ├── Claude Sonnet (generación + tool_use)
                            ├── Agentic RAG (tool_use → hybrid search → rerank → generate)
                            │     ├── OpenAI embeddings (text-embedding-3-small)
                            │     ├── Supabase pgvector (semantic) + full-text (BM25)
                            │     └── Claude Haiku (reranking + diversificación)
                            ├── Langfuse tracing (cada request)
                            └── waitUntil → Haiku scoring (0ms latencia añadida)
```

## Arquitectura Target (Voice)

Speech-to-speech nativo con modo dual (texto + voz) y contexto compartido.
**Decisión:** OpenAI Realtime API (Opción D) — WebSocket único, audio-to-audio nativo, function calling para RAG.
Ver plan completo en [`voice-mode-plan.md`](voice-mode-plan.md).

## Archivos Clave

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| `api/chat.js` | `../api/chat.js` | Edge function principal — RAG, tracing, scoring, streaming |
| `FloatingChat.tsx` | `../src/FloatingChat.tsx` | Widget React — streaming, quick prompts, contact CTA |
| `chatbot-prompt.txt` | `../chatbot-prompt.txt` | System prompt (fallback; producción usa Langfuse registry) |
| `SelfHealingChatbot.tsx` | `../src/SelfHealingChatbot.tsx` | Artículo / case study del chatbot |
| `chatbot-i18n.ts` | `../src/chatbot-i18n.ts` | Contenido bilingüe del case study |
| `src/ops/OpsDashboard.tsx` | `../src/ops/OpsDashboard.tsx` | Dashboard LLMOps privado en `/ops` |

## Ops Dashboard (`/ops`)

Dashboard LLMOps privado protegido por password (`OPS_DASHBOARD_SECRET`).

**URL:** https://santifer.io/ops
**Auth:** Password → sessionStorage token → Bearer en cada request
**Excluido de:** robots.txt, sitemap, prerender

### Tabs
| Tab | Datos | Fuente |
|-----|-------|--------|
| Overview | KPIs + timelines + donuts + intents | Langfuse traces |
| Conversations | Filtros + lista + detail con spans/cost/latency/scores + link a Langfuse | Langfuse traces + observations |
| Costs | Desglose por componente (toolDecision/embedding/reranking/generation/voice) | Langfuse `trace.metadata.cost` |
| RAG | Activation rate + chunks por artículo | Langfuse tags + Supabase `rag_chunks` |
| Security | Defense funnel + safety distribution + jailbreak list | Langfuse tags + scores |
| Evals | Pass rates reales por categoría, parsed desde eval reports | `evals/results/` → embebidos en build |
| Voice | Sessions + text/voice split + rate limits | Langfuse tags + Supabase `voice_rate_limits` |
| System | Prompt versions + RAG docs + model pricing | Langfuse prompts API + Supabase |

### Arquitectura
```
Browser (/ops)
  └── OpsDashboard.tsx (lazy-loaded, auth gate, no GlobalNav/Chat/Music)
        └── useOpsApi hook → /api/ops/* (Edge) → Langfuse REST / Supabase REST

API Proxy Layer:
  api/ops/auth.js       → POST login (valida OPS_DASHBOARD_SECRET)
  api/ops/stats.js      → GET aggregated stats (server-side compute from traces)
  api/ops/traces.js     → GET traces con filtros (proxy a Langfuse)
  api/ops/trace/[id].js → GET trace detail + observations + scores + langfuseUrl
  api/ops/evals.js      → GET eval results (embebidos desde build)
  api/ops/prompts.js    → GET prompt versions (proxy a Langfuse)
  api/ops/rag-stats.js  → GET document stats (proxy a Supabase)
```

### Env vars requeridas (adicionales)
- `OPS_DASHBOARD_SECRET` — password del dashboard

## Contrato Chatbot ↔ Dashboard

**CRÍTICO: El dashboard lee datos del trace de Langfuse. Si cambias el formato, el dashboard se rompe.**

### Tags que el dashboard consume (de `chat.js` y `voice-trace.js`)

| Tag | Usado en | Dashboard lee |
|-----|----------|---------------|
| `es` / `en` | classifyIntent | Stats → distributions.languages |
| `voice` | voice-trace.js | Stats → text/voice split, Voice tab |
| `rag:yes` / `rag:no` | chat.js L478 | Stats → RAG activation, RAG tab |
| `jailbreak-attempt` | classifyIntent | Security tab → funnel + list |
| `prompt-leak-blocked` | chat.js leak detection | Security tab → funnel |
| `prompt-leak-detected` | voice-trace.js | Security tab → funnel |
| `topic:*` | classifyIntent | Overview → intent distribution |
| `greeting` | classifyIntent | Filtered as intent |

### Metadata fields que el dashboard consume (de `trace.metadata`)

```javascript
// chat.js — trace.update() en L477-491
metadata: {
  lang,                    // → ConversationList lang emoji
  messageCount,            // → trace detail
  lastUserMessage,         // → ConversationList preview, Detail fallback
  promptVersion,           // → trace detail
  ragUsed,                 // → filtering
  sources,                 // → trace detail (article_ids)
  ragDegraded,             // → RAG tab
  latencyBreakdown: {      // → ConversationDetail latency bars
    toolDecisionMs,
    embeddingMs,
    rerankMs,
    totalMs,
  },
  cost: {                  // → ALL cost displays (Overview, Costs tab, Detail)
    toolDecision,          //   NUNCA renombrar estos campos
    embedding,
    reranking,
    generation,
    total,
  },
}

// voice-trace.js — trace.update()
metadata: {
  durationMs,              // → Voice tab, Detail
  turnCount,               // → Detail
  userMessageCount,        // → Detail
  jailbreakDetected,       // → Security tab
  leakDetected,            // → Security tab
  cost: { voice, total },  // → Costs tab voice column
}
```

### trace.input / trace.output

- `chat.js` guarda `input: cleanMessages` (array de `{role, content}`) y `output: fullOutput` (string)
- El dashboard los usa para mostrar la conversación completa en ConversationDetail
- Si dejas de guardarlos, el detail mostrará "No messages" con fallback a `lastUserMessage`

### Scores que el dashboard consume

| Score name | Productor | Dashboard |
|------------|-----------|-----------|
| `quality` | scoreTrace() en chat.js | ConversationList quality pill, Detail |
| `safety` | scoreTrace() en chat.js | Stats avgSafetyScore, Security tab |
| `faithfulness` | scoreTrace() (solo si RAG) | Detail |

### Regla de oro

> Si añades un campo nuevo a `metadata` o `tags`: no rompe nada, el dashboard lo ignora.
> Si **renombras o eliminas** un campo existente: el dashboard muestra datos vacíos o incorrectos.
> Si cambias el nombre de un score: el dashboard no lo encuentra.

### Checklist antes de modificar chat.js

- [ ] ¿Cambié algún key en `metadata.cost`? → Actualizar `api/ops/stats.js` + `CostsTab.tsx`
- [ ] ¿Cambié algún key en `metadata.latencyBreakdown`? → Actualizar `ConversationDetail.tsx`
- [ ] ¿Cambié los tags de `classifyIntent`? → Actualizar `api/ops/stats.js` distributions
- [ ] ¿Cambié nombres de scores en `scoreTrace`? → Actualizar `ConversationList.tsx` + `SecurityTab.tsx`
- [ ] ¿Cambié la estructura de `trace.input`? → Actualizar `ConversationDetail.tsx` extractMessages()

## Evals

Suite de 71 tests automatizados en `../evals/`. Los resultados se embeben en el dashboard durante `npm run build` via `scripts/embed-evals.ts`.

```bash
npm run evals                    # Evals locales (requiere vercel dev)
CHAT_API_URL=https://santifer.io/api/chat npm run evals  # Contra producción
npm run adversarial              # Red team (20+ ataques auto-generados)
npm run prompt:regression -- --v1=production --v2=5      # Comparar prompts
```

### Categorías (10)
| Categoría | Tests | Tipo |
|-----------|-------|------|
| factual_accuracy | 9 | Determinista |
| persona_adherence | 4 | Determinista |
| boundary_testing | 7 | Determinista |
| response_quality | 7 | Mixto (det + LLM-judge) |
| safety_jailbreak | 7 | Determinista |
| language_handling | 5 | Determinista |
| rag_quality | 16 | Mixto |
| multi_turn | 5 | Mixto |
| source_badges | 5 | Determinista |
| voice_quality | 6 | Mixto |

**~70% deterministas** (contains, regex, wordCount) — rápidos, reproducibles, $0.
**~30% LLM-judge** (Haiku) — para calidad y tono donde no hay respuesta "correcta".

## Defensa (6 Capas)

1. **Keyword Detection** — 50+ patrones ES/EN, alerta por email vía Resend
2. **Canary Tokens** — UUID secreto, si aparece en output → bloqueo
3. **Fingerprinting** — 12 frases monitorizadas en cada respuesta
4. **Anti-Extraction** — Redirige a GitHub en vez de rechazar
5. **Online Safety Scoring** — Haiku evalúa safety (0-1) vía waitUntil
6. **Adversarial Red Team** — 20+ ataques evolutivos auto-generados

## LLMOps

### Observabilidad
- **Langfuse** — traces de cada conversación con costes, latencia, tokens
- **Online scoring** — Haiku evalúa calidad/seguridad en background (waitUntil)
- **Batch eval** — Cron diario con Sonnet, scoring multidimensional

### Prompt Management
- **Langfuse registry** — prompt versionado, hash-based sync (`npm run prompt:sync`)
- **Regression testing** — `npm run prompt:regression` compara v1 vs v2
- **Fallback** — si Langfuse no disponible, usa `chatbot-prompt.txt` local

### Closed Loop
```
Producción → Online Scoring → quality < 0.7 → Trace-to-eval → Nuevo test
                                                                    ↓
Producción ← Deploy ← CI gate (56 tests) ←─────────────────────────┘
```

### RAG Pipeline
- **Agentic** — Claude decide cuándo buscar (tool_use), ~60% no activan RAG
- **Hybrid search** — 70% semántico (pgvector) + 30% keyword (full-text)
- **Reranking** — Haiku selecciona top-5, diversifyByArticle evita dominancia
- **Graceful degradation** — 3 tiers: RAG completo → sin contexto → error amable
- **Sync** — `npm run rag:sync` re-exporta + ingesta chunks a Supabase

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run evals` | 71 tests automatizados |
| `npm run adversarial` | Red team (20+ ataques) |
| `npm run chats` | Últimas 50 conversaciones |
| `npm run chats -- --full` | Conversaciones con mensajes |
| `npm run chats -- --jailbreak` | Solo intentos de jailbreak |
| `npm run evaluate-traces` | Batch eval con Haiku |
| `npm run prompt:sync` | Sync prompt a Langfuse |
| `npm run prompt:regression` | Comparar versiones del prompt |
| `npm run rag:sync` | Re-indexar artículos en Supabase |

## Coste

- **<$0.005/conversación** desglosado por span
- **$0 infraestructura** (free tiers: Vercel, Supabase, Langfuse)
- **~$30/mes** estimado a 200 conv/día

## Deploy

El chatbot se deploya con el portfolio completo desde la raíz (`cv-santiago/`).

```bash
# Desde cv-santiago/ (raíz)
npm run build    # incluye prerender de todos los artículos
vercel --prod    # deploy a producción
```

Variables de entorno requeridas en Vercel:
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY` (embeddings)
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (RAG)
- `LANGFUSE_PUBLIC_KEY` + `LANGFUSE_SECRET_KEY` (observabilidad)
- `RESEND_API_KEY` (alertas de jailbreak)
- `OPS_DASHBOARD_SECRET` (password del dashboard `/ops`)

## Reglas

- El system prompt en producción vive en Langfuse, NO en el repo
- `chatbot-prompt.txt` es solo fallback — editarlo y correr `npm run prompt:sync`
- Cualquier cambio al prompt → `npm run prompt:regression` antes de promover
- Cualquier cambio al RAG content → `npm run rag:sync`
- Los evals son CI gate — si falla 1, el deploy se bloquea
- **Cualquier cambio a `chat.js` metadata/tags/scores → revisar el contrato dashboard arriba**
- El dashboard se embebe en build (`embed-evals.ts`) — los eval results se actualizan con cada build
- `/ops` está excluido de robots.txt, sitemap, y prerender
