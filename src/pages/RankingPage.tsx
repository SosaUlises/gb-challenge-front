import { useEffect, useMemo, useState } from 'react'
import { getRanking } from '../api/gameApi'
import type { RankingEntry } from '../types/game'

type RankingPageProps = {
  hasPreviousResult?: boolean
  onBack: () => void
  onRestart: () => void
}

const podiumStyles = [
  {
    medal: '🥇',
    label: '1º',
    className:
      'border-amber-200/35 bg-amber-200/[0.08] shadow-2xl shadow-amber-950/25 lg:-mt-6 lg:min-h-72',
    nameClassName: 'text-3xl',
  },
  {
    medal: '🥈',
    label: '2º',
    className:
      'border-slate-200/25 bg-white/[0.045] shadow-2xl shadow-slate-950/25 lg:min-h-64',
    nameClassName: 'text-2xl',
  },
  {
    medal: '🥉',
    label: '3º',
    className:
      'border-orange-200/25 bg-orange-200/[0.055] shadow-2xl shadow-orange-950/15 lg:min-h-64',
    nameClassName: 'text-2xl',
  },
]

function getPlayerName(entry: RankingEntry) {
  return entry.playerName ?? entry.name ?? 'Director'
}

function getScore(entry: RankingEntry) {
  return entry.finalScore ?? entry.score ?? 0
}

function getRating(entry: RankingEntry) {
  return entry.finalRating ?? entry.rating ?? 'Sin perfil'
}

function getDate(entry: RankingEntry) {
  const rawDate = entry.createdAt ?? entry.playedAt ?? entry.date

  if (!rawDate) return 'Sin fecha'

  const date = new Date(rawDate)

  if (Number.isNaN(date.getTime())) return rawDate

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function getPositionLabel(index: number) {
  if (index === 0) return '🥇 #1'
  if (index === 1) return '🥈 #2'
  if (index === 2) return '🥉 #3'

  return `#${index + 1}`
}

function RankingPage({
  hasPreviousResult = false,
  onBack,
  onRestart,
}: RankingPageProps) {
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadRanking() {
      try {
        const data = await getRanking()

        if (isMounted) {
          setRanking(data)
          setError(null)
        }
      } catch {
        if (isMounted) {
          setError('No se pudo cargar el ranking global.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadRanking()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedRanking = useMemo(
    () => [...ranking].sort((first, second) => getScore(second) - getScore(first)),
    [ranking]
  )
  const topEntry = sortedRanking[0]
  const podium = sortedRanking.slice(0, 3)
  const hasRanking = sortedRanking.length > 0

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#020617_100%)] text-white">
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-5 md:px-6 md:py-10">
        <header className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-100">
              Competencia global
            </p>
            <h1 className="mt-4 max-w-5xl text-[2.65rem] font-black uppercase leading-[0.9] text-white sm:text-5xl md:text-7xl lg:text-8xl">
              Ranking de directores
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-slate-300 sm:text-lg md:text-xl md:leading-8">
              Compará tu gestión contra otros jugadores y buscá entrar al Top.
              Una nueva estrategia puede cambiar toda la tabla.
            </p>
          </div>

          <aside className="rounded-2xl border border-amber-200/25 bg-amber-200/[0.07] p-5 shadow-2xl shadow-amber-950/20 sm:rounded-3xl sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-100">
              🏆 Top actual
            </p>
            {topEntry ? (
              <>
                <p className="mt-4 text-3xl font-black leading-none sm:text-4xl">
                  #1 {getPlayerName(topEntry)}
                </p>
                <p className="mt-3 text-2xl font-black tabular-nums text-white">
                  {getScore(topEntry)} puntos
                </p>
                <p className="mt-2 text-sm font-bold text-slate-300">
                  {getRating(topEntry)}
                </p>
              </>
            ) : (
              <p className="mt-4 text-lg font-bold leading-7 text-slate-300">
                Todavía no hay un líder registrado.
              </p>
            )}
          </aside>
        </header>

        {isLoading && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-7 text-center sm:rounded-3xl sm:p-10">
            <p className="text-lg font-bold text-slate-300">
              Cargando competencia global...
            </p>
          </section>
        )}

        {error && !isLoading && (
          <section className="mt-8 rounded-2xl border border-red-200/25 bg-red-200/[0.055] p-7 text-center sm:rounded-3xl sm:p-10">
            <p className="text-lg font-bold text-red-100">{error}</p>
          </section>
        )}

        {!isLoading && !error && !hasRanking && (
          <section className="mt-8 rounded-2xl border border-amber-200/25 bg-amber-200/[0.055] p-7 text-center shadow-2xl shadow-amber-950/15 sm:rounded-3xl sm:p-10">
            <p className="text-5xl" aria-hidden="true">
              🏆
            </p>
            <h2 className="mt-5 text-3xl font-black uppercase sm:text-4xl">
              Todavía no hay directores en competencia
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Sé el primero en iniciar una gestión y dejar tu resultado en el
              ranking global.
            </p>
            <button
              type="button"
              onClick={onRestart}
              className="mt-7 w-full rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-100 sm:w-auto"
            >
              Iniciar gestión 2026
            </button>
          </section>
        )}

        {!isLoading && !error && hasRanking && (
          <>
            <section className="mt-10">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                Podio de gestión
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.15fr_0.9fr] lg:items-end">
                {podium.map((entry, visualIndex) => {
                  if (!entry) return null

                  const rankingIndex = sortedRanking.indexOf(entry)
                  const style = podiumStyles[rankingIndex] ?? podiumStyles[1]

                  return (
                    <article
                      key={entry.id ?? `${getPlayerName(entry)}-${rankingIndex}`}
                      className={`rounded-2xl border p-5 sm:rounded-3xl sm:p-6 ${style.className} ${
                        visualIndex === 0 ? 'lg:order-2' : ''
                      } ${
                        visualIndex === 1 ? 'lg:order-1' : ''
                      } ${
                        visualIndex === 2 ? 'lg:order-3' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-4xl" aria-hidden="true">
                          {style.medal}
                        </p>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                          {style.label}
                        </p>
                      </div>
                      <h2
                        className={`mt-6 font-black leading-tight text-white ${style.nameClassName}`}
                      >
                        {getPlayerName(entry)}
                      </h2>
                      <p className="mt-4 text-4xl font-black tabular-nums text-amber-100">
                        {getScore(entry)}
                      </p>
                      <p className="mt-2 text-sm font-bold text-slate-300">
                        {getRating(entry)}
                      </p>
                    </article>
                  )
                })}
              </div>
            </section>

            <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-slate-950/25">
              <div className="hidden grid-cols-[7rem_1fr_8rem_14rem_8rem] gap-4 border-b border-white/10 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500 md:grid">
                <p>Posición</p>
                <p>Director</p>
                <p>Puntaje</p>
                <p>Perfil</p>
                <p>Fecha</p>
              </div>

              {sortedRanking.map((entry, index) => {
                const isTopThree = index < 3

                return (
              <article
                    key={entry.id ?? `${getPlayerName(entry)}-${index}`}
                    className={`grid gap-3 border-b border-white/10 px-4 py-5 transition last:border-b-0 hover:bg-white/[0.045] sm:px-6 md:grid-cols-[7rem_1fr_8rem_14rem_8rem] md:items-center ${
                      isTopThree ? 'bg-amber-200/[0.025]' : ''
                    }`}
                  >
                    <p
                      className={`text-lg font-black ${
                        isTopThree ? 'text-amber-100' : 'text-slate-300'
                      }`}
                    >
                      {getPositionLabel(index)}
                    </p>
                    <div>
                      <p className="text-lg font-black text-white">
                        {getPlayerName(entry)}
                      </p>
                      <p className="text-sm text-slate-500 md:hidden">
                        {getDate(entry)}
                      </p>
                    </div>
                    <p className="text-2xl font-black tabular-nums text-white">
                      {getScore(entry)}
                    </p>
                    <p className="w-fit rounded-full border border-cyan-200/20 bg-cyan-200/[0.06] px-3 py-1.5 text-xs font-black text-cyan-100">
                      {getRating(entry)}
                    </p>
                    <p className="text-sm font-semibold text-slate-500 max-md:hidden">
                      {getDate(entry)}
                    </p>
                  </article>
                )
              })}
            </section>
          </>
        )}

        <footer className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-black text-slate-300">
            Cada partida cambia el ranking.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRestart}
              className="w-full rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-100 sm:w-auto"
            >
              🔄 Intentar nueva estrategia
            </button>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default RankingPage
