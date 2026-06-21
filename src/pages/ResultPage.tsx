import StatCard from '../components/StatCard'
import type { GameSession } from '../types/game'

type ResultPageProps = {
  game: GameSession
  onRestart: () => void
  onViewRanking: () => void
}

const statDefinitions = [
  { key: 'rentability', label: 'Rentabilidad', code: 'REN' },
  { key: 'clients', label: 'Cartera de clientes', code: 'CLI' },
  { key: 'organizationalClimate', label: 'Clima interno', code: 'CLI+' },
  { key: 'brandImage', label: 'Imagen de marca', code: 'MAR' },
  { key: 'operationalEfficiency', label: 'Eficiencia logística', code: 'LOG' },
] as const

function ResultPage({ game, onRestart, onViewRanking }: ResultPageProps) {
  const stats = statDefinitions.map((stat) => ({
    ...stat,
    value: game[stat.key],
  }))

  const strongest = stats.reduce((best, stat) =>
    stat.value > best.value ? stat : best
  )
  const weakest = stats.reduce((worst, stat) =>
    stat.value < worst.value ? stat : worst
  )

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <header className="rounded-lg border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
            Gestión finalizada
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                {game.finalRating}
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Resultado de gestión de {game.playerName} como Director General
                de Grupo Blanco.
              </p>
            </div>
            <div className="rounded-lg border border-cyan-200/30 bg-cyan-200/10 p-5 text-center">
              <p className="text-sm text-cyan-100">Puntaje final</p>
              <p className="mt-2 text-6xl font-bold">{game.finalScore}</p>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {stats.map((stat) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value={stat.value}
              code={stat.code}
            />
          ))}
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Fortaleza principal
            </p>
            <h2 className="mt-3 text-2xl font-bold">{strongest.label}</h2>
            <p className="mt-2 text-slate-300">
              Fue el indicador más sólido del año, con {strongest.value} puntos.
            </p>
          </article>

          <article className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-100">
              Debilidad principal
            </p>
            <h2 className="mt-3 text-2xl font-bold">{weakest.label}</h2>
            <p className="mt-2 text-slate-300">
              Es el frente que más atención necesitaría en el siguiente período,
              con {weakest.value} puntos.
            </p>
          </article>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onViewRanking}
            className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-100"
          >
            Ver ranking
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-white"
          >
            Jugar otra vez
          </button>
        </div>
      </section>
    </main>
  )
}

export default ResultPage
