import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts'

interface Series {
  key: string
  color: string
  label: string
}

interface MetricChartProps {
  data: Record<string, unknown>[]
  type: 'area' | 'bar' | 'donut'
  xKey?: string
  series: Series[]
  height?: number
  stacked?: boolean
}

const DARK_GRID = 'rgba(255,255,255,0.06)'
const DARK_TICK = 'rgba(255,255,255,0.5)'
const DARK_TOOLTIP_BG = 'hsl(240 5% 13%)'

export default function MetricChart({ data, type, xKey = 'date', series, height = 240, stacked = false }: MetricChartProps) {
  if (type === 'donut') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={series[0]?.key ?? 'value'}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            stroke="none"
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={series[i]?.color ?? series[0]?.color ?? '#888'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: DARK_TOOLTIP_BG, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#eee' }}
          />
          <Legend
            wrapperStyle={{ color: DARK_TICK, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ left: 60, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DARK_GRID} horizontal={false} />
          <XAxis type="number" tick={{ fill: DARK_TICK, fontSize: 12 }} />
          <YAxis type="category" dataKey={xKey} tick={{ fill: DARK_TICK, fontSize: 12 }} width={56} />
          <Tooltip
            contentStyle={{ background: DARK_TOOLTIP_BG, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#eee' }}
          />
          {series.map(s => (
            <Bar key={s.key} dataKey={s.key} fill={s.color} name={s.label} radius={[0, 4, 4, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // area chart (default)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
        <defs>
          {series.map(s => (
            <linearGradient key={s.key} id={`grad_${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={DARK_GRID} />
        <XAxis dataKey={xKey} tick={{ fill: DARK_TICK, fontSize: 12 }} />
        <YAxis tick={{ fill: DARK_TICK, fontSize: 12 }} />
        <Tooltip
          contentStyle={{ background: DARK_TOOLTIP_BG, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#eee' }}
        />
        {series.map(s => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            stroke={s.color}
            fill={`url(#grad_${s.key})`}
            name={s.label}
            stackId={stacked ? 'stack' : undefined}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
