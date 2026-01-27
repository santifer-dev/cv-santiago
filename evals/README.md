# Evals Suite - Chatbot "Santi"

Suite de evaluaciones profesionales para el chatbot de CV que habla como Santiago.

## Qué son los Evals

Los **evals** son tests sistemáticos para medir la calidad de un sistema de IA:

- **Accuracy** - ¿Responde con información correcta?
- **Persona adherence** - ¿Mantiene el personaje?
- **Safety** - ¿Rechaza lo que debe rechazar?
- **Quality** - ¿Las respuestas son útiles y concisas?

## Categorías de Tests

| Categoría | Tests | Target |
|-----------|-------|--------|
| `factual_accuracy` | 7 | 100% |
| `persona_adherence` | 4 | 95%+ |
| `boundary_testing` | 5 | 100% |
| `language_handling` | 5 | 100% |
| `response_quality` | 5 | 90%+ |
| `safety_jailbreak` | 5 | 100% |

## Cómo Ejecutar

**Opción 1: Local con Vercel Dev** (recomendado para desarrollo)
```bash
# Terminal 1: Iniciar servidor con edge functions
vercel dev

# Terminal 2: Ejecutar evals
npm run evals
```

**Opción 2: Contra producción** (para validar el deploy)
```bash
CHAT_API_URL=https://santifer.io/api/chat npm run evals
```

> **Nota:** `npm run dev` (Vite) no sirve las edge functions de `/api/chat`. Usa `vercel dev` para desarrollo local.

## Estructura

```
evals/
├── README.md           # Esta documentación
├── datasets/           # Tests en formato JSON
│   ├── factual.json    # Precisión factual
│   ├── persona.json    # Consistencia de personaje
│   ├── boundaries.json # Tests de límites
│   ├── languages.json  # Comportamiento bilingüe
│   ├── quality.json    # Calidad de respuestas
│   └── safety.json     # Seguridad y jailbreaks
├── assertions.ts       # Funciones de assertion
├── llm-judge.ts        # Evaluador con Haiku
├── runner.ts           # Script principal
└── results/            # Reportes generados
```

## Tipos de Assertions

### Deterministas (90% de tests)

| Tipo | Descripción |
|------|-------------|
| `contains` | Contiene texto exacto |
| `contains_any` | Contiene al menos uno de los valores |
| `not_contains` | NO contiene el texto |
| `max_words` | Máximo N palabras |
| `min_words` | Mínimo N palabras |
| `regex` | Match de patrón regex |
| `language` | Detecta idioma (ES/EN) |

### Con LLM Judge (10% de tests)

| Tipo | Descripción |
|------|-------------|
| `llm_judge` | Haiku evalúa según criterio subjetivo |

## Formato de Dataset

```json
{
  "name": "categoria_nombre",
  "description": "Descripción de qué evalúa",
  "tests": [
    {
      "id": "test-id",
      "description": "Qué verifica este test",
      "input": "Pregunta al chatbot",
      "lang": "es",
      "assertions": [
        { "type": "contains", "value": "texto esperado" },
        { "type": "llm_judge", "criteria": "criterio subjetivo" }
      ]
    }
  ]
}
```

## Reporte de Resultados

Después de cada ejecución se genera un reporte en `results/report-YYYY-MM-DD.md` con:

- Resumen general
- Pass rate por categoría
- Detalle de cada test con input, response y assertions

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `CHAT_API_URL` | `http://localhost:3000/api/chat` | URL del API del chat |
| `ANTHROPIC_API_KEY` | (requerido para LLM judge) | API key de Anthropic |

### Configurar API Key (para LLM Judge)

```bash
# Copia el ejemplo y añade tu key
cp evals/.env.example evals/.env.local

# Edita el archivo con tu key real
# El archivo .env.local está en .gitignore (no se sube a GitHub)
```

**Nota:** Sin `ANTHROPIC_API_KEY`, el test `tone-quality` fallará. Los demás 30 tests (deterministas) funcionan sin esta variable.

## Valor para el CV

Esta suite demuestra competencias en:

- **AI Product Discovery** - Definición de métricas de calidad
- **LLMOps Foundations** - Testing sistemático de LLMs
- **Reliability & Ops** - Garantía de calidad en producción
- **Forward-Deployed Delivery** - Soluciones completas y medibles
