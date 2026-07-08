import type { DecisionOption } from '../types/game'

type DecisionCardProps = {
  option: DecisionOption
  index: number
  disabled: boolean
  onChoose: (optionId: string) => void
}

const cardStyles = [
  {
    className:
      'border-emerald-200/20 bg-emerald-300/[0.045] hover:border-emerald-200/70 hover:bg-emerald-300/[0.075] hover:shadow-emerald-950/35',
    accent: 'text-emerald-200',
    line: 'bg-emerald-300/70',
  },
  {
    className:
      'border-blue-200/20 bg-blue-300/[0.045] hover:border-blue-200/70 hover:bg-blue-300/[0.075] hover:shadow-blue-950/35',
    accent: 'text-blue-200',
    line: 'bg-blue-300/70',
  },
  {
    className:
      'border-amber-200/25 bg-amber-300/[0.055] hover:border-amber-200/80 hover:bg-amber-300/[0.085] hover:shadow-amber-950/35',
    accent: 'text-amber-200',
    line: 'bg-amber-300/80',
  },
]

function DecisionCard({ option, index, disabled, onChoose }: DecisionCardProps) {
  const style = cardStyles[index] ?? cardStyles[1]

  return (
    <button
      type="button"
      onClick={() => onChoose(option.id)}
      disabled={disabled}
      className={`group relative flex min-h-[14rem] overflow-hidden rounded-2xl border p-6 text-left shadow-xl shadow-slate-950/25 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-200/70 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 sm:min-h-[15rem] sm:p-7 lg:min-h-[17rem] lg:p-8 ${style.className}`}
    >
      <span
        className={`absolute inset-x-0 top-0 h-1 ${style.line}`}
        aria-hidden="true"
      />

      <div className="flex h-full flex-col justify-between">
        <div>
          <p
            className={`text-xs font-black uppercase tracking-[0.2em] ${style.accent}`}
          >
            Opcion {index + 1}
          </p>

          <h3 className="mt-5 text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl">
            {option.text}
          </h3>
        </div>

        <p className="mt-7 inline-flex w-fit items-center rounded-full border border-amber-200/35 bg-amber-200/10 px-4 py-2.5 text-sm font-black text-amber-100 transition duration-200 group-hover:border-amber-200/80 group-hover:bg-amber-200/15">
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
