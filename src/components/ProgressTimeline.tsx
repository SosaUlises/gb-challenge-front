import { quarters } from '../utils/gameProgress'

type ProgressTimelineProps = {
  currentScenario: number
}

function ProgressTimeline({ currentScenario }: ProgressTimelineProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center">
        {quarters.map((quarter, index) => {
          const isActive =
            currentScenario >= quarter.start && currentScenario <= quarter.end
          const isComplete = currentScenario > quarter.end

          return (
            <div
              key={quarter.id}
              className="flex min-w-0 flex-1 items-center last:flex-none"
            >
              <div className="min-w-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-black ${
                    isActive
                      ? 'border-cyan-200 bg-cyan-200 text-slate-950 shadow-lg shadow-cyan-950/40'
                      : isComplete
                        ? 'border-emerald-200/60 bg-emerald-200/15 text-emerald-100'
                        : 'border-slate-700 bg-slate-950 text-slate-500'
                  }`}
                >
                  {isComplete ? '✓' : index + 1}
                </div>
                <p
                  className={`mt-2 text-sm font-black ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {quarter.id}
                </p>
                {isActive && (
                  <p className="mt-1 max-w-28 text-xs font-semibold leading-4 text-cyan-100">
                    {quarter.label}
                  </p>
                )}
              </div>

              {index < quarters.length - 1 && (
                <div
                  className={`mx-3 h-px flex-1 ${
                    isComplete ? 'bg-emerald-200/50' : 'bg-slate-700'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressTimeline
