interface Props {
  steps: string[]
  current: number
  className?: string
}

export default function ProgressSteps({ steps, current, className = '' }: Props) {
  return (
    <div className={className}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const number = index + 1
          const done = number < current
          const active = number === current
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-700 transition-colors ${
                    done
                      ? 'bg-green-500 text-white'
                      : active
                        ? 'bg-[#5548C8] text-white'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {done ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    number
                  )}
                </div>
                <span
                  className={`hidden text-xs font-500 md:block ${
                    active ? 'text-[#5548C8]' : done ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-2 h-px flex-1 ${done ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-gray-400 md:hidden">
        Paso {current} de {steps.length} · {steps[current - 1]}
      </p>
    </div>
  )
}
