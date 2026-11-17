import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge, EmptyState, PageHeader, Stars } from '@/components/ui'
import { TUTORS } from '@/data/tutors'
import { formatCOP } from '@/lib/format'

export default function AvailableNow(props: NavProps) {
  const [subject, setSubject] = useState('Todas')
  const [level, setLevel] = useState('Todos')
  const [modality, setModality] = useState('Todas')

  const results = TUTORS.filter((tutor) => {
    if (!tutor.available) return false
    if (subject !== 'Todas' && !tutor.subject.toLowerCase().includes(subject.toLowerCase())) return false
    if (level !== 'Todos' && !tutor.level.toLowerCase().includes(level.toLowerCase())) return false
    if (modality !== 'Todas' && !tutor.modalities.includes(modality)) return false
    return true
  })

  return (
    <DashboardLayout {...props} activeScreen="available-now">
      <div className="mx-auto max-w-5xl p-5 sm:p-6 lg:p-8">
        <PageHeader
          title="⚡ Tutor disponible ahora"
          subtitle="Encuentra ayuda inmediata para tu materia, sin esperar a agendar."
          action={<Badge variant="success" dot>{results.length} en línea</Badge>}
        />

        <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#312e81] to-[#5548C8] p-6 text-white">
          <h2 className="text-lg font-700">¿Necesitas ayuda ahora?</h2>
          <p className="mt-1 max-w-xl text-sm text-white/70">
            Cuéntanos qué materia necesitas y te mostraremos tutores conectados en este momento.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              aria-label="Materia"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur [&>option]:text-[#221A3A]"
            >
              {['Todas', 'Matemáticas', 'Programación', 'Inglés', 'Física', 'Química', 'Biología', 'Diseño', 'Finanzas', 'Negocios', 'Marketing', 'Historia', 'Música', 'Tecnología', 'Francés'].map((option) => (
                <option key={option} value={option}>{option === 'Todas' ? 'Todas las materias' : option}</option>
              ))}
            </select>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              aria-label="Nivel"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur [&>option]:text-[#221A3A]"
            >
              {['Todos', 'Básico', 'Intermedio', 'Avanzado', 'Universitario', 'Bachillerato'].map((option) => (
                <option key={option} value={option}>{option === 'Todos' ? 'Todos los niveles' : option}</option>
              ))}
            </select>
            <select
              value={modality}
              onChange={(event) => setModality(event.target.value)}
              aria-label="Modalidad"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur [&>option]:text-[#221A3A]"
            >
              {['Todas', 'Virtual', 'Presencial'].map((option) => (
                <option key={option} value={option}>{option === 'Todas' ? 'Virtual o presencial' : option}</option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon="🟢"
            title="No encontramos tutores disponibles ahora"
            description="Intenta con otra materia, amplía el nivel o revisa los tutores que tienen horarios esta semana."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => { setSubject('Todas'); setLevel('Todos'); setModality('Todas') }}
                  className="rounded-xl bg-[#5548C8] px-5 py-3 text-sm font-600 text-white hover:bg-[#4338CA]"
                >
                  Modificar búsqueda
                </button>
                <button
                  onClick={() => props.navigate('search')}
                  className="rounded-xl border border-[#E4DAC6] px-5 py-3 text-sm font-500 text-[#3A3348] hover:bg-gray-50"
                >
                  Ver todos los tutores
                </button>
              </div>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {results.map((tutor) => (
              <div key={tutor.id} className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 transition-shadow hover:shadow-lg">
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <img src={tutor.avatar} alt={tutor.name} className="h-16 w-16 rounded-2xl object-cover" />
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-700 text-[#221A3A]">{tutor.name}</h3>
                      <Badge variant="success" dot>Disponible ahora</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{tutor.subject}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Stars rating={tutor.rating} showValue reviews={tutor.reviews} />
                      <span className="text-xs text-gray-400">· {tutor.level}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tutor.modalities.map((item) => (
                    <Badge key={item} variant="primary" className="text-[10px]">{item === 'Virtual' ? '💻' : '📍'} {item}</Badge>
                  ))}
                  <Badge className="text-[10px]">📍 {tutor.location}</Badge>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                  <div>
                    <span className="text-xl font-700 text-[#221A3A]">{formatCOP(tutor.price)}</span>
                    <span className="text-xs text-gray-400"> /hora</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { props.selectTutor(tutor.id); props.navigate('tutor-profile') }}
                      className="rounded-xl border border-[#E4DAC6] px-3 py-2.5 text-xs font-500 text-gray-600 hover:bg-gray-50"
                    >
                      Ver perfil
                    </button>
                    <button
                      onClick={() => { props.selectTutor(tutor.id); props.navigate('booking') }}
                      className="rounded-xl bg-[#5548C8] px-4 py-2.5 text-xs font-600 text-white hover:bg-[#4338CA]"
                    >
                      Conectar ahora
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
