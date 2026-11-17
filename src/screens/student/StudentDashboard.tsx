import { useEffect, useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { TUTORS, CATEGORIES } from '@/data/tutors'
import {
  formatReservationDate,
  listReservations,
  nextReservation,
  type Reservation,
} from '@/lib/bookings'

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

export default function StudentDashboard(props: NavProps) {
  const [search, setSearch] = useState('')
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    if (!props.isAuthenticated) return
    let active = true
    listReservations()
      .then((items) => {
        if (active) setReservations(items)
      })
      .catch(() => {
        // Si la API no responde, el inicio sigue usable con los ceros por defecto.
      })
    return () => {
      active = false
    }
  }, [props.isAuthenticated])

  const upcoming = props.isAuthenticated ? nextReservation(reservations) : null
  const completed = reservations.filter((item) => item.estado === 'completada')
  const hours = completed.reduce((sum, item) => sum + item.duracion, 0) / 60
  const tutorsKnown = new Set(completed.map((item) => item.tutorId)).size

  return (
    <DashboardLayout {...props} activeScreen="student-dashboard">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-700 text-[#221A3A] mb-1">¡Hola, {props.userName}! 👋</h1>
          <p className="text-gray-500">¿Qué quieres aprender hoy?</p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 flex items-center gap-3 bg-[#FFFDF8] rounded-xl py-3 border border-[#E4DAC6] shadow-sm" style={{ paddingLeft: '3px', paddingRight: '3px' }}>
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar tutores, materias o temas..."
              className="flex-1 outline-none text-[#2B2140] placeholder-gray-400 text-sm bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && props.navigate('search')}
            />
          </div>
          <button
            onClick={() => props.navigate('search')}
            className="bg-[#5548C8] text-white font-600 px-5 py-3 rounded-xl hover:bg-[#4338CA] transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: '⚡', label: 'Disponible ahora', color: 'bg-green-50 border-green-200 text-green-700', action: () => props.navigate('available-now') },
            { icon: '✨', label: 'Lumen IA', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', action: () => props.navigate('ai-recommend') },
            { icon: '📅', label: 'Mis tutorías', color: 'bg-blue-50 border-blue-200 text-blue-700', action: () => props.navigate('history') },
            { icon: '📊', label: 'Historial', color: 'bg-amber-50 border-amber-200 text-amber-700', action: () => props.navigate('history') },
          ].map((q) => (
            <button
              key={q.label}
              onClick={q.action}
              className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-500 hover:opacity-80 transition-opacity ${q.color}`}
            >
              <span>{q.icon}</span>
              <span>{q.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Next session */}
            {props.isAuthenticated ? (
              upcoming ? (
                <div className="bg-gradient-to-r from-[#312e81] to-[#5548C8] rounded-2xl p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white/60 text-xs font-500 uppercase tracking-wider mb-1">Próxima tutoría</p>
                      <h3 className="text-lg font-700">{upcoming.materia}</h3>
                    </div>
                    <span className="bg-white/20 text-white text-xs font-500 px-3 py-1 rounded-full border border-white/20">
                      {upcoming.modalidad === 'virtual' ? '💻 Virtual' : '📍 Presencial'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-5">
                    {upcoming.tutorAvatar ? (
                      <img
                        src={upcoming.tutorAvatar}
                        alt={upcoming.tutorNombre}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 font-700">
                        {upcoming.tutorNombre.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-600">{upcoming.tutorNombre}</p>
                      <p className="text-white/60 text-sm">{upcoming.nivel}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-white/70 mb-5">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatReservationDate(upcoming.fecha)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {upcoming.hora} · {upcoming.duracion} min
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      props.setActiveBooking(upcoming)
                      props.navigate(upcoming.modalidad === 'virtual' ? 'virtual-session' : 'inperson-session')
                    }}
                    className="bg-[#FFFDF8] text-[#5548C8] font-600 px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors"
                  >
                    Ver tutoría
                  </button>
                </div>
              ) : (
                <div className="bg-[#FFFDF8] rounded-2xl border border-[#EAE1CD] p-6">
                  <p className="text-xs font-500 uppercase tracking-wider text-gray-400 mb-1">Próxima tutoría</p>
                  <h3 className="text-lg font-700 text-[#221A3A]">Aún no tienes tutorías programadas</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Busca un tutor y reserva tu primera sesión. Cuando la confirmes, aparecerá aquí.
                  </p>
                  <button
                    onClick={() => props.navigate('search')}
                    className="mt-4 bg-[#5548C8] text-white font-600 px-5 py-2.5 rounded-xl text-sm hover:bg-[#4338CA] transition-colors"
                  >
                    Buscar tutor
                  </button>
                </div>
              )
            ) : (
            <div className="bg-gradient-to-r from-[#312e81] to-[#5548C8] rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/60 text-xs font-500 uppercase tracking-wider mb-1">Próxima tutoría</p>
                  <h3 className="text-lg font-700">Cálculo Diferencial</h3>
                </div>
                <span className="bg-white/20 text-white text-xs font-500 px-3 py-1 rounded-full border border-white/20">
                  💻 Virtual
                </span>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=56&h=56&fit=crop&auto=format"
                  alt="Laura Martínez"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
                <div>
                  <p className="font-600">Laura Martínez</p>
                  <p className="text-white/60 text-sm">Matemáticas · Física</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/70 mb-5">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Lunes 2 de sep.
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  10:00 — 11:00 AM
                </div>
              </div>
              <button
                onClick={() => props.navigate('virtual-session')}
                className="bg-[#FFFDF8] text-[#5548C8] font-600 px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors"
              >
                Ver tutoría
              </button>
            </div>
            )}

            {/* Recommended tutors */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-700 text-[#221A3A]">Tutores recomendados para ti</h2>
                <button onClick={() => props.navigate('search')} className="text-[#5548C8] text-sm font-500 hover:underline">
                  Ver todos
                </button>
              </div>
              <div className="space-y-3">
                {TUTORS.slice(0, 4).map((tutor) => (
                  <div
                    key={tutor.id}
                    onClick={() => { props.selectTutor(tutor.id); props.navigate('tutor-profile') }}
                    className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#EAE1CD] flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <img src={tutor.avatar} alt={tutor.name} className="w-12 h-12 rounded-full object-cover bg-indigo-100" />
                      {tutor.available && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-600 text-[#221A3A] text-sm">{tutor.name}</span>
                        {tutor.verified && (
                          <svg className="w-3.5 h-3.5 text-[#5548C8]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{tutor.subject}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <StarRating rating={tutor.rating} />
                        <span className="text-xs text-gray-500">{tutor.rating} · {tutor.reviews} reseñas</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-700 text-[#221A3A]">${tutor.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">/hora</div>
                      <div className="flex flex-wrap gap-1 mt-1 justify-end">
                        {tutor.modalities.map((m) => (
                          <span key={m} className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-[#5548C8] rounded-full font-500">
                            {m === 'Virtual' ? '💻' : '📍'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#EAE1CD]">
              <h3 className="font-700 text-[#221A3A] mb-4">Categorías populares</h3>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => props.navigate('search')}
                    className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-[#F7F3E9] transition-colors text-left group"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <div className="text-xs font-500 text-[#2B2140] group-hover:text-[#5548C8] transition-colors">{cat.name}</div>
                      <div className="text-[10px] text-gray-400">{cat.count}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI nudge */}
            <button
              onClick={() => props.navigate('ai-recommend')}
              className="w-full bg-gradient-to-br from-[#5548C8] to-[#7c3aed] rounded-2xl p-5 text-left hover:opacity-95 transition-opacity"
            >
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-700 text-white mb-1 text-sm">Encuentra tu tutor con IA</h3>
              <p className="text-white/70 text-xs leading-relaxed">
                Cuéntanos qué necesitas y te recomendamos el tutor perfecto.
              </p>
            </button>

            {/* Stats */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#EAE1CD]">
              <h3 className="font-700 text-[#221A3A] mb-4">Tu progreso</h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Tutorías realizadas',
                    value: props.isAuthenticated ? String(completed.length) : '12',
                    icon: '🎓',
                  },
                  {
                    label: 'Horas aprendidas',
                    value: props.isAuthenticated ? `${hours % 1 === 0 ? hours : hours.toFixed(1)}h` : '18h',
                    icon: '⏱️',
                  },
                  {
                    label: 'Tutores conocidos',
                    value: props.isAuthenticated ? String(tutorsKnown) : '4',
                    icon: '👥',
                  },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{stat.icon}</span>
                      {stat.label}
                    </div>
                    <span className="font-700 text-[#221A3A]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
