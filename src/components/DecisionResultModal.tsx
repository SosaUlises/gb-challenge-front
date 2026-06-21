import { useEffect } from 'react'

type DecisionResultDelta = {
  key: string
  label: string
  icon: string
  previousValue: number
  nextValue: number
  delta: number
}

type DecisionResultModalProps = {
  decisionText: string | null
  consequence: string
  deltas: DecisionResultDelta[]
  onContinue: () => void
}

function getStrategicSummary(deltas: DecisionResultDelta[]) {
  const totalImpact = deltas.reduce((total, stat) => total + stat.delta, 0)

  if (totalImpact > 0) {
    return {
      label: 'Impacto general positivo',
      description: 'La decisión fortaleció la posición competitiva.',
      className: 'border-emerald-200/25 bg-emerald-200/10 text-emerald-100',
    }
  }

  if (totalImpact < 0) {
    return {
      label: 'Impacto general riesgoso',
      description: 'La decisión genera presión sobre indicadores críticos.',
      className: 'border-red-200/25 bg-red-200/10 text-red-100',
    }
  }

  return {
    label: 'Impacto general equilibrado',
    description: 'Hubo beneficios, aunque con costos relevantes.',
    className: 'border-amber-200/25 bg-amber-200/10 text-amber-100',
  }
}

function getDeltaClass(delta: number) {
  if (delta > 0) {
    return 'border-emerald-200/30 bg-emerald-200/10 text-emerald-100'
  }

  if (delta < 0) {
    return 'border-red-200/30 bg-red-200/10 text-red-100'
  }

  return 'border-amber-200/30 bg-amber-200/10 text-amber-100'
}

function DecisionResultModal({
  decisionText,
  consequence,
  deltas,
  onContinue,
}: DecisionResultModalProps) {
  const summary = getStrategicSummary(deltas)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        onContinue()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onContinue])

  return (
    <div className="result-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/82 px-3 py-4 backdrop-blur-md sm:px-5 sm:py-6">
      <section
        className="result-modal-panel max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-amber-200/25 bg-[linear-gradient(145deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] shadow-2xl shadow-amber-950/25 sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="decision-result-title"
      >
        <div className="border-b border-white/10 px-5 py-5 sm:px-6 sm:py-6 md:px-8">
          <p
            id="decision-result-title"
            className="text-xs font-black uppercase tracking-[0.24em] text-amber-100"
          >
            Decisión tomada
          </p>
          {decisionText && (
            <h2 className="mt-3 text-xl font-black leading-tight text-white sm:text-2xl md:text-3xl">
              {decisionText}
            </h2>
          )}
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6 md:px-8">
          <div
            className={`flex max-w-full flex-col gap-1 rounded-2xl border px-3.5 py-2 text-sm font-black sm:inline-flex sm:flex-row sm:items-center ${summary.className}`}
          >
            <span>{summary.label}</span>
            <span className="hidden h-1 w-1 rounded-full bg-current opacity-60 sm:block" />
            <span className="text-slate-100/90">
              {summary.description}
            </span>
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
            Resultado
          </p>
          <p className="mt-3 text-base leading-8 text-slate-100 md:text-lg">
            {consequence}
          </p>

          {deltas.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-100">
                Impacto en la empresa
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {deltas.map((stat, index) => (
                  <div
                    key={stat.key}
                    className={`result-impact-card rounded-2xl border p-4 ${getDeltaClass(
                      stat.delta
                    )}`}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="flex items-center gap-2 text-sm font-black text-slate-100">
                      <span className="text-xl" aria-hidden="true">
                        {stat.icon}
                      </span>
                      <span>{stat.label}</span>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <p className="text-xs font-black text-slate-400">
                        {stat.previousValue} -&gt; {stat.nextValue}
                      </p>
                      <p className="text-2xl font-black leading-none tabular-nums">
                        {stat.delta > 0 ? '+' : ''}
                        {stat.delta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="flex justify-end border-t border-white/10 px-5 py-5 sm:px-6 md:px-8">
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-full border border-amber-200/45 bg-amber-200/12 px-5 py-3 text-sm font-black text-amber-100 shadow-lg shadow-amber-950/20 transition duration-200 hover:-translate-y-0.5 hover:border-amber-100 hover:bg-amber-200/20 hover:shadow-amber-950/35 focus:outline-none focus:ring-2 focus:ring-amber-200/70 sm:w-auto"
          >
            Continuar -&gt;
          </button>
        </div>
      </section>
    </div>
  )
}

export default DecisionResultModal
