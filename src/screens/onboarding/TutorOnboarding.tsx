import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import { Badge, Logo, ProgressSteps, Stars } from '@/components/ui'
import { formatCOP } from '@/lib/format'

const STEPS = ['Perfil', 'Materias', 'Modalidad', 'Precio', 'Agenda', 'Vista previa']
const SUBJECTS = ['Matemáticas', 'Física', 'Programación', 'Inglés', 'Química', 'Diseño', 'Marketing', 'Finanzas']
const LEVELS = ['Primaria', 'Bachillerato', 'Universitario', 'Profesional']
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00']

export default function TutorOnboarding({ navigate, userName }: NavProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState(userName || 'Laura Martínez')
  const [headline, setHeadline] = useState('Tutora de Matemáticas y Física')
  const [bio, setBio] = useState(
    'Matemática con maestría en educación. Especialista en hacer accesibles conceptos complejos para estudiantes universitarios y de bachillerato.',
  )
  const [experience, setExperience] = useState('5 años')
  const [subjects, setSubjects] = useState<string[]>(['Matemáticas', 'Física'])
  const [levels, setLevels] = useState<string[]>(['Bachillerato', 'Universitario'])
  const [modality, setModality] = useState<'virtual' | 'presencial' | 'ambas'>('ambas')
  const [city, setCity] = useState('Bogotá')
  const [zone, setZone] = useState('Chapinero')
  const [radius, setRadius] = useState('10 km')
  const [meetingPoint, setMeetingPoint] = useState('Cafeterías y bibliotecas cerca de la zona')
  const [price, setPrice] = useState(40000)
  const [durations, setDurations] = useState<number[]>([60])
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    Lun: ['09:00', '10:00', '14:00', '15:00'],
    Mar: ['10:00', '11:00', '14:00'],
    Mié: [],
    Jue: ['09:00', '14:00', '15:00', '16:00'],
    Vie: ['10:00', '11:00'],
    Sáb: [],
  })
  const [published, setPublished] = useState(false)

  const toggle = (list: string[], value: string, setter: (value: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
  }

  const toggleSlot = (day: string, slot: string) => {
    setAvailability((prev) => {
      const current = prev[day] ?? []
      return {
        ...prev,
        [day]: current.includes(slot) ? current.filter((item) => item !== slot) : [...current, slot].sort(),
      }
    })
  }

  const canContinue =
    (step === 1 && name.trim() && headline.trim() && bio.trim()) ||
    (step === 2 && subjects.length > 0 && levels.length > 0) ||
    step === 3 ||
    step === 4 ||
    step === 5

  if (step === 6 && published) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F7F3E9] px-5 py-12">
        <div className="w-full max-w-md animate-fade-up text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            🚀
          </div>
          <h1 className="text-2xl font-700 text-[#221A3A]">Tu perfil está publicado</h1>
          <p className="mt-2 text-gray-500">
            Ya puedes recibir solicitudes de estudiantes. Te avisaremos por notificaciones.
          </p>
          <button
            onClick={() => navigate('tutor-dashboard')}
            className="mt-8 w-full rounded-xl bg-[#5548C8] py-4 font-600 text-white transition-colors hover:bg-[#4338CA]"
          >
            Ir a mi dashboard
          </button>
          <button
            onClick={() => navigate('tutor-availability')}
            className="mt-3 w-full rounded-xl border border-[#E4DAC6] bg-[#FFFDF8] py-3.5 text-sm font-500 text-[#3A3348] transition-colors hover:bg-gray-50"
          >
            Revisar mi disponibilidad
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#F7F3E9] px-4 pb-10 pt-5 sm:px-6">
      <header className="mx-auto mb-8 flex max-w-3xl items-center justify-between">
        <Logo size="sm" />
        <span className="text-xs font-500 text-gray-400">Perfil de tutor · {Math.min(step, 5)}/5 completado</span>
      </header>

      <div className="mx-auto max-w-3xl">
        <ProgressSteps steps={STEPS} current={step} className="mb-8" />

        <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 shadow-sm sm:p-8">
          {step === 1 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 1 · Información personal</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">Cuéntanos quién eres</h1>
              <p className="mt-1 text-sm text-gray-500">Esta información aparecerá en tu perfil público.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="tutor-name" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Nombre completo</label>
                  <input id="tutor-name" value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10" />
                </div>
                <div>
                  <label htmlFor="tutor-headline" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Título profesional</label>
                  <input id="tutor-headline" value={headline} onChange={(event) => setHeadline(event.target.value)} className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10" />
                </div>
                <div>
                  <label htmlFor="tutor-bio" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Descripción profesional</label>
                  <textarea id="tutor-bio" rows={4} value={bio} onChange={(event) => setBio(event.target.value)} className="w-full resize-none rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10" />
                  <p className="mt-1 text-xs text-gray-400">{bio.length}/280 caracteres</p>
                </div>
                <div>
                  <label htmlFor="tutor-experience" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Años de experiencia</label>
                  <input id="tutor-experience" value={experience} onChange={(event) => setExperience(event.target.value)} className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10" />
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#5548C8]/30 bg-[#F7F3E9] p-4">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&auto=format" alt="Vista previa de foto" className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-600 text-[#2B2140]">Foto de perfil</p>
                    <p className="text-xs text-gray-500">En la versión final podrás subir una imagen desde tu dispositivo.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 2 · Especialidades</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">¿Qué materias enseñas?</h1>
              <p className="mt-1 text-sm text-gray-500">Selecciona tus materias y los niveles que puedes acompañar.</p>

              <div className="mt-6">
                <p className="mb-2 text-sm font-500 text-[#3A3348]">Materias</p>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((subject) => {
                    const selected = subjects.includes(subject)
                    return (
                      <button key={subject} onClick={() => toggle(subjects, subject, setSubjects)} aria-pressed={selected} className={`rounded-full border px-4 py-2 text-sm transition-all ${selected ? 'border-[#5548C8] bg-[#5548C8] text-white' : 'border-[#E4DAC6] text-gray-600 hover:border-[#5548C8]'}`}>
                        {subject}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm font-500 text-[#3A3348]">Niveles educativos</p>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((level) => {
                    const selected = levels.includes(level)
                    return (
                      <button key={level} onClick={() => toggle(levels, level, setLevels)} aria-pressed={selected} className={`rounded-full border px-4 py-2 text-sm transition-all ${selected ? 'border-[#5548C8] bg-indigo-50 font-500 text-[#5548C8]' : 'border-[#E4DAC6] text-gray-600 hover:border-[#5548C8]'}`}>
                        {level}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 3 · Modalidad</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">¿Cómo quieres dar tus tutorías?</h1>

              <div className="mt-6 space-y-3">
                {[
                  { value: 'virtual' as const, icon: '💻', title: 'Virtual', desc: 'Clases por videollamada' },
                  { value: 'presencial' as const, icon: '📍', title: 'Presencial', desc: 'Encuentros en tu zona' },
                  { value: 'ambas' as const, icon: '🔄', title: 'Ambas', desc: 'Ofrece más opciones a tus estudiantes' },
                ].map((item) => (
                  <button key={item.value} onClick={() => setModality(item.value)} aria-pressed={modality === item.value} className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${modality === item.value ? 'border-[#5548C8] bg-indigo-50' : 'border-[#EAE1CD] hover:border-[#5548C8]/40'}`}>
                    <span className="text-2xl">{item.icon}</span>
                    <span className="flex-1">
                      <span className="block font-600 text-[#221A3A]">{item.title}</span>
                      <span className="block text-xs text-gray-500">{item.desc}</span>
                    </span>
                    {modality === item.value && <span className="text-[#5548C8]">✓</span>}
                  </button>
                ))}
              </div>

              {modality !== 'virtual' && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Ciudad</label>
                    <input id="city" value={city} onChange={(event) => setCity(event.target.value)} className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8]" />
                  </div>
                  <div>
                    <label htmlFor="zone" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Zona</label>
                    <input id="zone" value={zone} onChange={(event) => setZone(event.target.value)} className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8]" />
                  </div>
                  <div>
                    <label htmlFor="radius" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Radio de atención</label>
                    <input id="radius" value={radius} onChange={(event) => setRadius(event.target.value)} className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8]" />
                  </div>
                  <div>
                    <label htmlFor="meeting" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Lugar de encuentro</label>
                    <input id="meeting" value={meetingPoint} onChange={(event) => setMeetingPoint(event.target.value)} className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8]" />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 4 · Precio</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">Define el valor de tu hora</h1>
              <p className="mt-1 text-sm text-gray-500">Puedes ajustarlo más adelante según tu demanda.</p>

              <div className="mt-6 rounded-2xl bg-[#F7F3E9] p-5">
                <label htmlFor="price" className="text-sm font-500 text-[#3A3348]">Precio por hora (COP)</label>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-2xl font-700 text-gray-400">$</span>
                  <input
                    id="price"
                    type="number"
                    min={15000}
                    step={5000}
                    value={price}
                    onChange={(event) => setPrice(Number(event.target.value))}
                    className="w-full bg-transparent text-3xl font-700 text-[#221A3A] outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">Sugerencia para tu perfil: {formatCOP(40000)} – {formatCOP(60000)}</p>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm font-500 text-[#3A3348]">Duraciones que ofreces</p>
                <div className="flex gap-2">
                  {[30, 60, 90].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setDurations((prev) => (prev.includes(duration) ? prev.filter((item) => item !== duration) : [...prev, duration]))}
                      aria-pressed={durations.includes(duration)}
                      className={`flex-1 rounded-xl border-2 py-3 text-sm font-500 transition-all ${durations.includes(duration) ? 'border-[#5548C8] bg-indigo-50 text-[#5548C8]' : 'border-[#EAE1CD] text-gray-600 hover:border-[#5548C8]/40'}`}
                    >
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-[#5548C8]">
                💡 TALEMTUMCLASS cobra una comisión del 15% por sesión. Recibirías {formatCOP(Math.round(price * 0.85))} por hora.
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 5 · Disponibilidad</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">¿Cuándo puedes enseñar?</h1>
              <p className="mt-1 text-sm text-gray-500">Toca los horarios disponibles. Puedes bloquearlos cuando quieras.</p>

              <div className="mt-6 space-y-4">
                {DAYS.map((day) => (
                  <div key={day}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-600 text-[#3A3348]">{day}</span>
                      <span className="text-xs text-gray-400">{availability[day]?.length ?? 0} horarios</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {SLOTS.map((slot) => {
                        const active = availability[day]?.includes(slot)
                        return (
                          <button
                            key={slot}
                            onClick={() => toggleSlot(day, slot)}
                            aria-pressed={active}
                            className={`rounded-lg border py-2 text-xs font-500 transition-all ${active ? 'border-[#5548C8] bg-[#5548C8] text-white' : 'border-[#E4DAC6] text-gray-500 hover:border-[#5548C8]'}`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-[#EAE1CD] bg-gray-50 px-4 py-3 text-xs text-gray-500">
                Las horas ocupadas se bloquean automáticamente cuando aceptas una tutoría.
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-fade-up">
              <p className="text-xs font-600 uppercase tracking-wider text-[#5548C8]">Paso 6 · Vista previa</p>
              <h1 className="mt-1 text-xl font-700 text-[#221A3A] sm:text-2xl">Así verán tu perfil</h1>
              <p className="mt-1 text-sm text-gray-500">Revisa que todo esté correcto antes de publicar.</p>

              <div className="mt-6 overflow-hidden rounded-2xl border border-[#EAE1CD]">
                <div className="bg-gradient-to-r from-[#312e81] to-[#5548C8] p-6 text-white">
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&auto=format" alt={name} className="h-16 w-16 rounded-2xl border-2 border-white/30 object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-700">{name}</h2>
                        <Badge variant="info" className="border-white/20 bg-white/15 text-white">Verificado</Badge>
                      </div>
                      <p className="text-sm text-white/70">{headline}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Stars rating={5} />
                        <span className="text-xs text-white/70">Nuevo · 0 reseñas</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-5 p-6">
                  <p className="text-sm leading-relaxed text-gray-600">{bio}</p>
                  <div>
                    <p className="mb-2 text-xs font-600 uppercase tracking-wide text-gray-400">Especialidades</p>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => <Badge key={subject} variant="primary">{subject}</Badge>)}
                      {levels.map((level) => <Badge key={level}>{level}</Badge>)}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F7F3E9] p-4">
                    <div>
                      <p className="text-xs text-gray-500">Desde</p>
                      <p className="text-xl font-700 text-[#221A3A]">{formatCOP(price)} <span className="text-xs font-400 text-gray-400">/hora</span></p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>💻 {modality === 'presencial' ? 'No disponible' : 'Virtual'}</p>
                      <p>📍 {modality === 'virtual' ? 'No disponible' : `${zone}, ${city}`}</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-600 uppercase tracking-wide text-gray-400">Disponibilidad</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(availability).flatMap(([day, slots]) => slots.map((slot) => `${day} ${slot}`)).slice(0, 10).map((slot) => (
                        <span key={slot} className="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-500 text-[#5548C8]">{slot}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => (step === 1 ? navigate('role-select') : setStep(step - 1))}
              className="rounded-xl border border-[#E4DAC6] px-5 py-3.5 text-sm font-500 text-gray-600 transition-colors hover:bg-gray-50"
            >
              {step === 1 ? 'Salir' : 'Atrás'}
            </button>
            {step === 6 ? (
              <button
                onClick={() => setPublished(true)}
                className="flex-1 rounded-xl bg-[#5548C8] py-3.5 font-600 text-white transition-colors hover:bg-[#4338CA]"
              >
                Publicar perfil
              </button>
            ) : (
              <button
                disabled={!canContinue}
                onClick={() => setStep(step + 1)}
                className="flex-1 rounded-xl bg-[#5548C8] py-3.5 font-600 text-white transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
