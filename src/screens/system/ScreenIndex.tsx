import type { NavProps, Screen } from '@/app/navigation'
import { Logo } from '@/components/ui'

interface Entry {
  screen: Screen
  title: string
  description: string
  icon: string
  tag?: string
}

const GROUPS: Array<{ title: string; subtitle: string; entries: Entry[] }> = [
  {
    title: '01 · Público y autenticación',
    subtitle: 'Lo que ve un visitante antes de tener una cuenta.',
    entries: [
      { screen: 'landing', title: 'Landing page', description: 'Hero, búsqueda, categorías, tutores destacados, cómo funciona, testimonios y CTA.', icon: '🏠' },
      { screen: 'login', title: 'Login', description: 'Correo y contraseña reales con validación y errores por campo.', icon: '🔐' },
      { screen: 'register', title: 'Registro', description: 'Nombre, apellido, correo y contraseña con confirmación y validaciones.', icon: '📝' },
      { screen: 'role-select', title: 'Selección de rol', description: 'Dos tarjetas claras: soy estudiante / soy tutor.', icon: '🎭' },
      { screen: 'design-system', title: 'Design system', description: 'Colores, tipografía, botones, formularios, badges y estados.', icon: '🎨', tag: 'Sistema' },
      { screen: 'admin', title: 'Panel administrador', description: 'Usuarios reales desde SQLite, tutores, materias, reservas, valoraciones y reportes.', icon: '🛠️', tag: 'Admin' },
      { screen: 'categories', title: 'Categorías · CRUD', description: 'Crear, listar, editar y eliminar categorías con una sesión autenticada.', icon: '🗂️', tag: 'SQLite' },
    ],
  },
  {
    title: '02 · Flujo del estudiante',
    subtitle: 'Registro → onboarding → buscar → reservar → aprender → calificar.',
    entries: [
      { screen: 'student-onboarding', title: 'Onboarding estudiante', description: 'Intereses, nivel, objetivo y modalidad en 4 pasos.', icon: '🎓' },
      { screen: 'student-dashboard', title: 'Dashboard estudiante', description: 'Próxima tutoría, recomendados, categorías y progreso.', icon: '📊' },
      { screen: 'search', title: 'Buscar tutores', description: 'Búsqueda con filtros de materia, nivel, modalidad, precio y rating.', icon: '🔍' },
      { screen: 'available-now', title: 'Tutor disponible ahora', description: 'Tutores conectados en tiempo real para ayuda inmediata.', icon: '⚡' },
      { screen: 'tutor-profile', title: 'Perfil del tutor', description: 'Bio, especialidades, precios, disponibilidad, reseñas y reserva.', icon: '👨‍🏫' },
      { screen: 'booking', title: 'Reserva de tutoría', description: 'Modalidad, duración, fecha, horario, confirmación y éxito.', icon: '📅' },
      { screen: 'ai-recommend', title: 'Lumen IA', description: 'Asistente educativa con Gemini para estudiantes y tutores: explica cualquier tema, resuelve dudas y recomienda tutores.', icon: '✨' },
      { screen: 'virtual-session', title: 'Tutoría virtual', description: 'Videollamada, chat, compartir pantalla y controles.', icon: '💻' },
      { screen: 'inperson-session', title: 'Tutoría presencial', description: 'Detalles, mapa, contacto y estado de la sesión.', icon: '📍' },
      { screen: 'rating', title: 'Calificar tutoría', description: 'Estrellas, etiquetas, comentario y confirmación.', icon: '⭐' },
      { screen: 'history', title: 'Historial', description: 'Sesiones pasadas, estados, calificaciones y repetir reserva.', icon: '🗂️' },
      { screen: 'notifications', title: 'Notificaciones', description: 'Solicitudes, confirmaciones, recordatorios, reseñas y mensajes.', icon: '🔔' },
      { screen: 'messages', title: 'Mensajes', description: 'Conversaciones con tutores y chat en tiempo real simulado.', icon: '💬' },
      { screen: 'profile-settings', title: 'Perfil y ajustes', description: 'Datos personales, notificaciones, seguridad y progreso.', icon: '👤' },
    ],
  },
  {
    title: '03 · Flujo del tutor',
    subtitle: 'Perfil → disponibilidad → solicitudes → enseñar → valoración.',
    entries: [
      { screen: 'tutor-onboarding', title: 'Onboarding tutor', description: 'Perfil, materias, modalidad, precio, agenda y vista previa.', icon: '🧑‍🏫' },
      { screen: 'tutor-dashboard', title: 'Dashboard tutor', description: 'Próxima sesión, solicitudes, estadísticas, ingresos y agenda.', icon: '📈' },
      { screen: 'tutor-requests', title: 'Solicitudes', description: 'Aceptar o rechazar con motivo, y ver el estado.', icon: '📩' },
      { screen: 'tutor-availability', title: 'Disponibilidad', description: 'Calendario semanal, bloqueos, duraciones y excepciones.', icon: '⏰' },
      { screen: 'profile-settings', title: 'Perfil del tutor', description: 'Datos, foto, descripción, verificación y preferencias.', icon: '⚙️' },
    ],
  },
]

export default function ScreenIndex({ navigate }: NavProps) {
  return (
    <div className="min-h-full bg-[#F7F3E9]">
      <header className="border-b border-[#EAE1CD] bg-[#FFFDF8]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => navigate('landing')} aria-label="Ir a la landing"><Logo size="sm" /></button>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('design-system')} className="rounded-xl border border-[#E4DAC6] px-3 py-2 text-xs font-500 text-gray-600 hover:bg-gray-50">🎨 Design system</button>
            <button onClick={() => navigate('landing')} className="rounded-xl bg-[#5548C8] px-3 py-2 text-xs font-600 text-white hover:bg-[#4338CA]">Volver a la app</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-600 uppercase tracking-widest text-[#5548C8]">Mapa del prototipo</p>
          <h1 className="mt-1 text-3xl font-800 text-[#221A3A]">Todas las pantallas de TALEMTUMCLASS</h1>
          <p className="mt-2 text-gray-500">
            Este índice reúne las pantallas del prototipo para revisarlas una por una. Cada tarjeta abre la
            pantalla real implementada en React, con su versión responsive para desktop y móvil.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[#FFFDF8] px-3 py-1.5 text-gray-600 shadow-sm">🖥️ Desktop 1440 × 1024</span>
            <span className="rounded-full bg-[#FFFDF8] px-3 py-1.5 text-gray-600 shadow-sm">📱 Mobile 390 × 844</span>
            <span className="rounded-full bg-[#FFFDF8] px-3 py-1.5 text-gray-600 shadow-sm">⚛️ React + Vite + Tailwind</span>
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <div className="mb-4">
                <h2 className="text-xl font-700 text-[#221A3A]">{group.title}</h2>
                <p className="text-sm text-gray-500">{group.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.entries.map((entry) => (
                  <button
                    key={`${group.title}-${entry.screen}-${entry.title}`}
                    onClick={() => navigate(entry.screen)}
                    className="group flex h-full flex-col rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 text-left transition-all hover:-translate-y-0.5 hover:border-[#5548C8]/30 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3E9] text-lg">{entry.icon}</span>
                      {entry.tag && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-600 text-[#5548C8]">{entry.tag}</span>}
                    </div>
                    <h3 className="mt-3 font-600 text-[#221A3A] group-hover:text-[#5548C8]">{entry.title}</h3>
                    <p className="mt-1 flex-1 text-xs leading-relaxed text-gray-500">{entry.description}</p>
                    <span className="mt-3 text-xs font-600 text-[#5548C8]">Abrir pantalla →</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-sm text-[#5548C8]">
          <p className="font-600">Flujo recomendado para la demo</p>
          <p className="mt-1 leading-relaxed">
            Landing → Registro → Selección de estudiante → Onboarding → Dashboard → Buscar tutor → Perfil →
            Reservar → Confirmar → Tutoría virtual → Calificar. Para el tutor: Landing → Registro → Selección de
            tutor → Onboarding → Dashboard → Solicitud → Aceptar → Tutoría.
          </p>
        </div>
      </main>
    </div>
  )
}
