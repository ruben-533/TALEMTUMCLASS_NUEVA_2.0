export type RequestStatus = 'pending' | 'accepted' | 'rejected'

export interface TutorRequest {
  id: number
  name: string
  avatar: string
  subject: string
  level: string
  date: string
  time: string
  modality: 'Virtual' | 'Presencial'
  price: number
  message: string
}

export const TUTOR_REQUESTS: TutorRequest[] = [
  {
    id: 1,
    name: 'Mariana Pérez',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=48&h=48&fit=crop&auto=format',
    subject: 'Cálculo Diferencial',
    level: 'Universitario',
    date: 'Lun 2 sep.',
    time: '10:00 AM',
    modality: 'Virtual',
    price: 40000,
    message: 'Tengo un examen el jueves y necesito repasar derivadas e integrales.',
  },
  {
    id: 2,
    name: 'Felipe Ortiz',
    avatar:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=48&h=48&fit=crop&auto=format',
    subject: 'Álgebra Lineal',
    level: 'Universitario',
    date: 'Mar 3 sep.',
    time: '2:00 PM',
    modality: 'Presencial',
    price: 55000,
    message: 'Prefiero clase presencial cerca de la universidad. ¿Te queda bien Chapinero?',
  },
  {
    id: 3,
    name: 'Isabella Vargas',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=48&h=48&fit=crop&auto=format',
    subject: 'Estadística',
    level: 'Intermedio',
    date: 'Mié 4 sep.',
    time: '11:00 AM',
    modality: 'Virtual',
    price: 40000,
    message: 'Necesito ayuda con probabilidad y distribuciones normales.',
  },
  {
    id: 4,
    name: 'Jorge Salazar',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format',
    subject: 'Física Mecánica',
    level: 'Bachillerato',
    date: 'Jue 5 sep.',
    time: '4:00 PM',
    modality: 'Virtual',
    price: 40000,
    message: 'Estoy preparando las pruebas de admisión de la universidad.',
  },
]
