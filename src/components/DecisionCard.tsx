import type { DecisionOption } from '../types/game'

type DecisionCardProps = {
  option: DecisionOption
  index: number
  disabled: boolean
  onChoose: (optionId: string) => void
}

const profiles = [
  {
    icon: '🛡',
    name: 'Conservadora',
    intent: 'Minimizar riesgo',
    summary: 'Menor riesgo. Protege liquidez y relaciones comerciales.',
    className:
      'border-emerald-200/20 bg-emerald-300/[0.045] hover:border-emerald-200/70 hover:bg-emerald-300/[0.075] hover:shadow-emerald-950/35',
    accent: 'text-emerald-200',
    line: 'bg-emerald-300/70',
  },
  {
    icon: '⚖',
    name: 'Equilibrada',
    intent: 'Balancear impacto',
    summary: 'Balancea impacto, operación y posición competitiva.',
    className:
      'border-blue-200/20 bg-blue-300/[0.045] hover:border-blue-200/70 hover:bg-blue-300/[0.075] hover:shadow-blue-950/35',
    accent: 'text-blue-200',
    line: 'bg-blue-300/70',
  },
  {
    icon: '🚀',
    name: 'Agresiva',
    intent: 'Buscar ventaja',
    summary: 'Acelera resultados, asumiendo más presión operativa.',
    className:
      'border-amber-200/25 bg-amber-300/[0.055] hover:border-amber-200/80 hover:bg-amber-300/[0.085] hover:shadow-amber-950/35',
    accent: 'text-amber-200',
    line: 'bg-amber-300/80',
  },
]

function DecisionCard({ option, index, disabled, onChoose }: DecisionCardProps) {
  const profile = profiles[index] ?? profiles[1]

  return (
    <button
      type="button"
      onClick={() => onChoose(option.id)}
      disabled={disabled}
      className={`group relative flex min-h-[17rem] overflow-hidden rounded-2xl border p-6 text-left shadow-xl shadow-slate-950/25 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-200/70 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 sm:min-h-[19rem] sm:p-7 lg:min-h-[21rem] lg:p-9 ${profile.className}`}
    >
      <span
        className={`absolute inset-x-0 top-0 h-1 ${profile.line}`}
        aria-hidden="true"
      />

      <div className="flex h-full flex-col justify-between">
        <div>
          <p
            className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] ${profile.accent}`}
          >
            <span className="text-base" aria-hidden="true">
              {profile.icon}
            </span>
            {profile.name}
          </p>

          <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            {profile.intent}
          </p>

          <h3 className="mt-5 text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl">
            {option.text}
          </h3>

          <p className="mt-4 text-sm font-medium leading-6 text-slate-300 sm:mt-5 md:text-base md:leading-7">
            {profile.summary}
          </p>
        </div>

        <p
          className="mt-7 inline-flex w-fit items-center rounded-full border border-amber-200/35 bg-amber-200/10 px-4 py-2.5 text-sm font-black text-amber-100 transition duration-200 group-hover:border-amber-200/80 group-hover:bg-amber-200/15"
        >
          Aplicar estrategia
          <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
            -&gt;
          </span>
        </p>
      </div>
    </button>
  )
}

export default DecisionCard
