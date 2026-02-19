import { useState, useEffect, useCallback, useMemo, useReducer, useRef, lazy, Suspense, Component, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, ExternalLink, Briefcase, GraduationCap, Award, Code, Users, Globe, Sun, Moon, Bot, Zap, Database, Layout, BadgeCheck, FolderGit2, Sparkles, Download, Github, Package, MessageSquare, Receipt, CalendarCheck, Shield, FileText, GitBranch, Terminal, Lock, Network, Calendar, Percent, UserCheck, Image, TrendingUp, Timer, SkipForward, ThumbsUp, MessageCircle, Share2 } from 'lucide-react'
import { translations, seo, type Lang } from './i18n'

const FloatingChat = lazy(() => import('./FloatingChat'))

class ChatErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? null : this.props.children }
}

function LinkedInLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
    </svg>
  )
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

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
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [detected, setDetected] = useState(false)
  const hydrated = useHydrated()
  const wasAboveFold = useRef(false)

  useEffect(() => {
    if (!ref) return

    // IntersectionObserver instead of getBoundingClientRect (avoids forced reflow).
    // First callback fires immediately for visible elements → above-fold detection.
    let firstCallback = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (firstCallback) {
          firstCallback = false
          if (entry.isIntersecting) wasAboveFold.current = true
          setDetected(true)
        }
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref])

  return (
    <motion.div
      ref={setRef}
      initial={false}
      animate={
        !hydrated || !detected
          ? false  // Pre-hydration / pre-detection: preserve SSR DOM state
          : isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 40 }
      }
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
  // Texto normal y Tipo B: atenuados, luego quedan en segundo plano (opacity-50)
  const textOpacity = dimmed ? (revealed ? 'opacity-50' : 'opacity-15') : 'opacity-100'
  // Tipo C: atenuados hasta que finalReveal=true (se encienden ANTES que el resto)
  const isFinalLowOpacity = dimmed && !finalReveal

  // UN SOLO TIMING para TODO - sincronización perfecta
  const timing = 'duration-[2500ms] ease-in-out'

  // If no special ranges, render as plain text
  if (typewriterRanges.length === 0 && finalRanges.length === 0 && permanentRanges.length === 0) {
    return (
      <span className={`text-muted-foreground transition-opacity ${timing} ${textOpacity}`}>
        {text}
      </span>
    )
  }

  // Group consecutive characters by type
  const parts: React.ReactNode[] = []
  let currentType: HighlightType = charTypes[0]
  let currentStart = 0

  // Per-word inline-grid so highlighted text can wrap naturally on narrow screens.
  // Each word shows its slice of the full-phrase gradient via background-size/position.
  const pushHighlightWords = (
    seg: string, baseKey: number, showGradient: boolean, normalOpacity: string
  ) => {
    const gOp = showGradient ? 'opacity-100' : 'opacity-0'
    const totalLen = seg.length
    let charPos = 0
    seg.split(/( +)/).forEach((word, wIdx) => {
      if (!word) return
      if (/^ +$/.test(word)) {
        parts.push(<span key={`${baseKey}s${wIdx}`}>{word}</span>)
        charPos += word.length
      } else {
        const wordFrac = word.length / totalLen
        const startFrac = charPos / totalLen
        // Continuous gradient: size spans full phrase, position shows this word's slice
        const bgSize = wordFrac >= 1 ? 100 : 100 / wordFrac
        const bgPos = wordFrac >= 1 ? 0 : startFrac * 100 / (1 - wordFrac)
        parts.push(
          <span key={`${baseKey}w${wIdx}`} className="inline-grid">
            <span
              className={`col-start-1 row-start-1 font-medium transition-opacity ${timing} ${gOp}`}
              style={{
                backgroundImage: 'linear-gradient(to right, hsl(var(--gradient-from)), hsl(var(--gradient-to)))',
                backgroundSize: `${bgSize}% 100%`,
                backgroundPosition: `${bgPos}% 0`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >{word}</span>
            <span className={`col-start-1 row-start-1 text-muted-foreground transition-opacity ${timing} ${normalOpacity}`}>{word}</span>
          </span>
        )
        charPos += word.length
      }
    })
  }

  for (let i = 1; i <= text.length; i++) {
    const type = i < text.length ? charTypes[i] : null
    if (type !== currentType || i === text.length) {
      const segment = text.slice(currentStart, i)
      if (segment) {
        if (currentType === null) {
          // Plain text - dims then stays as background context
          parts.push(
            <span
              key={currentStart}
              className={`text-muted-foreground transition-opacity ${timing} ${textOpacity}`}
            >
              {segment}
            </span>
          )
        } else if (currentType === 'typewriter') {
          // Tipo B: gradiente SOLO durante typewriter (highlightsActive), luego texto normal
          const showGradient = highlightsActive
          pushHighlightWords(segment, currentStart, showGradient,
            showGradient ? 'opacity-0' : textOpacity)
        } else if (currentType === 'final') {
          // Tipo C: normal durante typewriter, gradiente en encendido final (finalReveal)
          const showGradient = finalReveal
          pushHighlightWords(segment, currentStart, showGradient,
            showGradient ? 'opacity-0' : isFinalLowOpacity ? 'opacity-15' : 'opacity-100')
        } else {
          // permanent: siempre gradiente (mientras no esté revealed)
          const showGradient = !revealed
          pushHighlightWords(segment, currentStart, showGradient,
            showGradient ? 'opacity-0' : 'opacity-100')
        }
      }
      currentStart = i
      currentType = type
    }
  }

  return parts
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
      <span className="md:block md:-mb-1">
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
      </span>{' '}

      {/* Reflection line (becomes the hook line) */}
      {(phase === 'reflection' || phase === 'pause-before-delete' || phase === 'deleting') && (
        <p className="mb-1">
          <span className="text-gradient-theme">{displayText}</span>
          {showCursor && <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>}
        </p>
      )}

      {/* Hook paragraphs */}
      {/* Hook paragraphs: pIdx=0 inline on mobile (flows with context), block on desktop */}
      {(phase === 'hook' || phase === 'complete') && hookParagraphs.map((paragraph, pIdx) => {
        const Tag = pIdx === 0 ? 'span' : 'p'
        const wrapperClass = pIdx === 0
          ? "md:block md:mb-4"
          : "mt-4 md:mt-0"
        return (
          <Tag key={pIdx} className={wrapperClass}>
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
                <span key={lIdx} className={lIdx > 0 ? "md:block md:-mt-1" : ""}>
                  {lIdx > 0 && <span className="md:hidden"> </span>}
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
          </Tag>
        )
      })}
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
            <p className={`text-base md:text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto transition-opacity duration-[2500ms] ease-in-out ${textDimmed ? (textRevealed ? 'opacity-50' : 'opacity-15') : 'opacity-100'}`}>
              {t.story.why}
            </p>
          </motion.div>

          <div className="mt-6 text-center max-w-3xl mx-auto">
            {t.story.seeking.map((line, i) => {
              // Spotlight: lines 0 and 2 light up with finalReveal, line 1 stays as background
              const isSpotlit = i === 0 || i === 2
              const dimOpacity = textDimmed
                ? (isSpotlit ? (finalReveal ? 'opacity-100' : 'opacity-15') : (textRevealed ? 'opacity-50' : 'opacity-15'))
                : 'opacity-100'

              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={typewriterComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.6, delay: typewriterComplete ? 0.3 + i * 0.2 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`transition-opacity duration-[2500ms] ease-in-out ${dimOpacity} ${
                    i === 2
                      ? 'font-display text-lg md:text-2xl font-bold text-gradient-theme leading-snug'
                      : i === 1
                        ? 'font-display text-lg md:text-2xl text-muted-foreground leading-snug'
                        : 'font-display text-lg md:text-2xl font-bold text-foreground leading-snug'
                  }`}
                >
                  {line}
                </motion.p>
              )
            })}
          </div>

          {/* Burbujas de navegación - delays sincronizados */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={typewriterComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: typewriterComplete ? 0.9 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`flex flex-wrap justify-center gap-3 mt-10 mb-12 transition-opacity duration-[2500ms] ease-in-out ${textDimmed && !textRevealed ? 'opacity-15' : 'opacity-100'}`}
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
      <svg viewBox="0 0 92.2 65" className="w-6 h-6" fill="currentColor" aria-hidden="true">
        <path d="M66.5,0H52.4l25.7,65h14.1L66.5,0z M25.7,0L0,65h14.4l5.3-13.6h26.9L51.8,65h14.4L40.5,0C40.5,0,25.7,0,25.7,0z M24.3,39.3l8.8-22.8l8.8,22.8H24.3z"/>
      </svg>
    ),
    airtable: (
      <svg viewBox="0 0 200 170" className="w-6 h-6" aria-hidden="true">
        <path fill="#FCB400" d="M90.039 12.368 24.079 39.66c-3.667 1.519-3.63 6.729.062 8.192l66.235 26.266a24.58 24.58 0 0 0 18.12 0l66.236-26.266c3.69-1.463 3.729-6.673.062-8.192l-65.96-27.292a24.58 24.58 0 0 0-18.795 0"/>
        <path fill="#18BFFF" d="M105.312 88.46v65.617c0 3.12 3.147 5.258 6.048 4.108l73.806-28.648a4.42 4.42 0 0 0 2.79-4.108V59.813c0-3.121-3.147-5.258-6.048-4.108l-73.806 28.648a4.42 4.42 0 0 0-2.79 4.108"/>
        <path fill="#F82B60" d="m88.078 91.846-21.904 10.576-2.224 1.075-46.238 22.155c-2.93 1.414-6.672-.722-6.672-3.978V60.088c0-1.178.604-2.195 1.414-2.96a5 5 0 0 1 1.12-.84c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
        <path fill="#8B8B8B" d="m88.078 91.846-21.904 10.576-53.72-45.295a5 5 0 0 1 1.12-.839c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
      </svg>
    ),
    make: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
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
  if (typeof document === 'undefined') return false
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

  const t = translations[lang]
  const message = t.ui.languageBanner

  const switchLabel = t.ui.languageBannerSwitch

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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
  const hydrated = useHydrated()

  // Always start dark to match SSR prerender; real preference applied in useEffect
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) setIsDark(stored === 'dark')
    else setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Listen for system theme changes (only if user hasn't manually toggled)
  useEffect(() => {
    if (localStorage.getItem('theme')) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

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
    <div className="min-h-screen bg-background transition-colors duration-200" role="main">
      {/* Skip navigation — accessible keyboard shortcut */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:font-medium focus:shadow-lg"
      >
        {lang === 'en' ? 'Skip to content' : 'Saltar al contenido'}
      </a>

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
          initial={hydrated ? { opacity: 0, scale: 0.8 } : false}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={toggleLang}
          className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
          title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <motion.span
            key={lang}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-bold text-primary"
          >
            {t.ui.languageToggle}
          </motion.span>
        </motion.button>
        <motion.button
          initial={hydrated ? { opacity: 0, scale: 0.8 } : false}
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
      <header id="main-content" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-2xl md:blur-3xl -translate-y-1/2 translate-x-1/2 hidden sm:block" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-2xl md:blur-3xl translate-y-1/2 -translate-x-1/2 hidden sm:block" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Photo */}
            <motion.div
              initial={hydrated ? { opacity: 0, scale: 0.8 } : false}
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
                    <picture>
                      <source srcSet="/foto-avatar.webp" type="image/webp" />
                      <img src="/foto-avatar.png" alt="Santiago Fernández de Valderrama" className="w-full h-full object-cover" width={384} height={384} fetchPriority="high" />
                    </picture>
                  </div>
                </div>
              </div>
              <motion.div
                initial={hydrated ? { scale: 0 } : false}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-gradient-theme flex items-center justify-center shadow-lg border-2 border-background"
              >
                <BadgeCheck className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={hydrated ? { opacity: 0, x: -20 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                {t.greeting} <span className="text-gradient-theme">@santifer</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                {t.role}
              </p>

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
      <section id="experience" className="py-16 md:py-24 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 2000px' }}>
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
                    <div className="flex items-start gap-2 mb-1 min-h-[2.5rem]">
                      <Zap className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold group-hover:text-accent transition-colors leading-tight">{item.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{item.desc}</p>
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
                    <picture>
                      <source srcSet="/logo-santifer.webp" type="image/webp" />
                      <img src="/logo-santifer.jpg" alt={t.experience.santifer.company} className="w-full h-full object-cover" width={40} height={40} loading="lazy" decoding="async" />
                    </picture>
                  </div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.santifer.company}</h3>
                </div>
                <a href="https://santiferirepair.es" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  santiferirepair.es <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <span className="text-sm text-muted-foreground">{t.experience.santifer.location}</span>
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

              {/* Trusted By - Corporate Logos */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-4">{t.experience.santifer.trustedBy.label}</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:gap-x-8">
                  {t.experience.santifer.trustedBy.logos.map((logo, i) => (
                    <div key={i} className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-200">
                      {'src' in logo ? (
                        <img src={logo.src} alt={logo.name} className="h-5 w-auto shrink-0 invert opacity-60 hover:opacity-80 dark:invert-0 dark:opacity-70 dark:hover:opacity-90" loading="lazy" />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 opacity-60 dark:opacity-70" aria-hidden="true" dangerouslySetInnerHTML={{ __html: logo.icon }} />
                      )}
                      <span className="text-sm font-medium opacity-60 dark:opacity-70">{logo.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Business OS - Full Width Hero Card */}
          <AnimatedSection delay={0.1} className="mb-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 hover:border-gold/50 transition-all duration-200 group">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 200 170" className="w-6 h-6" aria-hidden="true">
                        <path fill="#FCB400" d="M90.039 12.368 24.079 39.66c-3.667 1.519-3.63 6.729.062 8.192l66.235 26.266a24.58 24.58 0 0 0 18.12 0l66.236-26.266c3.69-1.463 3.729-6.673.062-8.192l-65.96-27.292a24.58 24.58 0 0 0-18.795 0"/>
                        <path fill="#18BFFF" d="M105.312 88.46v65.617c0 3.12 3.147 5.258 6.048 4.108l73.806-28.648a4.42 4.42 0 0 0 2.79-4.108V59.813c0-3.121-3.147-5.258-6.048-4.108l-73.806 28.648a4.42 4.42 0 0 0-2.79 4.108"/>
                        <path fill="#F82B60" d="m88.078 91.846-21.904 10.576-2.224 1.075-46.238 22.155c-2.93 1.414-6.672-.722-6.672-3.978V60.088c0-1.178.604-2.195 1.414-2.96a5 5 0 0 1 1.12-.84c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
                      </svg>
                    </div>
                    <span className="badge px-3 py-1 bg-gold/20 text-gold">Source of Truth</span>
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
                  <span className="badge px-3 py-1 bg-primary/20 text-primary">{t.experience.santifer.jacobo.badge}</span>
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
                  <span className="badge px-3 py-1 bg-accent/20 text-accent">{t.experience.santifer.webSeo.badge}</span>
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
                <p className="text-sm text-muted-foreground">{t.experience.santifer.erp.desc}</p>
                <span className="text-xs font-medium text-primary mt-auto pt-3">{t.experience.santifer.erp.metric}</span>
              </div>
            </AnimatedSection>

            {/* GPTs card */}
            <AnimatedSection delay={0.35}>
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 flex flex-col">
                <Bot className="w-5 h-5 text-accent mb-3" />
                <p className="font-medium text-sm mb-1">{t.experience.santifer.gpts.title}</p>
                <p className="text-sm text-muted-foreground">{t.experience.santifer.gpts.desc}</p>
                <span className="text-xs font-medium text-primary mt-auto pt-3">{t.experience.santifer.gpts.metric}</span>
              </div>
            </AnimatedSection>

            {/* Reservas card */}
            <AnimatedSection delay={0.4}>
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 flex flex-col">
                <Timer className="w-5 h-5 text-primary mb-3" />
                <p className="font-medium text-sm mb-1">{t.experience.santifer.reservas.title}</p>
                <p className="text-sm text-muted-foreground">{t.experience.santifer.reservas.desc}</p>
                <span className="text-xs font-medium text-accent mt-auto pt-3">{t.experience.santifer.reservas.metric}</span>
              </div>
            </AnimatedSection>

            {/* CRM card */}
            <AnimatedSection delay={0.45}>
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 flex flex-col">
                <Users className="w-5 h-5 text-accent mb-3" />
                <p className="font-medium text-sm mb-1">{t.experience.santifer.crm.title}</p>
                <p className="text-sm text-muted-foreground">{t.experience.santifer.crm.desc}</p>
                <span className="text-xs font-medium text-primary mt-auto pt-3">{t.experience.santifer.crm.metric}</span>
              </div>
            </AnimatedSection>

            {/* GenAI Marketing card */}
            <AnimatedSection delay={0.5}>
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 flex flex-col">
                <Sparkles className="w-5 h-5 text-primary mb-3" />
                <p className="font-medium text-sm mb-1">{t.experience.santifer.genAI.title}</p>
                <p className="text-sm text-muted-foreground">{t.experience.santifer.genAI.desc}</p>
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
                    <picture>
                      <source srcSet="/logo-lico.webp" type="image/webp" />
                      <img src="/logo-lico.png" alt={t.experience.lico.company} className="w-full h-full object-contain p-1" width={40} height={40} loading="lazy" decoding="async" />
                    </picture>
                  </div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.lico.company}</h3>
                </div>
                <a href="https://licocosmetics.es" target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1">
                  licocosmetics.es <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <span className="text-sm text-muted-foreground">{t.experience.lico.location}</span>
              </div>
              <p className="text-accent font-medium mb-1">{t.experience.lico.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.lico.period}</p>
              <p className="text-muted-foreground">{t.experience.lico.desc}</p>

              {/* Testimonial */}
              <a href="https://www.linkedin.com/in/santifer/details/recommendations/" target="_blank" rel="noopener noreferrer" className="block group">
                <blockquote className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/10 group-hover:border-[hsl(var(--linkedin)/0.3)] transition-colors">
                  <p className="text-sm text-muted-foreground italic mb-4">
                    "{t.experience.lico.testimonial.quote}"
                  </p>
                  <footer className="flex items-center gap-3">
                    <picture>
                      <source srcSet="/juan-sabate.webp" type="image/webp" />
                      <img src="/juan-sabate.jpeg" alt={t.experience.lico.testimonial.author} className="w-10 h-10 rounded-full object-cover" width={40} height={40} loading="lazy" decoding="async" />
                    </picture>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground block">{t.experience.lico.testimonial.author}</span>
                      <span className="text-xs text-muted-foreground">{t.experience.lico.testimonial.role}</span>
                    </div>
                    <LinkedInLogo className="w-4 h-4 text-[hsl(var(--linkedin))]" />
                  </footer>
                </blockquote>
              </a>
            </div>
          </AnimatedSection>

          {/* Everis */}
          <AnimatedSection delay={0.6} className="mt-16">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0 p-1.5">
                    <picture>
                      <source srcSet="/logo-everis.webp" type="image/webp" />
                      <img src="/logo-everis.jpg" alt={t.experience.everis.company} className="w-full h-full object-contain" width={40} height={40} loading="lazy" decoding="async" />
                    </picture>
                  </div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.everis.company}</h3>
                </div>
              </div>
              <p className="text-primary font-medium mb-1">{t.experience.everis.role}</p>
              <p className="text-sm text-muted-foreground mb-2">{t.experience.everis.period}</p>
              <p className="text-muted-foreground">{t.experience.everis.desc}</p>
            </div>
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
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
            <a href="https://www.linkedin.com/in/santifer/details/recommendations/" target="_blank" rel="noopener noreferrer" className="block group">
              <blockquote className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 group-hover:border-[hsl(var(--linkedin)/0.3)] transition-colors">
                <p className="text-sm text-muted-foreground italic mb-4">
                  "{t.experience.everis.testimonial.quote}"
                </p>
                <footer className="flex items-center gap-3">
                  <picture>
                    <source srcSet="/manuel-lopez.webp" type="image/webp" />
                    <img src="/manuel-lopez.jpeg" alt={t.experience.everis.testimonial.author} className="w-10 h-10 rounded-full object-cover" width={40} height={40} loading="lazy" decoding="async" />
                  </picture>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground block">{t.experience.everis.testimonial.author}</span>
                    <span className="text-xs text-muted-foreground">{t.experience.everis.testimonial.role}</span>
                  </div>
                  <LinkedInLogo className="w-4 h-4 text-[hsl(var(--linkedin))]" />
                </footer>
              </blockquote>
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects & Claude Code */}
      <section id="projects" className="py-16 md:py-24" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1500px' }}>
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
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
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
                      <span className="badge px-3 py-1 bg-gold/20 text-gold">{t.projects.saPlaybook.badge}</span>
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-1">{t.projects.saPlaybook.title}</h3>
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
                    <svg viewBox="0 0 24 24" className="w-16 h-16 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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
            const lifeOS = allProjects.find(p => p.title === 'Life OS')!
            const careerOps = allProjects.find(p => p.title === 'Career Ops')!
            const santiferIo = allProjects.find(p => p.title === 'santifer.io')!
            // Tools que dependen de santifer.io
            const claudeEye = allProjects.find(p => p.title === 'Claude Eye')!
            const claudeable = allProjects.find(p => p.title === 'Claudeable')!
            // Fila 4: Claude Pulse + ProjectOS Predict
            const claudePulse = allProjects.find(p => p.title === 'Claude Pulse')!
            const projectOSPredict = allProjects.find(p => p.title === 'ProjectOS Predict')!

            // Helper para parsear **bold** a elementos con estilo
            const parseBold = (text: string): React.ReactNode[] => {
              return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="text-tool font-semibold">{part}</strong> : part
              )
            }

            // Refs para cada tarjeta (para calcular posiciones de conexiones)
            const containerRef = useRef<HTMLDivElement>(null)
            const cardRefs = {
              contentDigest: useRef<HTMLDivElement>(null),
              lifeOS: useRef<HTMLDivElement>(null),
              careerOps: useRef<HTMLDivElement>(null),
              santiferIo: useRef<HTMLDivElement>(null),
              claudeEye: useRef<HTMLDivElement>(null),
              claudeable: useRef<HTMLDivElement>(null),
              claudePulse: useRef<HTMLDivElement>(null),
              projectOSPredict: useRef<HTMLDivElement>(null),
            }

            // Hook para calcular líneas de conexión SVG
            const [lines, setLines] = useState<string[]>([])
            const { ref: visibilityRef, isInView: isVisible } = useInView(0.1)

            useEffect(() => {
              if (!isVisible || !containerRef.current) return

              const calculate = () => {
                const container = containerRef.current!.getBoundingClientRect()
                const isMobile = window.innerWidth < 768 // Tailwind md breakpoint

                type Edge = 'top' | 'bottom' | 'left' | 'right'
                const getPoint = (ref: React.RefObject<HTMLDivElement | null>, edge: Edge, ratio = 0.5) => {
                  const rect = ref.current?.getBoundingClientRect()
                  if (!rect) return null
                  const x = rect.left - container.left
                  const y = rect.top - container.top
                  switch (edge) {
                    case 'top': return { x: x + rect.width * ratio, y }
                    case 'bottom': return { x: x + rect.width * ratio, y: y + rect.height }
                    case 'left': return { x, y: y + rect.height * ratio }
                    case 'right': return { x: x + rect.width, y: y + rect.height * ratio }
                  }
                }

                // Definir conexiones según el grafo
                type Connection = {
                  from: React.RefObject<HTMLDivElement | null>
                  fromEdge: Edge
                  fromRatio?: number
                  to: React.RefObject<HTMLDivElement | null>
                  toEdge: Edge
                  toRatio?: number
                }

                // En móvil: conexiones verticales simples (tarjetas apiladas)
                // En desktop: grafo complejo con conexiones horizontales y diagonales
                const connections: Connection[] = isMobile ? [
                  // Móvil: flujo vertical simple
                  { from: cardRefs.lifeOS, fromEdge: 'bottom', to: cardRefs.careerOps, toEdge: 'top' },
                  { from: cardRefs.careerOps, fromEdge: 'bottom', to: cardRefs.santiferIo, toEdge: 'top' },
                  { from: cardRefs.santiferIo, fromEdge: 'bottom', to: cardRefs.claudeEye, toEdge: 'top' },
                  { from: cardRefs.claudeEye, fromEdge: 'bottom', to: cardRefs.claudeable, toEdge: 'top' },
                  { from: cardRefs.claudeable, fromEdge: 'bottom', to: cardRefs.claudePulse, toEdge: 'top' },
                  { from: cardRefs.claudePulse, fromEdge: 'bottom', to: cardRefs.contentDigest, toEdge: 'top' },
                  { from: cardRefs.contentDigest, fromEdge: 'bottom', to: cardRefs.projectOSPredict, toEdge: 'top' },
                ] : [
                  // Desktop: grafo complejo
                  // Fila 1: Life OS ↔ Career Ops (horizontal)
                  { from: cardRefs.lifeOS, fromEdge: 'right', to: cardRefs.careerOps, toEdge: 'left' },
                  // Fila 1 → Fila 2: diagonales hacia santifer.io
                  { from: cardRefs.lifeOS, fromEdge: 'bottom', to: cardRefs.santiferIo, toEdge: 'top', toRatio: 0.25 },
                  { from: cardRefs.careerOps, fromEdge: 'bottom', to: cardRefs.santiferIo, toEdge: 'top', toRatio: 0.75 },
                  // Fila 2 → Fila 3: santifer.io hacia tools
                  { from: cardRefs.santiferIo, fromEdge: 'bottom', fromRatio: 0.25, to: cardRefs.claudeEye, toEdge: 'top' },
                  { from: cardRefs.santiferIo, fromEdge: 'bottom', fromRatio: 0.75, to: cardRefs.claudeable, toEdge: 'top' },
                  // Fila 3 → Fila 4
                  { from: cardRefs.claudeEye, fromEdge: 'bottom', to: cardRefs.claudePulse, toEdge: 'top' },
                  { from: cardRefs.claudeable, fromEdge: 'bottom', to: cardRefs.contentDigest, toEdge: 'top' },
                  // Fila 4 → Fila 5: diagonales hacia ProjectOS
                  { from: cardRefs.claudePulse, fromEdge: 'bottom', to: cardRefs.projectOSPredict, toEdge: 'top', toRatio: 0.25 },
                  { from: cardRefs.contentDigest, fromEdge: 'bottom', to: cardRefs.projectOSPredict, toEdge: 'top', toRatio: 0.75 },
                ]

                const paths = connections.map(conn => {
                  const start = getPoint(conn.from, conn.fromEdge, conn.fromRatio ?? 0.5)
                  const end = getPoint(conn.to, conn.toEdge, conn.toRatio ?? 0.5)
                  if (!start || !end) return ''

                  // Móvil: líneas rectas simples | Desktop: curvas Bézier
                  if (isMobile) {
                    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
                  }

                  // Determinar si es conexión horizontal o vertical
                  const isHorizontal = conn.fromEdge === 'left' || conn.fromEdge === 'right'
                  if (isHorizontal) {
                    // Curva Bézier horizontal
                    const midX = (start.x + end.x) / 2
                    return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`
                  } else {
                    // Curva Bézier vertical
                    const midY = (start.y + end.y) / 2
                    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`
                  }
                }).filter(Boolean)

                setLines(paths)
              }

              // Delay para dar tiempo a las animaciones de entrada (AnimatedSection ~0.6s)
              const initialTimeout = setTimeout(calculate, 700)

              // Debounce para resize
              let resizeTimeout: ReturnType<typeof setTimeout>
              const debouncedCalc = () => {
                clearTimeout(resizeTimeout)
                resizeTimeout = setTimeout(calculate, 100)
              }
              window.addEventListener('resize', debouncedCalc)
              return () => {
                window.removeEventListener('resize', debouncedCalc)
                clearTimeout(initialTimeout)
                clearTimeout(resizeTimeout)
              }
            }, [isVisible, lang])

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
                    <h3 className={`font-display text-xl font-bold transition-colors ${
                      isTool ? 'group-hover:text-tool' : 'group-hover:text-primary'
                    }`}>{project.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`badge px-2 py-0.5 ${
                        isTool
                          ? 'bg-tool/10 text-tool'
                          : isHighlight
                          ? 'bg-accent/20 text-accent'
                          : 'bg-primary/10 text-primary'
                      }`}>{project.badge}</span>
                      {project.badgeBuilding && (
                        <span className="badge px-2 py-0.5 bg-success/10 text-success flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot"></span>
                          {project.badgeBuilding}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {parseBold(project.desc)}
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
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          {t.projects.viewPrototype}
                        </>
                      )}
                    </a>
                  )}
                </div>
              )
            }


            return (
              <div ref={(el) => { containerRef.current = el; visibilityRef(el) }} className="mb-12 relative">
                {/* SVG de conexiones - absoluto, z-0 para quedar detrás */}
                <svg
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 0, overflow: 'visible' }}
                >
                  {lines.map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      className="dependency-line"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4 4"
                      style={{
                        opacity: isVisible ? 0.6 : 0,
                        transition: `opacity 0.6s ease-out ${i * 0.1}s`
                      }}
                    />
                  ))}
                </svg>

                {/* Fila 1: Life OS + Career Ops */}
                <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
                  <AnimatedSection delay={0.1}>
                    <ProjectCard project={lifeOS} cardRef={cardRefs.lifeOS} />
                  </AnimatedSection>
                  <AnimatedSection delay={0.15}>
                    <ProjectCard project={careerOps} cardRef={cardRefs.careerOps} />
                  </AnimatedSection>
                </div>

                {/* Fila 2: santifer.io (highlight) — nodo central */}
                <div className="mb-6 relative z-10">
                  <AnimatedSection delay={0.2}>
                    <ProjectCard project={santiferIo} variant="highlight" cardRef={cardRefs.santiferIo} />
                  </AnimatedSection>
                </div>

                {/* Fila 3: Claude Eye + Claudeable — tools */}
                <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
                  <AnimatedSection delay={0.25}>
                    <ProjectCard project={claudeEye} variant="tool-static" cardRef={cardRefs.claudeEye} />
                  </AnimatedSection>
                  <AnimatedSection delay={0.3}>
                    <ProjectCard project={claudeable} variant="tool-static" cardRef={cardRefs.claudeable} />
                  </AnimatedSection>
                </div>

                {/* Fila 4: Claude Pulse + Content Digest */}
                <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
                  <AnimatedSection delay={0.35}>
                    <ProjectCard project={claudePulse} variant="tool-static" cardRef={cardRefs.claudePulse} />
                  </AnimatedSection>
                  <AnimatedSection delay={0.4}>
                    <ProjectCard project={contentDigest} cardRef={cardRefs.contentDigest} />
                  </AnimatedSection>
                </div>

                {/* Fila 5: ProjectOS Predict (full width) */}
                <div className="relative z-10">
                  <AnimatedSection delay={0.45}>
                    <ProjectCard project={projectOSPredict} cardRef={cardRefs.projectOSPredict} />
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
                    <span className="badge px-2 py-0.5 bg-accent/20 text-accent">{t.claudeCode.badge}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.claudeCode.desc}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sharing — Teaching + LinkedIn */}
      <section id="speaking" className="py-16 md:py-24 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-primary" />
              </div>
              {t.speaking.title}
            </h2>
          </AnimatedSection>

          {/* Teaching / Speaking cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {t.speaking.items.map((talk: { year: string; event: string; eventUrl: string; title: string; desc: string; pdf: string; featured: boolean }, i: number) => (
              <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                {talk.featured ? (
                  <div className="relative rounded-2xl p-[1.5px] bg-gradient-theme h-full">
                    <div className="p-6 rounded-[calc(1rem-1.5px)] bg-card h-full flex flex-col">
                      <span className="text-xs text-primary font-medium">
                        {talk.year} · {talk.eventUrl ? (
                          <a href={talk.eventUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {talk.event} <ExternalLink className="w-3 h-3 inline" aria-hidden="true" />
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
                          {talk.event} <ExternalLink className="w-3 h-3 inline" aria-hidden="true" />
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

          {/* Separator */}
          <div className="my-10 border-t border-border/40" />

          {/* LinkedIn Posts — fake embed cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {t.linkedinPosts.items.map((post: { hook: string; reactions: string; comments: string; url: string }, i: number) => (
              <AnimatedSection key={`li-${i}`} delay={0.2 + i * 0.1}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 rounded-2xl bg-card border border-border/50 border-t-2 border-t-[hsl(var(--linkedin))] hover:border-border transition-colors group h-full"
                >
                  <div className="flex gap-3">
                    <img src="/foto-avatar.webp" alt="" role="presentation" className="w-10 h-10 rounded-full shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm text-foreground leading-relaxed">{post.hook}<span className="text-muted-foreground">...</span> <span className="text-[hsl(var(--linkedin))] group-hover:text-[hsl(var(--linkedin))] transition-colors">ver más</span></p>
                        <LinkedInLogo className="w-4 h-4 text-[hsl(var(--linkedin))] shrink-0 mt-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {post.reactions}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments}
                    </span>
                    <span className="ml-auto text-[hsl(var(--linkedin))] group-hover:text-[hsl(var(--linkedin))] group-hover:underline flex items-center gap-1.5 transition-colors">
                      {t.linkedinPosts.cta}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>

          {/* AI Fluency Educator card */}
          {t.speaking.aiFluency && (
            <AnimatedSection delay={0.3}>
              <div className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-display font-bold">{t.speaking.aiFluency.title}</h3>
                      <span className="badge px-2 py-0.5 bg-accent/20 text-accent text-xs">{t.speaking.aiFluency.badge}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{t.speaking.aiFluency.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {t.speaking.aiFluency.certs.map((cert: { title: string; url: string }, i: number) => (
                        <a
                          key={i}
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-xs text-muted-foreground hover:text-accent hover:bg-accent/20 transition-colors"
                        >
                          <BadgeCheck className="w-3.5 h-3.5" />
                          {cert.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Education & Certifications */}
      <section id="education" className="py-16 md:py-24" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1000px' }}>
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
                                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      {/* Testimonial if exists */}
                      {'testimonial' in item && item.testimonial && (
                        <a href="https://www.linkedin.com/in/santifer/details/recommendations/" target="_blank" rel="noopener noreferrer" className="block group">
                          <blockquote className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 group-hover:border-[hsl(var(--linkedin)/0.3)] transition-colors">
                            <p className="text-sm text-muted-foreground italic mb-4">
                              "{item.testimonial.quote}"
                            </p>
                            <footer className="flex items-center gap-3">
                              <picture>
                                <source srcSet={item.testimonial.photo.replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
                                <img src={item.testimonial.photo} alt={item.testimonial.author} className="w-10 h-10 rounded-full object-cover" width={40} height={40} loading="lazy" decoding="async" />
                              </picture>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-foreground block">{item.testimonial.author}</span>
                                <span className="text-xs text-muted-foreground">{item.testimonial.role}</span>
                              </div>
                              <LinkedInLogo className="w-4 h-4 text-[hsl(var(--linkedin))]" />
                            </footer>
                          </blockquote>
                        </a>
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
      <section id="tech" className="py-16 md:py-24 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}>
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
                <LinkedInLogo className="w-4 h-4 text-[hsl(var(--linkedin))]" />
                LinkedIn
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </footer>

      {/* Floating Chat — lazy loaded, client-only (avoids React #419 Suspense SSR error) */}
      {hydrated && (
        <ChatErrorBoundary>
          <Suspense fallback={null}>
            <FloatingChat lang={lang} />
          </Suspense>
        </ChatErrorBoundary>
      )}
    </div>
  )
}

export default App
