import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'

const REQUESTS = [
  {
    id: 1,
    name: 'Mariana Pérez',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=48&h=48&fit=crop&auto=format',
    subject: 'Cálculo Diferencial',
    level: 'Universitario',
    date: 'Lun 2 sep.',
    time: '10:00 AM',
    modality: 'Virtual',
    price: 40000,
  },
  {
    id: 2,
    name: 'Felipe Ortiz',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=48&h=48&fit=crop&auto=format',
    subject: 'Álgebra Lineal',
    level: 'Universitario',
    date: 'Mar 3 sep.',
    time: '14:00',
    modality: 'Presencial',
    price: 55000,
  },
  {
    id: 3,
    name: 'Isabella Vargas',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=48&h=48&fit=crop&auto=format',
    subject: 'Estadística',
    level: 'Intermedio',
    date: 'Mié 4 sep.',
    time: '11:00 AM',
    modality: 'Virtual',
    price: 40000,
  },
]

const WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']
const AVAILABILITY: Record<string, string[]> = {
  Lun: ['09:00', '10:00', '14:00', '15:00'],
  Mar: ['10:00', '11:00', '14:00'],
  Mié: [],
  Jue: ['09:00', '14:00', '15:00', '16:00'],
  Vie: ['10:00', '11:00'],
}

export default function TutorDashboard(props: NavProps) {
  const [requestStates, setRequestStates] = useState<Record<number, 'pending' | 'accepted' | 'rejected'>>({
    1: 'pending', 2: 'pending', 3: 'pending',
  })

  const handleRequest = (id: number, action: 'accepted' | 'rejected') => {
    setRequestStates((prev) => ({ ...prev, [id]: action }))
  }

  const pending = (props.isAuthenticated ? [] : REQUESTS).filter((r) => requestStates[r.id] === 'pending')
  const requests = props.isAuthenticated ? [] : REQUESTS
  const availability: Record<string, string[]> = props.isAuthenticated ? {} : AVAILABILITY

  return (
    <DashboardLayout {...props} activeScreen="tutor-dashboard">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-700 text-[#221A3A] mb-1">¡Hola, {props.userName}! 👋</h1>
          <p className="text-gray-500">Tienes {pending.length} solicitud{pending.length !== 1 ? 'es' : ''} pendiente{pending.length !== 1 ? 's' : ''}.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tutorías realizadas', value: props.isAuthenticated ? '0' : '312', icon: '🎓', color: 'bg-indigo-50 text-indigo-700' },
            { label: 'Ingresos este mes', value: props.isAuthenticated ? '$0' : '$1.24M', icon: '💰', color: 'bg-green-50 text-green-700' },
            { label: 'Calificación', value: props.isAuthenticated ? '—' : '4.9 ★', icon: '⭐', color: 'bg-amber-50 text-amber-700' },
            { label: 'Estudiantes', value: props.isAuthenticated ? '0' : '87', icon: '👥', color: 'bg-blue-50 text-blue-700' },
          ].map((s) => (
            <div key={s.label} className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#EAE1CD]">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg mb-3 ${s.color}`}>
                {s.icon}
              </div>
              <p className="text-2xl font-700 text-[#221A3A]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — requests + next session */}
          <div className="lg:col-span-2 space-y-6">

            {/* Next session */}
            {props.isAuthenticated ? (
              <div className="bg-[#FFFDF8] rounded-2xl border border-[#EAE1CD] p-6">
                <p className="text-xs font-500 uppercase tracking-wider text-gray-400 mb-1">Próxima tutoría</p>
                <h3 className="text-lg font-700 text-[#221A3A]">Aún no tienes tutorías programadas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Cuando aceptes una solicitud o un estudiante reserve contigo, la sesión aparecerá aquí.
                </p>
              </div>
            ) : (
            <div className="bg-gradient-to-r from-[#312e81] to-[#5548C8] rounded-2xl p-6 text-white">
              <p className="text-white/60 text-xs font-500 uppercase tracking-wider mb-2">Próxima tutoría</p>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=56&h=56&fit=crop&auto=format"
                  alt="Mariana"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
                <div>
                  <p className="font-700 text-lg">Mariana Pérez</p>
                  <p className="text-white/60 text-sm">Cálculo Diferencial · Universitario</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/70 mb-5">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Lun 2 sep. · 10:00 AM
                </div>
                <span className="bg-white/20 text-white text-xs font-500 px-3 py-0.5 rounded-full">💻 Virtual</span>
              </div>
              <button onClick={() => props.navigate('virtual-session')} className="bg-[#FFFDF8] text-[#5548C8] font-600 px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
                Iniciar sesión
              </button>
            </div>
            )}

            {/* Pending requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-700 text-[#221A3A]">Solicitudes pendientes</h2>
                  {pending.length > 0 && (
                    <span className="bg-[#5548C8] text-white text-xs font-700 w-5 h-5 rounded-full flex items-center justify-center">
                      {pending.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => props.navigate('tutor-requests')}
                  className="text-[#5548C8] text-sm font-500 hover:underline"
                >
                  Ver todas
                </button>
              </div>

              {requests.length === 0 && (
                <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-6 text-center text-sm text-gray-500">
                  No tienes solicitudes por ahora. Cuando un estudiante te contacte, aparecerá aquí.
                </div>
              )}

              {requests.map((req) => {
                const state = requestStates[req.id]
                return (
                  <div
                    key={req.id}
                    className={`bg-[#FFFDF8] rounded-2xl border p-5 mb-3 transition-all ${
                      state === 'accepted' ? 'border-green-200 bg-green-50' :
                      state === 'rejected' ? 'border-[#EAE1CD] opacity-60' :
                      'border-[#EAE1CD]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img src={req.avatar} alt={req.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="font-600 text-[#221A3A]">{req.name}</p>
                            <p className="text-xs text-gray-500">{req.subject} · {req.level}</p>
                          </div>
                          {state === 'accepted' && (
                            <span className="bg-green-100 text-green-700 text-xs font-600 px-2.5 py-1 rounded-full">Confirmada</span>
                          )}
                          {state === 'rejected' && (
                            <span className="bg-gray-100 text-gray-500 text-xs font-600 px-2.5 py-1 rounded-full">Rechazada</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                          <span>📅 {req.date}</span>
                          <span>🕐 {req.time}</span>
                          <span>{req.modality === 'Virtual' ? '💻' : '📍'} {req.modality}</span>
                          <span className="font-600 text-[#3A3348]">${req.price.toLocaleString()}</span>
                        </div>
                        {state === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRequest(req.id, 'accepted')}
                              className="flex-1 bg-[#5548C8] text-white font-600 py-2 rounded-xl text-sm hover:bg-[#4338CA] transition-colors"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() => handleRequest(req.id, 'rejected')}
                              className="flex-1 border border-[#E4DAC6] text-[#3A3348] font-500 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right — calendar + earnings */}
          <div className="space-y-6">
            {/* Availability */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#EAE1CD]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-700 text-[#221A3A]">Mi disponibilidad</h3>
                <span className="text-xs text-gray-400">Sep 2026</span>
              </div>
              <div className="space-y-3">
                {WEEK.map((day) => (
                  <div key={day} className="flex items-start gap-3">
                    <span className="text-xs font-600 text-gray-500 w-7 shrink-0 pt-1">{day}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {availability[day]?.length > 0 ? (
                        availability[day].map((s) => (
                          <span key={s} className="text-[10px] bg-indigo-50 text-[#5548C8] font-500 px-2 py-1 rounded-lg">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-300">Sin disponibilidad</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => props.navigate('tutor-availability')} className="w-full mt-4 text-xs text-[#5548C8] font-500 border border-[#5548C8]/30 py-2 rounded-xl hover:bg-indigo-50 transition-colors">
                Editar disponibilidad
              </button>
            </div>

            {/* Earnings summary */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#EAE1CD]">
              <h3 className="font-700 text-[#221A3A] mb-4">Ingresos</h3>
              <div className="space-y-3">
                {[
                  { label: 'Esta semana', value: props.isAuthenticated ? '$0' : '$280,000', trend: props.isAuthenticated ? '' : '+12%' },
                  { label: 'Este mes', value: props.isAuthenticated ? '$0' : '$1,240,000', trend: props.isAuthenticated ? '' : '+8%' },
                  { label: 'Este año', value: props.isAuthenticated ? '$0' : '$8,640,000', trend: props.isAuthenticated ? '' : '+24%' },
                ].map((e) => (
                  <div key={e.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{e.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-700 text-[#221A3A]">{e.value}</span>
                      <span className="ml-1.5 text-xs text-green-600 font-500">{e.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#EAE1CD]">
              <h3 className="font-700 text-[#221A3A] mb-3">Acciones rápidas</h3>
              <div className="space-y-2">
                {[
                  { icon: '📝', label: 'Editar mi perfil', screen: 'profile-settings' as const },
                  { icon: '✨', label: 'Preparar clase con Lumen IA', screen: 'ai-recommend' as const },
                  { icon: '📅', label: 'Actualizar disponibilidad', screen: 'tutor-availability' as const },
                  { icon: '📊', label: 'Ver historial completo', screen: 'history' as const },
                  { icon: '⚙️', label: 'Configuración', screen: 'profile-settings' as const },
                ].map((a) => (
                  <button key={a.label} onClick={() => props.navigate(a.screen)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left">
                    <span>{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

