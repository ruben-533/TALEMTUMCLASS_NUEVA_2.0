import { useEffect, useState } from 'react'
import Landing from '@/screens/landing/Landing'
import AuthFlow from '@/screens/auth/AuthFlow'
import StudentOnboarding from '@/screens/onboarding/StudentOnboarding'
import TutorOnboarding from '@/screens/onboarding/TutorOnboarding'
import StudentDashboard from '@/screens/student/StudentDashboard'
import SearchTutors from '@/screens/student/SearchTutors'
import TutorProfile from '@/screens/student/TutorProfile'
import BookingFlow from '@/screens/student/BookingFlow'
import AvailableNow from '@/screens/student/AvailableNow'
import History from '@/screens/student/History'
import TutorDashboard from '@/screens/tutor/TutorDashboard'
import TutorRequests from '@/screens/tutor/TutorRequests'
import TutorAvailability from '@/screens/tutor/TutorAvailability'
import LumenIA from '@/screens/ai/LumenIA'
import VirtualSession from '@/screens/sessions/VirtualSession'
import InPersonSession from '@/screens/sessions/InPersonSession'
import RatingScreen from '@/screens/reviews/RatingScreen'
import Notifications from '@/screens/communication/Notifications'
import Messages from '@/screens/communication/Messages'
import ProfileSettings from '@/screens/account/ProfileSettings'
import AdminDashboard from '@/screens/admin/AdminDashboard'
import Categories from '@/screens/categories/Categories'
import DesignSystem from '@/screens/system/DesignSystem'
import ScreenIndex from '@/screens/system/ScreenIndex'
import { TUTORS } from '@/data/tutors'
import {
  displayName,
  getCurrentUser,
  logoutUser,
  updateUserRole,
  type AuthUser,
} from '@/lib/auth'
import type { Reservation } from '@/lib/bookings'
import { ALL_SCREENS, type Role, type Screen, type NavProps } from './navigation'

const TUTOR_SCREENS: Screen[] = ['tutor-onboarding', 'tutor-dashboard', 'tutor-requests', 'tutor-availability']
const PUBLIC_SCREENS: Screen[] = ['landing', 'login', 'register', 'role-select']

function screenFromHash(): Screen {
  const value = window.location.hash.replace(/^#\/?/, '').trim() as Screen
  return ALL_SCREENS.includes(value) ? value : 'landing'
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(screenFromHash)
  const [role, setRole] = useState<Role>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userName, setUserName] = useState('Carlos')
  const [selectedTutorId, setSelectedTutorId] = useState(TUTORS[0].id)
  const [activeBooking, setActiveBooking] = useState<Reservation | null>(null)

  // Recupera la sesión real guardada en una cookie httpOnly.
  useEffect(() => {
    let active = true
    getCurrentUser().then((sessionUser) => {
      if (!active || !sessionUser) return
      setUser(sessionUser)
      setRole(sessionUser.rol === 'tutor' ? 'tutor' : sessionUser.rol === 'admin' ? null : 'student')
      setUserName(displayName(sessionUser))
    })
    return () => {
      active = false
    }
  }, [])

  // Permite atrás/adelante del navegador y enlaces directos (#/booking).
  useEffect(() => {
    const onHashChange = () => setScreen(screenFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (next: Screen) => {
    // Mantiene el rol de tutor al moverse a pantallas compartidas (Lumen, mensajes, perfil...).
    if (TUTOR_SCREENS.includes(next)) {
      if (role !== 'tutor') {
        setRole('tutor')
        if (!user) setUserName('Laura')
      }
    } else if (!role && TUTOR_SCREENS.includes(screen) && !PUBLIC_SCREENS.includes(next)) {
      setRole('tutor')
      if (!user) setUserName('Laura')
    }

    setScreen(next)
    window.location.hash = `/${next}`
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleAuth = (authUser: AuthUser, flow: 'login' | 'register') => {
    setUser(authUser)
    const nextRole: Role =
      authUser.rol === 'tutor' ? 'tutor' : authUser.rol === 'admin' ? null : 'student'
    setRole(nextRole)
    setUserName(displayName(authUser))

    if (flow === 'register') {
      navigate('role-select')
      return
    }

    if (authUser.rol === 'admin') navigate('admin')
    else if (authUser.rol === 'tutor') navigate('tutor-dashboard')
    else navigate('student-dashboard')
  }

  const handleRole = async (nextRole: 'student' | 'tutor') => {
    setRole(nextRole)
    if (user) {
      try {
        const updated = await updateUserRole(nextRole === 'tutor' ? 'tutor' : 'estudiante')
        setUser(updated)
        setUserName(displayName(updated))
      } catch {
        // Si falla la actualización, mantenemos la sesión y el rol visual.
      }
    } else {
      setUserName(nextRole === 'tutor' ? 'Laura' : 'Carlos')
    }
    navigate(nextRole === 'student' ? 'student-onboarding' : 'tutor-onboarding')
  }

  const handleUserUpdate = (updated: AuthUser) => {
    setUser(updated)
    setUserName(displayName(updated))
    if (updated.rol === 'tutor') setRole('tutor')
    else if (updated.rol === 'estudiante') setRole('student')
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch {
      // Aunque falle la petición, cerramos la sesión en el cliente.
    }
    setUser(null)
    setRole(null)
    setUserName('Carlos')
    setActiveBooking(null)
    navigate('landing')
  }

  const selectTutor = (tutorId: number) => setSelectedTutorId(tutorId)

  // Si se entra directo a una pantalla de tutor, la demo asume ese rol.
  const inferredRole: Role = role ?? (TUTOR_SCREENS.includes(screen) ? 'tutor' : screen === 'admin' ? null : 'student')

  const shownName = inferredRole === 'tutor' && !user ? 'Laura' : userName

  const nav: NavProps = {
    navigate,
    role: inferredRole,
    userName: shownName,
    selectedTutor: TUTORS.find((t) => t.id === selectedTutorId) ?? TUTORS[0],
    selectTutor,
    logout: handleLogout,
    isAuthenticated: Boolean(user),
    isAdmin: user?.rol === 'admin',
    activeBooking,
    setActiveBooking,
  }

  switch (screen) {
    case 'landing':
      return <Landing {...nav} />
    case 'login':
    case 'register':
    case 'role-select':
      return <AuthFlow screen={screen} navigate={navigate} onRole={handleRole} onAuth={handleAuth} />
    case 'student-onboarding':
      return <StudentOnboarding {...nav} />
    case 'tutor-onboarding':
      return <TutorOnboarding {...nav} />
    case 'student-dashboard':
      return <StudentDashboard {...nav} />
    case 'search':
      return <SearchTutors {...nav} />
    case 'tutor-profile':
      return <TutorProfile {...nav} />
    case 'booking':
      return <BookingFlow {...nav} />
    case 'available-now':
      return <AvailableNow {...nav} />
    case 'tutor-dashboard':
      return <TutorDashboard {...nav} />
    case 'tutor-requests':
      return <TutorRequests {...nav} />
    case 'tutor-availability':
      return <TutorAvailability {...nav} />
    case 'ai-recommend':
      return <LumenIA {...nav} />
    case 'virtual-session':
      return <VirtualSession {...nav} />
    case 'inperson-session':
      return <InPersonSession {...nav} />
    case 'rating':
      return <RatingScreen {...nav} />
    case 'notifications':
      return <Notifications {...nav} />
    case 'messages':
      return <Messages {...nav} />
    case 'history':
      return <History {...nav} />
    case 'profile-settings':
      return <ProfileSettings {...nav} user={user} onUserUpdate={handleUserUpdate} />
    case 'admin':
      return <AdminDashboard {...nav} />
    case 'categories':
      return <Categories {...nav} user={user} />
    case 'design-system':
      return <DesignSystem {...nav} />
    case 'screens':
      return <ScreenIndex {...nav} />
    default:
      return <Landing {...nav} />
  }
}
