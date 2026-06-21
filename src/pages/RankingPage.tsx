import { useEffect, useState } from 'react'
import { getRanking } from '../api/gameApi'
import type { RankingEntry } from '../types/game'

type RankingPageProps = {
  onBack: () => void
  onRestart: () => void
}

function getPlayerName(entry: RankingEntry) {
  return entry.playerName ?? entry.name ?? 'Jugador'
}

function getScore(entry: RankingEntry) {
  return entry.finalScore ?? entry.score ?? 0
}

function getRating(entry: RankingEntry) {
  return entry.finalRating ?? entry.rating ?? 'Sin calificación'
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

function RankingPage({ onBack, onRestart }: RankingPageProps) {
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
              Competencia global
            </p>
            <h1 className="mt-2 text-4xl font-bold">Ranking Grupo Blanco</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Compará la gestión anual contra otros directores generales del
              simulador.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-slate-700 px-4 py-2 font-semibold text-white transition hover:border-white"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              Nueva partida
            </button>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80">
          <div className="grid grid-cols-[72px_1fr_110px_150px_120px] gap-3 border-b border-slate-800 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-slate-400 max-md:hidden">
            <p>Pos.</p>
            <p>Nombre</p>
            <p>Puntaje</p>
            <p>Calificación</p>
            <p>Fecha</p>
          </div>

          {isLoading && (
            <p className="px-5 py-8 text-center text-slate-300">
              Cargando ranking...
            </p>
          )}

          {error && !isLoading && (
            <p className="px-5 py-8 text-center text-red-200">{error}</p>
          )}

          {!isLoading && !error && ranking.length === 0 && (
            <p className="px-5 py-8 text-center text-slate-300">
              Todavía no hay partidas registradas.
            </p>
          )}

          {!isLoading &&
            !error &&
            ranking.map((entry, index) => (
              <article
                key={entry.id ?? `${getPlayerName(entry)}-${index}`}
                className="grid gap-3 border-b border-slate-800 px-5 py-4 last:border-b-0 md:grid-cols-[72px_1fr_110px_150px_120px] md:items-center"
              >
                <p className="text-lg font-bold text-cyan-100">#{index + 1}</p>
                <div>
                  <p className="font-semibold text-white">
                    {getPlayerName(entry)}
                  </p>
                  <p className="text-sm text-slate-400 md:hidden">
                    {getDate(entry)}
                  </p>
                </div>
                <p className="font-bold text-white">{getScore(entry)}</p>
                <p className="text-sm text-slate-300">{getRating(entry)}</p>
                <p className="text-sm text-slate-400 max-md:hidden">
                  {getDate(entry)}
                </p>
              </article>
            ))}
        </section>
      </section>
    </main>
  )
}

export default RankingPage
