import type { Tutor } from '@/data/tutors'
import type { Reservation } from '@/lib/bookings'

/** Rol activo dentro de la demo. `null` = visitante (landing / auth). */
export type Role = 'student' | 'tutor' | null

/**
 * Mapa único de pantallas de la aplicación.
 * Cada valor coincide con una ruta del hash: #/student-dashboard, #/booking, etc.
 */
export type Screen =
  | 'landing'
  | 'login'
  | 'register'
  | 'role-select'
  | 'student-onboarding'
  | 'tutor-onboarding'
  | 'student-dashboard'
  | 'tutor-dashboard'
  | 'search'
  | 'tutor-profile'
  | 'booking'
  | 'available-now'
  | 'ai-recommend'
  | 'virtual-session'
  | 'inperson-session'
  | 'rating'
  | 'notifications'
  | 'messages'
  | 'history'
  | 'tutor-requests'
  | 'tutor-availability'
  | 'profile-settings'
  | 'admin'
  | 'categories'
  | 'design-system'
  | 'screens'

/** Props que reciben todas las pantallas conectadas al router. */
export interface NavProps {
  navigate: (screen: Screen) => void
  /** Rol activo. En pantallas públicas puede ser null. */
  role: Role
  userName: string
  /** Tutor elegido en búsqueda, dashboard o recomendaciones IA. */
  selectedTutor: Tutor
  /** Guarda el tutor elegido antes de navegar a su perfil o reservar. */
  selectTutor: (tutorId: number) => void
  /** Cierra la sesión real (cookie httpOnly) y vuelve al inicio. */
  logout: () => void
  /** Indica si hay una sesión autenticada en SQLite. */
  isAuthenticated: boolean
  /** Indica si la sesión pertenece a un administrador. */
  isAdmin?: boolean
  /** Reserva seleccionada para sesión, calificación o historial. */
  activeBooking: Reservation | null
  setActiveBooking: (reservation: Reservation | null) => void
}

export const ALL_SCREENS: Screen[] = [
  'landing',
  'login',
  'register',
  'role-select',
  'student-onboarding',
  'student-dashboard',
  'search',
  'available-now',
  'tutor-profile',
  'booking',
  'ai-recommend',
  'virtual-session',
  'inperson-session',
  'rating',
  'notifications',
  'messages',
  'history',
  'profile-settings',
  'tutor-onboarding',
  'tutor-dashboard',
  'tutor-requests',
  'tutor-availability',
  'admin',
  'categories',
  'design-system',
  'screens',
]

export const SCREEN_LABELS: Record<Screen, string> = {
  landing: 'Landing page',
  login: 'Iniciar sesión',
  register: 'Crear cuenta',
  'role-select': 'Selección de rol',
  'student-onboarding': 'Onboarding estudiante',
  'tutor-onboarding': 'Onboarding tutor',
  'student-dashboard': 'Dashboard estudiante',
  'tutor-dashboard': 'Dashboard tutor',
  search: 'Buscar tutores',
  'tutor-profile': 'Perfil del tutor',
  booking: 'Reserva de tutoría',
  'available-now': 'Tutor disponible ahora',
  'ai-recommend': 'Lumen IA',
  'virtual-session': 'Tutoría virtual',
  'inperson-session': 'Tutoría presencial',
  rating: 'Calificar tutoría',
  notifications: 'Notificaciones',
  messages: 'Mensajes',
  history: 'Historial',
  'tutor-requests': 'Solicitudes del tutor',
  'tutor-availability': 'Disponibilidad del tutor',
  'profile-settings': 'Perfil y configuración',
  admin: 'Panel administrador',
  categories: 'Categorías (CRUD)',
  'design-system': 'Design system',
  screens: 'Mapa de pantallas',
}
