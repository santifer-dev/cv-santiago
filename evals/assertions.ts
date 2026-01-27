/**
 * Funciones de assertion deterministas para evals
 */

export interface Assertion {
  type: string
  value?: string | number
  values?: string[]
  expected?: string
  pattern?: string
  flags?: string
  criteria?: string
}

export interface AssertionResult {
  passed: boolean
  assertion: Assertion
  reason?: string
}

/**
 * Verifica que la respuesta contiene un texto exacto (case insensitive)
 */
export function assertContains(response: string, value: string): boolean {
  return response.toLowerCase().includes(value.toLowerCase())
}

/**
 * Verifica que la respuesta contiene al menos uno de los valores (case insensitive)
 */
export function assertContainsAny(response: string, values: string[]): boolean {
  return values.some((v) => response.toLowerCase().includes(v.toLowerCase()))
}

/**
 * Verifica que la respuesta NO contiene un texto (case insensitive)
 */
export function assertNotContains(response: string, value: string): boolean {
  return !response.toLowerCase().includes(value.toLowerCase())
}

/**
 * Verifica que la respuesta tiene como máximo N palabras
 */
export function assertMaxWords(response: string, maxWords: number): boolean {
  const wordCount = response.trim().split(/\s+/).length
  return wordCount <= maxWords
}

/**
 * Verifica que la respuesta tiene al menos N palabras
 */
export function assertMinWords(response: string, minWords: number): boolean {
  const wordCount = response.trim().split(/\s+/).length
  return wordCount >= minWords
}

/**
 * Verifica que la respuesta cumple con un patrón regex
 */
export function assertRegex(
  response: string,
  pattern: string,
  flags: string = ''
): boolean {
  try {
    const regex = new RegExp(pattern, flags)
    return regex.test(response)
  } catch {
    console.error(`Invalid regex pattern: ${pattern}`)
    return false
  }
}

/**
 * Detecta el idioma de la respuesta (heurística simple)
 * Busca palabras comunes en español vs inglés
 */
export function assertLanguage(response: string, expected: 'es' | 'en'): boolean {
  const spanishWords = [
    'el',
    'la',
    'los',
    'las',
    'de',
    'en',
    'que',
    'es',
    'un',
    'una',
    'mi',
    'con',
    'para',
    'por',
    'del',
    'al',
    'como',
    'más',
    'pero',
    'su',
    'sus',
    'este',
    'esta',
    'estos',
    'estas',
    'he',
    'ha',
    'años',
  ]
  const englishWords = [
    'the',
    'is',
    'are',
    'was',
    'were',
    'have',
    'has',
    'had',
    'my',
    'your',
    'with',
    'for',
    'and',
    'but',
    'or',
    'from',
    'this',
    'that',
    'these',
    "i'm",
    "i've",
    'years',
  ]

  const words = response.toLowerCase().split(/\s+/)

  let spanishCount = 0
  let englishCount = 0

  for (const word of words) {
    if (spanishWords.includes(word)) spanishCount++
    if (englishWords.includes(word)) englishCount++
  }

  if (expected === 'es') {
    return spanishCount > englishCount
  } else {
    return englishCount > spanishCount
  }
}

/**
 * Ejecuta una assertion y devuelve el resultado
 */
export function runAssertion(
  response: string,
  assertion: Assertion
): AssertionResult {
  let passed = false
  let reason = ''

  switch (assertion.type) {
    case 'contains':
      passed = assertContains(response, assertion.value as string)
      reason = passed
        ? `Contains "${assertion.value}"`
        : `Missing "${assertion.value}"`
      break

    case 'contains_any':
      passed = assertContainsAny(response, assertion.values as string[])
      reason = passed
        ? `Contains one of: ${assertion.values?.join(', ')}`
        : `Missing all of: ${assertion.values?.join(', ')}`
      break

    case 'not_contains':
      passed = assertNotContains(response, assertion.value as string)
      reason = passed
        ? `Does not contain "${assertion.value}"`
        : `Unexpectedly contains "${assertion.value}"`
      break

    case 'max_words':
      const wordCount = response.trim().split(/\s+/).length
      passed = assertMaxWords(response, assertion.value as number)
      reason = passed
        ? `Word count ${wordCount} <= ${assertion.value}`
        : `Word count ${wordCount} exceeds max ${assertion.value}`
      break

    case 'min_words':
      const minWordCount = response.trim().split(/\s+/).length
      passed = assertMinWords(response, assertion.value as number)
      reason = passed
        ? `Word count ${minWordCount} >= ${assertion.value}`
        : `Word count ${minWordCount} below min ${assertion.value}`
      break

    case 'regex':
      passed = assertRegex(
        response,
        assertion.pattern as string,
        assertion.flags
      )
      reason = passed
        ? `Matches pattern /${assertion.pattern}/`
        : `Does not match pattern /${assertion.pattern}/`
      break

    case 'language':
      passed = assertLanguage(response, assertion.expected as 'es' | 'en')
      reason = passed
        ? `Language detected as ${assertion.expected}`
        : `Language is not ${assertion.expected}`
      break

    case 'llm_judge':
      // LLM judge se maneja en llm-judge.ts
      passed = true // Placeholder, se sobrescribe
      reason = 'LLM judge evaluation pending'
      break

    default:
      reason = `Unknown assertion type: ${assertion.type}`
  }

  return { passed, assertion, reason }
}
