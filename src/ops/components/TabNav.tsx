interface TabNavProps {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

export default function TabNav({ tabs, active, onChange }: TabNavProps) {
  return (
    <nav
      className="flex gap-0.5 sm:gap-1 overflow-x-auto pb-px -mb-px"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`.ops-tab-nav::-webkit-scrollbar { display: none; }`}</style>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`ops-tab-nav px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors relative ${
            active === tab
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab}
          {active === tab && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </nav>
  )
}
