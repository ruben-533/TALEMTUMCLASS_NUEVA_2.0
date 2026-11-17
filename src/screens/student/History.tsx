import { useEffect, useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge, EmptyState, PageHeader, Stars } from '@/components/ui'
import { HISTORY_SESSIONS, type SessionStatus } from '@/data/sessions'
import { formatCOP } from '@/lib/format'
import {
  formatReservationDate,
  listReservations,
  type Reservation,
  type ReservationStatus,
} from '@/lib/bookings'

type Filter = 'all' | 'completed' | 'upcoming' | 'cancelled'

const statusVariant: Record<SessionStatus, 'success' | 'warning' | 'neutral' | 'danger'> = {
  Confirmada: 'success',
  Pendiente: 'warning',
  Completada: 'neutral',
  Cancelada: 'danger',
}

const statusLabel: Record<ReservationStatus, SessionStatus> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

interface ViewSession {
  id: number
  tutorId: number
  tutorName: string
  avatar: string
  subject: string
  level: string
  date: string
  time: string
  modality: 'Virtual' | 'Presencial'
  status: SessionStatus
  price: number
  duration: number
  rating?: number
  reservation?: Reservation
}

export default function History(props: NavProps) {
  const isTutor = props.role === 'tutor'
  const [filter, setFilter] = useState<Filter>('all')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(props.isAuthenticated)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!props.isAuthenticated) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    listReservations()
      .then((items) => {
        if (active) setReservations(items)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'No se pudo cargar el historial.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [props.isAuthenticated])

  // Cuentas reales: reservas guardadas en SQLite. Invitado: recorrido de ejemplo.
  const allSessions: ViewSession[] = props.isAuthenticated
    ? reservations.map((item) => ({
        id: item.id,
        tutorId: item.tutorId,
        tutorName: item.tutorNombre,
        avatar: item.tutorAvatar,
        subject: item.materia,
        level: item.nivel,
        date: formatReservationDate(item.fecha),
        time: `${item.hora} · ${item.duracion} min`,
        modality: item.modalidad === 'virtual' ? 'Virtual' : 'Presencial',
        status: statusLabel[item.estado],
        price: item.precio,
        duration: item.duracion,
        rating: item.calificacion ?? undefined,
        reservation: item,
      }))
    : HISTORY_SESSIONS.map((session) => ({
        id: session.id,
        tutorId: session.tutorId,
        tutorName: session.tutorName,
        avatar: session.avatar,
        subject: session.subject,
        level: session.level,
        date: session.date,
        time: session.time,
        modality: session.modality,
        status: session.status,
        price: session.price,
        duration: 60,
        rating: session.rating,
      }))

  const sessions = allSessions.filter((session) => {
    if (filter === 'completed') return session.status === 'Completada'
    if (filter === 'cancelled') return session.status === 'Cancelada'
    if (filter === 'upcoming') return session.status === 'Confirmada' || session.status === 'Pendiente'
    return true
  })

  const completed = allSessions.filter((session) => session.status === 'Completada')
  const total = completed.reduce((sum, session) => sum + session.price, 0)
  const hours = completed.reduce((sum, session) => sum + session.duration, 0) / 60
  const rated = completed.filter((session) => typeof session.rating === 'number')
  const averageRating = rated.length
    ? (rated.reduce((sum, session) => sum + (session.rating ?? 0), 0) / rated.length).toFixed(1)
    : '—'

  const openSession = (session: ViewSession, screen: 'virtual-session' | 'inperson-session' | 'rating') => {
    if (session.reservation) props.setActiveBooking(session.reservation)
    props.navigate(screen)
  }

  return (
    <DashboardLayout {...props} activeScreen="history">
      <div className="mx-auto max-w-5xl p-5 sm:p-6 lg:p-8">
        <PageHeader
          title={isTutor ? 'Historial de tutorías' : 'Mi historial'}
          subtitle={isTutor ? 'Consulta las sesiones que has impartido y tus ingresos.' : 'Revisa tus tutorías pasadas y vuelve a reservar cuando quieras.'}
        />

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total sesiones', value: String(allSessions.length) },
            { label: 'Completadas', value: String(completed.length) },
            {
              label: isTutor ? 'Ingresos' : 'Horas aprendidas',
              value: isTutor ? formatCOP(total) : `${hours % 1 === 0 ? hours : hours.toFixed(1)}h`,
            },
            { label: 'Calificación prom.', value: averageRating === '—' ? '—' : `${averageRating} ★` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-4">
              <p className="text-lg font-700 text-[#221A3A]">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all' as const, label: 'Todas' },
            { key: 'upcoming' as const, label: 'Próximas' },
            { key: 'completed' as const, label: 'Completadas' },
            { key: 'cancelled' as const, label: 'Canceladas' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-500 transition-colors ${
                filter === tab.key ? 'border-[#5548C8] bg-[#5548C8] text-white' : 'border-[#E4DAC6] bg-[#FFFDF8] text-gray-600 hover:border-[#5548C8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-10 text-center text-sm text-gray-500">
            Cargando tus tutorías...
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState
            icon="🗂️"
            title={props.isAuthenticated ? 'Todavía no tienes tutorías' : 'Aún no hay tutorías en esta categoría'}
            description={
              props.isAuthenticated
                ? 'Cuando reserves tu primera tutoría, aparecerá aquí con todos sus detalles.'
                : 'Cuando reserves o completes una tutoría, aparecerá aquí con todos sus detalles.'
            }
            action={
              <button onClick={() => props.navigate('search')} className="rounded-xl bg-[#5548C8] px-5 py-3 text-sm font-600 text-white hover:bg-[#4338CA]">
                Buscar un tutor
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {session.avatar ? (
                    <img src={session.avatar} alt={session.tutorName} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-700 text-[#5548C8]">
                      {session.tutorName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-600 text-[#221A3A]">{isTutor ? 'Sesión impartida' : session.tutorName}</p>
                      <Badge variant={statusVariant[session.status]}>{session.status}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">{session.subject} · {session.level}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                      <span>📅 {session.date}</span>
                      <span>🕐 {session.time}</span>
                      <span>{session.modality === 'Virtual' ? '💻' : '📍'} {session.modality}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="text-right">
                      <p className="font-700 text-[#221A3A]">{formatCOP(session.price)}</p>
                      {isTutor ? (
                        <p className="text-xs text-green-600">Ingreso: {formatCOP(Math.round(session.price * 0.85))}</p>
                      ) : session.rating ? (
                        <Stars rating={session.rating} />
                      ) : session.status === 'Completada' ? (
                        <p className="text-xs text-gray-400">Sin calificar</p>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      {session.status === 'Completada' && !session.rating && !isTutor && (
                        <button onClick={() => openSession(session, 'rating')} className="rounded-lg bg-[#5548C8] px-3 py-1.5 text-xs font-600 text-white hover:bg-[#4338CA]">
                          Calificar
                        </button>
                      )}
                      {(session.status === 'Confirmada' || session.status === 'Pendiente') && !isTutor && (
                        <button
                          onClick={() => openSession(session, session.modality === 'Virtual' ? 'virtual-session' : 'inperson-session')}
                          className="rounded-lg bg-[#5548C8] px-3 py-1.5 text-xs font-600 text-white hover:bg-[#4338CA]"
                        >
                          Entrar
                        </button>
                      )}
                      {session.status === 'Completada' && !isTutor && (
                        <button
                          onClick={() => {
                            props.selectTutor(session.tutorId)
                            props.navigate('booking')
                          }}
                          className="rounded-lg border border-[#E4DAC6] px-3 py-1.5 text-xs font-500 text-gray-600 hover:bg-gray-50"
                        >
                          Reservar otra
                        </button>
                      )}
                    </div>
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
