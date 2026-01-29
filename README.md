# santifer.io

**[:gb: English](#features)** | **[:es: Español](#es-versión-en-español)**

> Interactive CV with AI-powered chat — Ask my avatar anything

[![Live Demo](https://img.shields.io/badge/demo-santifer.io-blue?style=flat-square)](https://santifer.io)
[![Built with Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-blueviolet?style=flat-square)](https://claude.ai/code)

---

## Features

- **AI Chatbot "Santi"** — Claude API with streaming SSE, answers as me in first person
- **Story Section Animations** — 3-type highlight system with synchronized transitions
- **i18n ES/EN** — URL-based routing (`/` Spanish, `/en` English)
- **Mobile-first** — iOS keyboard handling, responsive design
- **Edge Functions** — Vercel Edge runtime for low latency
- **Dark mode** — Semantic design tokens throughout
- **Natural typewriter** — Variable delays for human-like feel
- **Quick prompts** — Pre-built questions for recruiters

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4, Motion |
| AI | Claude API, Streaming SSE |
| LLMOps | Langfuse, Evals |
| Deploy | Vercel Edge Functions |

---

## LLMOps & Observability

This project implements production-grade LLM practices:

| Practice | Implementation |
|----------|----------------|
| **Observability** | [Langfuse](https://langfuse.com) for tracing, metrics & cost tracking |
| **Telemetry** | Every conversation logged with latency, tokens, model version |
| **Evals** | 31 automated tests covering accuracy, persona, safety |
| **Prompt Caching** | Anthropic ephemeral cache for cost optimization |

### Why This Matters

For AI Product Managers, FDEs, and Solutions Architects, understanding LLMOps is critical:
- **Debug production issues** with full conversation traces
- **Track costs** per conversation and optimize spend
- **Measure quality** with automated evaluations
- **Version prompts** and compare performance

---

## Quick Start

```bash
# Clone
git clone https://github.com/santifer-dev/cv-santiago.git
cd cv-santiago

# Install & run
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173)

---

## Project Structure

```
src/
├── App.tsx           # Full CV with all sections
├── FloatingChat.tsx  # AI chat widget
├── i18n.ts           # ES/EN translations
└── main.tsx          # Entry with React Router

api/
└── chat.js           # Edge function with system prompt

public/
└── foto-avatar.png   # Flat illustration avatar
```

---

## Why I Built This

> An interactive portfolio with integrated AI chat says more than a PDF ever could.

This project demonstrates:

- **AI Integration** — Production-ready Claude API implementation with streaming
- **Full-stack ownership** — From design tokens to edge functions
- **Attention to UX** — Mobile keyboard handling, natural typing animations, bilingual support
- **Modern stack mastery** — React 19, Tailwind v4, Vercel Edge

Built with Claude Code — when you know what you want and can describe it with technical precision, execution speed is brutal.

---

## Claude Code Ecosystem

This project is part of a suite of tools built with Claude Code:

| Project | Description | Link |
|---------|-------------|------|
| **Claudable** | Meta-project with skills, MCPs, and templates for professional web development | [GitHub](https://github.com/santifer-dev/claudable) |
| **Claude Eye** | CLI tool for debugging CSS animations using Claude Vision (frame-by-frame analysis) | [GitHub](https://github.com/santifer-dev/claude-eye) |
| **Claude Pulse** | Real-time AI coding assistant status and notifications | [GitHub](https://github.com/santifer-dev/claude-pulse) |

---

## About Me

**Santiago Fernández de Valderrama**
AI Product Manager • Solutions Architect • FDE

I build AI-powered products that solve real business problems. 10+ years turning complex tech into value.

[:link: LinkedIn](https://linkedin.com/in/santifer) • [:envelope: santiago@santifer.io](mailto:santiago@santifer.io)

---

---

# :es: Versión en Español

> CV interactivo con chat IA integrado — Pregúntale lo que quieras a mi avatar

[![Demo en vivo](https://img.shields.io/badge/demo-santifer.io-blue?style=flat-square)](https://santifer.io)

---

## Funcionalidades

- **Chatbot IA "Santi"** — Claude API con streaming SSE, responde como yo en primera persona
- **Animaciones Story Section** — Sistema de 3 tipos de highlights con transiciones sincronizadas
- **i18n ES/EN** — Routing por URL (`/` español, `/en` inglés)
- **Mobile-first** — Manejo de teclado iOS, diseño responsive
- **Edge Functions** — Vercel Edge runtime para baja latencia
- **Dark mode** — Tokens de diseño semánticos
- **Typewriter natural** — Delays variables para efecto humano
- **Quick prompts** — Preguntas predefinidas para reclutadores

---

## Stack Técnico

| Categoría | Tecnologías |
|-----------|-------------|
| Frontend | React 19, TypeScript, Vite |
| Estilos | Tailwind CSS v4, Motion |
| IA | Claude API, Streaming SSE |
| LLMOps | Langfuse, Evals |
| Deploy | Vercel Edge Functions |

---

## LLMOps y Observabilidad

Este proyecto implementa prácticas LLM de nivel producción:

| Práctica | Implementación |
|----------|----------------|
| **Observabilidad** | [Langfuse](https://langfuse.com) para tracing, métricas y costes |
| **Telemetría** | Cada conversación registrada con latencia, tokens, versión del modelo |
| **Evals** | 31 tests automatizados cubriendo precisión, persona, seguridad |
| **Prompt Caching** | Cache ephemeral de Anthropic para optimización de costes |

### Por Qué Importa

Para AI Product Managers, FDEs y Solutions Architects, entender LLMOps es crítico:
- **Debug en producción** con trazas completas de conversación
- **Control de costes** por conversación y optimización de gasto
- **Medir calidad** con evaluaciones automatizadas
- **Versionar prompts** y comparar rendimiento

---

## Inicio Rápido

```bash
# Clonar
git clone https://github.com/santifer-dev/cv-santiago.git
cd cv-santiago

# Instalar y ejecutar
npm install
npm run dev
```

Abrir [localhost:5173](http://localhost:5173)

---

## Estructura del Proyecto

```
src/
├── App.tsx           # CV completo con todas las secciones
├── FloatingChat.tsx  # Widget de chat IA
├── i18n.ts           # Traducciones ES/EN
└── main.tsx          # Entry con React Router

api/
└── chat.js           # Edge function con system prompt

public/
└── foto-avatar.png   # Avatar estilo flat illustration
```

---

## Por Qué Lo Construí

> Un portfolio interactivo con chat IA integrado dice más que un PDF.

Este proyecto demuestra:

- **Integración IA** — Implementación production-ready de Claude API con streaming
- **Ownership full-stack** — Desde design tokens hasta edge functions
- **Atención al UX** — Manejo de teclado móvil, animaciones naturales, soporte bilingüe
- **Dominio del stack moderno** — React 19, Tailwind v4, Vercel Edge

Construido con Claude Code — cuando sabes lo que quieres y puedes describirlo con precisión técnica, la velocidad de ejecución es brutal.

---

## Ecosistema Claude Code

Este proyecto forma parte de un conjunto de herramientas construidas con Claude Code:

| Proyecto | Descripción | Enlace |
|----------|-------------|--------|
| **Claudable** | Metaproyecto con skills, MCPs y templates para desarrollo web profesional | [GitHub](https://github.com/santifer-dev/claudable) |
| **Claude Eye** | CLI para debugging de animaciones CSS usando Claude Vision (análisis frame-by-frame) | [GitHub](https://github.com/santifer-dev/claude-eye) |
| **Claude Pulse** | Estado y notificaciones en tiempo real del asistente de código IA | [GitHub](https://github.com/santifer-dev/claude-pulse) |

---

## Sobre Mí

**Santiago Fernández de Valderrama**
AI Product Manager • Solutions Architect • FDE

Construyo productos con IA que resuelven problemas reales de negocio. 10+ años convirtiendo tecnología compleja en valor.

---

## Let's Connect

[![Website](https://img.shields.io/badge/santifer.io-000?style=for-the-badge&logo=safari&logoColor=white)](https://santifer.io)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/santifer)
[![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hola@santifer.io)
