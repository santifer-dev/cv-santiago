import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Globe, ArrowLeft } from 'lucide-react'

/**
 * GlobalNav — unified navigation across all pages.
 *
 * Controls (lang pill + theme button) are positioned identically everywhere:
 * - Home: fixed at top-6 right-6 (floating, no layout impact)
 * - Inner pages: inside a sticky bar with pt-6 pb-3 px-6, so controls land
 *   at exactly the same screen position (24px from top & right edges)
 *
 * The inner-page bar fades in for a smooth navigation feel.
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

/** Shared controls: Globe lang pill + theme circle */
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

/** Home: floating controls at top-6 right-6, no layout impact */
function HomeNav({ altPath, altLabel, isDark, toggleTheme }: {
  altPath: string; altLabel: string; isDark: boolean; toggleTheme: () => void
}) {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  if (!hydrated) return null

  return (
    <div className="fixed top-6 right-6 z-50">
      <NavControls altPath={altPath} altLabel={altLabel} isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  )
}

/**
 * Inner pages: sticky bar with back link + controls.
 * Uses pt-6 px-6 so controls land at exact same position as home's
 * fixed top-6 right-6. Bar fades in for smooth transition.
 */
function InnerNav({ altPath, altLabel, isDark, toggleTheme }: {
  altPath: string; altLabel: string; isDark: boolean; toggleTheme: () => void
}) {
  return (
    <nav
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      style={{ animation: 'nav-fade-in 0.35s ease-out' }}
    >
      <div className="pt-6 pb-3 px-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          style={{ animation: 'nav-fade-in 0.4s ease-out' }}
        >
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

  const altPath = ALT_PATH[pathname] || (lang === 'es' ? '/en' : '/')
  const altLabel = lang === 'es' ? 'ES' : 'EN'

  if (isHome) {
    return <HomeNav altPath={altPath} altLabel={altLabel} isDark={isDark} toggleTheme={toggleTheme} />
  }

  return <InnerNav altPath={altPath} altLabel={altLabel} isDark={isDark} toggleTheme={toggleTheme} />
}
