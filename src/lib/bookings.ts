import { AuthError, type FieldError } from './auth'

export type ReservationStatus = 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
export type ReservationModality = 'virtual' | 'presencial'

export interface Reservation {
  id: number
  tutorId: number
  tutorNombre: string
  tutorAvatar: string
  materia: string
  nivel: string
  modalidad: ReservationModality
  fecha: string // YYYY-MM-DD
  hora: string // HH:MM
  duracion: number
  precio: number
  estado: ReservationStatus
  calificacion: number | null
  comentario: string
  creadoEn: string
}

export interface ReservationPayload {
  tutorId: number
  tutorNombre: string
  tutorAvatar?: string
  materia: string
  nivel?: string
  modalidad: ReservationModality
  fecha: string
  hora: string
  duracion: number
  precio: number
}

async function readJson(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    })
  } catch {
    throw new AuthError('No se pudo conectar con el servidor. Verifica que `npm run dev` esté activo.')
  }

  if (response.status === 204) return undefined as T
  const data = await readJson(response)

  if (!response.ok) {
    throw new AuthError(
      typeof data?.message === 'string' ? data.message : 'La operación no se pudo completar.',
      typeof data?.code === 'string' ? data.code : undefined,
      response.status,
      Array.isArray(data?.errors) ? (data.errors as FieldError[]) : [],
    )
  }

  return (data || {}) as T
}

export async function listReservations(): Promise<Reservation[]> {
  const data = await request<{ reservations: Reservation[] }>('/api/reservas')
  return data.reservations
}

export async function createReservation(payload: ReservationPayload): Promise<Reservation> {
  const data = await request<{ reservation: Reservation }>('/api/reservas', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.reservation
}

export async function updateReservationStatus(
  id: number,
  estado: ReservationStatus,
): Promise<Reservation> {
  const data = await request<{ reservation: Reservation }>(`/api/reservas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  })
  return data.reservation
}

export async function rateReservation(
  id: number,
  calificacion: number,
  comentario = '',
): Promise<Reservation> {
  const data = await request<{ reservation: Reservation }>(`/api/reservas/${id}/valoracion`, {
    method: 'PATCH',
    body: JSON.stringify({ calificacion, comentario }),
  })
  return data.reservation
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

/** "2026-11-10" → "10 nov. 2026" */
export function formatReservationDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  return `${day} ${MONTHS[month - 1]} ${year}`
}

/** "2026-11-10" → "Mar 10" (etiqueta corta) */
export function shortDayLabel(iso: string): string {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return `${DAYS[date.getDay()]} ${date.getDate()}`
}

/** Próximos 7 días desde hoy, en formato ISO local. */
export function upcomingDays(count = 7): string[] {
  const days: string[] = []
  const today = new Date()
  for (let index = 0; index < count; index += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    days.push(`${date.getFullYear()}-${month}-${day}`)
  }
  return days
}

export function reservationDateTime(reservation: Reservation): number {
  return new Date(`${reservation.fecha}T${reservation.hora}:00`).getTime()
}

export function nextReservation(reservations: Reservation[]): Reservation | null {
  const now = Date.now()
  const upcoming = reservations
    .filter((item) => item.estado === 'confirmada' || item.estado === 'pendiente')
    .filter((item) => reservationDateTime(item) >= now)
    .sort((a, b) => reservationDateTime(a) - reservationDateTime(b))
  return upcoming[0] ?? null
}
