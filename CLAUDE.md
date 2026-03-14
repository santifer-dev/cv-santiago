# CV Santiago - Portfolio Web Interactivo

## Second Brain Link

Este proyecto está vinculado al Second Brain de Santiago.

- **Tracking file:** `/Users/santifer/code/second-brain/01_CARRERA/cv-santiago.md`
- **Área:** `01_CARRERA`
- **Vault root:** `/Users/santifer/code/second-brain`
- **Bridge CLI:** `/Users/santifer/code/second-brain/_tools/sb-bridge.sh`

### Qué vive dónde

| Contenido | Ubicación |
|-----------|-----------|
| Tareas de alto nivel, decisiones, timeline, contactos | Vault: `01_CARRERA/cv-santiago.md` |
| Código, implementación, docs técnicos, arquitectura | Este directorio |
| Recursos (URLs, vídeos) | Vault: tabla de recursos en tracking file |
| Conocimiento consolidado (reutilizable) | Vault: `06_KNOWLEDGE/` |
| Stack, convenciones, skills del proyecto | Este CLAUDE.md |

### Reglas de interacción con el vault

1. **Leer contexto:** El hook SessionStart inyecta tareas y decisiones del tracking file automáticamente.
2. **Consultar vault:** Usar rutas absolutas para leer/editar archivos del vault:
   ```
   Read: /Users/santifer/code/second-brain/01_CARRERA/cv-santiago.md
   ```
3. **Actualizar tareas EN TIEMPO REAL:** Cuando completes una tarea o avances significativamente, actualiza el tracking file inmediatamente — no esperes al final de la sesión:
   ```
   Edit: /Users/santifer/code/second-brain/01_CARRERA/cv-santiago.md
   old: - [ ] Tarea completada
   new: - [x] Tarea completada _(completado: YYYY-MM-DD)_
   ```
4. **Registrar decisiones:** Cada decisión importante se registra en la tabla de Decisiones del tracking file en el momento, con fecha, razonamiento y revisabilidad.
5. **Bridge CLI:** Para consultas rápidas desde terminal:
   ```bash
   /Users/santifer/code/second-brain/_tools/sb-bridge.sh status 01_CARRERA/cv-santiago.md
   /Users/santifer/code/second-brain/_tools/sb-bridge.sh search "query"
   ```

### Responsabilidad de sync (IMPORTANTE)

El tracking file en el vault es la **fuente de verdad** del estado del proyecto. Este agente es responsable de mantenerlo actualizado durante la sesión:

- **Tarea completada** → marcar `[x]` inmediatamente
- **Decisión tomada** → añadir fila a tabla de Decisiones
- **Recurso nuevo encontrado** → añadir a tabla de Recursos
- **Bloqueo o cambio de plan** → actualizar notas en Conocimiento / Notas

### Lo que NO hacer

- NO duplicar tareas aquí — las tareas de alto nivel viven en el vault
- NO crear un sistema de tracking paralelo — usar el tracking file
- NO copiar recursos del vault — referenciarlos por ruta
- NO dejar actualizaciones para "después" — escribir al vault en el momento

---

CV web de Santiago Fernández de Valderrama con chat IA integrado.

- **URL**: https://santifer.io
- **Repo**: github.com/santifer/cv-santiago

## Stack

- React 19 + TypeScript + Vite
- Motion (animaciones con IntersectionObserver)
- Tailwind CSS con tokens semánticos
- Lucide icons
- react-markdown (para respuestas del chat)
- recharts (gráficos del dashboard ops)
- Anthropic SDK (chat con Claude)

## Estructura

```
src/
├── App.tsx              # CV completo con todas las secciones
├── FloatingChat.tsx     # Widget de chat flotante
├── GlobalNav.tsx        # Nav unificada con breadcrumbs dinámicos
├── i18n.ts              # Traducciones ES/EN hardcodeadas (home)
├── main.tsx             # Entry con React Router + rutas dinámicas desde registry
├── articles/
│   ├── registry.ts      # Config centralizada de todos los artículos (slugs, SEO, secciones)
│   ├── components.tsx   # Componentes compartidos (Header, Footer, FAQ, Lessons, Metrics...)
│   └── json-ld.ts       # Builder genérico de JSON-LD para artículos
├── N8nForPMs.tsx        # Artículo: n8n for PMs (collab con Marily)
├── n8n-i18n.ts          # Contenido bilingüe n8n article
├── JacoboAgent.tsx      # Case study: Agente IA Jacobo
├── jacobo-i18n.ts       # Contenido bilingüe Jacobo
├── BusinessOS.tsx       # Case study: Business OS / ERP
├── business-os-i18n.ts  # Contenido bilingüe Business OS
├── ProgrammaticSeo.tsx  # Case study: SEO Programático
├── pseo-i18n.ts         # Contenido bilingüe pSEO
└── ops/                 # Dashboard LLMOps privado (/ops)
    ├── OpsDashboard.tsx  # Shell + Overview tab + auth gate
    ├── OpsAuth.tsx       # Pantalla de login
    ├── types.ts          # Interfaces compartidas (contrato API ↔ UI)
    ├── hooks/            # useOpsApi, useTraces
    ├── components/       # KpiCard, MetricChart, TabNav, FilterBar, etc.
    └── tabs/             # ConversationsTab, CostsTab, SecurityTab, etc.
api/
├── chat.js              # Edge function con system prompt completo
├── _shared/ops-auth.js  # Auth helper para dashboard
└── ops/                 # API proxy layer para dashboard
    ├── auth.js           # Login
    ├── stats.js          # Aggregated stats
    ├── traces.js         # List traces con filtros
    ├── trace/[id].js     # Trace detail
    ├── evals.js          # Eval results (embebidos en build)
    ├── prompts.js        # Prompt versions
    └── rag-stats.js      # RAG document stats
public/
├── foto-avatar.png  # Avatar estilo flat illustration
├── favicon.ico      # Favicon para legacy browsers
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png    # iOS
└── android-chrome-192x192.png  # Android PWA
```

## i18n

- **ES** por defecto (`/`)
- **EN** en `/en`
- Toggle en header (botón ES/EN)
- El chat detecta el idioma y adapta greeting + prompts

## Chat "Santi" - Decisiones de Diseño

Basado en research de mejores prácticas (ver `../chat-recomendations.md`).

### Personalidad
- Habla en primera persona como Santiago
- Tono: profesional pero cercano ("como un café con un reclutador")
- Respuestas concisas: máximo 2-3 oraciones
- Usa métricas concretas cuando aplica

### Quick Prompts (4 botones)
1. Experiencia con IA
2. Proyectos destacados
3. ¿Por qué contratarle?
4. Contactar

### Contact CTA
Aparece automáticamente después de 2+ mensajes del usuario. Ofrece email directo.

### System Prompt
Ubicado en `api/chat.js`. Contiene:
- Perfil completo de Santiago
- Competencias core
- Experiencia detallada (Santifer iRepair, LICO, Everis)
- Sistemas construidos (Jacobo, Web Programática, ERP, GPTs, Reservas, CRM)
- Tech stack
- Formación y certificaciones
- Instrucciones de comportamiento

### Modelo
- `claude-sonnet-4-5-20250929`
- Streaming via SSE
- max_tokens: 500
- Edge runtime en Vercel

## Avatar

Estilo **flat illustration** profesional. Decisiones en `../estilos-chat-avatar.md`:
- Clean vector-style con formas geométricas simplificadas
- Paleta limitada (4-5 colores)
- Estilo similar a Notion/Linear

## Diseño Visual

- Dark mode por defecto
- Tokens: `bg-background`, `text-foreground`, `text-primary`, `text-accent`
- Fuente display: Space Grotesk
- Gradientes: `bg-gradient-theme`, `text-gradient-theme`
- Cards con hover effects y glassmorphism en hero
- Highlights de tarjetas alineados abajo (flex + mt-auto)

## Secciones del CV

1. **Hero** - foto + nombre + rol + contacto + target roles (separados con línea sutil)
2. **Resumen Profesional** - 3 cards
3. **Competencias Core** - 6 items grid
4. **Experiencia - Bento Grid**:
   - Tarjeta grande: **Agente AI Omnicanal "Jacobo"** (sub-agentes técnicos, tool calling, HITL)
   - Tarjeta grande: **Web Programática + SEO Automatizado** (única en sector España, 2024)
   - Tarjetas pequeñas: ERP, GPTs, Reservas, CRM
   - Tarjeta Exit 2025
5. **LICO Cosmetics + Everis**
6. **Proyectos** (santifer.io, Claude Pulse, Content Digest) + enlace GitHub
7. **Claude Code Power User** badge
8. **Educación + Certificaciones** (2 columnas)
9. **Skills + Tech Stack**
10. **Footer CTA**

## Comandos

```bash
npm run dev      # localhost:5173
npm run build    # build producción
npm run preview  # preview del build
npm run evals    # ejecutar suite de evaluaciones del chatbot
```

## Article Boilerplate

Todos los artículos se gestionan desde `src/articles/registry.ts`:
- **Registry**: config centralizada (slugs, SEO, secciones, tipo)
- **Componentes compartidos**: `AnchorHeading`, `ArticleHeader`, `ArticleFooter`, `FaqSection`, `ResourcesList`, `LessonsSection`, `MetricsGrid`, `CaseStudyCta`
- **JSON-LD builder**: `buildArticleJsonLd()` — genera Person, WebSite, BreadcrumbList, FAQPage, HowTo
- **Prerender**: loop genérico sobre registry (skip graceful si componente no existe aún)
- **GlobalNav**: breadcrumbs y lang toggle derivados del registry
- **Routes**: generados dinámicamente en `main.tsx` desde registry

### Artículos publicados

| Artículo | Slugs | Tipo |
|----------|-------|------|
| n8n for PMs | `/n8n-para-pms` + `/n8n-for-pms` | collab |
| Jacobo AI Agent | `/ai-agent-jacobo` | case-study |
| Business OS | `/business-os` | case-study |
| SEO Programático | `/seo-programatico` + `/programmatic-seo` | case-study |

### Añadir un artículo nuevo

1. Crear `src/{slug}-i18n.ts` con contenido bilingüe
2. Crear `src/{Component}.tsx` usando componentes de `articles/components.tsx`
3. Añadir entrada en `src/articles/registry.ts`
4. `npm run build` — automáticamente genera rutas, nav, prerender y JSON-LD

### SEO Validation

`scripts/validate-articles.ts` valida SEO en build-time (fechas, keywords, títulos, OG images, etc.):
- `npm run validate-articles` — check mode (errors rompen build)
- `npm run validate-articles:fix` — auto-corrige fechas desde git

Cuando reporta `OG image missing` → usar `/og-image {article-id}` para generarla con Gemini MCP.

## Deploy

Vercel con edge function para `/api/chat`.

Variables de entorno requeridas:
- `ANTHROPIC_API_KEY` - API key de Anthropic

```bash
vercel --prod    # deploy a producción
```

## Observabilidad (LLMOps)

El chatbot implementa observabilidad de nivel producción con **Langfuse** + dashboard custom:

### Dashboard `/ops`
Dashboard privado (password-protected) en https://santifer.io/ops. Ver detalles completos en `chatbot/CLAUDE.md`.
Contiene 8 tabs: Overview, Conversations, Costs, RAG, Security, Evals, Voice, System.
**Contrato:** Si modificas `chat.js` metadata/tags/scores, revisa la sección "Contrato Chatbot ↔ Dashboard" en `chatbot/CLAUDE.md`.

### Capa 1: Telemetría en tiempo real
- Traces de cada conversación
- Métricas de latencia y tokens
- Tags automáticos por keywords (jailbreak, topic, idioma)

### Capa 2: LLM-as-Judge en batch
Script que evalúa trazas periódicamente con Claude Haiku:

```bash
npm run evaluate-traces           # Últimas 24h
npm run evaluate-traces --hours=1 # Última hora
```

Añade scores a Langfuse:
- `intent_category` - Clasificación de intención
- `response_quality` - Calidad de respuesta (0-1)
- `safety_score` - Seguridad (0-1)
- `jailbreak_attempt` - Flag de intento de manipulación

### Capa 3: Evals pre-deploy
Suite de 31 tests automatizados: `npm run evals`

### Variables de entorno
- `LANGFUSE_PUBLIC_KEY`
- `LANGFUSE_SECRET_KEY`
- `LANGFUSE_BASE_URL` (opcional, default US)

Dashboard: https://cloud.langfuse.com

### Investigar chatbot en producción (CLI)

Comandos disponibles para debugging y análisis directo desde Claude Code:

| Comando | Uso |
|---------|-----|
| `npm run chats` | Lista resumen de últimas 50 conversaciones |
| `npm run chats -- --full` | Conversaciones completas con mensajes (10 últimas) |
| `npm run chats -- --full --limit=20` | Últimas 20 conversaciones completas |
| `npm run chats -- --jailbreak` | Solo intentos de jailbreak |
| `npm run chats -- --days=7` | Últimos 7 días |
| `npm run chats -- --view=5` | Ver conversación #5 en detalle |
| `npm run evaluate-traces` | Evaluar trazas recientes con Haiku (calidad, seguridad, intent) |
| `npm run evaluate-traces --hours=1` | Solo última hora |
| `npm run adversarial` | Red teaming: 20 ataques generados por Sonnet |
| `npm run adversarial -- --attacks=30` | Red teaming con 30 ataques |
| `npm run prompt:regression -- --v1=production --v2=5` | Comparar dos versiones del prompt |
| `npm run prompt:sync` | Subir prompt actual a Langfuse (smart: solo si cambió) |
| `npm run rag:sync` | Re-exportar + ingestar chunks RAG a Supabase |
| `CHAT_API_URL=https://santifer.io/api/chat npm run evals` | Evals contra producción |

**Cuándo usar cada uno:**
- El usuario pide analizar respuestas recientes → `npm run chats -- --full`
- Se desplegó un cambio en el chatbot → `npm run evals` + `npm run evaluate-traces --hours=1`
- Sospecha de jailbreak → `npm run chats -- --jailbreak` + `npm run adversarial`
- Cambió el prompt → `npm run prompt:regression` antes de promover
- Cambió contenido de artículos → `npm run rag:sync`

## Evals - Suite de Evaluaciones

Suite profesional de tests para validar la calidad del chatbot. Ver `evals/README.md`.

```
evals/
├── datasets/        # Tests en JSON por categoría
├── assertions.ts    # Funciones de assertion deterministas
├── llm-judge.ts     # Evaluador subjetivo con Haiku
├── runner.ts        # Script principal
└── results/         # Reportes generados
```

**Categorías evaluadas:**
- Precisión factual (7 tests)
- Consistencia de personaje (4 tests)
- Respeto de límites (5 tests)
- Manejo de idiomas (5 tests)
- Calidad de respuestas (5 tests)
- Seguridad/jailbreaks (5 tests)

**Ejecución:**
- Local: `vercel dev` + `npm run evals`
- Producción: `CHAT_API_URL=https://santifer.io/api/chat npm run evals`

## Archivos de Referencia (en directorio padre)

- `cv.md` - CV completo en markdown
- `chat-recomendations.md` - Research de mejores prácticas para chatbots
- `estilos-chat-avatar.md` - Opciones de estilos de avatar
- `meta_prompt.md` - Template de system prompt
- `prompts-transform-avatar.md` - Prompts para generar avatares
