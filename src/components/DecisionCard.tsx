import type { DecisionOption } from '../types/game'

type DecisionCardProps = {
  option: DecisionOption
  index: number
  disabled: boolean
  onChoose: (optionId: string) => void
}

const profiles = [
  {
    name: 'Conservadora',
    summary: 'Reduce exposición y cuida la caja, pero puede resignar velocidad.',
  },
  {
    name: 'Equilibrada',
    summary: 'Busca balancear operación, marca y relación comercial.',
  },
  {
    name: 'Agresiva',
    summary: 'Acelera el impacto, con mayor presión sobre recursos y equipos.',
  },
]

function DecisionCard({ option, index, disabled, onChoose }: DecisionCardProps) {
  const profile = profiles[index] ?? profiles[1]

  return (
    <button
      type="button"
      onClick={() => onChoose(option.id)}
      disabled={disabled}
      className="group flex min-h-56 flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/85 p-5 text-left shadow-xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-cyan-200/70 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
            Opción {index + 1}
          </span>
          <span className="text-xs font-semibold text-cyan-200">
            {profile.name}
          </span>
        </div>

        <p className="mt-5 text-lg font-semibold leading-snug text-white">
          {option.text}
        </p>
      </div>

      <div>
        <p className="mt-6 border-t border-slate-800 pt-4 text-sm leading-6 text-slate-400">
          {profile.summary}
        </p>
        <p className="mt-4 text-sm font-semibold text-white">
          Tomar decisión
          <span className="ml-2 text-cyan-200 transition group-hover:ml-3">
            -&gt;
          </span>
        </p>
      </div>
    </button>
  )
}

export default DecisionCard
