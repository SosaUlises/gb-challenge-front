import { useState } from 'react'
import { startGame } from '../api/gameApi'
import operationsHero from '../assets/home-operations-hero.png'
import type { GameSession } from '../types/game'

type HomePageProps = {
  onGameStarted: (game: GameSession) => void
  onViewRanking: () => void
}

const brandLogos = [
  { name: 'Skechers', src: '/brands/skechers.svg' },
  { name: 'Havaianas', src: '/brands/havaianas.png' },
  { name: 'Timberland', src: '/brands/timberland.png' },
  { name: 'Diadora', src: '/brands/diadora.svg' },
  { name: 'Athix', src: '/brands/athix.png' },
  { name: 'Comfortflex', src: '/brands/comfortflex.png' },
  { name: 'Ramarim', src: '/brands/ramarim.png' },
  { name: 'Via Marte', src: '/brands/via-marte.png' },
  { name: 'Kidy', src: '/brands/kidy.png' },
  { name: 'Boating', src: '/brands/boating.png' },
  { name: 'Hey Dude', src: '/brands/hey-dude.png' },
]

const heroMetrics = [
  { icon: '📈', value: '12', label: 'Meses' },
  { icon: '💰', value: '5', label: 'Indicadores' },
  { icon: '📅', value: '1', label: 'Año de gestión' },
]

const managementAreas = [
  {
    icon: '📦',
    title: 'Importaciones',
    description: 'Contenedores, stock y comercio exterior.',
  },
  {
    icon: '🛒',
    title: 'Ecommerce',
    description: 'Canales digitales y disponibilidad.',
  },
  {
    icon: '🚚',
    title: 'Logística',
    description: 'Depósito Rosario, entregas y transporte.',
  },
  {
    icon: '🏪',
    title: 'Retail',
    description: 'Locales, franquicias y showrooms.',
  },
  {
    icon: '👥',
    title: 'Recursos Humanos',
    description: 'Clima interno, equipos y liderazgo.',
  },
  {
    icon: '📈',
    title: 'Marketing',
    description: 'Marca, campañas y posicionamiento.',
  },
]

function HomePage({ onGameStarted, onViewRanking }: HomePageProps) {
  const [playerName, setPlayerName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleStartGame() {
    if (!playerName.trim()) return

    setIsLoading(true)

    try {
      const game = await startGame({ playerName: playerName.trim() })
      onGameStarted(game)
    } catch {
      alert('No se pudo iniciar la partida')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <section className="relative isolate min-h-screen overflow-hidden">
        <img
          src={operationsHero}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_36%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.87)_48%,rgba(2,6,23,0.5)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-slate-950 to-transparent" />

        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <img
                src="/grupo-blanco-logo.png"
                alt="Grupo Blanco"
                className="h-10 w-10 rounded-full sm:h-12 sm:w-12"
              />
              <p className="min-w-0 text-[0.68rem] font-bold uppercase leading-4 tracking-[0.12em] text-slate-300 sm:text-sm sm:tracking-[0.18em]">
                Simulador de Gestión Empresarial
              </p>
            </div>
            <button
              type="button"
              onClick={onViewRanking}
              className="hidden items-center gap-2 rounded-full border border-cyan-200/30 bg-slate-950/55 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur transition hover:border-cyan-100 hover:bg-cyan-200/10 hover:text-white sm:flex"
              aria-label="Ver ranking global"
            >
              <span aria-hidden="true">🏆</span>
              Ranking global
            </button>
          </header>

          <div className="grid flex-1 gap-7 py-8 sm:py-10 lg:grid-cols-[1fr_340px] lg:items-center">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-200/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 backdrop-blur sm:gap-3 sm:px-4 sm:text-sm sm:tracking-[0.18em]">
                <span aria-hidden="true">👑</span>
                Director General
              </div>

              <h1 className="mt-6 max-w-5xl text-[2.45rem] font-black uppercase leading-[0.94] tracking-tight sm:text-6xl md:text-8xl">
                Asumí la Dirección General de Grupo Blanco
              </h1>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 sm:gap-x-6">
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex min-w-0 items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300 sm:text-sm sm:tracking-[0.16em]"
                  >
                    <span className="text-lg sm:text-xl" aria-hidden="true">
                      {metric.icon}
                    </span>
                    <span className="text-xl text-cyan-100 sm:text-2xl">
                      {metric.value}
                    </span>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 max-w-2xl rounded-xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-md sm:mt-12">
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Nombre del Director General
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleStartGame()
                    }}
                    placeholder="Ingresá tu nombre"
                    className="h-14 w-full rounded-lg border border-white/15 bg-slate-900/90 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200 sm:h-16 sm:px-5 sm:text-lg"
                  />
                  <button
                    type="button"
                    onClick={handleStartGame}
                    disabled={isLoading || !playerName.trim()}
                    className="h-14 w-full rounded-lg bg-cyan-200 px-5 text-xs font-black uppercase tracking-[0.14em] text-slate-950 shadow-2xl shadow-cyan-950/50 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:px-7 sm:text-sm sm:tracking-[0.16em]"
                  >
                    {isLoading ? 'Iniciando...' : 'Iniciar Gestión 2026'}
                  </button>
                </div>
              </div>
            </section>

            <aside className="rounded-xl border border-cyan-200/25 bg-slate-950/65 p-4 backdrop-blur-md sm:p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-sm font-black uppercase tracking-wide text-slate-400">
                  Misión
                </span>
                <span className="text-2xl sm:text-3xl" aria-hidden="true">
                  🏆
                </span>
              </div>
              <p className="mt-3 text-2xl font-black leading-tight text-white sm:mt-4 sm:text-3xl">
                Entrá al Top del ranking.
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-300 sm:mt-3 sm:text-base sm:leading-7">
                Tomá decisiones estratégicas y llevá a Grupo Blanco al mejor
                resultado posible.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-950 py-6 sm:py-8">
        <div className="brand-marquee">
          <div className="brand-marquee-track brand-marquee-track-premium">
            {[...brandLogos, ...brandLogos].map((brand, index) => (
              <img
                key={`${brand.name}-${index}`}
                src={brand.src}
                alt={index < brandLogos.length ? brand.name : ''}
                className="brand-logo-premium"
                aria-hidden={index >= brandLogos.length}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
              Áreas de gestión
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-none text-white sm:text-4xl md:text-6xl">
              Donde se gana o se pierde.
            </h2>
          </div>

          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {managementAreas.map((area) => (
              <article key={area.title} className="flex gap-4">
                <span className="text-4xl leading-none sm:text-5xl" aria-hidden="true">
                  {area.icon}
                </span>
                <div>
                  <h3 className="text-xl font-black text-white sm:text-2xl">
                    {area.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-400">
                    {area.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-cyan-200/30 bg-cyan-200/10 p-5 shadow-2xl shadow-slate-950/50 sm:p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-[2rem] font-black uppercase leading-none text-white sm:text-4xl md:text-7xl">
                ¿Podrás superar a otros directores?
              </h2>
              <p className="mt-4 text-lg font-bold text-cyan-100 sm:mt-5 sm:text-xl">
                Tu gestión quedará registrada en el ranking.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Nombre del Director General
              </label>
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleStartGame()
                }}
                placeholder="Ingresá tu nombre"
                className="mt-3 h-14 w-full rounded-lg border border-white/15 bg-slate-950/80 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200 sm:h-16 sm:px-5 sm:text-lg"
              />
              <button
                type="button"
                onClick={handleStartGame}
                disabled={isLoading || !playerName.trim()}
                className="mt-3 h-14 w-full rounded-lg bg-white px-5 text-xs font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:px-7 sm:text-sm sm:tracking-[0.16em]"
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Gestión 2026'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
