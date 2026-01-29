import { useState, useEffect, useCallback, useMemo, useReducer, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, Linkedin, ExternalLink, Briefcase, GraduationCap, Award, Code, Users, Globe, Sun, Moon, Bot, Zap, Database, Layout, BadgeCheck, FolderGit2, Sparkles, Download, Github, Package, MessageSquare, Receipt, CalendarCheck, Shield, FileText, GitBranch, Terminal, Lock, Network, Calendar, Percent, UserCheck, Image, TrendingUp, Timer, SkipForward } from 'lucide-react'
import { translations, seo, type Lang } from './i18n'
import FloatingChat from './FloatingChat'

function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return { ref: setRef, isInView }
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const { ref, isInView } = useInView()
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parsea texto con marcadores de highlight:
// *texto* = Tipo B: gradiente durante typewriter (frase activa), luego normal
// +texto+ = Tipo C: normal durante typewriter, gradiente en encendido final
// **texto** = gradiente siempre (permanent) + slow typing
type ParsedHighlights = {
  clean: string
  ranges: [number, number][]          // backward compat
  typewriterRanges: [number, number][] // *texto* - Tipo B: gradiente solo durante typewriter
  finalRanges: [number, number][]      // +texto+ - Tipo C: gradiente solo en encendido final
  permanentRanges: [number, number][]  // **texto** - siempre gradiente
  slowRanges: [number, number][]       // para typing lento
}

function parseHighlights(text: string): ParsedHighlights {
  const typewriterRanges: [number, number][] = []  // Tipo B: *texto*
  const finalRanges: [number, number][] = []       // Tipo C: +texto+
  const permanentRanges: [number, number][] = []   // **texto**
  const slowRanges: [number, number][] = []
  let clean = ''
  let i = 0

  while (i < text.length) {
    // Check for ** (permanent highlight + slow)
    if (text[i] === '*' && text[i + 1] === '*') {
      const start = clean.length
      i += 2
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
        clean += text[i]
        i++
      }
      permanentRanges.push([start, clean.length])
      slowRanges.push([start, clean.length])
      i += 2
    }
    // Check for + (Tipo C: gradiente solo en encendido final)
    // Si +digit (ej: +15), mostrar como "15+" (convención internacional)
    else if (text[i] === '+') {
      const nextIsDigit = /\d/.test(text[i + 1] || '')
      const start = clean.length
      i++ // skip opening +
      if (nextIsDigit) {
        // Leer dígitos primero, luego añadir + después (15+ en vez de +15)
        while (i < text.length && /\d/.test(text[i])) {
          clean += text[i]
          i++
        }
        clean += '+'
      }
      while (i < text.length && text[i] !== '+') {
        clean += text[i]
        i++
      }
      finalRanges.push([start, clean.length])
      i++ // skip closing +
    }
    // Check for single * (Tipo B: gradiente solo durante typewriter)
    else if (text[i] === '*') {
      const start = clean.length
      i++
      while (i < text.length && text[i] !== '*') {
        clean += text[i]
        i++
      }
      typewriterRanges.push([start, clean.length])
      i++
    } else {
      clean += text[i]
      i++
    }
  }

  // For backward compatibility
  const ranges: [number, number][] = [...permanentRanges]
  return { clean, ranges, typewriterRanges, finalRanges, permanentRanges, slowRanges }
}

// Renderiza texto con rangos destacados y soporte para transición
// Tipos de highlight:
// - typewriter (Tipo B): gradiente durante typewriter, luego normal
// - final (Tipo C): normal durante typewriter, gradiente en encendido final
// - permanent: siempre gradiente
function renderHighlightedText(
  text: string,
  _ranges: [number, number][],  // kept for API compatibility
  options?: {
    dimmed?: boolean           // texto atenuado (después del typewriter)
    finalReveal?: boolean      // Tipo C se enciende con gradiente
    revealed?: boolean         // resto del texto se enciende
    typewriterRanges?: [number, number][]  // Tipo B
    finalRanges?: [number, number][]       // Tipo C
    permanentRanges?: [number, number][]
    highlightsActive?: boolean // gradiente activo durante typewriter
  }
) {
  const {
    dimmed = false,
    finalReveal = false,
    revealed = false,
    typewriterRanges = [],
    finalRanges = [],
    permanentRanges = [],
    highlightsActive = false
  } = options || {}

  // Build a map of character positions to their highlight type
  type HighlightType = 'typewriter' | 'final' | 'permanent' | null
  const charTypes: HighlightType[] = new Array(text.length).fill(null)

  typewriterRanges.forEach(([start, end]) => {
    for (let i = start; i < end && i < text.length; i++) charTypes[i] = 'typewriter'
  })
  finalRanges.forEach(([start, end]) => {
    for (let i = start; i < end && i < text.length; i++) charTypes[i] = 'final'
  })
  permanentRanges.forEach(([start, end]) => {
    for (let i = start; i < end && i < text.length; i++) charTypes[i] = 'permanent'
  })

  // Opacity states - SEPARADOS para cada tipo
  // Texto normal y Tipo B: atenuados hasta que revealed=true
  const isTextLowOpacity = dimmed && !revealed
  // Tipo C: atenuados hasta que finalReveal=true (se encienden ANTES que el resto)
  const isFinalLowOpacity = dimmed && !finalReveal

  // UN SOLO TIMING para TODO - sincronización perfecta
  const timing = 'duration-[2500ms] ease-in-out'

  // If no special ranges, render as plain text
  if (typewriterRanges.length === 0 && finalRanges.length === 0 && permanentRanges.length === 0) {
    // Plain text - dims then reveals with the rest
    const opacity = isTextLowOpacity ? 'opacity-15' : 'opacity-100'
    return (
      <span className={`text-muted-foreground transition-opacity ${timing} ${opacity}`}>
        {text}
      </span>
    )
  }

  // Group consecutive characters by type
  const parts: React.ReactNode[] = []
  let currentType: HighlightType = charTypes[0]
  let currentStart = 0

  for (let i = 1; i <= text.length; i++) {
    const type = i < text.length ? charTypes[i] : null
    if (type !== currentType || i === text.length) {
      const segment = text.slice(currentStart, i)
      if (segment) {
        if (currentType === null) {
          // Plain text - dims then reveals with the rest (usa isTextLowOpacity)
          const opacity = isTextLowOpacity ? 'opacity-15' : 'opacity-100'
          parts.push(
            <span
              key={currentStart}
              className={`text-muted-foreground transition-opacity ${timing} ${opacity}`}
            >
              {segment}
            </span>
          )
        } else if (currentType === 'typewriter') {
          // Tipo B: gradiente SOLO durante typewriter (highlightsActive), luego texto normal
          // Después del typewriter, se comporta IGUAL que texto normal (usa isTextLowOpacity)
          const showGradient = highlightsActive
          parts.push(
            <span key={currentStart} className="inline-grid">
              <span
                className={`col-start-1 row-start-1 text-gradient-theme font-medium transition-opacity ${timing} ${
                  showGradient ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {segment}
              </span>
              <span
                className={`col-start-1 row-start-1 text-muted-foreground transition-opacity ${timing} ${
                  showGradient ? 'opacity-0' : isTextLowOpacity ? 'opacity-15' : 'opacity-100'
                }`}
              >
                {segment}
              </span>
            </span>
          )
        } else if (currentType === 'final') {
          // Tipo C: normal durante typewriter, gradiente en encendido final (finalReveal)
          // Usa isFinalLowOpacity - se enciende ANTES que el resto
          const showGradient = finalReveal
          parts.push(
            <span key={currentStart} className="inline-grid">
              <span
                className={`col-start-1 row-start-1 text-gradient-theme font-medium transition-opacity ${timing} ${
                  showGradient ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {segment}
              </span>
              <span
                className={`col-start-1 row-start-1 text-muted-foreground transition-opacity ${timing} ${
                  showGradient ? 'opacity-0' : isFinalLowOpacity ? 'opacity-15' : 'opacity-100'
                }`}
              >
                {segment}
              </span>
            </span>
          )
        } else {
          // permanent: siempre gradiente (mientras no esté revealed)
          const showGradient = !revealed
          parts.push(
            <span key={currentStart} className="inline-grid">
              <span
                className={`col-start-1 row-start-1 text-gradient-theme font-medium transition-opacity ${timing} ${
                  showGradient ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {segment}
              </span>
              <span
                className={`col-start-1 row-start-1 text-muted-foreground transition-opacity ${timing} ${
                  showGradient ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {segment}
              </span>
            </span>
          )
        }
      }
      currentStart = i
      currentType = type
    }
  }

  return parts
}

function NaturalTypewriter({
  phrases,
  className = '',
  pauseBetween = 2000,
  onPhraseComplete
}: {
  phrases: readonly string[]
  className?: string
  pauseBetween?: number
  onPhraseComplete?: () => void
}) {
  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Pre-procesar frases para obtener texto limpio y rangos
  const parsedPhrases = useMemo(() => phrases.map(parseHighlights), [phrases])

  // Calcula delay natural basado en el carácter y contexto
  const getTypingDelay = useCallback((char: string, prevChar: string, position: number, wordLength: number) => {
    const baseSpeed = 45
    let delay = baseSpeed

    // Puntuación: pausa más larga
    if (/[.,!?;:]/.test(char)) {
      delay += 150 + Math.random() * 200
    }
    // Espacio: pequeña pausa
    else if (char === ' ') {
      delay += 20 + Math.random() * 40
    }
    // Inicio de palabra: ligeramente más lento
    else if (prevChar === ' ' || position === 0) {
      delay += 30 + Math.random() * 30
    }
    // Caracteres poco comunes
    else if (/[áéíóúñüÁÉÍÓÚÑÜ]/.test(char)) {
      delay += 40 + Math.random() * 30
    }
    // Palabras largas: se acelera en el medio
    else if (wordLength > 6 && position > 2 && position < wordLength - 2) {
      delay -= 15
    }

    // Variación aleatoria natural
    delay += (Math.random() - 0.5) * 30

    return Math.max(25, delay)
  }, [])

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseBetween)
      return () => clearTimeout(pauseTimer)
    }

    const { clean: currentPhrase } = parsedPhrases[phraseIndex]

    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
      } else {
        const timer = setTimeout(() => {
          setDisplayText(prev => {
            // Borrar palabra por palabra (como Alt+Backspace)
            const trimmed = prev.trimEnd()
            const lastSpace = trimmed.lastIndexOf(' ')
            return lastSpace === -1 ? '' : prev.slice(0, lastSpace + 1)
          })
        }, 100 + Math.random() * 30)
        return () => clearTimeout(timer)
      }
    } else {
      if (displayText === currentPhrase) {
        onPhraseComplete?.()
        setIsPaused(true)
      } else {
        const nextCharIndex = displayText.length
        const char = currentPhrase[nextCharIndex]
        const prevChar = nextCharIndex > 0 ? currentPhrase[nextCharIndex - 1] : ''

        // Calcular longitud de palabra actual
        const wordStart = currentPhrase.lastIndexOf(' ', nextCharIndex - 1) + 1
        const wordEnd = currentPhrase.indexOf(' ', nextCharIndex)
        const wordLength = (wordEnd === -1 ? currentPhrase.length : wordEnd) - wordStart
        const posInWord = nextCharIndex - wordStart

        const delay = getTypingDelay(char, prevChar, posInWord, wordLength)

        const timer = setTimeout(() => {
          setDisplayText(prev => prev + char)
        }, delay)
        return () => clearTimeout(timer)
      }
    }
  }, [displayText, phraseIndex, isDeleting, isPaused, phrases, parsedPhrases, pauseBetween, getTypingDelay, onPhraseComplete])

  // Reset cuando cambian las frases (cambio de idioma)
  useEffect(() => {
    setDisplayText('')
    setPhraseIndex(0)
    setIsDeleting(false)
    setIsPaused(false)
  }, [phrases])

  const { ranges } = parsedPhrases[phraseIndex]

  return (
    <span className={className}>
      {renderHighlightedText(displayText, ranges)}
      <span
        className="ml-1.5 inline-block"
        style={{ animation: 'blink 0.6s step-end infinite' }}
      >|</span>
    </span>
  )
}

// Typewriter reflexivo con fases: contexto → reflexiones (se borran) → hook final
type Phase = 'idle' | 'context' | 'pause-after-context' | 'reflection' | 'pause-before-delete' | 'deleting' | 'hook' | 'complete'

type TypewriterState = {
  phase: Phase
  displayText: string
  contextComplete: boolean
  currentReflection: number
  completedHookLines: string[][]
  currentHookParagraph: number
  currentHookLine: number
}

type TypewriterAction =
  | { type: 'START' }
  | { type: 'TICK'; char: string }
  | { type: 'PHASE_CHANGE'; phase: Phase }
  | { type: 'CONTEXT_COMPLETE' }
  | { type: 'CLEAR_TEXT' }
  | { type: 'DELETE_WORD' }
  | { type: 'NEXT_REFLECTION' }
  | { type: 'COMPLETE_HOOK_LINE'; text: string }
  | { type: 'NEXT_HOOK_LINE' }
  | { type: 'NEXT_HOOK_PARAGRAPH' }
  | { type: 'SKIP_TO_COMPLETE'; allHookLines: string[][] }
  | { type: 'RESET' }

const initialTypewriterState: TypewriterState = {
  phase: 'idle',
  displayText: '',
  contextComplete: false,
  currentReflection: 0,
  completedHookLines: [],
  currentHookParagraph: 0,
  currentHookLine: 0,
}

function typewriterReducer(state: TypewriterState, action: TypewriterAction): TypewriterState {
  switch (action.type) {
    case 'START':
      return { ...state, phase: 'context' }
    case 'TICK':
      return { ...state, displayText: state.displayText + action.char }
    case 'PHASE_CHANGE':
      return { ...state, phase: action.phase }
    case 'CONTEXT_COMPLETE':
      return { ...state, contextComplete: true }
    case 'CLEAR_TEXT':
      return { ...state, displayText: '' }
    case 'DELETE_WORD': {
      const trimmed = state.displayText.trimEnd()
      const lastSpace = trimmed.lastIndexOf(' ')
      return { ...state, displayText: lastSpace === -1 ? '' : state.displayText.slice(0, lastSpace + 1) }
    }
    case 'NEXT_REFLECTION':
      return { ...state, currentReflection: state.currentReflection + 1, displayText: '', phase: 'reflection' }
    case 'COMPLETE_HOOK_LINE': {
      const newCompleted = [...state.completedHookLines]
      if (!newCompleted[state.currentHookParagraph]) newCompleted[state.currentHookParagraph] = []
      newCompleted[state.currentHookParagraph][state.currentHookLine] = action.text
      return { ...state, completedHookLines: newCompleted }
    }
    case 'NEXT_HOOK_LINE':
      return { ...state, currentHookLine: state.currentHookLine + 1, displayText: '' }
    case 'NEXT_HOOK_PARAGRAPH':
      return { ...state, currentHookParagraph: state.currentHookParagraph + 1, currentHookLine: 0, displayText: '' }
    case 'SKIP_TO_COMPLETE':
      return {
        ...state,
        phase: 'complete',
        contextComplete: true,
        completedHookLines: action.allHookLines,
        displayText: '',
      }
    case 'RESET':
      return initialTypewriterState
    default:
      return state
  }
}

const STORY_SEEN_KEY = 'story-animation-seen-v1'

function ReflectiveTypewriter({
  context,
  reflections,
  hookParagraphs,
  className = '',
  dimmed = false,
  finalReveal = false,
  revealed = false,
  onComplete,
  skipRef,
  onStart
}: {
  context: string
  reflections: readonly string[]
  hookParagraphs: readonly (readonly string[])[]
  className?: string
  dimmed?: boolean
  finalReveal?: boolean
  revealed?: boolean
  onComplete?: () => void
  skipRef?: React.MutableRefObject<(() => void) | null>
  onStart?: () => void
}) {
  const [state, dispatch] = useReducer(typewriterReducer, initialTypewriterState)
  const { phase, displayText, contextComplete, currentReflection, completedHookLines, currentHookParagraph, currentHookLine } = state

  const { ref, isInView } = useInView(0.5)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Parse context for highlights
  const parsedContext = useMemo(() => parseHighlights(context), [context])

  // Parse hook lines for highlights
  const parsedHookLines = useMemo(() =>
    hookParagraphs.flatMap(p => [...p]).map(parseHighlights),
    [hookParagraphs]
  )

  // Build all hook lines for skip functionality
  const allHookLinesComplete = useMemo(() => {
    const result: string[][] = []
    let flatIdx = 0
    for (let p = 0; p < hookParagraphs.length; p++) {
      result[p] = []
      for (let l = 0; l < hookParagraphs[p].length; l++) {
        result[p][l] = parsedHookLines[flatIdx]?.clean || ''
        flatIdx++
      }
    }
    return result
  }, [hookParagraphs, parsedHookLines])

  // Skip to complete function
  const skipToComplete = useCallback(() => {
    abortRef.current?.abort()
    dispatch({ type: 'SKIP_TO_COMPLETE', allHookLines: allHookLinesComplete })
    sessionStorage.setItem(STORY_SEEN_KEY, 'true')
    onComplete?.()
  }, [allHookLinesComplete, onComplete])

  // Expose skipToComplete to parent via ref
  useEffect(() => {
    if (skipRef) skipRef.current = skipToComplete
  }, [skipRef, skipToComplete])

  // Check sessionStorage on mount - skip if already seen
  useEffect(() => {
    const seen = sessionStorage.getItem(STORY_SEEN_KEY)
    if (seen && phase === 'idle') {
      skipToComplete()
    }
  }, []) // Only on mount

  // Reset and cancel on language change
  useEffect(() => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    dispatch({ type: 'RESET' })

    // Check if already seen after reset
    const seen = sessionStorage.getItem(STORY_SEEN_KEY)
    if (seen) {
      dispatch({ type: 'SKIP_TO_COMPLETE', allHookLines: allHookLinesComplete })
    }
  }, [context, reflections, hookParagraphs, allHookLinesComplete])

  // Start when in view
  useEffect(() => {
    if (isInView && phase === 'idle') {
      dispatch({ type: 'START' })
      onStart?.()
    }
  }, [isInView, phase, onStart])

  // Click to skip handler
  useEffect(() => {
    if (phase === 'complete' || phase === 'idle') return

    const handleClick = () => {
      skipToComplete()
    }

    const container = containerRef.current
    container?.addEventListener('click', handleClick)

    return () => container?.removeEventListener('click', handleClick)
  }, [phase, skipToComplete])

  // Typing delay function
  const getTypingDelay = useCallback((char: string, prevChar: string) => {
    let delay = 40
    if (/[.,!?;:—]/.test(char)) delay += 120 + Math.random() * 100
    else if (char === ' ') delay += 20 + Math.random() * 30
    else if (prevChar === ' ') delay += 25 + Math.random() * 20
    else if (/[áéíóúñü¿¡]/i.test(char)) delay += 30 + Math.random() * 20
    delay += (Math.random() - 0.5) * 20
    return Math.max(25, delay)
  }, [])

  // Main animation effect
  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return

    const signal = abortRef.current?.signal

    // Phase: context (use clean text without markers)
    if (phase === 'context') {
      const cleanContext = parsedContext.clean
      if (displayText === cleanContext) {
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'PHASE_CHANGE', phase: 'pause-after-context' })
        }, 100)
        return () => clearTimeout(timer)
      } else {
        const nextChar = cleanContext[displayText.length]
        const prevChar = displayText.length > 0 ? cleanContext[displayText.length - 1] : ''
        const delay = getTypingDelay(nextChar, prevChar)
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'TICK', char: nextChar })
        }, delay)
        return () => clearTimeout(timer)
      }
    }

    // Phase: pause after context
    if (phase === 'pause-after-context') {
      dispatch({ type: 'CONTEXT_COMPLETE' })
      const timer = setTimeout(() => {
        if (signal?.aborted) return
        dispatch({ type: 'CLEAR_TEXT' })
        dispatch({ type: 'PHASE_CHANGE', phase: 'reflection' })
      }, 800)
      return () => clearTimeout(timer)
    }

    // Phase: reflection (typing)
    if (phase === 'reflection') {
      const currentText = reflections[currentReflection]
      if (displayText === currentText) {
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'PHASE_CHANGE', phase: 'pause-before-delete' })
        }, 600)
        return () => clearTimeout(timer)
      } else {
        const nextChar = currentText[displayText.length]
        const prevChar = displayText.length > 0 ? currentText[displayText.length - 1] : ''
        const delay = getTypingDelay(nextChar, prevChar)
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'TICK', char: nextChar })
        }, delay)
        return () => clearTimeout(timer)
      }
    }

    // Phase: pause before delete
    if (phase === 'pause-before-delete') {
      const timer = setTimeout(() => {
        if (signal?.aborted) return
        dispatch({ type: 'PHASE_CHANGE', phase: 'deleting' })
      }, 400)
      return () => clearTimeout(timer)
    }

    // Phase: deleting (word by word, like Alt+Backspace)
    if (phase === 'deleting') {
      if (displayText === '') {
        if (currentReflection < reflections.length - 1) {
          dispatch({ type: 'NEXT_REFLECTION' })
        } else {
          dispatch({ type: 'PHASE_CHANGE', phase: 'hook' })
        }
      } else {
        const delay = 80 + Math.random() * 40
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'DELETE_WORD' })
        }, delay)
        return () => clearTimeout(timer)
      }
    }

    // Phase: hook
    if (phase === 'hook') {
      const flatIndex = (() => {
        let idx = 0
        for (let p = 0; p < currentHookParagraph; p++) idx += hookParagraphs[p].length
        return idx + currentHookLine
      })()
      const { clean: currentText } = parsedHookLines[flatIndex]

      if (displayText === currentText) {
        dispatch({ type: 'COMPLETE_HOOK_LINE', text: currentText })

        const isLastLine = currentHookLine >= hookParagraphs[currentHookParagraph].length - 1
        const isLastParagraph = currentHookParagraph >= hookParagraphs.length - 1

        if (isLastLine && isLastParagraph) {
          const timer = setTimeout(() => {
            if (signal?.aborted) return
            dispatch({ type: 'PHASE_CHANGE', phase: 'complete' })
            sessionStorage.setItem(STORY_SEEN_KEY, 'true')
            onComplete?.()
          }, 600)
          return () => clearTimeout(timer)
        } else if (isLastLine) {
          const timer = setTimeout(() => {
            if (signal?.aborted) return
            dispatch({ type: 'NEXT_HOOK_PARAGRAPH' })
          }, 800)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => {
            if (signal?.aborted) return
            dispatch({ type: 'NEXT_HOOK_LINE' })
          }, 500)
          return () => clearTimeout(timer)
        }
      } else {
        const nextCharIndex = displayText.length
        const nextChar = currentText[nextCharIndex]
        const prevChar = nextCharIndex > 0 ? currentText[nextCharIndex - 1] : ''

        const { slowRanges } = parsedHookLines[flatIndex]
        const isInSlowRange = slowRanges.some(([start, end]) => nextCharIndex >= start && nextCharIndex < end)

        const textSoFar = currentText.slice(0, nextCharIndex)
        const isAfterSentenceEnd = prevChar === '.' && nextChar === ' ' && textSoFar.includes('negocio')

        let delay = getTypingDelay(nextChar, prevChar)

        if (isAfterSentenceEnd) {
          delay = 800
        } else if (isInSlowRange) {
          delay = delay * 4 + 80
        }

        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'TICK', char: nextChar })
        }, delay)
        return () => clearTimeout(timer)
      }
    }
  }, [phase, displayText, context, reflections, currentReflection, hookParagraphs, parsedHookLines, currentHookParagraph, currentHookLine, getTypingDelay, onComplete])

  const showCursor = phase !== 'complete' && phase !== 'idle'

  // Helper to get parsed highlights for hook line
  const getHookParsed = (pIdx: number, lIdx: number): ParsedHighlights => {
    let flatIdx = 0
    for (let p = 0; p < pIdx; p++) flatIdx += hookParagraphs[p].length
    return parsedHookLines[flatIdx + lIdx] || { clean: '', fadeOutRanges: [], permanentRanges: [], fadeInRanges: [], slowRanges: [] }
  }

  // Combine refs
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node
    ref(node)
  }, [ref])

  return (
    <div
      ref={setRefs}
      className={`${className} min-h-[7rem] md:min-h-[8rem] ${phase !== 'complete' && phase !== 'idle' ? 'cursor-pointer' : ''}`}
      title={phase !== 'complete' && phase !== 'idle' ? 'Click to skip' : undefined}
    >
      {/* Context line */}
      <p className="-mb-1">
        {phase === 'context' ? (
          <>
            {renderHighlightedText(displayText, [], {
              dimmed,
              finalReveal,
              revealed,
              typewriterRanges: parsedContext.typewriterRanges,
              finalRanges: parsedContext.finalRanges,
              permanentRanges: parsedContext.permanentRanges,
              highlightsActive: true, // gradiente activo durante typewriter del context
            })}
            {showCursor && <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>}
          </>
        ) : contextComplete ? (
          <>
            {renderHighlightedText(parsedContext.clean, [], {
              dimmed,
              finalReveal,
              revealed,
              typewriterRanges: parsedContext.typewriterRanges,
              finalRanges: parsedContext.finalRanges,
              permanentRanges: parsedContext.permanentRanges,
              highlightsActive: false, // ya no estamos en el context, gradiente apagado
            })}
            {phase === 'pause-after-context' && (
              <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>
            )}
          </>
        ) : null}
      </p>

      {/* Reflection line (becomes the hook line) */}
      {(phase === 'reflection' || phase === 'pause-before-delete' || phase === 'deleting') && (
        <p className="mb-1">
          <span className="text-gradient-theme">{displayText}</span>
          {showCursor && <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>}
        </p>
      )}

      {/* Hook paragraphs */}
      {(phase === 'hook' || phase === 'complete') && hookParagraphs.map((paragraph, pIdx) => (
        <p key={pIdx} className={pIdx === 0 ? "mb-4" : "mb-1 last:mb-0"}>
          {paragraph.map((_, lIdx) => {
            const parsed = getHookParsed(pIdx, lIdx)
            const isCurrentLine = pIdx === currentHookParagraph && lIdx === currentHookLine
            const isCompleted = completedHookLines[pIdx]?.[lIdx] !== undefined

            // Unificar renderizado para permitir transiciones CSS suaves
            // El texto a mostrar: completado > actual (displayText) > vacío
            const textToShow = isCompleted
              ? completedHookLines[pIdx][lIdx]
              : (isCurrentLine && phase === 'hook')
                ? displayText
                : ''

            // Tipo B highlights activos SOLO mientras se escribe esta línea
            const highlightsActive = isCurrentLine && phase === 'hook'

            // Solo renderizar si hay texto o es la línea actual
            if (!textToShow && !isCurrentLine) return null

            return (
              <span key={lIdx} className={lIdx > 0 ? "block -mt-1" : ""}>
                {renderHighlightedText(textToShow, [], {
                  dimmed,
                  finalReveal,
                  revealed,
                  typewriterRanges: parsed.typewriterRanges,
                  finalRanges: parsed.finalRanges,
                  permanentRanges: parsed.permanentRanges,
                  highlightsActive,
                })}
                {isCurrentLine && phase === 'hook' && showCursor && (
                  <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>
                )}
              </span>
            )
          })}
        </p>
      ))}
    </div>
  )
}

// Sección de historia con typewriter y animaciones
function StorySection({ t }: { t: (typeof translations)[Lang] }) {
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const [textDimmed, setTextDimmed] = useState(false)
  const [finalReveal, setFinalReveal] = useState(false)  // Tipo C se enciende con gradiente
  const [textRevealed, setTextRevealed] = useState(false) // Resto del texto se enciende
  const [animationStarted, setAnimationStarted] = useState(false)
  const [scrollSkipped, setScrollSkipped] = useState(false)
  const skipRef = useRef<(() => void) | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Reset states when language changes
  useEffect(() => {
    // Check if animation was already seen (skip case)
    const seen = sessionStorage.getItem(STORY_SEEN_KEY)
    if (seen) {
      setTypewriterComplete(true)
      setTextDimmed(true)
      setFinalReveal(true)
      setTextRevealed(true)
    } else {
      setTypewriterComplete(false)
      setTextDimmed(false)
      setFinalReveal(false)
      setTextRevealed(false)
      setAnimationStarted(false)
      setScrollSkipped(false)
    }
  }, [t])

  // Transition sequence: dim → finalReveal (Tipo C gradient) → revealed (rest)
  const sequenceStartedRef = useRef(false)

  useEffect(() => {
    // Reset ref when language changes
    sequenceStartedRef.current = false
  }, [t])

  useEffect(() => {
    if (!typewriterComplete || sequenceStartedRef.current) return
    sequenceStartedRef.current = true

    // Secuencia de animación post-typewriter:
    // 1. Esperar a que Tipo B (Construir) termine de desvanecerse (~2.5s transición)
    // 2. Dimmed: todo se atenúa
    // 3. FinalReveal: Tipo C se enciende con gradiente (+15 años + sistemas)
    // 4. Revealed: resto del texto se enciende, Tipo C MANTIENE gradiente

    // Step 1: Dim everything (2500ms - espera a que Tipo B haya perdido gradiente)
    const dimTimer = setTimeout(() => {
      setTextDimmed(true)
    }, 2500)

    // Step 2: Tipo C se enciende con gradiente (4500ms - contenido adicional ya visible)
    const finalRevealTimer = setTimeout(() => {
      setFinalReveal(true)
    }, 4500)

    // Step 3: Resto del texto se enciende (8000ms - Tipo C tuvo tiempo de brillar)
    const revealTimer = setTimeout(() => {
      setTextRevealed(true)
    }, 8000)

    return () => {
      clearTimeout(dimTimer)
      clearTimeout(finalRevealTimer)
      clearTimeout(revealTimer)
    }
  }, [typewriterComplete])

  // Scroll-past-as-skip: si el usuario scrollea pasando la sección, auto-skip
  useEffect(() => {
    if (typewriterComplete) return
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setScrollSkipped(true)
          skipRef.current?.()
        }
      },
      { threshold: 0 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [typewriterComplete])

  return (
    <section ref={sectionRef} id="about" className="relative py-16 md:py-24">
      {/* Fade de opacidad: transparente arriba → fondo sólido abajo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Hook emocional con typewriter reflexivo + botón skip */}
        <div className="relative pb-12">
          <ReflectiveTypewriter
            context={t.story.context}
            reflections={t.story.reflections}
            hookParagraphs={t.story.hookParagraphs}
            dimmed={textDimmed}
            finalReveal={finalReveal}
            revealed={textRevealed}
            className="font-display text-lg md:text-2xl leading-relaxed text-center max-w-3xl mx-auto"
            onComplete={() => setTypewriterComplete(true)}
            skipRef={skipRef}
            onStart={() => setAnimationStarted(true)}
          />

          {/* Botón skip — posición absoluta debajo del texto, en el padding reservado */}
          <AnimatePresence>
            {animationStarted && !typewriterComplete && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => skipRef.current?.()}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-muted-foreground border border-border/50 bg-card backdrop-blur-sm cursor-pointer hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-all duration-200"
              >
                <SkipForward className="w-3.5 h-3.5" />
                {t.story.skipButton}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Contenido que aparece después del typewriter - expansión suave (instantánea si scroll-skip) */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={typewriterComplete
            ? { height: 'auto', opacity: 1 }
            : { height: 0, opacity: 0 }
          }
          transition={scrollSkipped
            ? { duration: 0 }
            : {
                height: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.4, delay: 0.1 }
              }
          }
          style={{ overflow: 'hidden' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={typewriterComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: typewriterComplete ? 0.1 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              {t.story.why}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={typewriterComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: typewriterComplete ? 0.3 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-base md:text-lg text-foreground font-medium mt-4 text-center max-w-3xl mx-auto">
              {t.story.seeking}
            </p>
          </motion.div>

          {/* Burbujas de navegación - delays sincronizados */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={typewriterComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: typewriterComplete ? 0.5 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-wrap justify-center gap-3 mt-10 mb-12"
          >
          {t.story.nav.map((item) => {
            const icons: Record<string, React.ReactNode> = {
              briefcase: <Briefcase className="w-4 h-4" />,
              folder: <FolderGit2 className="w-4 h-4" />,
              mail: <Mail className="w-4 h-4" />,
              bot: <Bot className="w-4 h-4" />
            }
            const isHighlight = 'highlight' in item && item.highlight
            const handleClick = (e: React.MouseEvent) => {
              if (item.href === '#chat') {
                e.preventDefault()
                window.dispatchEvent(new Event('openChat'))
              }
            }
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={handleClick}
                className={isHighlight
                  ? "flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-theme text-white border border-transparent hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:brightness-95 transition-all duration-200 text-sm font-medium shadow-lg shadow-primary/25"
                  : "flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium"
                }
              >
                {icons[item.icon]}
                {item.label}
              </a>
            )
          })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function CertLogo({ logo }: { logo: string }) {
  const logos: Record<string, React.ReactNode> = {
    anthropic: (
      <svg viewBox="0 0 92.2 65" className="w-6 h-6" fill="currentColor">
        <path d="M66.5,0H52.4l25.7,65h14.1L66.5,0z M25.7,0L0,65h14.4l5.3-13.6h26.9L51.8,65h14.4L40.5,0C40.5,0,25.7,0,25.7,0z M24.3,39.3l8.8-22.8l8.8,22.8H24.3z"/>
      </svg>
    ),
    airtable: (
      <svg viewBox="0 0 200 170" className="w-6 h-6">
        <path fill="#FCB400" d="M90.039 12.368 24.079 39.66c-3.667 1.519-3.63 6.729.062 8.192l66.235 26.266a24.58 24.58 0 0 0 18.12 0l66.236-26.266c3.69-1.463 3.729-6.673.062-8.192l-65.96-27.292a24.58 24.58 0 0 0-18.795 0"/>
        <path fill="#18BFFF" d="M105.312 88.46v65.617c0 3.12 3.147 5.258 6.048 4.108l73.806-28.648a4.42 4.42 0 0 0 2.79-4.108V59.813c0-3.121-3.147-5.258-6.048-4.108l-73.806 28.648a4.42 4.42 0 0 0-2.79 4.108"/>
        <path fill="#F82B60" d="m88.078 91.846-21.904 10.576-2.224 1.075-46.238 22.155c-2.93 1.414-6.672-.722-6.672-3.978V60.088c0-1.178.604-2.195 1.414-2.96a5 5 0 0 1 1.12-.84c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
        <path fill="#8B8B8B" d="m88.078 91.846-21.904 10.576-53.72-45.295a5 5 0 0 1 1.12-.839c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
      </svg>
    ),
    make: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="make-fill-0" x1="1.5" x2="12" y1="19.5" y2="0">
            <stop stopColor="#F0F"/><stop offset=".17" stopColor="#E90CF9"/><stop offset=".54" stopColor="#C023ED"/><stop offset="1" stopColor="#B02DE9"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="make-fill-1" x1="0" x2="24" y1="24" y2="0">
            <stop stopColor="#B02DE9"/><stop offset="1" stopColor="#6D00CC"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="make-fill-2" x1="0" x2="24" y1="24" y2="0">
            <stop stopColor="#F0F"/><stop offset=".3" stopColor="#B02DE9"/><stop offset="1" stopColor="#6021C3"/>
          </linearGradient>
        </defs>
        <path d="M6.989 4.036L.062 17.818a.577.577 0 00.257.774l3.733 1.876a.577.577 0 00.775-.256L11.753 6.43a.577.577 0 00-.257-.775L7.763 3.78a.575.575 0 00-.774.257z" fill="url(#make-fill-0)"/>
        <path d="M19.245 3.832h4.179c.318 0 .577.26.577.577v15.425a.578.578 0 01-.577.578h-4.179a.578.578 0 01-.577-.578V4.41c0-.318.259-.577.577-.577z" fill="url(#make-fill-1)"/>
        <path d="M12.815 4.085L9.85 19.108a.576.576 0 00.453.677l4.095.826c.314.063.62-.14.681-.454l2.964-15.022a.577.577 0 00-.453-.677l-4.096-.827a.577.577 0 00-.68.454z" fill="url(#make-fill-2)"/>
      </svg>
    ),
  }
  return logos[logo] || null
}

// Banner sutil para sugerir cambio de idioma
function getCookie(name: string): boolean {
  return document.cookie.split('; ').some(c => c === `${name}=true`)
}

function setCookie(name: string) {
  document.cookie = `${name}=true; max-age=31536000; SameSite=Lax; path=/`
}

function LanguageBanner({ lang, onSwitch, onDismiss }: { lang: Lang; onSwitch: () => void; onDismiss: () => void }) {
  const prefersEnglish = typeof navigator !== 'undefined' &&
    !navigator.language.toLowerCase().startsWith('es')

  // Mostrar solo si el idioma preferido no coincide con la página
  const shouldShow = (lang === 'es' && prefersEnglish) || (lang === 'en' && !prefersEnglish)

  // Verificar si ya lo descartó
  const [dismissed, setDismissed] = useState(() => getCookie('lang-banner-dismissed'))

  const [visible, setVisible] = useState(false)

  // Mostrar banner con delay para no ser intrusivo
  useEffect(() => {
    if (shouldShow && !dismissed) {
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [shouldShow, dismissed])

  // Si el usuario cambia idioma con el toggle principal mientras el banner está visible, guardar preferencia
  useEffect(() => {
    if (visible && !shouldShow) {
      setCookie('lang-banner-dismissed')
      setVisible(false)
      setDismissed(true)
    }
  }, [lang, visible, shouldShow])

  const handleDismiss = () => {
    setVisible(false)
    setCookie('lang-banner-dismissed')
    setDismissed(true)
    onDismiss()
  }

  const handleSwitch = () => {
    setVisible(false)
    setCookie('lang-banner-dismissed')
    onSwitch()
  }

  if (!visible) return null

  const message = lang === 'es'
    ? '🇬🇧 This site is available in English'
    : '🇪🇸 Este sitio está disponible en español'

  const switchLabel = lang === 'es' ? 'Switch' : 'Cambiar'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="fixed top-20 right-6 md:top-[1.35rem] md:right-36 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/95 backdrop-blur-sm border border-border shadow-lg"
    >
      <span className="text-sm text-foreground">{message}</span>
      <button
        onClick={handleSwitch}
        className="px-3 py-1 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 active:brightness-95 transition-all duration-200"
      >
        {switchLabel}
      </button>
      <button
        onClick={handleDismiss}
        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const lang: Lang = location.pathname === '/en' ? 'en' : 'es'
  const t = translations[lang]

  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Scroll to hash anchor on load/navigation
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location.hash])

  // SEO: Dynamic meta tags based on language
  useEffect(() => {
    const seoData = seo[lang]
    document.title = seoData.title

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', seoData.description)

    // Update OG tags
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', seoData.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', seoData.description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'en' ? 'en_US' : 'es_ES')

    // Update canonical
    const canonical = lang === 'en' ? 'https://santifer.io/en' : 'https://santifer.io/'
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical)

    // Update html lang
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => {
    navigate(lang === 'es' ? '/en' : '/')
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Language suggestion banner */}
      <AnimatePresence>
        <LanguageBanner
          lang={lang}
          onSwitch={toggleLang}
          onDismiss={() => {}}
        />
      </AnimatePresence>

      {/* Controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={toggleLang}
          className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
          aria-label="Toggle language"
        >
          <motion.span
            key={lang}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-bold text-primary"
          >
            {lang === 'es' ? 'ES' : 'EN'}
          </motion.span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={() => setIsDark(!isDark)}
          className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
          aria-label="Toggle theme"
        >
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
          </motion.div>
        </motion.button>
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-2xl md:blur-3xl -translate-y-1/2 translate-x-1/2 hidden sm:block" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-2xl md:blur-3xl translate-y-1/2 -translate-x-1/2 hidden sm:block" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-theme-30 blur-xl" />
                {/* Glassmorphism frame */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-white/5 md:backdrop-blur-sm border border-white/20 shadow-2xl" />
                {/* Inner border */}
                <div className="absolute inset-2 rounded-full bg-gradient-theme-50 p-[2px]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img src="/foto-avatar.png" alt="Santiago Fernández de Valderrama" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-gradient-theme flex items-center justify-center shadow-lg border-2 border-background"
              >
                <BadgeCheck className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                {t.greeting} <span className="text-gradient-theme">@santifer</span>
              </h1>
              <NaturalTypewriter
                key={lang}
                phrases={t.taglines}
                className="text-xl md:text-2xl text-muted-foreground mb-6 block min-h-[3.5rem] md:min-h-[2.5rem]"
                pauseBetween={2500}
              />

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary">AI Product Manager</span>
                <span className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary">Solutions Architect</span>
                <span className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary">AI FDE</span>
              </div>
            </motion.div>
          </div>

        </div>
      </header>

      {/* Summary - Con storytelling integrado */}
      <StorySection t={t} />

      {/* Experience - Con preámbulo de competencias */}
      <section id="experience" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              {t.experience.title}
            </h2>
          </AnimatedSection>

          {/* Preámbulo: Cómo trabajo + Competencias */}
          <AnimatedSection delay={0.1}>
            <div className="mb-12 p-6 rounded-2xl bg-card/50">
              <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-6">
                {t.summary.p2} <span className="text-foreground font-medium">{t.summary.p2Highlight}</span>{t.summary.p2End}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                {t.coreCompetencies.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-background/50 border border-border hover:border-accent/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-sm font-semibold group-hover:text-accent transition-colors">{item.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Santifer iRepair - Bento Grid */}
          <AnimatedSection delay={0.1}>
            <div className="mb-12">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#888] shrink-0">
                    <img src="/logo-santifer.jpg" alt="Santifer iRepair" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">Santifer iRepair</h3>
                </div>
                <a href="https://santiferirepair.es" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  santiferirepair.es <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-sm text-muted-foreground">{lang === 'es' ? 'Sevilla, España' : 'Seville, Spain'}</span>
              </div>
              <p className="text-primary font-medium mb-1">{t.experience.santifer.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.santifer.period}</p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-6">
                {t.experience.santifer.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          {/* Business OS - Full Width Hero Card */}
          <AnimatedSection delay={0.1} className="mb-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 hover:border-gold/50 transition-all duration-200 group">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 200 170" className="w-6 h-6">
                        <path fill="#FCB400" d="M90.039 12.368 24.079 39.66c-3.667 1.519-3.63 6.729.062 8.192l66.235 26.266a24.58 24.58 0 0 0 18.12 0l66.236-26.266c3.69-1.463 3.729-6.673.062-8.192l-65.96-27.292a24.58 24.58 0 0 0-18.795 0"/>
                        <path fill="#18BFFF" d="M105.312 88.46v65.617c0 3.12 3.147 5.258 6.048 4.108l73.806-28.648a4.42 4.42 0 0 0 2.79-4.108V59.813c0-3.121-3.147-5.258-6.048-4.108l-73.806 28.648a4.42 4.42 0 0 0-2.79 4.108"/>
                        <path fill="#F82B60" d="m88.078 91.846-21.904 10.576-2.224 1.075-46.238 22.155c-2.93 1.414-6.672-.722-6.672-3.978V60.088c0-1.178.604-2.195 1.414-2.96a5 5 0 0 1 1.12-.84c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
                      </svg>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold">Source of Truth</span>
                  </div>
                  <h4 className="font-display text-2xl font-bold mb-4">{t.experience.santifer.businessOS.title}</h4>
                  <p className="text-muted-foreground mb-6">{t.experience.santifer.businessOS.desc}</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {t.experience.santifer.businessOS.modules.map((item, i) => {
                      const icons: Record<string, React.ReactNode> = {
                        database: <Database className="w-4 h-4" />,
                        users: <Users className="w-4 h-4" />,
                        layout: <Layout className="w-4 h-4" />,
                        package: <Package className="w-4 h-4" />,
                        messageSquare: <MessageSquare className="w-4 h-4" />,
                        receipt: <Receipt className="w-4 h-4" />,
                        calendarCheck: <CalendarCheck className="w-4 h-4" />
                      }
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-gold mt-0.5">{icons[item.icon]}</span>
                          <span>{item.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                  <a href="#contact" className="block text-xs font-medium italic mt-auto pt-4 text-gold hover:underline transition-colors duration-200">{t.experience.santifer.businessOS.footer}</a>
                </div>
                <div className="grid grid-cols-3 lg:flex lg:flex-col gap-2 lg:gap-3 mt-4 lg:mt-0">
                  {t.experience.santifer.businessOS.metrics.map((metric, i) => (
                    <div key={i} className="text-center p-2 lg:p-4 rounded-xl bg-background/50 border border-gold/20">
                      <div className="font-display text-lg lg:text-2xl font-bold text-gold">{metric.value}</div>
                      <div className="text-[10px] lg:text-xs text-muted-foreground leading-tight">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {/* Large card - AI Agent */}
            <AnimatedSection delay={0.15} className="col-span-2 row-span-2">
              <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all duration-200 group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">{t.experience.santifer.jacobo.badge}</span>
                </div>
                <h4 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">{t.experience.santifer.jacobo.title}</h4>
                <p className="text-muted-foreground text-sm mb-4">{t.experience.santifer.jacobo.desc}</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {t.experience.santifer.jacobo.items.map((item, i) => {
                    const icons: Record<string, React.ReactNode> = {
                      network: <Network className="w-4 h-4" />,
                      calendar: <Calendar className="w-4 h-4" />,
                      percent: <Percent className="w-4 h-4" />,
                      package: <Package className="w-4 h-4" />,
                      userCheck: <UserCheck className="w-4 h-4" />
                    }
                    return (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">{icons[item.icon]}</span>
                        <span>{item.text}</span>
                      </li>
                    )
                  })}
                </ul>
                <a href="#contact" className="text-xs font-medium text-primary italic mt-auto pt-4 hover:underline">{t.experience.santifer.jacobo.soldWith}</a>
              </div>
            </AnimatedSection>

            {/* Large card - Web Programática + SEO */}
            <AnimatedSection delay={0.2} className="col-span-2 row-span-2">
              <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 hover:border-accent/40 transition-all duration-200 group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Layout className="w-6 h-6 text-accent" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">{t.experience.santifer.webSeo.badge}</span>
                </div>
                <h4 className="font-display text-xl font-bold mb-2 group-hover:text-accent transition-colors">{t.experience.santifer.webSeo.title}</h4>
                <p className="text-muted-foreground text-sm mb-4">{t.experience.santifer.webSeo.desc}</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {t.experience.santifer.webSeo.items.map((item, i) => {
                    const icons: Record<string, React.ReactNode> = {
                      fileText: <FileText className="w-4 h-4" />,
                      image: <Image className="w-4 h-4" />,
                      trendingUp: <TrendingUp className="w-4 h-4" />,
                      gitBranch: <GitBranch className="w-4 h-4" />,
                      bot: <Bot className="w-4 h-4" />
                    }
                    return (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent mt-0.5 shrink-0">{icons[item.icon]}</span>
                        <span>{item.text}</span>
                      </li>
                    )
                  })}
                </ul>
                <a href="#contact" className="text-xs font-medium text-accent italic mt-auto pt-4 hover:underline">{t.experience.santifer.webSeo.codeAvailable}</a>
              </div>
            </AnimatedSection>

            {/* EXIT 2025 - Verde Success para destacar logro/credibilidad */}
            <AnimatedSection delay={0.25} className="col-span-2">
              <div className="h-full p-5 rounded-2xl bg-gradient-to-r from-success/10 to-success/5 border border-success/30 hover:border-success/50 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-success" />
                  <span className="font-display font-bold text-success">{t.experience.santifer.exit}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t.experience.santifer.exitDesc}</p>
              </div>
            </AnimatedSection>

            {/* ERP card */}
            <AnimatedSection delay={0.3}>
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 flex flex-col">
                <Database className="w-5 h-5 text-primary mb-3" />
                <p className="font-medium text-sm mb-1">{t.experience.santifer.erp.title}</p>
                <p className="text-xs text-muted-foreground">{t.experience.santifer.erp.desc}</p>
                <span className="text-xs font-medium text-primary mt-auto pt-3">{t.experience.santifer.erp.metric}</span>
              </div>
            </AnimatedSection>

            {/* GPTs card */}
            <AnimatedSection delay={0.35}>
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 flex flex-col">
                <Bot className="w-5 h-5 text-accent mb-3" />
                <p className="font-medium text-sm mb-1">{t.experience.santifer.gpts.title}</p>
                <p className="text-xs text-muted-foreground">{t.experience.santifer.gpts.desc}</p>
                <span className="text-xs font-medium text-primary mt-auto pt-3">{t.experience.santifer.gpts.metric}</span>
              </div>
            </AnimatedSection>

            {/* Reservas card */}
            <AnimatedSection delay={0.4}>
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 flex flex-col">
                <Timer className="w-5 h-5 text-primary mb-3" />
                <p className="font-medium text-sm mb-1">{t.experience.santifer.reservas.title}</p>
                <p className="text-xs text-muted-foreground">{t.experience.santifer.reservas.desc}</p>
                <span className="text-xs font-medium text-accent mt-auto pt-3">{t.experience.santifer.reservas.metric}</span>
              </div>
            </AnimatedSection>

            {/* CRM card */}
            <AnimatedSection delay={0.45}>
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 flex flex-col">
                <Users className="w-5 h-5 text-accent mb-3" />
                <p className="font-medium text-sm mb-1">{t.experience.santifer.crm.title}</p>
                <p className="text-xs text-muted-foreground">{t.experience.santifer.crm.desc}</p>
                <span className="text-xs font-medium text-primary mt-auto pt-3">{t.experience.santifer.crm.metric}</span>
              </div>
            </AnimatedSection>

            {/* GenAI Marketing card */}
            <AnimatedSection delay={0.5}>
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 flex flex-col">
                <Sparkles className="w-5 h-5 text-primary mb-3" />
                <p className="font-medium text-sm mb-1">{t.experience.santifer.genAI.title}</p>
                <p className="text-xs text-muted-foreground">{t.experience.santifer.genAI.desc}</p>
                <span className="text-xs font-medium text-accent mt-auto pt-3">{t.experience.santifer.genAI.metric}</span>
              </div>
            </AnimatedSection>
          </div>

          {/* LICO Cosmetics */}
          <AnimatedSection delay={0.5} className="mt-16">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F5F3EE] flex items-center justify-center shrink-0">
                    <img src="/logo-lico.png" alt="LICO Cosmetics" className="w-full h-full object-contain p-1" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">LICO Cosmetics</h3>
                </div>
                <a href="https://licocosmetics.es" target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1">
                  licocosmetics.es <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-sm text-muted-foreground">{lang === 'es' ? 'Sevilla, España' : 'Seville, Spain'}</span>
              </div>
              <p className="text-accent font-medium mb-1">{t.experience.lico.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.lico.period}</p>
              <p className="text-muted-foreground">{t.experience.lico.desc}</p>

              {/* Testimonial */}
              <blockquote className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/10">
                <p className="text-sm text-muted-foreground italic mb-4">
                  "{t.experience.lico.testimonial.quote}"
                </p>
                <footer className="flex items-center gap-3">
                  <img src="/juan-sabate.jpeg" alt={t.experience.lico.testimonial.author} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground block">{t.experience.lico.testimonial.author}</span>
                    <span className="text-xs text-muted-foreground">{t.experience.lico.testimonial.role}</span>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/juan-sabat%C3%A9-garrach%C3%B3n-b4102b55/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    <Linkedin className="w-3 h-3" />
                  </a>
                </footer>
              </blockquote>
            </div>
          </AnimatedSection>

          {/* Everis */}
          <AnimatedSection delay={0.6} className="mt-16">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0 p-1.5">
                    <img src="/logo-everis.jpg" alt="Everis" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">Everis (NTT DATA)</h3>
                </div>
              </div>
              <p className="text-primary font-medium mb-1">{t.experience.everis.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.everis.period}</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-bold mb-2">{t.experience.everis.tesauro.title}</h4>
                  <p className="text-sm text-muted-foreground">{t.experience.everis.tesauro.desc}</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <blockquote className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm text-muted-foreground italic mb-4">
                "{t.experience.everis.testimonial.quote}"
              </p>
              <footer className="flex items-center gap-3">
                <img src="/manuel-lopez.jpeg" alt={t.experience.everis.testimonial.author} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground block">{t.experience.everis.testimonial.author}</span>
                  <span className="text-xs text-muted-foreground">{t.experience.everis.testimonial.role}</span>
                </div>
                <a
                  href="https://www.linkedin.com/in/manuellopezalcazar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Linkedin className="w-3 h-3" />
                </a>
              </footer>
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects & Claude Code */}
      <section id="projects" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-2xl font-semibold flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderGit2 className="w-5 h-5 text-primary" />
                </div>
                {t.projects.title}
              </h2>
              <a
                href={`https://${t.projects.githubLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {t.projects.githubLink.split('/').pop()}
              </a>
            </div>
          </AnimatedSection>

          {/* SA Playbook - Premium Card */}
          <AnimatedSection delay={0.05} className="mb-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 hover:border-gold/50 transition-all duration-200 group relative overflow-hidden">
              {/* Subtle glow effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 relative">
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                      <Terminal className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-gold" />
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold">{t.projects.saPlaybook.badge}</span>
                    </div>
                  </div>
                  <h4 className="font-display text-2xl font-bold mb-1">{t.projects.saPlaybook.title}</h4>
                  <p className="text-sm text-gold font-medium mb-4">{t.projects.saPlaybook.tagline}</p>
                  <p className="text-muted-foreground mb-6">{t.projects.saPlaybook.desc}</p>

                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Claude Code', 'Airtable', 'Shopify', 'Make.com', 'Bash', 'MCP'].map((tech) => (
                      <span key={tech} className="px-2 py-1 rounded-md text-xs bg-gold/10 text-gold border border-gold/20">{tech}</span>
                    ))}
                  </div>

                  <ul className="text-sm text-muted-foreground space-y-2">
                    {t.projects.saPlaybook.features.map((item, i) => {
                      const icons: Record<string, React.ReactNode> = {
                        zap: <Zap className="w-4 h-4" />,
                        shield: <Shield className="w-4 h-4" />,
                        fileText: <FileText className="w-4 h-4" />,
                        git: <GitBranch className="w-4 h-4" />
                      }
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-gold mt-0.5">{icons[item.icon]}</span>
                          <span>{item.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                  <a href="#contact" className="inline-flex items-center gap-2 text-xs font-medium italic mt-auto pt-6 text-gold hover:underline transition-colors duration-200">
                    <Lock className="w-3 h-3" />
                    {t.projects.saPlaybook.footer}
                  </a>
                </div>

                {/* Right side - visual element */}
                <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-xl bg-gold/5 border border-gold/10 min-w-[180px]">
                  <div className="text-4xl mb-3 opacity-80">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 17l6-6-6-6M12 19h8" />
                    </svg>
                  </div>
                  <span className="text-xs text-gold font-medium text-center">Systems Thinking<br/>for SAs</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Projects Grid with Dependency Lines */}
          {(() => {
            // Tipo para proyecto
            type Project = {
              title: string
              badge: string
              badgeBuilding: string
              desc: string
              tech: readonly string[]
              link: string
              isDependency?: boolean
              dependencyRole?: string
            }

            // Separar proyectos
            const allProjects = t.projects.items as readonly Project[]
            const contentDigest = allProjects.find(p => p.title === 'Content Digest')!
            const santiferIo = allProjects.find(p => p.title === 'santifer.io')!
            // Tools que dependen de santifer.io (fila 3)
            const claudeEye = allProjects.find(p => p.title === 'Claude Eye')!
            const claudeable = allProjects.find(p => p.title === 'Claudeable')!
            // Fila 4: Claude Pulse + Watermark Remover
            const claudePulse = allProjects.find(p => p.title === 'Claude Pulse')!
            const watermarkRemover = allProjects.find(p => p.title === 'Watermark Remover')!

            // Helper para parsear **bold** a elementos con estilo
            const parseBold = (text: string): React.ReactNode[] => {
              return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="text-tool font-semibold">{part}</strong> : part
              )
            }

            // Componente de tarjeta de proyecto
            const ProjectCard = ({ project, variant = 'default', cardRef }: {
              project: Project,
              variant?: 'default' | 'highlight' | 'tool' | 'tool-static',
              cardRef?: React.RefObject<HTMLDivElement | null> | ((el: HTMLDivElement | null) => void)
            }) => {
              const isHighlight = variant === 'highlight'
              const isTool = variant === 'tool' || variant === 'tool-static'
              const hasHover = variant !== 'tool-static'

              return (
                <div
                  ref={cardRef}
                  className={`h-full p-6 rounded-2xl transition-all duration-200 flex flex-col ${hasHover ? 'group' : ''} ${
                    isHighlight
                      ? 'bg-gradient-to-br from-accent/5 to-transparent border-2 border-accent/50 hover:border-accent/70'
                      : isTool
                      ? `bg-card border border-tool/30 ${hasHover ? 'hover:border-tool/50' : ''}`
                      : 'bg-card border border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`font-display text-lg font-bold transition-colors ${
                      isTool ? 'group-hover:text-tool' : 'group-hover:text-primary'
                    }`}>{project.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-center ${
                        isTool
                          ? 'bg-tool/10 text-tool'
                          : isHighlight
                          ? 'bg-accent/20 text-accent'
                          : 'bg-primary/10 text-primary'
                      }`}>{project.badge}</span>
                      {project.badgeBuilding && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-center bg-green-500/10 text-green-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot"></span>
                          {project.badgeBuilding}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isHighlight ? parseBold(project.desc) : project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className={`px-2 py-1 rounded-md text-xs ${
                        isTool
                          ? 'bg-tool/10 text-tool'
                          : 'bg-muted text-muted-foreground'
                      }`}>{tech}</span>
                    ))}
                  </div>
                  {project.link && (
                    <a
                      href={`https://${project.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-xs mt-auto ${
                        isTool ? 'text-tool hover:text-tool' : 'text-primary'
                      } hover:underline`}
                    >
                      {project.link.includes('github.com') ? (
                        <>
                          <Github className="w-4 h-4" />
                          {t.projects.viewCode}
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          {t.projects.viewPrototype}
                        </>
                      )}
                    </a>
                  )}
                </div>
              )
            }


            return (
              <div className="mb-12">
                {/* Fila 1: Content Digest + santifer.io */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <AnimatedSection delay={0.1}>
                    <ProjectCard project={contentDigest} />
                  </AnimatedSection>
                  <AnimatedSection delay={0.15}>
                    <ProjectCard project={santiferIo} variant="highlight" />
                  </AnimatedSection>
                </div>

                {/* Fila 2: Claude Eye + Claudeable */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <AnimatedSection delay={0.2}>
                    <ProjectCard project={claudeEye} variant="tool-static" />
                  </AnimatedSection>
                  <AnimatedSection delay={0.25}>
                    <ProjectCard project={claudeable} variant="tool-static" />
                  </AnimatedSection>
                </div>

                {/* Fila 3: Claude Pulse + Watermark Remover */}
                <div className="grid md:grid-cols-2 gap-6">
                  <AnimatedSection delay={0.3}>
                    <ProjectCard project={claudePulse} variant="tool-static" />
                  </AnimatedSection>
                  <AnimatedSection delay={0.35}>
                    <ProjectCard project={watermarkRemover} />
                  </AnimatedSection>
                </div>
              </div>
            )
          })()}

          {/* Claude Code Power User */}
          <AnimatedSection delay={0.3}>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display font-bold">{t.claudeCode.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">{t.claudeCode.badge}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.claudeCode.desc}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sharing */}
      <section id="speaking" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              {t.speaking.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {t.speaking.items.map((talk: { year: string; event: string; eventUrl: string; title: string; desc: string; pdf: string; featured: boolean }, i: number) => (
              <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                {talk.featured ? (
                  <div className="relative rounded-2xl p-[1.5px] bg-gradient-theme h-full">
                    <div className="p-6 rounded-[calc(1rem-1.5px)] bg-card h-full flex flex-col">
                      <span className="text-xs text-primary font-medium">
                        {talk.year} · {talk.eventUrl ? (
                          <a href={talk.eventUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {talk.event} <ExternalLink className="w-3 h-3 inline" />
                          </a>
                        ) : talk.event}
                      </span>
                      <h3 className="font-display font-bold mt-2 text-gradient-theme">{talk.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 flex-1">{talk.desc}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground/60">
                        <Lock className="w-3.5 h-3.5" />
                        {t.speaking.comingSoon}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 group h-full flex flex-col">
                    <span className="text-xs text-primary font-medium">
                      {talk.year} · {talk.eventUrl ? (
                        <a href={talk.eventUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {talk.event} <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      ) : talk.event}
                    </span>
                    <h3 className="font-display font-bold mt-2 group-hover:text-primary transition-colors">{talk.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 flex-1">{talk.desc}</p>
                    {talk.pdf && (
                      <a
                        href={talk.pdf}
                        download
                        className="mt-4 inline-flex items-center gap-2 text-xs text-primary hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        {t.speaking.slides}
                      </a>
                    )}
                  </div>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section id="education" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <AnimatedSection>
                <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  {t.education.title}
                </h2>
              </AnimatedSection>

              <div className="space-y-4">
                {t.education.items.map((item, i) => (
                  <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                    <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs text-primary font-medium">{item.year} · {item.org}</span>
                          <h3 className="font-display font-semibold mt-1 group-hover:text-primary transition-colors">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.desc}
                            {('projectLink' in item && item.projectLink) && (
                              <>
                                {' '}
                                <a
                                  href={`https://${item.projectLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                  {item.projectLabel}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      {/* Testimonial if exists */}
                      {'testimonial' in item && item.testimonial && (
                        <blockquote className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-xs text-muted-foreground italic mb-3">
                            "{item.testimonial.quote}"
                          </p>
                          <footer className="flex items-center gap-2">
                            <img src={item.testimonial.photo} alt={item.testimonial.author} className="w-8 h-8 rounded-full object-cover" />
                            <div className="flex-1">
                              <span className="text-xs font-medium text-foreground block">{item.testimonial.author}</span>
                              <span className="text-[10px] text-muted-foreground">{item.testimonial.role}</span>
                            </div>
                            <a
                              href={item.testimonial.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              <Linkedin className="w-3 h-3" />
                            </a>
                          </footer>
                        </blockquote>
                      )}
                    </div>
                  </AnimatedSection>
                ))}

              </div>
            </div>

            {/* Certifications */}
            <div>
              <AnimatedSection>
                <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  {t.certifications.title}
                </h2>
              </AnimatedSection>

              <div className="space-y-4">
                {t.certifications.items.map((cert, i) => (
                  <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-200 group cursor-pointer"
                    >
                      <span className="text-sm font-mono text-accent font-medium">{cert.year}</span>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-accent transition-colors">{cert.title}</p>
                        <p className="text-sm text-muted-foreground">{cert.org}</p>
                      </div>
                      <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                        <CertLogo logo={cert.logo} />
                      </div>
                    </a>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="tech" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-12 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              {t.skills.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">
            <AnimatedSection delay={0.1}>
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                {t.skills.languages}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>{t.skills.spanish}</span>
                  <span className="text-sm text-primary font-medium">{t.skills.native}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t.skills.english}</span>
                  <span className="text-sm text-muted-foreground">{t.skills.professional}</span>
                </div>
              </div>

              <h3 className="font-display font-semibold mb-4 mt-8">{t.skills.soft}</h3>
              <div className="flex flex-wrap gap-2">
                {t.skills.softSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="md:col-span-3">
              <h3 className="font-display font-semibold mb-4">{t.techStack.title}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {t.techStack.categories.map((cat) => (
                  <div key={cat.name} className="p-4 rounded-xl bg-card border border-border">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">{cat.name}</span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {cat.items.map((item) => (
                        <span key={item} className="px-2 py-1 rounded-md text-xs bg-muted text-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer id="contact" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t.cta.title}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t.cta.desc}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${t.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 active:brightness-95 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                {t.cta.contact}
              </a>
              <a
                href="https://linkedin.com/in/santifer/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-all duration-200 hover:bg-primary/5"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </footer>

      {/* Floating Chat */}
      <FloatingChat lang={lang} />
    </div>
  )
}

export default App
