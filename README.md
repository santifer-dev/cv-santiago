# santifer.io

**[:gb: English](#the-problem)** | **[:es: Español](#es-versión-en-español)**

> Interactive CV with AI-powered chat, production LLMOps, and narrative animations

[![Live Demo](https://img.shields.io/badge/demo-santifer.io-blue?style=flat-square)](https://santifer.io)
[![Built with Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-blueviolet?style=flat-square)](https://claude.ai/code)

---

## The Problem

Static CVs don't show what you can actually build. A PDF lists skills — it doesn't prove them.

## The Solution

A production-grade interactive portfolio that **demonstrates the skills it describes**: AI integration with a chatbot that answers as me, full LLMOps observability pipeline, automated evals, bilingual support, and narrative animations — all deployed on the edge.

**Key Features:**
- **AI Chatbot "santifer"** — Claude Sonnet 4.5 with streaming SSE, responds in first person as me. Includes jailbreak detection with real-time email alerts
- **Reflective Typewriter** — State machine (useReducer) that writes, pauses to "think", erases, and rewrites with 3 synchronized highlight types
- **Production LLMOps** — Langfuse tracing, 31+ automated evals across 6 categories, daily cron evaluator, prompt versioning
- **Bilingual ES/EN** — URL-based routing (`/` Spanish, `/en` English) with SEO hreflang, language suggestion banner
- **Dark/Light mode** — HSL semantic design tokens with smooth transitions
- **GEO-ready** — `llms.txt`, structured data (JSON-LD), AI crawler-friendly robots.txt
- **Mobile-first** — iOS safe areas, keyboard handling, fullscreen chat on mobile

---

## Tech Stack

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-FF4154?style=flat&logo=framer&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_API-191919?style=flat&logo=anthropic&logoColor=white)
![Langfuse](https://img.shields.io/badge/Langfuse-000000?style=flat&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel_Edge-000000?style=flat&logo=vercel&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=flat&logoColor=white)

---

## LLMOps Pipeline

This isn't a toy chatbot — it runs a full observability and evaluation pipeline:

| Layer | Implementation |
|-------|----------------|
| **Tracing** | Langfuse — every conversation logged with latency, tokens, model version, cost |
| **Evals** | 31+ tests across 6 datasets: factual accuracy, persona adherence, boundaries, bilingual, quality, safety |
| **LLM-as-Judge** | Claude Haiku evaluates subjective tone and quality metrics |
| **Daily Cron** | Vercel cron at 08:00 — batch evaluates last 24h of traces |
| **Alerts** | Resend email alerts on jailbreak attempts and low safety scores |
| **Prompt Caching** | Anthropic ephemeral cache on system prompt for cost optimization |
| **CLI Tools** | `npm run chats` (history), `npm run chats:tui` (interactive TUI), `npm run evaluate-traces` |

### Eval Datasets

| Dataset | Tests | What it covers |
|---------|-------|----------------|
| `factual.json` | 9 | Career facts, dates, certifications |
| `persona.json` | 4 | First-person voice, tone, personality |
| `boundaries.json` | 7 | Off-topic rejection, salary, personal |
| `languages.json` | 5 | Bilingual responses, language detection |
| `quality.json` | 7 | Conciseness, relevance, helpfulness |
| `safety.json` | 7 | Jailbreak resistance, prompt injection, DAN |

---

## Quick Start

```bash
git clone https://github.com/santifer-dev/cv-santiago.git
cd cv-santiago
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173)

### Environment Variables

For the chatbot and LLMOps features:

```bash
ANTHROPIC_API_KEY=        # Claude API
LANGFUSE_SECRET_KEY=      # Tracing
LANGFUSE_PUBLIC_KEY=      # Tracing
LANGFUSE_HOST=            # Langfuse endpoint
RESEND_API_KEY=           # Jailbreak email alerts
```

---

## Project Structure

```
src/
├── App.tsx              # Full CV — all sections (hero, story, experience, education, projects)
├── FloatingChat.tsx     # AI chat widget (fullscreen mobile, floating desktop)
├── i18n.ts              # Complete ES/EN translations (1000+ lines)
├── index.css            # HSL design tokens (dark/light, 2 color profiles)
└── main.tsx             # React Router (/ and /en)

api/
├── chat.js              # Edge function — Claude streaming + Langfuse tracing
└── cron/evaluate.js     # Daily batch evaluator (Vercel cron)

evals/
├── datasets/            # 6 JSON datasets (31+ test cases)
├── assertions.ts        # Deterministic assertion functions
├── llm-judge.ts         # LLM-as-Judge with Claude Haiku
└── runner.ts            # Eval runner

scripts/
├── chats.ts             # CLI — view chat history from Langfuse
├── chats-tui.ts         # Interactive TUI for navigating conversations
├── evaluate-traces.ts   # Local batch evaluator
└── update-prompt.sh     # Push prompt updates to Vercel env

public/
├── llms.txt             # AI crawler context (GEO)
├── sitemap.xml          # Bilingual sitemap with hreflang
└── robots.txt           # AI-friendly (GPTBot, ClaudeBot, PerplexityBot)
```

---

## License

MIT

---

---

# :es: Versión en Español

> CV interactivo con chat IA, pipeline LLMOps en producción y animaciones narrativas

[![Demo en vivo](https://img.shields.io/badge/demo-santifer.io-blue?style=flat-square)](https://santifer.io)

---

## El Problema

Los CVs estáticos no demuestran lo que realmente sabes construir. Un PDF lista habilidades — no las prueba.

## La Solución

Un portfolio interactivo de nivel producción que **demuestra las habilidades que describe**: integración IA con un chatbot que responde como yo, pipeline completo de observabilidad LLMOps, evals automatizados, soporte bilingüe y animaciones narrativas — todo desplegado en el edge.

**Funcionalidades:**
- **Chatbot IA "santifer"** — Claude Sonnet 4.5 con streaming SSE, responde en primera persona como yo. Incluye detección de jailbreak con alertas por email en tiempo real
- **Typewriter reflexivo** — Máquina de estados (useReducer) que escribe, pausa para "pensar", borra y reescribe con 3 tipos de highlight sincronizados
- **LLMOps en producción** — Tracing con Langfuse, 31+ evals automatizados en 6 categorías, evaluador cron diario, versionado de prompts
- **Bilingüe ES/EN** — Routing por URL (`/` español, `/en` inglés) con SEO hreflang, banner de sugerencia de idioma
- **Modo oscuro/claro** — Tokens de diseño semánticos HSL con transiciones suaves
- **GEO-ready** — `llms.txt`, datos estructurados (JSON-LD), robots.txt amigable con crawlers IA
- **Mobile-first** — Safe areas iOS, manejo de teclado, chat fullscreen en móvil

---

## Stack Técnico

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-FF4154?style=flat&logo=framer&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_API-191919?style=flat&logo=anthropic&logoColor=white)
![Langfuse](https://img.shields.io/badge/Langfuse-000000?style=flat&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel_Edge-000000?style=flat&logo=vercel&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=flat&logoColor=white)

---

## Pipeline LLMOps

No es un chatbot de juguete — ejecuta un pipeline completo de observabilidad y evaluación:

| Capa | Implementación |
|------|----------------|
| **Tracing** | Langfuse — cada conversación registrada con latencia, tokens, versión del modelo, coste |
| **Evals** | 31+ tests en 6 datasets: precisión factual, adherencia a persona, límites, bilingüe, calidad, seguridad |
| **LLM-as-Judge** | Claude Haiku evalúa métricas subjetivas de tono y calidad |
| **Cron diario** | Vercel cron a las 08:00 — evalúa batch de trazas de las últimas 24h |
| **Alertas** | Emails via Resend ante intentos de jailbreak y scores de seguridad bajos |
| **Prompt Caching** | Cache ephemeral de Anthropic en system prompt para optimizar costes |
| **CLI Tools** | `npm run chats` (historial), `npm run chats:tui` (TUI interactiva), `npm run evaluate-traces` |

### Datasets de Evaluación

| Dataset | Tests | Qué cubre |
|---------|-------|-----------|
| `factual.json` | 9 | Datos de carrera, fechas, certificaciones |
| `persona.json` | 4 | Voz en primera persona, tono, personalidad |
| `boundaries.json` | 7 | Rechazo de off-topic, salario, personal |
| `languages.json` | 5 | Respuestas bilingües, detección de idioma |
| `quality.json` | 7 | Concisión, relevancia, utilidad |
| `safety.json` | 7 | Resistencia a jailbreak, prompt injection, DAN |

---

## Inicio Rápido

```bash
git clone https://github.com/santifer-dev/cv-santiago.git
cd cv-santiago
npm install
npm run dev
```

Abrir [localhost:5173](http://localhost:5173)

### Variables de Entorno

Para el chatbot y las funcionalidades LLMOps:

```bash
ANTHROPIC_API_KEY=        # Claude API
LANGFUSE_SECRET_KEY=      # Tracing
LANGFUSE_PUBLIC_KEY=      # Tracing
LANGFUSE_HOST=            # Endpoint de Langfuse
RESEND_API_KEY=           # Alertas de jailbreak por email
```

---

## Estructura del Proyecto

```
src/
├── App.tsx              # CV completo — todas las secciones (hero, story, experiencia, formación, proyectos)
├── FloatingChat.tsx     # Widget de chat IA (fullscreen móvil, flotante desktop)
├── i18n.ts              # Traducciones completas ES/EN (1000+ líneas)
├── index.css            # Tokens de diseño HSL (dark/light, 2 perfiles de color)
└── main.tsx             # React Router (/ y /en)

api/
├── chat.js              # Edge function — Claude streaming + tracing Langfuse
└── cron/evaluate.js     # Evaluador batch diario (Vercel cron)

evals/
├── datasets/            # 6 datasets JSON (31+ test cases)
├── assertions.ts        # Funciones de assertion deterministas
├── llm-judge.ts         # LLM-as-Judge con Claude Haiku
└── runner.ts            # Runner de evaluaciones

scripts/
├── chats.ts             # CLI — ver historial de chats desde Langfuse
├── chats-tui.ts         # TUI interactiva para navegar conversaciones
├── evaluate-traces.ts   # Evaluador batch local
└── update-prompt.sh     # Push de actualizaciones del prompt a Vercel env

public/
├── llms.txt             # Contexto para crawlers IA (GEO)
├── sitemap.xml          # Sitemap bilingüe con hreflang
└── robots.txt           # AI-friendly (GPTBot, ClaudeBot, PerplexityBot)
```

---

## Licencia

MIT

---

## Let's Connect

[![Website](https://img.shields.io/badge/santifer.io-000?style=for-the-badge&logo=safari&logoColor=white)](https://santifer.io)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/santifer)
[![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hola@santifer.io)
