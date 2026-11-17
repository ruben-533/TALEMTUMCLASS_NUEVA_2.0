import type { ReactNode } from 'react'
import type { NavProps, Screen } from '@/app/navigation'
import { Logo } from '@/components/ui'
import { initials } from '@/lib/format'

interface Props extends NavProps {
  children: ReactNode
  activeScreen: Screen
}

interface NavItem {
  screen: Screen
  studentScreen?: Screen
  label: string
  icon: ReactNode
  badge?: number
  roles: Array<'student' | 'tutor'>
}

const icon = (path: string) => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
)

const navItems: NavItem[] = [
  {
    screen: 'student-dashboard',
    studentScreen: 'student-dashboard',
    label: 'Inicio',
    icon: icon('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1'),
    roles: ['student', 'tutor'],
  },
  {
    screen: 'search',
    label: 'Buscar tutores',
    icon: icon('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'),
    roles: ['student'],
  },
  {
    screen: 'tutor-requests',
    label: 'Solicitudes',
    icon: icon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'),
    roles: ['tutor'],
    badge: 3,
  },
  {
    screen: 'booking',
    label: 'Mis tutorías',
    icon: icon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'),
    roles: ['student'],
  },
  {
    screen: 'tutor-availability',
    label: 'Disponibilidad',
    icon: icon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'),
    roles: ['tutor'],
  },
  {
    screen: 'ai-recommend',
    label: 'Lumen IA',
    icon: icon('M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'),
    roles: ['student', 'tutor'],
  },
  {
    screen: 'history',
    label: 'Historial',
    icon: icon('M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'),
    roles: ['student', 'tutor'],
  },
  {
    screen: 'messages',
    label: 'Mensajes',
    icon: icon('M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'),
    roles: ['student', 'tutor'],
    badge: 2,
  },
  {
    screen: 'notifications',
    label: 'Notificaciones',
    icon: icon('M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'),
    roles: ['student', 'tutor'],
    badge: 3,
  },
  {
    screen: 'profile-settings',
    label: 'Perfil y ajustes',
    icon: icon('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'),
    roles: ['student', 'tutor'],
  },
]

export default function DashboardLayout({ children, navigate, role, userName, activeScreen, logout, isAdmin }: Props) {
  const activeRole = role === 'tutor' ? 'tutor' : 'student'
  const homeScreen: Screen = activeRole === 'tutor' ? 'tutor-dashboard' : 'student-dashboard'
  const items = navItems.filter((item) => item.roles.includes(activeRole))

  const isActive = (screen: Screen) => screen === activeScreen

  const bottomItems =
    activeRole === 'tutor'
      ? [
          { screen: 'tutor-dashboard' as Screen, icon: '🏠', label: 'Inicio' },
          { screen: 'tutor-requests' as Screen, icon: '📩', label: 'Solicitudes' },
          { screen: 'tutor-availability' as Screen, icon: '📅', label: 'Agenda' },
          { screen: 'ai-recommend' as Screen, icon: '✨', label: 'Lumen' },
          { screen: 'messages' as Screen, icon: '💬', label: 'Mensajes' },
          { screen: 'profile-settings' as Screen, icon: '👤', label: 'Perfil' },
        ]
      : [
          { screen: 'student-dashboard' as Screen, icon: '🏠', label: 'Inicio' },
          { screen: 'search' as Screen, icon: '🔍', label: 'Buscar' },
          { screen: 'booking' as Screen, icon: '📅', label: 'Tutorías' },
          { screen: 'ai-recommend' as Screen, icon: '✨', label: 'Lumen' },
          { screen: 'messages' as Screen, icon: '💬', label: 'Mensajes' },
          { screen: 'profile-settings' as Screen, icon: '👤', label: 'Perfil' },
        ]

  return (
    <div className="flex h-full overflow-hidden bg-[#F7F3E9]">
      {/* Sidebar — desktop */}
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-[#EAE1CD] bg-[#FBF8F1] lg:flex">
        <div className="border-b border-[#EAE1CD] px-5 py-4">
          <button onClick={() => navigate(homeScreen)} aria-label="Ir al inicio">
            <Logo size="sm" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
          {items.map((item) => {
            const target = activeRole === 'tutor' && item.screen === 'student-dashboard' ? 'tutor-dashboard' : item.screen
            const selected = isActive(item.screen) || (item.screen === 'student-dashboard' && activeScreen === 'tutor-dashboard')
            return (
              <button
                key={item.label}
                onClick={() => navigate(target)}
                aria-current={selected ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-500 transition-colors ${
                  selected
                    ? 'bg-[#5548C8] text-white'
                    : 'text-[#4B4360] hover:bg-[#F3EEDF] hover:text-[#221A3A]'
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && !selected && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5548C8] px-1.5 text-[10px] font-700 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-[#EAE1CD] px-3 py-3">
          <button
            onClick={() => navigate('categories')}
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-[#F3EEDF] hover:text-[#3A3348]"
          >
            🗂️ Categorías · CRUD
          </button>
          <button
            onClick={() => navigate('screens')}
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-[#F3EEDF] hover:text-[#3A3348]"
          >
            🗂️ Mapa de pantallas / Design system
          </button>
          <button
            onClick={() => navigate('profile-settings')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-gray-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5548C8] text-sm font-600 text-white">
              {initials(userName)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-600 text-[#221A3A]">{userName}</span>
              <span className="block text-xs text-gray-400">{isAdmin ? 'Administrador' : activeRole === 'tutor' ? 'Tutor' : 'Estudiante'}</span>
            </span>
          </button>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-[#F3EEDF] hover:text-[#221A3A]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar — mobile */}
        <header className="flex shrink-0 items-center justify-between border-b border-[#EAE1CD] bg-[#FBF8F1] px-4 py-3 lg:hidden">
          <button onClick={() => navigate(homeScreen)} aria-label="Ir al inicio">
            <Logo size="sm" showWordmark={false} />
            <span className="sr-only">TALEMTUMCLASS</span>
          </button>
          <span className="text-sm font-700 text-[#221A3A]">TALEMTUMCLASS</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('notifications')}
              aria-label="Notificaciones"
              className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#5548C8]" />
            </button>
            <button
              onClick={() => navigate('profile-settings')}
              aria-label="Mi perfil"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5548C8] text-xs font-600 text-white"
            >
              {initials(userName)}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Bottom nav — mobile */}
        <nav
          className="flex shrink-0 items-center justify-around border-t border-[#EAE1CD] bg-[#FBF8F1] px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] lg:hidden"
          aria-label="Navegación móvil"
        >
          {bottomItems.map((item) => {
            const active = isActive(item.screen)
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.screen)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors ${
                  active ? 'text-[#5548C8]' : 'text-gray-400'
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="text-[10px] font-500">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
