import { useEffect, useMemo, useState } from 'react'
import { getRanking } from '../api/gameApi'
import type {
  DecisionHistoryEntry,
  GameSession,
  RankingEntry,
} from '../types/game'
import { getMonthName } from '../utils/gameProgress'

type ResultPageProps = {
  game: GameSession
  decisionHistory?: DecisionHistoryEntry[]
  onRestart: () => void
  onViewRanking: () => void
}

const statDefinitions = [
  { key: 'rentability', label: 'Rentabilidad', icon: '💰' },
  { key: 'clients', label: 'Clientes', icon: '👥' },
  { key: 'organizationalClimate', label: 'Clima interno', icon: '😊' },
  { key: 'brandImage', label: 'Imagen de marca', icon: '⭐' },
  { key: 'operationalEfficiency', label: 'Logística', icon: '🚚' },
] as const

const quarters = [
  { label: 'Q1 - Plan comercial', from: 1, to: 3 },
  { label: 'Q2 - Importacion y stock', from: 4, to: 6 },
  { label: 'Q3 - Canales y equipos', from: 7, to: 9 },
  { label: 'Q4 - Cierre y expansion', from: 10, to: 12 },
]

function getEntryScore(entry: RankingEntry) {
  return entry.finalScore ?? entry.score ?? 0
}

function getEntryName(entry: RankingEntry) {
  return entry.playerName ?? entry.name ?? ''
}

function getDirectorProfile(game: GameSession) {
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

  if (game.finalScore >= 85) {
    return {
      title: 'Arquitecto del crecimiento',
      summary:
        'Cerraste el año con una gestión sólida, competitiva y preparada para escalar.',
      profile:
        'Tu estilo combinó ambición comercial con control ejecutivo. Construiste valor sin perder de vista el equilibrio general de la empresa.',
    }
  }

  if (strongest.key === 'brandImage' || strongest.key === 'clients') {
    return {
      title: 'Estratega comercial',
      summary:
        'Fortaleciste mercado, marca y clientes, aunque el crecimiento exigió decisiones costosas.',
      profile:
        'Tu gestión priorizó posicionamiento, canales comerciales y construcción de demanda. Apostaste por el largo plazo y aceptaste tensiones operativas.',
    }
  }

  if (
    strongest.key === 'operationalEfficiency' ||
    strongest.key === 'organizationalClimate'
  ) {
    return {
      title: 'Constructor operativo',
      summary:
        'Ordenaste la operación y protegiste la estructura interna durante un año exigente.',
      profile:
        'Tu estilo buscó estabilidad, coordinación y capacidad de ejecución. Evitaste movimientos extremos para sostener la continuidad del negocio.',
    }
  }

  if (strongest.key === 'rentability') {
    return {
      title: 'Administrador conservador',
      summary:
        'Defendiste márgenes y cuidaste la caja, incluso cuando eso limitó oportunidades comerciales.',
      profile:
        'Tu gestión priorizó rentabilidad, liquidez y control financiero. Tomaste decisiones prudentes, con foco en sostener la salud económica.',
    }
  }

  if (weakest.value <= 25) {
    return {
      title: 'Gestión bajo presión',
      summary:
        'El año dejó aprendizajes duros y frentes críticos para recomponer en la próxima partida.',
      profile:
        'Tu dirección enfrentó tensiones fuertes entre crecimiento, operación y resultados. Algunas decisiones abrieron oportunidades, pero dejaron costos visibles.',
    }
  }

  return {
    title: 'Director competitivo',
    summary:
      'Terminaste con una gestión balanceada, con avances claros y desafíos todavía abiertos.',
    profile:
      'Tu estilo buscó equilibrio entre indicadores. Evitaste desbordes graves y mantuviste a Grupo Blanco en una posición competitiva.',
  }
}

function getStatInsight(statLabel: string, value: number, positive: boolean) {
  if (positive) {
    return `${statLabel} terminó como el frente más sólido de tu gestión anual.`
  }

  if (value <= 25) {
    return `${statLabel} quedó en zona crítica y condicionó el resultado general.`
  }

  return `${statLabel} fue el punto que más atención necesitaría en un nuevo año de gestión.`
}

function ResultPage({
  game,
  decisionHistory = [],
  onRestart,
  onViewRanking,
}: ResultPageProps) {
  const [ranking, setRanking] = useState<RankingEntry[]>([])

  useEffect(() => {
    getRanking()
      .then((entries) => setRanking(entries))
      .catch(() => setRanking([]))
  }, [])

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
  const directorProfile = getDirectorProfile(game)
  const resultSummary = game.wasCompanySold
    ? `Vendiste Grupo Blanco en ${getMonthName(game.finishedAtMonth)}. El resultado refleja el valor que construiste hasta ese momento.`
    : directorProfile.summary
  const visibleQuarters = game.wasCompanySold
    ? quarters.filter((quarter) => quarter.from <= game.finishedAtMonth)
    : quarters

  const rankingSummary = useMemo(() => {
    if (ranking.length === 0) {
      return {
        position: null,
      }
    }

    const sortedRanking = [...ranking].sort(
      (first, second) => getEntryScore(second) - getEntryScore(first)
    )
    const matchingIndex = sortedRanking.findIndex(
      (entry) =>
        entry.id === game.id ||
        (getEntryName(entry).toLowerCase() === game.playerName.toLowerCase() &&
          getEntryScore(entry) === game.finalScore)
    )
    const computedPosition =
      matchingIndex >= 0
        ? matchingIndex + 1
        : sortedRanking.filter((entry) => getEntryScore(entry) > game.finalScore)
            .length + 1
    return {
      position: computedPosition,
    }
  }, [game.finalScore, game.id, game.playerName, ranking])

  function getQuarterDecision(from: number, to: number) {
    const selectedDecision = decisionHistory.find(
      (decision) =>
        decision.scenarioOrder >= from && decision.scenarioOrder <= to
    )

    return selectedDecision?.optionText ?? 'Sin registro de decisión'
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#020617_100%)] text-white">
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-5 md:px-6 md:py-10">
        <header className="border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-100">
              {game.wasCompanySold ? 'EMPRESA VENDIDA' : 'GESTIÓN FINALIZADA'}
            </p>
            <h1 className="mt-4 max-w-5xl text-[2.65rem] font-black uppercase leading-[0.9] text-white sm:text-5xl md:text-7xl lg:text-8xl">
              {directorProfile.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-slate-300 sm:text-lg md:text-xl md:leading-8">
              {resultSummary}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-200/25 bg-amber-200/[0.07] px-4 py-4 sm:px-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100">
                  Puntaje final
                </p>
                <p className="mt-2 text-4xl font-black leading-none tabular-nums">
                  {game.finalScore}
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.055] px-4 py-4 sm:px-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                  Ranking global
                </p>
                <p className="mt-2 text-4xl font-black leading-none tabular-nums">
                  {rankingSummary.position ? `#${rankingSummary.position}` : '-'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8">
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-slate-950/25 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
              Perfil de gestión
            </p>
            <p className="mt-4 max-w-4xl text-base font-medium leading-7 text-slate-200 sm:text-lg sm:leading-8">
              {game.wasCompanySold &&
                `Cerraste la operación en ${getMonthName(game.finishedAtMonth)}. `}
              {directorProfile.profile}
            </p>
          </article>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-emerald-200/25 bg-emerald-200/[0.07] p-5 shadow-2xl shadow-emerald-950/15 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
              ⭐ Mayor acierto
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <h2 className="text-2xl font-black sm:text-3xl">{strongest.label}</h2>
              <p className="text-5xl font-black tabular-nums">
                {strongest.value}
              </p>
            </div>
            <p className="mt-4 leading-7 text-slate-300">
              {getStatInsight(strongest.label, strongest.value, true)}
            </p>
          </article>

          <article className="rounded-2xl border border-red-200/20 bg-red-200/[0.055] p-5 shadow-2xl shadow-red-950/15 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-100">
              ⚠ Mayor desafío
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <h2 className="text-2xl font-black sm:text-3xl">{weakest.label}</h2>
              <p className="text-5xl font-black tabular-nums">
                {weakest.value}
              </p>
            </div>
            <p className="mt-4 leading-7 text-slate-300">
              {getStatInsight(weakest.label, weakest.value, false)}
            </p>
          </article>
        </section>

        <section className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
            {game.wasCompanySold ? 'Resumen hasta la venta' : 'Resumen del año'}
          </p>
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            {visibleQuarters.map((quarter) => (
              <article
                key={quarter.label}
                className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
              >
                <h3 className="text-lg font-black leading-tight text-amber-100">
                  {quarter.label}
                </h3>
                <p className="mt-4 line-clamp-3 text-base font-semibold leading-7 text-slate-300">
                  {getQuarterDecision(quarter.from, quarter.to)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onViewRanking}
            className="w-full rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-100 sm:w-auto"
          >
            🥇 Ver ranking global
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full rounded-full border border-amber-200/35 bg-amber-200/10 px-6 py-4 text-sm font-black text-amber-100 transition hover:border-amber-100 hover:bg-amber-200/20 sm:w-auto"
          >
            🔄 Intentar una nueva estrategia
          </button>
        </div>
      </section>
    </main>
  )
}

export default ResultPage
