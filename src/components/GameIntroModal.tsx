import { useState } from 'react'

type GameIntroModalProps = {
  onStart: () => void
}

const briefingSteps = [
  {
    icon: '🚨',
    title: 'Leé el escenario',
    text: 'Cada ronda presenta una situación crítica de negocio.',
  },
  {
    icon: '🛡',
    title: 'Elegí una estrategia',
    text: 'No hay respuestas perfectas. Cada decisión tiene costos y beneficios.',
  },
  {
    icon: '💰',
    title: 'Mirá el impacto',
    text: 'Tus indicadores pueden subir o bajar según tus decisiones.',
  },
  {
    icon: '🏆',
    title: 'Competí en el ranking',
    text: 'Al finalizar, tu gestión queda registrada en el ranking global.',
  },
]

const keyIndicators = [
  {
    icon: '💰',
    label: 'Rentabilidad',
    description: 'margen y salud financiera',
  },
  {
    icon: '👥',
    label: 'Clientes',
    description: 'cartera comercial y demanda',
  },
  {
    icon: '😊',
    label: 'Clima',
    description: 'equipo, liderazgo y motivación',
  },
  {
    icon: '⭐',
    label: 'Marca',
    description: 'imagen y posicionamiento',
  },
  {
    icon: '🚚',
    label: 'Logística',
    description: 'stock, depósito y entregas',
  },
]

const demoOptions = [
  {
    label: 'Reorganizar entregas',
    icon: '🛡',
    impacts: [
      { icon: '💰', label: 'Rentabilidad', value: '+3', tone: 'text-emerald-100' },
      { icon: '👥', label: 'Clientes', value: '+5', tone: 'text-emerald-100' },
      { icon: '🚚', label: 'Logística', value: '+7', tone: 'text-emerald-100' },
    ],
  },
  {
    label: 'Contratar refuerzo temporal',
    icon: '⚖',
    impacts: [
      { icon: '💰', label: 'Rentabilidad', value: '-5', tone: 'text-red-100' },
      { icon: '👥', label: 'Clientes', value: '+10', tone: 'text-emerald-100' },
      { icon: '🚚', label: 'Logística', value: '+15', tone: 'text-emerald-100' },
    ],
  },
  {
    label: 'Acelerar despachos prioritarios',
    icon: '🚀',
    impacts: [
      { icon: '💰', label: 'Rentabilidad', value: '-8', tone: 'text-red-100' },
      { icon: '👥', label: 'Clientes', value: '+14', tone: 'text-emerald-100' },
      { icon: '⭐', label: 'Marca', value: '+8', tone: 'text-emerald-100' },
    ],
  },
]

function GameIntroModal({ onStart }: GameIntroModalProps) {
  const [selectedDemo, setSelectedDemo] = useState(demoOptions[1])

  return (
    <div className="result-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/84 px-3 py-3 backdrop-blur-md sm:px-5 sm:py-5">
      <section
        className="result-modal-panel max-h-[96vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-cyan-200/20 bg-[linear-gradient(145deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] shadow-2xl shadow-cyan-950/25 sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-intro-title"
      >
        <div className="border-b border-white/10 px-5 py-5 sm:px-6 md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-amber-100">
              Briefing inicial
            </p>
            <h2
              id="game-intro-title"
              className="mt-3 text-3xl font-black uppercase leading-none text-white sm:text-5xl"
            >
              Bienvenido, Director General
            </h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-300 sm:text-lg">
              Durante 15 escenarios vas a tomar decisiones que modifican el
              futuro de Grupo Blanco.
            </p>

            <div className="mt-4 rounded-xl border border-amber-200/25 bg-amber-200/[0.06] p-3.5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-100">
                Indicadores clave
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {keyIndicators.map((indicator) => (
                  <div
                    key={indicator.label}
                    className="rounded-lg border border-white/10 bg-slate-950/35 px-2.5 py-2"
                  >
                    <p className="text-[0.72rem] font-black leading-4 text-white">
                      {indicator.icon} {indicator.label}
                    </p>
                    <p className="mt-0.5 text-[0.67rem] font-semibold leading-4 text-slate-400">
                      {indicator.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:px-6 md:grid-cols-[0.95fr_1.05fr] md:px-8">
          <section>
            <div className="grid gap-3 sm:grid-cols-2">
              {briefingSteps.map((step) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-3.5"
                >
                  <p className="text-2xl" aria-hidden="true">
                    {step.icon}
                  </p>
                  <h3 className="mt-3 text-base font-black text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-400">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.045] p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">
              Demo rápida
            </p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">
              El depósito de Rosario está saturado.
            </h3>

            <div className="mt-5 grid gap-3">
              {demoOptions.map((option) => {
                const isSelected = selectedDemo.label === option.label

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedDemo(option)}
                    className={`rounded-2xl border px-4 py-2.5 text-left text-sm font-black transition ${
                      isSelected
                        ? 'border-amber-200/60 bg-amber-200/12 text-amber-100'
                        : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-cyan-200/40 hover:bg-cyan-200/[0.06]'
                    }`}
                  >
                    <span className="mr-2" aria-hidden="true">
                      {option.icon}
                    </span>
                    {option.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Impacto ejemplo
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {selectedDemo.impacts.map((impact) => (
                  <div
                    key={impact.label}
                    className="rounded-xl border border-white/10 bg-slate-950/50 p-2.5"
                  >
                    <p className="text-xs font-black text-slate-400">
                      {impact.icon} {impact.label}
                    </p>
                    <p className={`mt-1.5 text-xl font-black ${impact.tone}`}>
                      {impact.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end border-t border-white/10 px-5 py-5 sm:px-6 md:px-8">
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-cyan-950/20 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200 sm:w-auto"
          >
            Comenzar gestión -&gt;
          </button>
        </div>
      </section>
    </div>
  )
}

export default GameIntroModal
