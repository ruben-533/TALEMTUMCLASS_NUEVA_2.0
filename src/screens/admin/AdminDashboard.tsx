import { useEffect, useState } from 'react'
import type { NavProps } from '@/app/navigation'
import { Badge, Logo, Stars } from '@/components/ui'
import { TUTORS } from '@/data/tutors'
import { getUsers, type AuthUser } from '@/lib/auth'
import { formatCOP } from '@/lib/format'

type Section = 'overview' | 'users' | 'tutors' | 'subjects' | 'bookings' | 'reviews' | 'reports'

const SECTIONS: Array<{ key: Section; label: string; icon: string }> = [
  { key: 'overview', label: 'Resumen', icon: '📊' },
  { key: 'users', label: 'Usuarios', icon: '👥' },
  { key: 'tutors', label: 'Tutores', icon: '👨‍🏫' },
  { key: 'subjects', label: 'Materias', icon: '📚' },
  { key: 'bookings', label: 'Reservas', icon: '📅' },
  { key: 'reviews', label: 'Valoraciones', icon: '⭐' },
  { key: 'reports', label: 'Reportes', icon: '📈' },
]

const USERS = [
  { name: 'Mariana Pérez', email: 'mariana@correo.com', role: 'Estudiante', status: 'Activa', joined: '12 ago. 2026' },
  { name: 'Laura Martínez', email: 'laura@correo.com', role: 'Tutor', status: 'Verificada', joined: '3 mar. 2026' },
  { name: 'Felipe Ortiz', email: 'felipe@correo.com', role: 'Estudiante', status: 'Activa', joined: '28 jul. 2026' },
  { name: 'Andrés Gómez', email: 'andres@correo.com', role: 'Tutor', status: 'Verificado', joined: '17 ene. 2026' },
  { name: 'Isabella Vargas', email: 'isabella@correo.com', role: 'Estudiante', status: 'Suspendida', joined: '2 sep. 2026' },
]

const BOOKINGS = [
  { id: 'T-1042', student: 'Mariana Pérez', tutor: 'Laura Martínez', subject: 'Cálculo', date: '2 sep.', amount: 40000, status: 'Confirmada' },
  { id: 'T-1041', student: 'Felipe Ortiz', tutor: 'Andrés Gómez', subject: 'React', date: '1 sep.', amount: 45000, status: 'Completada' },
  { id: 'T-1040', student: 'Isabella Vargas', tutor: 'Laura Martínez', subject: 'Estadística', date: '31 ago.', amount: 40000, status: 'Pendiente' },
  { id: 'T-1039', student: 'Jorge Salazar', tutor: 'Miguel Torres', subject: 'Física', date: '30 ago.', amount: 50000, status: 'Cancelada' },
]

export default function AdminDashboard(props: NavProps) {
  const [section, setSection] = useState<Section>('overview')
  const [realUsers, setRealUsers] = useState<AuthUser[] | null>(null)

  useEffect(() => {
    if (section !== 'users' && section !== 'overview') return
    let active = true
    getUsers()
      .then((users) => {
        if (active) setRealUsers(users)
      })
      .catch(() => {
        if (active) setRealUsers(null)
      })
    return () => {
      active = false
    }
  }, [section])

  return (
    <div className="flex min-h-full bg-[#3d2fb6]">
      <aside className="hidden w-64 shrink-0 flex-col bg-[#1e1b4b] text-white lg:flex">
        <div className="border-b border-white/10 p-5">
          <Logo size="sm" light />
          <p className="mt-2 text-[10px] uppercase tracking-widest text-white/40">Panel administrador</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {SECTIONS.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${section === item.key ? 'bg-[#5548C8] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-3 text-xs">
          <button onClick={() => props.navigate('screens')} className="w-full rounded-lg px-3 py-2 text-left text-white/50 hover:bg-white/10 hover:text-white">🗂️ Mapa de pantallas</button>
          <button onClick={() => props.navigate('landing')} className="w-full rounded-lg px-3 py-2 text-left text-white/50 hover:bg-white/10 hover:text-white">← Volver a la app</button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE1CD] bg-[#FFFDF8] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => props.navigate('landing')} className="lg:hidden" aria-label="Volver a la app">
              <Logo size="sm" showWordmark={false} />
            </button>
            <div>
              <p className="text-sm font-700 text-[#221A3A]">Administración</p>
              <p className="text-[10px] text-gray-400">TALEMTUMCLASS · Demo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={section}
              onChange={(event) => setSection(event.target.value as Section)}
              aria-label="Sección del panel"
              className="rounded-xl border border-[#E4DAC6] bg-[#FFFDF8] px-3 py-2 text-xs outline-none lg:hidden"
            >
              {SECTIONS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
            <button onClick={() => props.navigate('notifications')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Notificaciones">🔔</button>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5548C8] text-xs font-600 text-white">AD</span>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-700 text-[#221A3A] sm:text-2xl">
                {SECTIONS.find((item) => item.key === section)?.label}
              </h1>
              <p className="text-sm text-gray-500">Vista general de la plataforma y actividad reciente.</p>
            </div>
            <Badge variant="success" dot>{realUsers ? 'SQLite conectado' : 'Datos de demostración'}</Badge>
          </div>

          {(section === 'overview' || section === 'reports') && (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { label: 'Usuarios registrados', value: '8,542', trend: '+12%', icon: '👥' },
                  { label: 'Tutores activos', value: '1,204', trend: '+8%', icon: '👨‍🏫' },
                  { label: 'Tutorías este mes', value: '3,411', trend: '+21%', icon: '📅' },
                  { label: 'Ingresos del mes', value: '$128.4M', trend: '+16%', icon: '💰' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7F3E9] text-lg">{stat.icon}</span>
                      <span className="text-[10px] font-600 text-green-600">{stat.trend}</span>
                    </div>
                    <p className="mt-3 text-xl font-700 text-[#221A3A]">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-700 text-[#221A3A]">Tutorías por mes</h2>
                    <span className="text-xs text-gray-400">2026</span>
                  </div>
                  <div className="mt-6 flex h-44 items-end gap-2">
                    {[42, 55, 48, 66, 72, 68, 84, 91, 78, 96, 104, 118].map((value, index) => (
                      <div key={index} className="group flex flex-1 flex-col items-center gap-1">
                        <span className="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100">{value}</span>
                        <div className="w-full rounded-t-md bg-gradient-to-t from-[#5548C8] to-[#8b5cf6]" style={{ height: `${(value / 118) * 100}%` }} />
                        <span className="text-[9px] text-gray-400">{['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5">
                  <h2 className="font-700 text-[#221A3A]">Distribución por rol</h2>
                  <div className="mt-5 space-y-4">
                    {[
                      { label: 'Estudiantes', value: 7338, total: 8542, color: 'bg-[#5548C8]' },
                      { label: 'Tutores', value: 1204, total: 8542, color: 'bg-[#8b5cf6]' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-600 text-[#221A3A]">{item.value.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / item.total) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl bg-[#F7F3E9] p-3 text-xs text-gray-500">
                    El 86% de los usuarios son estudiantes. La retención mensual de tutores es del 91%.
                  </div>
                </div>
              </div>
            </>
          )}

          {(section === 'users' || section === 'overview') && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8]">
              <div className="flex items-center justify-between border-b border-gray-50 p-4">
                <h2 className="font-700 text-[#221A3A]">Usuarios recientes</h2>
                <div className="flex items-center gap-2">
                  {realUsers && <Badge variant="success">SQLite · {realUsers.length} reales</Badge>}
                  <button onClick={() => setSection('users')} className="text-xs font-500 text-[#5548C8] hover:underline">Ver todos</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-4 py-3">Usuario</th>
                      <th className="px-4 py-3">Rol</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realUsers
                      ? realUsers.map((user) => (
                          <tr key={user.id} className="border-t border-gray-50">
                            <td className="px-4 py-3">
                              <p className="font-500 text-[#221A3A]">{user.nombre} {user.apellido}</p>
                              <p className="text-[10px] text-gray-400">{user.email}</p>
                            </td>
                            <td className="px-4 py-3 capitalize text-gray-600">{user.rol}</td>
                            <td className="px-4 py-3">
                              <Badge variant="success">Activa</Badge>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">{user.creadoEn}</td>
                          </tr>
                        ))
                      : USERS.map((user) => (
                          <tr key={user.email} className="border-t border-gray-50">
                            <td className="px-4 py-3">
                              <p className="font-500 text-[#221A3A]">{user.name}</p>
                              <p className="text-[10px] text-gray-400">{user.email}</p>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{user.role}</td>
                            <td className="px-4 py-3">
                              <Badge variant={user.status === 'Suspendida' ? 'danger' : user.status === 'Activa' ? 'success' : 'primary'}>{user.status}</Badge>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">{user.joined}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'tutors' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {TUTORS.map((tutor) => (
                <div key={tutor.id} className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-4">
                  <div className="flex items-center gap-3">
                    <img src={tutor.avatar} alt={tutor.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-600 text-[#221A3A]">{tutor.name}</p>
                      <p className="text-xs text-gray-500">{tutor.subject}</p>
                      <div className="mt-1 flex items-center gap-1.5"><Stars rating={tutor.rating} /><span className="text-xs text-gray-500">{tutor.rating} ({tutor.reviews})</span></div>
                    </div>
                    <Badge variant={tutor.available ? 'success' : 'neutral'}>{tutor.available ? 'En línea' : 'Inactivo'}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-xs">
                    <span className="text-gray-500">{formatCOP(tutor.price)}/h · {tutor.sessions} sesiones</span>
                    <div className="flex gap-2">
                      <button onClick={() => { props.selectTutor(tutor.id); props.navigate('tutor-profile') }} className="rounded-lg border border-[#E4DAC6] px-2.5 py-1.5 text-gray-600 hover:bg-gray-50">Ver perfil</button>
                      <button className="rounded-lg bg-indigo-50 px-2.5 py-1.5 font-500 text-[#5548C8]">Verificar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === 'subjects' && (
            <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E6D8B8] bg-[#FBF7EE] p-4">
              <div>
                <p className="text-sm font-700 text-[#221A3A]">CRUD de categorías con SQLite</p>
                <p className="text-xs text-[#6B5A3E]">Crea, edita, elimina y lista categorías desde la base de datos real. Requiere sesión iniciada.</p>
              </div>
              <button
                onClick={() => props.navigate('categories')}
                className="rounded-xl bg-[#5548C8] px-4 py-2.5 text-sm font-600 text-white transition-colors hover:bg-[#4338CA]"
              >
                Abrir CRUD de categorías
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                ['Matemáticas', 234, '📐'], ['Programación', 187, '💻'], ['Inglés', 312, '🌍'], ['Física', 145, '⚛️'], ['Química', 98, '🧪'],
                ['Marketing', 76, '📊'], ['Diseño', 112, '🎨'], ['Finanzas', 89, '💰'], ['Negocios', 134, '🏢'], ['Tecnología', 167, '🤖'],
              ].map(([name, count, icon]) => (
                <div key={String(name)} className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-4 text-center">
                  <div className="text-2xl">{icon}</div>
                  <p className="mt-2 text-sm font-600 text-[#221A3A]">{name}</p>
                  <p className="text-xs text-gray-400">{count} tutores</p>
                  <button onClick={() => props.navigate('categories')} className="mt-2 text-[10px] font-500 text-[#5548C8] hover:underline">Gestionar</button>
                </div>
              ))}
            </div>
            </>
          )}

          {(section === 'bookings' || section === 'overview') && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8]">
              <div className="flex items-center justify-between border-b border-gray-50 p-4">
                <h2 className="font-700 text-[#221A3A]">Reservas recientes</h2>
                <button onClick={() => setSection('bookings')} className="text-xs font-500 text-[#5548C8] hover:underline">Ver todas</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Estudiante</th>
                      <th className="px-4 py-3">Tutor</th>
                      <th className="px-4 py-3">Materia</th>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Monto</th>
                      <th className="px-4 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BOOKINGS.map((booking) => (
                      <tr key={booking.id} className="border-t border-gray-50">
                        <td className="px-4 py-3 font-500 text-[#5548C8]">{booking.id}</td>
                        <td className="px-4 py-3 text-[#3A3348]">{booking.student}</td>
                        <td className="px-4 py-3 text-[#3A3348]">{booking.tutor}</td>
                        <td className="px-4 py-3 text-gray-500">{booking.subject}</td>
                        <td className="px-4 py-3 text-gray-500">{booking.date}</td>
                        <td className="px-4 py-3 font-500 text-[#221A3A]">{formatCOP(booking.amount)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={booking.status === 'Cancelada' ? 'danger' : booking.status === 'Pendiente' ? 'warning' : 'success'}>{booking.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'reviews' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { name: 'Mariana P.', tutor: 'Laura Martínez', rating: 5, text: 'Explica de forma clara y paciente. Recomendadísima.', date: 'Ago 2026' },
                { name: 'Felipe O.', tutor: 'Laura Martínez', rating: 5, text: 'Pude entender derivadas en una sola sesión.', date: 'Jul 2026' },
                { name: 'Isabella V.', tutor: 'Laura Martínez', rating: 4, text: 'Muy puntual y profesional. El contenido fue el indicado.', date: 'Jul 2026' },
                { name: 'Jorge S.', tutor: 'Miguel Torres', rating: 4, text: 'Buen dominio del tema y ejemplos prácticos.', date: 'Jun 2026' },
              ].map((review) => (
                <div key={`${review.name}-${review.date}`} className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-600 text-[#221A3A]">{review.name}</p>
                    <span className="text-[10px] text-gray-400">{review.date}</span>
                  </div>
                  <p className="text-xs text-gray-400">Tutor: {review.tutor}</p>
                  <div className="mt-1"><Stars rating={review.rating} /></div>
                  <p className="mt-2 text-sm text-gray-600">{review.text}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-lg bg-green-50 px-2.5 py-1.5 text-[10px] font-500 text-green-700">Aprobar</button>
                    <button className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-500 text-red-600">Reportar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === 'reports' && (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ['Tasa de conversión', '18.4%', 'Visitas que terminan en reserva'],
                ['Cancelaciones', '3.2%', 'Tutorías canceladas este mes'],
                ['Satisfacción promedio', '4.8 / 5', 'Promedio de 2,841 valoraciones'],
                ['Tiempo de respuesta', '42 min', 'Promedio de tutores a solicitudes'],
              ].map(([title, value, desc]) => (
                <div key={title} className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5">
                  <p className="text-xs font-500 text-gray-400">{title}</p>
                  <p className="mt-1 text-2xl font-700 text-[#221A3A]">{value}</p>
                  <p className="mt-1 text-xs text-gray-500">{desc}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full w-3/4 rounded-full bg-[#5548C8]" /></div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
