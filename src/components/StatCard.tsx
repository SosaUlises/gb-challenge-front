type StatTrend = 'positive' | 'negative' | 'neutral'

type StatCardProps = {
  label: string
  value: number
  code: string
  delta?: number
  trend?: StatTrend
}

function getStatus(value: number) {
  if (value <= 35) {
    return {
      label: 'Crítico',
      color: 'bg-red-400',
      text: 'text-red-200',
      border: 'border-red-400/35',
    }
  }

  if (value <= 65) {
    return {
      label: 'Estable',
      color: 'bg-amber-300',
      text: 'text-amber-100',
      border: 'border-amber-300/30',
    }
  }

  return {
    label: 'Fuerte',
    color: 'bg-emerald-300',
    text: 'text-emerald-100',
    border: 'border-emerald-300/30',
  }
}

function getTrendClass(trend: StatTrend) {
  if (trend === 'positive') return 'stat-feedback-positive'
  if (trend === 'negative') return 'stat-feedback-negative'

  return ''
}

function StatCard({
  label,
  value,
  code,
  delta = 0,
  trend = 'neutral',
}: StatCardProps) {
  const status = getStatus(value)
  const safeValue = Math.max(0, Math.min(100, value))
  const deltaLabel = delta > 0 ? `+${delta}` : `${delta}`

  return (
    <article
      className={`rounded-lg border ${status.border} ${getTrendClass(
        trend
      )} bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20 transition-colors duration-500`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-semibold text-slate-300">
          {code}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-white">{safeValue}</p>
          {delta !== 0 && (
            <span
              className={`pb-1 text-sm font-black ${
                delta > 0 ? 'text-emerald-200' : 'text-red-200'
              }`}
            >
              {deltaLabel}
            </span>
          )}
        </div>
        <p className={`text-xs font-semibold uppercase tracking-wide ${status.text}`}>
          {status.label}
        </p>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-800">
        <div
          className={`h-2 rounded-full ${status.color} transition-[width] duration-700 ease-out`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </article>
  )
}

export default StatCard
