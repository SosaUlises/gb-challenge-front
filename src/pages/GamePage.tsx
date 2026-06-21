import { useState } from 'react'
import { chooseOption } from '../api/gameApi'
import DecisionCard from '../components/DecisionCard'
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
  { key: 'rentability', label: 'Rentabilidad', icon: '💰' },
  { key: 'clients', label: 'Clientes', icon: '👥' },
  { key: 'organizationalClimate', label: 'Clima', icon: '😊' },
  { key: 'brandImage', label: 'Marca', icon: '⭐' },
  { key: 'operationalEfficiency', label: 'Logística', icon: '🚚' },
] as const

type StatKey = (typeof statDefinitions)[number]['key']

type StatDelta = {
  key: StatKey
  label: string
  icon: string
  delta: number
}

function getStatTone(value: number) {
  if (value <= 25) {
    return {
      dot: 'bg-red-300',
      value: 'text-red-100',
      glow: 'shadow-red-950/30',
    }
  }

  if (value <= 45) {
    return {
      dot: 'bg-orange-300',
      value: 'text-orange-100',
      glow: 'shadow-orange-950/30',
    }
  }

  if (value <= 65) {
    return {
      dot: 'bg-amber-300',
      value: 'text-amber-100',
      glow: 'shadow-amber-950/30',
    }
  }

  if (value <= 85) {
    return {
      dot: 'bg-cyan-300',
      value: 'text-cyan-100',
      glow: 'shadow-cyan-950/30',
    }
  }

  return {
    dot: 'bg-emerald-300',
    value: 'text-emerald-100',
    glow: 'shadow-emerald-950/30',
  }
}

function getScenarioChips(topic: string, title: string, description: string) {
  const text = `${topic} ${title} ${description}`.toLowerCase()
  const chips: string[] = []

  if (
    text.includes('import') ||
    text.includes('contenedor') ||
    text.includes('proveedor')
  ) {
    chips.push('🚢 Importaciones')
  }

  if (
    text.includes('dólar') ||
    text.includes('dolar') ||
    text.includes('cambio') ||
    text.includes('caja') ||
    text.includes('finan') ||
    text.includes('rentabilidad') ||
    text.includes('crédito') ||
    text.includes('credito')
  ) {
    chips.push('💵 Finanzas')
  }

  if (
    text.includes('log') ||
    text.includes('depósito') ||
    text.includes('deposito') ||
    text.includes('stock') ||
    text.includes('transporte')
  ) {
    chips.push('🚚 Logística')
  }

  if (
    text.includes('retail') ||
    text.includes('franquicia') ||
    text.includes('showroom') ||
    text.includes('local')
  ) {
    chips.push('🏪 Retail')
  }

  if (
    text.includes('ecommerce') ||
    text.includes('digital') ||
    text.includes('mercado libre')
  ) {
    chips.push('🛒 Ecommerce')
  }

  if (
    text.includes('afa') ||
    text.includes('marca') ||
    text.includes('skechers') ||
    text.includes('campaña') ||
    text.includes('campania')
  ) {
    chips.push('⭐ Marca')
  }

  if (
    text.includes('rrhh') ||
    text.includes('recursos') ||
    text.includes('clima') ||
    text.includes('equipo')
  ) {
    chips.push('👥 RRHH')
  }

  return chips.length > 0 ? chips.slice(0, 3) : [`🎯 ${topic}`]
}

function getScenarioContext(topic: string, title: string, description: string) {
  const text = `${topic} ${title} ${description}`.toLowerCase()

  if (
    text.includes('import') ||
    text.includes('contenedor') ||
    text.includes('proveedor')
  ) {
    return {
      icon: '🚢',
      category: 'Importaciones',
      alertLabel: '🚨 Operación crítica',
      impact: 'Impacto operativo',
      risk: 'Riesgo alto',
    }
  }

  if (
    text.includes('log') ||
    text.includes('depósito') ||
    text.includes('deposito') ||
    text.includes('stock') ||
    text.includes('transporte')
  ) {
    return {
      icon: '📦',
      category: 'Logística',
      alertLabel: '⚠ Tensión operativa',
      impact: 'Impacto operativo',
      risk: 'Riesgo medio',
    }
  }

  if (
    text.includes('finan') ||
    text.includes('rentabilidad') ||
    text.includes('caja') ||
    text.includes('crédito') ||
    text.includes('credito')
  ) {
    return {
      icon: '💰',
      category: 'Finanzas',
      alertLabel: text.includes('dólar') || text.includes('dolar')
        ? '🚨 Crisis cambiaria'
        : '📈 Mercado inestable',
      impact: 'Impacto financiero',
      risk: 'Riesgo alto',
    }
  }

  if (
    text.includes('retail') ||
    text.includes('franquicia') ||
    text.includes('showroom') ||
    text.includes('local')
  ) {
    return {
      icon: '🏪',
      category: 'Retail',
      alertLabel: '⚠ Decisión comercial',
      impact: 'Impacto comercial',
      risk: 'Riesgo medio',
    }
  }

  if (
    text.includes('ecommerce') ||
    text.includes('digital') ||
    text.includes('mercado libre')
  ) {
    return {
      icon: '🛒',
      category: 'Ecommerce',
      alertLabel: '⚠ Canal bajo presión',
      impact: 'Impacto comercial',
      risk: 'Riesgo medio',
    }
  }

  if (
    text.includes('afa') ||
    text.includes('marca') ||
    text.includes('skechers') ||
    text.includes('campaña') ||
    text.includes('campania')
  ) {
    return {
      icon: '⚽',
      category: 'Marca / AFA',
      alertLabel: '🚨 Riesgo de marca',
      impact: 'Impacto de marca',
      risk: 'Riesgo medio',
    }
  }

  if (
    text.includes('rrhh') ||
    text.includes('recursos') ||
    text.includes('clima') ||
    text.includes('equipo')
  ) {
    return {
      icon: '👥',
      category: 'RRHH',
      alertLabel: '⚠ Clima interno',
      impact: 'Impacto organizacional',
      risk: 'Riesgo medio',
    }
  }

  return {
    icon: '🎯',
    category: topic || 'Gestión general',
    alertLabel: '🚨 Situación crítica',
    impact: 'Impacto estratégico',
    risk: 'Riesgo medio',
  }
}

function getStatDeltas(previousGame: GameSession, nextGame: GameSession) {
  return statDefinitions
    .map((stat) => ({
      key: stat.key,
      label: stat.label,
      icon: stat.icon,
      delta: nextGame[stat.key] - previousGame[stat.key],
    }))
    .filter((stat) => stat.delta !== 0)
}

function getDeltaForStat(deltas: StatDelta[], key: StatKey) {
  return deltas.find((delta) => delta.key === key)?.delta ?? 0
}

function GamePage({ initialGame, onRestart, onViewRanking }: GamePageProps) {
  const [game, setGame] = useState(initialGame)
  const [lastConsequence, setLastConsequence] = useState<string | null>(null)
  const [lastDecisionText, setLastDecisionText] = useState<string | null>(null)
  const [lastDeltas, setLastDeltas] = useState<StatDelta[]>([])
  const [scenarioAnimationKey, setScenarioAnimationKey] = useState(
    initialGame.currentScenarioOrder
  )
  const [isLoading, setIsLoading] = useState(false)

  async function handleChooseOption(optionId: string) {
    setIsLoading(true)

    try {
      const selectedOption = game.currentScenario?.options.find(
        (option) => option.id === optionId
      )
      const result = await chooseOption({
        gameSessionId: game.id,
        optionId,
      })
      const deltas = getStatDeltas(game, result.gameSession)

      setLastDeltas(deltas)
      setLastConsequence(result.consequence)
      setLastDecisionText(selectedOption?.text ?? null)
      setGame(result.gameSession)
      setScenarioAnimationKey(result.gameSession.currentScenarioOrder)
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
  const isFinalStretch = quarter.id === 'Q4'
  const scenarioContext = scenario
    ? getScenarioContext(
        scenario.topic,
        scenario.title,
        scenario.description
      )
    : null
  const scenarioChips = scenario
    ? getScenarioChips(scenario.topic, scenario.title, scenario.description)
    : []

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#020617_100%)] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
        <header className="flex items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-black uppercase tracking-[0.18em] text-slate-300">
              Escenario {game.currentScenarioOrder} de {totalScenarios}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-black text-amber-100">
              🏆 {game.playerName}
            </p>
          </div>
        </header>

        <div className="mt-3 h-1 rounded-full bg-slate-800/80">
          <div
            className="h-1 rounded-full bg-amber-200 transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isFinalStretch && (
          <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-amber-100">
            Último tramo del año · {quarter.id}
          </p>
        )}

        {scenario && scenarioContext && (
          <section
            key={scenarioAnimationKey}
            className="scenario-transition mt-7"
          >
            <article className="max-w-5xl">
              <div className="flex flex-wrap items-center gap-3">
                <p className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.26em] text-amber-200">
                  {scenarioContext.alertLabel}
                </p>
                <span className="rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-100">
                  {scenarioContext.risk}
                </span>
              </div>

              <h1 className="mt-5 max-w-6xl text-5xl font-black uppercase leading-[0.86] tracking-normal text-white md:text-7xl lg:text-8xl">
                {scenario.title}
              </h1>

              <p className="mt-6 max-w-4xl text-lg font-medium leading-8 text-slate-300 md:text-xl md:leading-9">
                {scenario.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {scenarioChips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-slate-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </article>

            <section className="mt-9 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-3 shadow-2xl shadow-slate-950/25 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
                {statDefinitions.map((stat) => {
                  const delta = getDeltaForStat(lastDeltas, stat.key)
                  const tone = getStatTone(game[stat.key])

                  return (
                    <div
                      key={stat.key}
                      className={`flex min-w-[6.2rem] flex-1 items-center justify-center gap-3 rounded-xl px-2 py-2 transition duration-500 ${tone.glow}`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`}
                      />
                      <div
                        className="text-[2.45rem] leading-none"
                        aria-hidden="true"
                      >
                        {stat.icon}
                      </div>
                      <div>
                        <p
                          className={`text-2xl font-black leading-none tabular-nums ${tone.value}`}
                        >
                          {game[stat.key]}
                        </p>
                        <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.12em] text-slate-500">
                          {stat.label}
                        </p>
                        {delta !== 0 && (
                          <p
                            className={`mt-1 text-xs font-black ${
                              delta > 0 ? 'text-emerald-100' : 'text-red-100'
                            }`}
                          >
                            {delta > 0 ? '+' : ''}
                            {delta}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {lastConsequence && (
              <section className="result-panel-enter mt-6 rounded-2xl border border-amber-200/25 bg-amber-200/[0.055] p-5 shadow-2xl shadow-amber-950/20">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-100">
                      Decisión tomada
                    </p>
                    {lastDecisionText && (
                      <p className="mt-2 max-w-2xl text-xl font-black leading-tight text-white">
                        {lastDecisionText}
                      </p>
                    )}
                  </div>

                  {lastDeltas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {lastDeltas.map((stat) => (
                        <span
                          key={stat.key}
                          className={`result-delta-pill inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-black ${
                            stat.delta > 0
                              ? 'border-emerald-200/25 bg-emerald-200/10 text-emerald-100'
                              : 'border-red-200/25 bg-red-200/10 text-red-100'
                          }`}
                        >
                          <span aria-hidden="true">{stat.icon}</span>
                          {stat.label} {stat.delta > 0 ? '+' : ''}
                          {stat.delta}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-amber-100/15 pt-5">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-100">
                    Resultado
                  </p>
                  <p className="mt-3 max-w-4xl leading-7 text-slate-100">
                    {lastConsequence}
                  </p>
                </div>
              </section>
            )}

            <section className="mt-10">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-300">
                Elegí tu respuesta estratégica
              </p>
              <div className="grid gap-4 lg:grid-cols-3">
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
          </section>
        )}
      </section>
    </main>
  )
}

export default GamePage
