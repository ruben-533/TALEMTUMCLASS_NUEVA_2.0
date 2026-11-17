import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import { Logo, ProgressSteps } from '@/components/ui'

const SUBJECTS = [
  { icon: '📐', name: 'Matemáticas' },
  { icon: '💻', name: 'Programación' },
  { icon: '🌍', name: 'Inglés' },
  { icon: '⚛️', name: 'Física' },
  { icon: '🧪', name: 'Química' },
  { icon: '📊', name: 'Marketing' },
  { icon: '🎨', name: 'Diseño' },
  { icon: '💰', name: 'Finanzas' },
  { icon: '🏢', name: 'Negocios' },
  { icon: '🤖', name: 'Tecnología' },
  { icon: '🎵', name: 'Música' },
  { icon: '➕', name: 'Otras' },
]

const LEVELS = [
  { name: 'Básico', desc: 'Estoy empezando desde cero', icon: '🌱' },
  { name: 'Intermedio', desc: 'Ya tengo bases y quiero avanzar', icon: '🚀' },
  { name: 'Avanzado', desc: 'Domino lo básico y busco perfeccionar', icon: '🏆' },
]

const GOALS = [
  { name: 'Aprender desde cero', icon: '🌱' },
  { name: 'Mejorar mis habilidades', icon: '📈' },
  { name: 'Prepararme para un examen', icon: '📝' },
  { name: 'Prepararme para trabajar', icon: '💼' },
  { name: 'Desarrollar un proyecto', icon: '🛠️' },
  { name: 'Otro objetivo', icon: '✨' },
]

const MODALITIES = [
  { value: 'virtual', icon: '💻', title: 'Virtual', desc: 'Clases por videollamada desde donde estés' },
  { value: 'presencial', icon: '📍', title: 'Presencial', desc: 'Encuentros cara a cara en tu ciudad' },
  { value: 'cualquiera', icon: '🔄', title: 'Cualquiera', desc: 'Me adapto a la modalidad disponible' },
]

export default function StudentOnboarding({ navigate, userName }: NavProps) {
  const [step, setStep] = useState(1)
  const [subjects, setSubjects] = useState<string[]>([])
  const [level, setLevel] = useState('')
  const [goal, setGoal] = useState('')
  const [modality, setModality] = useState('')
  const [city, setCity] = useState('')

  const toggleSubject = (name: string) => {
    setSubjects((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const canContinue =
    (step === 1 && subjects.length > 0) ||
    (step === 2 && !!level) ||
    (step === 3 && !!goal) ||
    (step === 4 && !!modality && (modality !== 'presencial' || city.trim().length > 2))

  if (step === 5) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F7F3E9] px-5 py-12">
        <div className="w-full max-w-md animate-fade-up text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            🎉
          </div>
          <h1 className="text-2xl font-700 text-[#221A3A]">¡Listo, {userName}!</h1>
          <p className="mt-2 text-gray-500">
            Encontramos tutores de {subjects.slice(0, 2).join(' y ')} que encajan con tu nivel y objetivo.
          </p>
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate('search')}
              className="w-full rounded-xl bg-[#5548C8] py-4 font-600 text-white transition-colors hover:bg-[#4338CA]"
            >
              Ver tutores
            </button>
            <button
              onClick={() => navigate('ai-recommend')}
              className="w-full rounded-xl border border-[#E4DAC6] bg-[#FFFDF8] py-3.5 text-sm font-500 text-[#3A3348] transition-colors hover:bg-gray-50"
            >
              🤖 Pedir una recomendación con IA
            </button>
          </div>
          <button onClick={() => navigate('student-dashboard')} className="mt-5 text-sm text-gray-400 hover:text-[#5548C8]">
            Ir directo a mi inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#F7F3E9] px-4 pb-10 pt-5 sm:px-6">
      <header className="mx-auto mb-8 flex max-w-3xl items-center justify-between">
        <Logo size="sm" />
        <button
          onClick={() => navigate('student-dashboard')}
          className="text-sm font-500 text-gray-400 transition-colors hover:text-[#3A3348]"
        >
          Omitir por ahora
        </button>
      </header>

      <div className="mx-auto max-w-3xl">
        <ProgressSteps steps={['Intereses', 'Nivel', 'Objetivo', 'Modalidad']} current={step} className="mb-8" />

        <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 shadow-sm sm:p-8">
          {step === 1 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 1 de 4</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">¿Qué quieres aprender?</h1>
              <p className="mt-1 text-sm text-gray-500">Elige todas las materias que te interesen.</p>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {SUBJECTS.map((subject) => {
                  const selected = subjects.includes(subject.name)
                  return (
                    <button
                      key={subject.name}
                      onClick={() => toggleSubject(subject.name)}
                      aria-pressed={selected}
                      className={`flex items-center gap-2.5 rounded-xl border-2 px-3 py-3 text-left text-sm transition-all ${
                        selected
                          ? 'border-[#5548C8] bg-indigo-50 font-600 text-[#5548C8]'
                          : 'border-[#EAE1CD] text-[#3A3348] hover:border-[#5548C8]/40'
                      }`}
                    >
                      <span className="text-lg">{subject.icon}</span>
                      <span className="flex-1">{subject.name}</span>
                      {selected && <span className="text-[#5548C8]">✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 2 de 4</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">¿Cuál es tu nivel?</h1>
              <p className="mt-1 text-sm text-gray-500">Así te recomendamos tutores con el ritmo adecuado.</p>

              <div className="mt-6 space-y-3">
                {LEVELS.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setLevel(item.name)}
                    aria-pressed={level === item.name}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      level === item.name
                        ? 'border-[#5548C8] bg-indigo-50'
                        : 'border-[#EAE1CD] hover:border-[#5548C8]/40'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="flex-1">
                      <span className="block font-600 text-[#221A3A]">{item.name}</span>
                      <span className="block text-xs text-gray-500">{item.desc}</span>
                    </span>
                    {level === item.name && <span className="text-[#5548C8]">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 3 de 4</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">¿Cuál es tu objetivo?</h1>
              <p className="mt-1 text-sm text-gray-500">El tutor adaptará el plan de estudio a lo que buscas.</p>

              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {GOALS.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setGoal(item.name)}
                    aria-pressed={goal === item.name}
                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm transition-all ${
                      goal === item.name
                        ? 'border-[#5548C8] bg-indigo-50 font-600 text-[#5548C8]'
                        : 'border-[#EAE1CD] text-[#3A3348] hover:border-[#5548C8]/40'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                    {goal === item.name && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 4 de 4</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">¿Cómo prefieres aprender?</h1>
              <p className="mt-1 text-sm text-gray-500">Puedes cambiarlo cuando quieras.</p>

              <div className="mt-6 space-y-3">
                {MODALITIES.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setModality(item.value)}
                    aria-pressed={modality === item.value}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      modality === item.value
                        ? 'border-[#5548C8] bg-indigo-50'
                        : 'border-[#EAE1CD] hover:border-[#5548C8]/40'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="flex-1">
                      <span className="block font-600 text-[#221A3A]">{item.title}</span>
                      <span className="block text-xs text-gray-500">{item.desc}</span>
                    </span>
                    {modality === item.value && <span className="text-[#5548C8]">✓</span>}
                  </button>
                ))}
              </div>

              {modality === 'presencial' && (
                <div className="mt-5 animate-fade-up">
                  <label htmlFor="city" className="mb-1.5 block text-sm font-500 text-[#3A3348]">
                    ¿En qué ciudad o zona estás?
                  </label>
                  <input
                    id="city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Ej. Bogotá, Chapinero"
                    className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none transition-all focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10"
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => (step === 1 ? navigate('role-select') : setStep(step - 1))}
              className="rounded-xl border border-[#E4DAC6] px-5 py-3.5 text-sm font-500 text-gray-600 transition-colors hover:bg-gray-50"
            >
              Atrás
            </button>
            <button
              disabled={!canContinue}
              onClick={() => setStep(step + 1)}
              className="flex-1 rounded-xl bg-[#5548C8] py-3.5 font-600 text-white transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === 4 ? 'Finalizar' : 'Continuar'}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Podrás editar tus preferencias desde tu perfil.
        </p>
      </div>
    </div>
  )
}
