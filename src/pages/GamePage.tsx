import { useState } from 'react'
import { chooseOption } from '../api/gameApi'
import DecisionCard from '../components/DecisionCard'
import ProgressTimeline from '../components/ProgressTimeline'
import StatCard from '../components/StatCard'
import ResultPage from './ResultPage'
import type { GameSession } from '../types/game'
import { getQuarter } from '../utils/gameProgress'

type GamePageProps = {
  initialGame: GameSession
  onRestart: () => void
  onViewRanking: () => void
}

const totalScenarios = 15

const statDefinitions = [
  { key: 'rentability', label: 'Rentabilidad', code: 'REN' },
  { key: 'clients', label: 'Cartera de clientes', code: 'CLI' },
  { key: 'organizationalClimate', label: 'Clima interno', code: 'CLI+' },
  { key: 'brandImage', label: 'Imagen de marca', code: 'MAR' },
  { key: 'operationalEfficiency', label: 'Eficiencia logística', code: 'LOG' },
] as const

function GamePage({ initialGame, onRestart, onViewRanking }: GamePageProps) {
  const [game, setGame] = useState(initialGame)
  const [lastConsequence, setLastConsequence] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleChooseOption(optionId: string) {
    setIsLoading(true)

    try {
      const result = await chooseOption({
        gameSessionId: game.id,
        optionId,
      })

      setGame(result.gameSession)
      setLastConsequence(result.consequence)
    } catch {
      alert('No se pudo procesar la decisión')
    } finally {
      setIsLoading(false)
    }
  }

  if (game.isFinished) {
    return (
      <ResultPage
        game={game}
        onRestart={onRestart}
        onViewRanking={onViewRanking}
      />
    )
  }

  const scenario = game.currentScenario
  const quarter = getQuarter(game.currentScenarioOrder)
  const progress = Math.round((game.currentScenarioOrder / totalScenarios) * 100)
  const stats = statDefinitions.map((stat) => ({
    ...stat,
    value: game[stat.key],
  }))

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <header className="grid gap-5 border-b border-slate-800 pb-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
              Tablero de Dirección General
            </p>
            <h1 className="mt-2 text-3xl font-bold">{game.playerName}</h1>
            <p className="mt-1 text-slate-400">
              Rol: Director General de Grupo Blanco
            </p>
          </div>

          <div className="grid gap-2 rounded-lg border border-slate-800 bg-slate-900/80 p-4 sm:min-w-80">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-400">Escenario actual</span>
              <span className="font-semibold text-white">
                {game.currentScenarioOrder} / {totalScenarios}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-400">Trimestre</span>
              <span className="font-semibold text-cyan-100">
                {quarter.id} · {quarter.label}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-cyan-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <div className="mt-6">
          <ProgressTimeline currentScenario={game.currentScenarioOrder} />
        </div>

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

        {lastConsequence && (
          <div className="mt-6 rounded-lg border border-cyan-200/30 bg-cyan-200/10 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100">
              Consecuencia de tu decisión
            </p>
            <p className="mt-3 leading-7 text-slate-200">{lastConsequence}</p>
          </div>
        )}

        {scenario && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.35fr]">
            <article className="rounded-lg border border-slate-800 bg-slate-900/85 p-6 shadow-xl shadow-slate-950/30">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                {scenario.topic}
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                {scenario.title}
              </h2>

              <p className="mt-5 leading-8 text-slate-300">
                {scenario.description}
              </p>

              <div className="mt-6 grid gap-3 border-t border-slate-800 pt-5 text-sm text-slate-300">
                <p>
                  <span className="font-semibold text-white">Contexto:</span>{' '}
                  importación, comercialización, logística y gestión de marcas.
                </p>
                <p>
                  <span className="font-semibold text-white">Criterio:</span>{' '}
                  no hay decisión perfecta; cada alternativa mueve prioridades.
                </p>
              </div>
            </article>

            <div className="grid gap-4 md:grid-cols-3">
              {scenario.options.map((option, index) => (
                <DecisionCard
                  key={option.id}
                  option={option}
                  index={index}
                  disabled={isLoading}
                  onChoose={handleChooseOption}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default GamePage
