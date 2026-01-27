/**
 * LLM Judge usando Claude Haiku para evaluaciones subjetivas
 */

import Anthropic from '@anthropic-ai/sdk'

// Cliente lazy - se inicializa cuando se usa, no al importar el módulo
let client: Anthropic | null = null
function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic()
  }
  return client
}

export interface JudgeResult {
  pass: boolean
  reason: string
}

/**
 * Usa Claude Haiku para evaluar si una respuesta cumple criterios subjetivos
 */
export async function judgeTone(
  response: string,
  criteria: string
): Promise<JudgeResult> {
  try {
    const result = await getClient().messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Evalúa si esta respuesta de un chatbot cumple el criterio especificado.

Criterio: ${criteria}

Respuesta a evaluar:
"""
${response}
"""

Responde SOLO con JSON válido en este formato exacto (sin markdown):
{"pass": true, "reason": "explicación breve de por qué pasa"}
o
{"pass": false, "reason": "explicación breve de por qué no pasa"}`,
        },
      ],
    })

    const text =
      result.content[0].type === 'text' ? result.content[0].text : ''

    // Limpiar posible markdown del JSON
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()

    const parsed = JSON.parse(cleanText)
    return {
      pass: Boolean(parsed.pass),
      reason: String(parsed.reason || 'No reason provided'),
    }
  } catch (error) {
    console.error('LLM Judge error:', error)
    return {
      pass: false,
      reason: `LLM Judge error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
