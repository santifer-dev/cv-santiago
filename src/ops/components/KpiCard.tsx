import type { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string | number
  format?: 'number' | 'currency' | 'percent' | 'ms'
  icon?: ReactNode
  trend?: number
}

function formatValue(value: string | number, format?: string): string {
  if (typeof value === 'string') return value
  switch (format) {
    case 'currency':
      return `$${value.toFixed(2)}`
    case 'percent':
      return `${(value * 100).toFixed(1)}%`
    case 'ms':
      return `${Math.round(value)}ms`
    case 'number':
      return value.toLocaleString()
    default:
      return String(value)
  }
}

export default function KpiCard({ label, value, format, icon, trend }: KpiCardProps) {
  return (
    <div className="bg-card border border-white/[0.06] border-l-2 border-l-primary/20 rounded-lg p-3 sm:p-4 flex flex-col gap-0.5 sm:gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium truncate">{label}</span>
        {icon && <span className="text-muted-foreground shrink-0 ml-1">{icon}</span>}
      </div>
      <div className="flex items-end gap-1.5 sm:gap-2">
        <span className="text-xl sm:text-2xl font-display font-bold text-foreground truncate">
          {formatValue(value, format)}
        </span>
        {trend !== undefined && trend !== 0 && (
          <span className={`text-xs sm:text-sm font-medium shrink-0 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '\u2191' : '\u2193'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}
