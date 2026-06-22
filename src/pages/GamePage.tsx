import { useState } from 'react'
import { chooseOption } from '../api/gameApi'
import DecisionCard from '../components/DecisionCard'
import DecisionResultModal from '../components/DecisionResultModal'
import GameIntroModal from '../components/GameIntroModal'
import ResultPage from './ResultPage'
import type { DecisionHistoryEntry, GameSession } from '../types/game'
import { getQuarter } from '../utils/gameProgress'

type GamePageProps = {
  initialGame: GameSession
  showIntro: boolean
  onIntroClose: () => void
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
  previousValue: number
  nextValue: number
  delta: number
}

type DecisionResult = {
  decisionText: string | null
  consequence: string
  deltas: StatDelta[]
}

function getStatColor(value: number) {
  if (value <= 25) {
    return 'text-red-100'
  }

  if (value <= 45) {
    return 'text-orange-100'
  }

  if (value <= 65) {
    return 'text-amber-100'
  }

  if (value <= 85) {
    return 'text-cyan-100'
  }

  return 'text-emerald-100'
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
      previousValue: previousGame[stat.key],
      nextValue: nextGame[stat.key],
      delta: nextGame[stat.key] - previousGame[stat.key],
    }))
    .filter((stat) => stat.delta !== 0)
}

function GamePage({
  initialGame,
  showIntro,
  onIntroClose,
  onRestart,
  onViewRanking,
}: GamePageProps) {
  const [game, setGame] = useState(initialGame)
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(
    null
  )
  const [decisionHistory, setDecisionHistory] = useState<
    DecisionHistoryEntry[]
  >([])
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
      const currentScenario = game.currentScenario
      const result = await chooseOption({
        gameSessionId: game.id,
        optionId,
      })
      const deltas = getStatDeltas(game, result.gameSession)

      setDecisionResult({
        decisionText: selectedOption?.text ?? null,
        consequence: result.consequence,
        deltas,
      })
      if (selectedOption && currentScenario) {
        setDecisionHistory((history) => [
          ...history,
          {
            scenarioOrder: currentScenario.order,
            scenarioTitle: currentScenario.title,
            optionText: selectedOption.text,
          },
        ])
      }
      setGame(result.gameSession)
      setScenarioAnimationKey(result.gameSession.currentScenarioOrder)
    } catch {
      alert('No se pudo procesar la decisión')
    } finally {
      setIsLoading(false)
    }
  }

  if (game.isFinished && !decisionResult) {
    return (
      <ResultPage
        game={game}
        decisionHistory={decisionHistory}
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
        <header className="flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-start sm:justify-between">
          <div className="pt-0 sm:pt-8">
            <p className="font-black uppercase tracking-[0.18em] text-slate-300">
              Escenario {game.currentScenarioOrder} de {totalScenarios}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm font-black text-amber-100">
              🏆 {game.playerName}
            </p>
            <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-500">
              Director General
            </p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 sm:justify-end">
              {statDefinitions.map((stat) => {
                const statColor = getStatColor(game[stat.key])

                return (
                  <span
                    key={stat.key}
                    className="inline-flex items-center gap-1.5 text-xs font-black"
                    title={stat.label}
                  >
                    <span className="text-base leading-none" aria-hidden="true">
                      {stat.icon}
                    </span>
                    <span className={`tabular-nums ${statColor}`}>
                      {game[stat.key]}
                    </span>
                  </span>
                )
              })}
            </div>
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
            className="scenario-transition mt-8 md:mt-12"
          >
            <article className="max-w-6xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-amber-100">
                  {scenarioContext.alertLabel}
                </span>
                {scenarioChips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-slate-300"
                  >
                    {chip}
                  </span>
                ))}
                <span className="rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-100">
                  {scenarioContext.risk}
                </span>
              </div>

              <h1 className="mt-5 max-w-6xl text-[3.25rem] font-black uppercase leading-[0.86] tracking-normal text-white sm:text-6xl md:text-7xl lg:text-[7rem]">
                {scenario.title}
              </h1>

              <p className="mt-6 max-w-4xl text-base font-medium leading-7 text-slate-300 sm:text-lg md:text-xl md:leading-9">
                {scenario.description}
              </p>
            </article>

            <section className="mt-9 md:mt-12">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-300">
                Elegí tu respuesta estratégica
              </p>
              <div className="grid gap-6 lg:grid-cols-3">
                {scenario.options.map((option, index) => (
                  <DecisionCard
                    key={option.id}
                    option={option}
                    index={index}
                    disabled={
                      isLoading || Boolean(decisionResult) || showIntro
                    }
                    onChoose={handleChooseOption}
                  />
                ))}
              </div>
            </section>
          </section>
        )}

        {decisionResult && (
          <DecisionResultModal
            decisionText={decisionResult.decisionText}
            consequence={decisionResult.consequence}
            deltas={decisionResult.deltas}
            onContinue={() => setDecisionResult(null)}
          />
        )}

        {showIntro && <GameIntroModal onStart={onIntroClose} />}
      </section>
    </main>
  )
}

export default GamePage
