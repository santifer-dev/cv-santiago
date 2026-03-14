import { useState, useEffect, type FormEvent } from 'react'

interface OpsAuthProps {
  onAuth: () => void
}

export default function OpsAuth({ onAuth }: OpsAuthProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = 'noindex, nofollow'
    // Force dark mode via CSS variables (works regardless of OS preference)
    const style = document.createElement('style')
    style.id = 'ops-dark-theme'
    style.textContent = `
      :root {
        --background: 240 6% 10% !important;
        --foreground: 0 0% 98% !important;
        --card: 240 5% 12% !important;
        --card-foreground: 0 0% 98% !important;
        --muted-foreground: 240 5% 65% !important;
        --primary: 24 94% 53% !important;
        --primary-foreground: 0 0% 9% !important;
        --accent: 187 75% 55% !important;
        color-scheme: dark;
      }
    `
    document.head.appendChild(style)
    return () => {
      robots.content = 'index, follow'
      document.getElementById('ops-dark-theme')?.remove()
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/ops/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Authentication failed')
      }

      const { token } = await res.json()
      sessionStorage.setItem('ops_token', token)
      onAuth()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-white/5 rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-display font-bold text-foreground mb-1">LLMOps Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">santifer.io</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
