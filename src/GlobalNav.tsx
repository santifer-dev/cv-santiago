import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Globe, ArrowLeft } from 'lucide-react'

/**
 * GlobalNav — unified navigation across all pages.
 *
 * - Home (/, /en): floating controls top-right (fixed, no layout impact)
 * - Inner pages: sticky semi-transparent bar with ← santifer.io + same controls
 *
 * Controls (lang pill + theme button) are visually identical everywhere.
 */

const ALT_PATH: Record<string, string> = {
  '/': '/en',
  '/en': '/',
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
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

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

/** Shared controls: Globe lang pill + theme circle — identical on every page */
function NavControls({ altPath, altLabel, isDark, toggleTheme }: {
  altPath: string
  altLabel: string
  isDark: boolean
  toggleTheme: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        to={altPath}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        {altLabel}
      </Link>
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
      </button>
    </div>
  )
}

/** Home pages: floating controls top-right, no layout impact */
function HomeNav({ lang, isDark, toggleTheme, pathname }: { lang: 'es' | 'en'; isDark: boolean; toggleTheme: () => void; pathname: string }) {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  if (!hydrated) return null

  const altPath = ALT_PATH[pathname] || (lang === 'es' ? '/en' : '/')
  const altLabel = lang === 'es' ? 'EN' : 'ES'

  return (
    <div className="fixed top-6 right-6 z-50">
      <NavControls altPath={altPath} altLabel={altLabel} isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  )
}

/** Inner pages: sticky bar with back link + same controls */
function InnerNav({ lang, isDark, toggleTheme, pathname }: { lang: 'es' | 'en'; isDark: boolean; toggleTheme: () => void; pathname: string }) {
  const altPath = ALT_PATH[pathname] || (lang === 'es' ? '/en' : '/')
  const altLabel = lang === 'es' ? 'EN' : 'ES'

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          santifer.io
        </Link>
        <NavControls altPath={altPath} altLabel={altLabel} isDark={isDark} toggleTheme={toggleTheme} />
      </div>
    </nav>
  )
}

export default function GlobalNav() {
  const { pathname, isHome, lang } = useLang()
  const { isDark, toggleTheme } = useTheme()

  if (isHome) {
    return <HomeNav lang={lang} isDark={isDark} toggleTheme={toggleTheme} pathname={pathname} />
  }

  return <InnerNav lang={lang} isDark={isDark} toggleTheme={toggleTheme} pathname={pathname} />
}
