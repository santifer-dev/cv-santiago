import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, House, X, ChevronRight } from 'lucide-react'
import { translations, type Lang } from './i18n'
import { getAltPaths, getPageTitles, getSectionLabels, getEsSlugs } from './articles/registry'

/**
 * GlobalNav — unified navigation across all pages.
 *
 * The translucent bar is a "contextual message container" that appears
 * when there's something to communicate:
 * - Inner pages: permanent "← santifer.io" back link
 * - Any page: temporary language suggestion when browser lang ≠ page lang
 *
 * Language suggestion is right-aligned, next to the lang pill, reinforcing
 * the connection. Controls always live inside the bar when it's visible;
 * when there's no bar (home, no banner), controls float fixed at top-6 right-6.
 */

const ALT_PATH = getAltPaths()
const BANNER_DISMISSED_KEY = 'lang-banner-dismissed'
const PAGE_TITLE = getPageTitles()
const SECTION_LABELS = getSectionLabels()
const ES_SLUGS = getEsSlugs()

/** Observes h2[id] elements and returns the currently visible section ID */
function useActiveSection(pathname: string, enabled: boolean) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    setActiveId(null)
    if (!enabled) return

    let io: IntersectionObserver | null = null
    let mo: MutationObserver | null = null

    function setup() {
      const h1 = document.querySelector('h1')
      const headings = Array.from(document.querySelectorAll('h2[id]'))
      if (headings.length === 0) return false

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (entry.target.tagName === 'H1') {
                setActiveId(null)
                return
              }
              setActiveId(entry.target.id)
              return
            }
          }
        },
        { rootMargin: '-64px 0px -75% 0px' }
      )

      if (h1) io.observe(h1)
      headings.forEach((h) => io!.observe(h))
      return true
    }

    // Try immediately (component may already be rendered)
    if (!setup()) {
      // Lazy component not mounted yet — watch for h2[id] to appear
      mo = new MutationObserver(() => {
        if (setup()) mo!.disconnect()
      })
      mo.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      io?.disconnect()
      mo?.disconnect()
    }
  }, [pathname, enabled])

  return activeId
}

function useLang() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === '/en'
  const lang: 'es' | 'en' = ES_SLUGS.has(pathname) ? 'es' : 'en'
  const pageTitle = PAGE_TITLE[pathname] ?? null
  return { pathname, isHome, lang, pageTitle }
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

/**
 * Detects browser/page language mismatch.
 * Uses sessionStorage to survive re-mounts across navigations:
 * - null: not shown yet → show after 2s delay
 * - 'shown': already visible → show immediately, no animation
 * - 'dismissed': user closed it → never show again
 */
function useLanguageBanner(lang: Lang) {
  const stored = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(BANNER_DISMISSED_KEY) : null
  const [visible, setVisible] = useState(stored === 'shown')
  const isFirstAppearance = useRef(stored !== 'shown')

  // Show after delay on first visit (no sessionStorage entry yet)
  useEffect(() => {
    if (typeof navigator === 'undefined') return
    if (stored) return // already 'shown' or 'dismissed'

    const browserPrefersEn = !navigator.language.toLowerCase().startsWith('es')
    const mismatch = (lang === 'es' && browserPrefersEn) || (lang === 'en' && !browserPrefersEn)
    if (!mismatch) return

    const timer = setTimeout(() => {
      sessionStorage.setItem(BANNER_DISMISSED_KEY, 'shown')
      setVisible(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [lang, stored])

  // Auto-dismiss if user switches language via toggle
  useEffect(() => {
    if (!visible) return
    const browserPrefersEn = !navigator.language.toLowerCase().startsWith('es')
    const mismatch = (lang === 'es' && browserPrefersEn) || (lang === 'en' && !browserPrefersEn)
    if (!mismatch) {
      sessionStorage.setItem(BANNER_DISMISSED_KEY, 'dismissed')
      setVisible(false)
    }
  }, [lang, visible])

  const dismiss = useCallback(() => {
    sessionStorage.setItem(BANNER_DISMISSED_KEY, 'dismissed')
    setVisible(false)
  }, [])

  return { showBanner: visible, dismiss, animateBanner: visible && isFirstAppearance.current }
}

/** Shared controls: Globe lang pill + theme circle */
function NavControls({ altPath, altLabel, isDark, toggleTheme }: {
  altPath: string; altLabel: string; isDark: boolean; toggleTheme: () => void
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

export default function GlobalNav() {
  const { pathname, isHome, lang, pageTitle } = useLang()
  const { isDark, toggleTheme } = useTheme()
  const { showBanner, dismiss, animateBanner } = useLanguageBanner(lang)
  const navigate = useNavigate()
  const activeSection = useActiveSection(pathname, !isHome)

  const altPath = ALT_PATH[pathname] || (lang === 'es' ? '/en' : '/')
  const altLabel = lang === 'es' ? 'ES' : 'EN'

  const t = translations[lang]
  const hasBar = !isHome || showBanner

  // Breadcrumb: show active section label or fall back to page title
  const sectionLabels = SECTION_LABELS[pathname]
  const activeSectionLabel = activeSection && sectionLabels?.[activeSection]


  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  // Animation tracking — bar and back link animate only on first appearance
  const barShown = useRef(false)
  const animateBar = hasBar && !barShown.current
  if (hasBar) barShown.current = true

  const backLinkShown = useRef(false)
  const animateBackLink = !isHome && !backLinkShown.current
  if (!isHome) backLinkShown.current = true

  const switchLang = () => {
    dismiss()
    navigate(altPath)
  }

  const controls = <NavControls altPath={altPath} altLabel={altLabel} isDark={isDark} toggleTheme={toggleTheme} />

  const fade = (duration: string) => ({ animation: `nav-fade-in ${duration} ease-out` })

  // Banner message (right-aligned, near lang pill)
  const bannerMessage = showBanner ? (
    <div
      className="flex items-center gap-2.5 text-sm"
      style={animateBanner ? fade('0.4s') : undefined}
    >
      <span className="text-muted-foreground hidden sm:inline">{t.ui.languageBanner}</span>
      <button
        onClick={switchLang}
        className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {t.ui.languageBannerSwitchPrefix}<Globe className="w-3.5 h-3.5 mx-0.5" />{t.ui.languageBannerSwitchLang}
      </button>
      <button
        onClick={dismiss}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  ) : null

  // Bar visible: controls (+ optional banner) inside it
  if (hasBar) {
    return (
      <nav className="sticky top-0 z-50 relative">
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border"
          style={animateBar ? fade('0.35s') : undefined}
        />
        <div className="relative pt-4 pb-3 px-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {/* Left: back link on inner pages, empty on home */}
            <div className="min-w-0 flex items-center">
              {!isHome && (
                <nav
                  aria-label="Breadcrumb"
                  className="inline-flex items-center gap-1.5 text-sm"
                  style={animateBackLink ? fade('0.4s') : undefined}
                >
                  <Link
                    to={lang === 'en' ? '/en' : '/'}
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <House className="w-4 h-4" />
                    <span className="hidden sm:inline">santifer.io</span>
                  </Link>
                  {pageTitle && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                      <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className={`hover:text-foreground transition-colors cursor-pointer truncate ${activeSectionLabel ? 'text-muted-foreground' : 'text-foreground font-medium'}`}
                      >
                        {pageTitle}
                      </button>
                    </>
                  )}
                  {activeSectionLabel && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 hidden sm:block" />
                      <span className="text-foreground font-medium truncate max-w-[140px] sm:max-w-none hidden sm:inline">
                        {activeSectionLabel}
                      </span>
                    </>
                  )}
                </nav>
              )}
            </div>
            {/* Right: controls */}
            <div className="flex items-center gap-2 shrink-0">
              {controls}
            </div>
          </div>
          {/* Banner: second row on mobile, inline on desktop */}
          {bannerMessage && (
            <div className="flex justify-end">
              {bannerMessage}
            </div>
          )}
        </div>
      </nav>
    )
  }

  // No bar: floating controls only
  if (!hydrated) return null

  return (
    <div className="fixed top-6 right-6 z-50">
      {controls}
    </div>
  )
}
