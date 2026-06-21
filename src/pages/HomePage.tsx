import { useState } from 'react'
import { startGame } from '../api/gameApi'
import operationsHero from '../assets/home-operations-hero.png'
import type { GameSession } from '../types/game'

type HomePageProps = {
  onGameStarted: (game: GameSession) => void
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

const challengeItems = [
  {
    value: '15',
    label: 'decisiones estrategicas',
  },
  {
    value: '5',
    label: 'indicadores criticos',
  },
  {
    value: '1',
    label: 'anio de gestion',
  },
  {
    value: 'Top',
    label: 'ranking global',
  },
]

const operationSignals = [
  'Importacion',
  'Deposito Rosario',
  'Ecommerce',
  'Showrooms',
  'Retail',
  'Franquicias',
  'Logistica',
]

function HomePage({ onGameStarted }: HomePageProps) {
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
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative isolate min-h-screen overflow-hidden">
        <img
          src={operationsHero}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.86)_42%,rgba(2,6,23,0.48)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Grupo Blanco Challenge
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Simulador empresarial de estrategia y gestion
              </p>
            </div>
            <div className="hidden rounded-md border border-cyan-200/25 bg-slate-950/50 px-3 py-2 text-sm font-semibold text-cyan-100 backdrop-blur md:block">
              Ranking global activo
            </div>
          </header>

          <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1fr_380px] lg:items-center">
            <section>
              <div className="flex flex-wrap gap-2">
                {operationSignals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300 backdrop-blur"
                  >
                    {signal}
                  </span>
                ))}
              </div>

              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Asumi la Direccion General de Grupo Blanco.
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">
                Gestiona un anio comercial completo: importaciones, stock,
                vendedores, ecommerce, showrooms, retail, franquicias y marcas
                internacionales. Cada decision cambia el futuro de la empresa.
              </p>

              <div className="mt-8 max-w-xl">
                <label className="block text-sm font-semibold uppercase tracking-wide text-cyan-100">
                  Nombre del Director General
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleStartGame()
                    }}
                    placeholder="Ej: Ulises"
                    className="h-14 rounded-lg border border-white/15 bg-slate-950/70 px-4 text-white outline-none backdrop-blur transition placeholder:text-slate-500 focus:border-cyan-200"
                  />
                  <button
                    type="button"
                    onClick={handleStartGame}
                    disabled={isLoading || !playerName.trim()}
                    className="h-14 rounded-lg bg-cyan-200 px-6 font-black uppercase tracking-wide text-slate-950 shadow-2xl shadow-cyan-950/40 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? 'Iniciando...' : 'Asumir Direccion General'}
                  </button>
                </div>
                <p className="mt-4 text-sm text-slate-300">
                  Tu gestion quedara registrada en el ranking. Podras superar a
                  otros directores?
                </p>
              </div>
            </section>

            <aside className="rounded-lg border border-white/10 bg-slate-950/65 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100">
                Desafio 2026
              </p>
              <h2 className="mt-3 text-2xl font-bold">
                Cerra el anio sin romper el equilibrio.
              </h2>
              <p className="mt-3 leading-7 text-slate-300">
                Rentabilidad, cartera de clientes, clima interno, imagen de
                marca y eficiencia logistica compiten por tu atencion.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {challengeItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                  >
                    <p className="text-3xl font-black text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-sm font-semibold text-white">
                  Mision inmediata
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Decidir cuando financiar clientes, como sostener stock, que
                  canal priorizar y cuanto riesgo tomar antes del cierre anual.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-950 py-9">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Marcas gestionadas
              </p>
              <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
                Un portfolio real en movimiento.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Grupo Blanco opera marcas internacionales de calzado a traves de
              importacion, distribucion, ecommerce, retail y showrooms.
            </p>
          </div>

          <div className="brand-marquee brand-marquee-prominent">
            <div className="brand-marquee-track">
              {[...brandLogos, ...brandLogos].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="brand-logo-card"
                  aria-hidden={index >= brandLogos.length}
                >
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className="brand-logo-image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <article className="border-l border-cyan-200/40 pl-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100">
              Decisiones con costo
            </p>
            <p className="mt-3 leading-7 text-slate-300">
              Mejorar un indicador puede tensionar otro. La gestion se gana
              leyendo trade-offs, no eligiendo respuestas obvias.
            </p>
          </article>

          <article className="border-l border-cyan-200/40 pl-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100">
              Empresa real, canales reales
            </p>
            <p className="mt-3 leading-7 text-slate-300">
              El tablero combina importacion, distribucion mayorista, ecommerce,
              retail fisico, franquicias, showrooms y logistica.
            </p>
          </article>

          <article className="border-l border-cyan-200/40 pl-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100">
              Competencia
            </p>
            <p className="mt-3 leading-7 text-slate-300">
              Al finalizar, tu puntaje y calificacion muestran si tu anio de
              gestion puede competir en el ranking global.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default HomePage
