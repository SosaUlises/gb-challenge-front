import { quarters } from '../utils/gameProgress'

type ProgressTimelineProps = {
  currentScenario: number
}

function ProgressTimeline({ currentScenario }: ProgressTimelineProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {quarters.map((quarter) => {
        const isActive =
          currentScenario >= quarter.start && currentScenario <= quarter.end
        const isComplete = currentScenario > quarter.end

        return (
          <div
            key={quarter.id}
            className={`rounded-lg border p-3 ${
              isActive
                ? 'border-cyan-300/60 bg-cyan-300/10'
                : isComplete
                  ? 'border-emerald-300/35 bg-emerald-300/10'
                  : 'border-slate-800 bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-white">{quarter.id}</p>
              <p className="text-xs text-slate-400">Esc. {quarter.range}</p>
            </div>
            <p className="mt-2 text-sm text-slate-300">{quarter.label}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ProgressTimeline
