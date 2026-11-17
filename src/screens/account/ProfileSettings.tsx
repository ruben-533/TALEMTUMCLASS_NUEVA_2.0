import { useEffect, useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge, PageHeader, Toast } from '@/components/ui'
import { initials } from '@/lib/format'
import { AuthError, displayName, updateProfile, type AuthUser } from '@/lib/auth'

interface Props extends NavProps {
  user: AuthUser | null
  onUserUpdate: (user: AuthUser) => void
}

export default function ProfileSettings({ user, onUserUpdate, ...props }: Props) {
  const isTutor = (user?.rol ?? props.role) === 'tutor'

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    ciudad: '',
    telefono: '',
    biografia: '',
  })
  const [notifications, setNotifications] = useState({
    requests: true,
    reminders: true,
    messages: true,
    marketing: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState('')

  // Carga los datos reales de la cuenta cada vez que cambia la sesión.
  useEffect(() => {
    if (!user) return
    setForm({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      ciudad: user.ciudad || '',
      telefono: user.telefono || '',
      biografia: user.biografia || '',
    })
  }, [user])

  const fullName = user
    ? displayName(user)
    : [form.nombre, form.apellido].filter(Boolean).join(' ') || props.userName

  const save = async () => {
    setError('')
    setFieldErrors({})
    setToast('')

    if (!user) {
      setError('Inicia sesión para guardar los datos de tu perfil.')
      return
    }

    setSaving(true)
    try {
      const updated = await updateProfile({
        nombre: form.nombre,
        apellido: form.apellido,
        ciudad: form.ciudad,
        telefono: form.telefono,
        biografia: form.biografia,
      })
      onUserUpdate(updated)
      setToast('Cambios guardados correctamente.')
      window.setTimeout(() => setToast(''), 3000)
    } catch (caught) {
      if (caught instanceof AuthError) {
        setError(caught.message)
        const next: Record<string, string> = {}
        for (const item of caught.errors) {
          if (item?.field) next[item.field] = item.message
        }
        setFieldErrors(next)
      } else {
        setError('No se pudieron guardar los cambios. Inténtalo de nuevo.')
      }
    } finally {
      setSaving(false)
    }
  }

  const toggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <DashboardLayout {...props} activeScreen="profile-settings">
      <div className="mx-auto max-w-4xl p-5 sm:p-6 lg:p-8">
        <PageHeader
          title="Perfil y configuración"
          subtitle="Administra tus datos personales y preferencias de la cuenta."
          action={
            user ? (
              <button
                onClick={save}
                disabled={saving}
                className="rounded-xl bg-[#5548C8] px-5 py-3 text-sm font-600 text-white hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            ) : (
              <button
                onClick={() => props.navigate('login')}
                className="rounded-xl bg-[#5548C8] px-5 py-3 text-sm font-600 text-white hover:bg-[#4338CA]"
              >
                Iniciar sesión
              </button>
            )
          }
        />

        {!user && (
          <div className="mb-5 rounded-2xl border border-[#E6D8B8] bg-[#FBF7EE] p-4 text-sm text-[#6B5A3E]">
            Estás viendo la demo como invitado. Inicia sesión o crea una cuenta para que tu perfil muestre
            y guarde tus datos reales.
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#5548C8] to-[#7c3aed] text-2xl font-700 text-white">
                {initials(fullName)}
              </div>
              <p className="mt-3 font-600 text-[#221A3A]">{fullName || 'Invitado'}</p>
              <p className="text-xs text-gray-400">{isTutor ? 'Tutor' : 'Estudiante'}</p>
              <Badge variant={isTutor ? 'success' : 'primary'} className="mt-2">
                {isTutor ? '✓ Verificado' : 'Cuenta activa'}
              </Badge>
              <button className="mt-4 w-full rounded-xl border border-[#E4DAC6] py-2 text-xs font-500 text-gray-600 hover:bg-gray-50">
                Cambiar foto
              </button>
            </div>

            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5">
              <p className="text-xs font-600 uppercase tracking-wide text-gray-400">Completitud del perfil</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-700 text-[#221A3A]">{isTutor ? '92%' : '78%'}</span>
                <span className="text-xs text-gray-400">{isTutor ? 'Casi listo' : 'Buen avance'}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-[#5548C8]" style={{ width: isTutor ? '92%' : '78%' }} />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {isTutor
                  ? 'Agrega una foto profesional para mejorar tu perfil.'
                  : 'Completa tus preferencias para mejores recomendaciones.'}
              </p>
            </div>

            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-3">
              <button onClick={() => props.navigate('screens')} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
                🗂️ <span>Mapa de pantallas</span>
              </button>
              <button onClick={() => props.navigate('design-system')} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
                🎨 <span>Design system</span>
              </button>
              <button onClick={() => props.logout()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-50">
                🚪 <span>Cerrar sesión</span>
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 sm:p-6">
              <h2 className="font-700 text-[#221A3A]">Información personal</h2>
              <p className="mt-1 text-xs text-gray-400">
                Son los datos que registraste al crear tu cuenta. Puedes actualizarlos cuando quieras.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-nombre" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Nombre</label>
                  <input
                    id="profile-nombre"
                    value={form.nombre}
                    onChange={(event) => setForm({ ...form, nombre: event.target.value })}
                    disabled={!user}
                    autoComplete="given-name"
                    className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] disabled:bg-[#F7F3E9] disabled:text-gray-500"
                  />
                  {fieldErrors.nombre && <p className="mt-1 text-xs text-red-600">{fieldErrors.nombre}</p>}
                </div>
                <div>
                  <label htmlFor="profile-apellido" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Apellido</label>
                  <input
                    id="profile-apellido"
                    value={form.apellido}
                    onChange={(event) => setForm({ ...form, apellido: event.target.value })}
                    disabled={!user}
                    autoComplete="family-name"
                    className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] disabled:bg-[#F7F3E9] disabled:text-gray-500"
                  />
                  {fieldErrors.apellido && <p className="mt-1 text-xs text-red-600">{fieldErrors.apellido}</p>}
                </div>
                <div>
                  <label htmlFor="profile-email" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Correo electrónico</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full rounded-xl border border-[#E4DAC6] bg-[#F7F3E9] px-4 py-3 text-sm text-gray-500 outline-none"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">El correo de la cuenta no se puede cambiar aquí.</p>
                </div>
                <div>
                  <label htmlFor="profile-telefono" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Teléfono</label>
                  <input
                    id="profile-telefono"
                    value={form.telefono}
                    onChange={(event) => setForm({ ...form, telefono: event.target.value })}
                    disabled={!user}
                    autoComplete="tel"
                    placeholder="+57 300 123 4567"
                    className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] disabled:bg-[#F7F3E9] disabled:text-gray-500"
                  />
                  {fieldErrors.telefono && <p className="mt-1 text-xs text-red-600">{fieldErrors.telefono}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="profile-ciudad" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Ciudad</label>
                  <input
                    id="profile-ciudad"
                    value={form.ciudad}
                    onChange={(event) => setForm({ ...form, ciudad: event.target.value })}
                    disabled={!user}
                    autoComplete="address-level2"
                    placeholder="Bogotá"
                    className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] disabled:bg-[#F7F3E9] disabled:text-gray-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-500 text-[#3A3348]">
                  {isTutor ? 'Descripción profesional' : 'Sobre mí'}
                </label>
                <textarea
                  id="profile-bio"
                  rows={4}
                  value={form.biografia}
                  onChange={(event) => setForm({ ...form, biografia: event.target.value })}
                  disabled={!user}
                  maxLength={500}
                  placeholder={isTutor ? 'Cuéntales a los estudiantes sobre tu experiencia.' : 'Cuéntanos qué quieres aprender.'}
                  className="w-full resize-none rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] disabled:bg-[#F7F3E9] disabled:text-gray-500"
                />
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 sm:p-6">
              <h2 className="font-700 text-[#221A3A]">Notificaciones</h2>
              <p className="text-xs text-gray-400">Elige qué avisos quieres recibir.</p>
              <div className="mt-4 space-y-3">
                {[
                  { key: 'requests' as const, label: 'Solicitudes de tutoría', desc: 'Cuando un estudiante solicite una sesión' },
                  { key: 'reminders' as const, label: 'Recordatorios de sesión', desc: 'Avisos antes de cada tutoría' },
                  { key: 'messages' as const, label: 'Mensajes', desc: 'Nuevos mensajes de estudiantes o tutores' },
                  { key: 'marketing' as const, label: 'Novedades y promociones', desc: 'Consejos, descuentos y novedades' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4 rounded-xl border border-gray-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-500 text-[#2B2140]">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggle(item.key)}
                      aria-pressed={notifications[item.key]}
                      aria-label={item.label}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${notifications[item.key] ? 'bg-[#5548C8]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-1 h-4 w-4 rounded-full bg-[#FFFDF8] transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 sm:p-6">
              <h2 className="font-700 text-[#221A3A]">Seguridad</h2>
              <div className="mt-3 space-y-2">
                <button className="flex w-full items-center justify-between rounded-xl border border-[#EAE1CD] px-4 py-3 text-sm text-[#3A3348] hover:bg-gray-50">
                  <span>Cambiar contraseña</span><span className="text-gray-400">›</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-xl border border-[#EAE1CD] px-4 py-3 text-sm text-[#3A3348] hover:bg-gray-50">
                  <span>Verificación en dos pasos</span><Badge variant="warning">Recomendado</Badge>
                </button>
                {isTutor && (
                  <button onClick={() => props.navigate('tutor-onboarding')} className="flex w-full items-center justify-between rounded-xl border border-[#EAE1CD] px-4 py-3 text-sm text-[#3A3348] hover:bg-gray-50">
                    <span>Editar perfil de tutor</span><span className="text-gray-400">›</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} />}
    </DashboardLayout>
  )
}
