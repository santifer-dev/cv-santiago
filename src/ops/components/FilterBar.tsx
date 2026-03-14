import type { TraceFilters } from '../hooks/useTraces'

interface FilterBarProps {
  filters: TraceFilters
  onChange: (filters: TraceFilters) => void
}

const selectClass =
  'bg-card border border-white/[0.06] rounded-lg px-2 py-1 sm:py-1.5 text-xs sm:text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary/50'

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const set = (patch: Partial<TraceFilters>) => onChange({ ...filters, ...patch })

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
      <select
        value={filters.days}
        onChange={e => set({ days: Number(e.target.value) })}
        className={selectClass}
      >
        <option value={1}>1 day</option>
        <option value={7}>7 days</option>
        <option value={30}>30 days</option>
      </select>

      <select
        value={filters.lang ?? ''}
        onChange={e => set({ lang: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">All langs</option>
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>

      <select
        value={filters.mode ?? ''}
        onChange={e => set({ mode: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">All modes</option>
        <option value="text">Text</option>
        <option value="voice">Voice</option>
      </select>

      <select
        value={filters.rag ?? ''}
        onChange={e => set({ rag: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">RAG: All</option>
        <option value="yes">RAG: Yes</option>
        <option value="no">RAG: No</option>
      </select>

      <label className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={filters.jailbreak ?? false}
          onChange={e => set({ jailbreak: e.target.checked || undefined })}
          className="accent-primary"
        />
        Jailbreak
      </label>
    </div>
  )
}
