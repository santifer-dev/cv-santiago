import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, ArrowLeft } from 'lucide-react'

/**
 * GlobalNav — unified navigation across all pages.
 *
 * - Home (/, /en): floating circular buttons (fixed, no layout impact)
 * - Inner pages: sticky bar with back link + lang/theme toggles
 *
 * Theme state lives here. No Motion dependency (keeps bundle light).
 */

const ALT_PATH: Record<string, string> = {
  '/n8n-para-pms': '/n8n-for-pms',
  '/n8n-for-pms': '/n8n-para-pms',
}

function useLang() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === '/en'
  const lang: 'es' | 'en' = (pathname === '/' || pathname === '/n8n-para-pms') ? 'es' : 'en'
  return { pathname, isHome, lang }
}

function useTheme() {
  // Default dark to match SSR prerender
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  // System preference listener (only if user hasn't manually toggled)
  useEffect(() => {
    if (localStorage.getItem('theme')) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
      document.documentElement.classList.toggle('dark', e.matches)
      document.documentElement.classList.toggle('light', !e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }, [isDark])

  return { isDark, toggleTheme }
}

function ThemeButton({ isDark, onClick, size = 'lg' }: { isDark: boolean; onClick: () => void; size?: 'lg' | 'sm' }) {
  const cls = size === 'lg'
    ? 'w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors'
    : 'w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors'
  return (
    <button onClick={onClick} className={cls} aria-label="Toggle theme">
      {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
    </button>
  )
}

/** Home pages: floating buttons top-right, no layout impact */
function HomeNav({ lang, isDark, toggleTheme }: { lang: 'es' | 'en'; isDark: boolean; toggleTheme: () => void }) {
  const navigate = useNavigate()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  if (!hydrated) return null

  const toggleLang = () => navigate(lang === 'es' ? '/en' : '/')

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-3">
      <button
        onClick={toggleLang}
        className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
        title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      >
        <span className="text-sm font-bold text-primary">
          {lang === 'es' ? 'EN' : 'ES'}
        </span>
      </button>
      <ThemeButton isDark={isDark} onClick={toggleTheme} size="lg" />
    </div>
  )
}

/** Inner pages: sticky bar with back link */
function InnerNav({ lang, isDark, toggleTheme, pathname }: { lang: 'es' | 'en'; isDark: boolean; toggleTheme: () => void; pathname: string }) {
  const altPath = ALT_PATH[pathname]
  const altLabel = lang === 'es' ? 'EN' : 'ES'

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          santifer.io
        </Link>
        <div className="flex items-center gap-2">
          {altPath && (
            <Link
              to={altPath}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {altLabel}
            </Link>
          )}
          <ThemeButton isDark={isDark} onClick={toggleTheme} size="sm" />
        </div>
      </div>
    </nav>
  )
}

export default function GlobalNav() {
  const { pathname, isHome, lang } = useLang()
  const { isDark, toggleTheme } = useTheme()

  if (isHome) {
    return <HomeNav lang={lang} isDark={isDark} toggleTheme={toggleTheme} />
  }

  return <InnerNav lang={lang} isDark={isDark} toggleTheme={toggleTheme} pathname={pathname} />
}
