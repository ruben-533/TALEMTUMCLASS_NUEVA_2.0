export type SessionStatus = 'Confirmada' | 'Pendiente' | 'Completada' | 'Cancelada'

export interface SessionRecord {
  id: number
  tutorId: number
  tutorName: string
  studentName: string
  avatar: string
  subject: string
  level: string
  date: string
  time: string
  modality: 'Virtual' | 'Presencial'
  status: SessionStatus
  price: number
  rating?: number
  location?: string
}

export const UPCOMING_SESSION: SessionRecord = {
  id: 101,
  tutorId: 1,
  tutorName: 'Laura Martínez',
  studentName: 'Carlos',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format',
  subject: 'Cálculo Diferencial',
  level: 'Universitario',
  date: 'Lun 2 sep. 2026',
  time: '10:00 — 11:00 AM',
  modality: 'Virtual',
  status: 'Confirmada',
  price: 40000,
  location: 'Bogotá · Chapinero',
}

export const HISTORY_SESSIONS: SessionRecord[] = [
  {
    id: 1,
    tutorId: 1,
    tutorName: 'Laura Martínez',
    studentName: 'Carlos',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format',
    subject: 'Cálculo Diferencial',
    level: 'Universitario',
    date: '24 ago. 2026',
    time: '10:00 AM',
    modality: 'Virtual',
    status: 'Completada',
    price: 40000,
    rating: 5,
  },
  {
    id: 2,
    tutorId: 2,
    tutorName: 'Andrés Gómez',
    studentName: 'Carlos',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
    subject: 'React desde cero',
    level: 'Intermedio',
    date: '18 ago. 2026',
    time: '4:00 PM',
    modality: 'Virtual',
    status: 'Completada',
    price: 45000,
    rating: 5,
  },
  {
    id: 3,
    tutorId: 4,
    tutorName: 'Miguel Torres',
    studentName: 'Carlos',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format',
    subject: 'Química orgánica',
    level: 'Bachillerato',
    date: '10 ago. 2026',
    time: '9:00 AM',
    modality: 'Presencial',
    status: 'Cancelada',
    price: 50000,
  },
  {
    id: 4,
    tutorId: 3,
    tutorName: 'Valentina Cruz',
    studentName: 'Carlos',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format',
    subject: 'Inglés conversacional',
    level: 'Intermedio',
    date: '2 ago. 2026',
    time: '6:00 PM',
    modality: 'Virtual',
    status: 'Completada',
    price: 35000,
    rating: 4,
  },
]
