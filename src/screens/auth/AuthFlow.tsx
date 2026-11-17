import { useState } from 'react'
import type { Screen } from '@/app/navigation'
import { AuthError, loginUser, registerUser, type AuthUser, type FieldError } from '@/lib/auth'
import logo from '@/assets/logo.png'

interface Props {
  screen: 'login' | 'register' | 'role-select'
  navigate: (s: Screen) => void
  onRole: (r: 'student' | 'tutor') => void
  onAuth: (user: AuthUser, flow: 'login' | 'register') => void
}

export default function AuthFlow({ screen, navigate, onRole, onAuth }: Props) {
  const [form, setForm] = useState({ name: '', lastName: '', email: '', password: '', confirm: '' })
  const [resetSent, setResetSent] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // El paso vive en el hash (#/login, #/register, #/role-select) para que
  // atrás/adelante y los enlaces directos funcionen.
  const step = screen

  const applyError = (err: unknown) => {
    if (err instanceof AuthError) {
      setError(err.message)
      const next: Record<string, string> = {}
      for (const item of err.errors as FieldError[]) {
        if (item?.field) next[item.field] = item.message
      }
      setFieldErrors(next)
    } else {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (form.password !== form.confirm) {
      setFieldErrors({ confirm: 'Las contraseñas no coinciden.' })
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      const user = await registerUser({
        nombre: form.name,
        apellido: form.lastName,
        email: form.email,
        password: form.password,
      })
      onAuth(user, 'register')
    } catch (err) {
      applyError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      const user = await loginUser(form.email, form.password)
      onAuth(user, 'login')
    } catch (err) {
      applyError(err)
    } finally {
      setLoading(false)
    }
  }

  const fieldError = (field: string) =>
    fieldErrors[field] ? (
      <p className="mt-1 text-xs text-red-600" role="alert">
        {fieldErrors[field]}
      </p>
    ) : null

  return (
    <div className="min-h-full flex">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 text-white"
        style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #5548C8 100%)' }}
      >
        <button onClick={() => navigate('landing')} className="flex items-center gap-2 w-fit">
          <img src={logo} alt="TALEMTUMCLASS" className="h-10 w-auto object-contain brightness-200" />
          <span className="font-700 text-lg">TALEMTUMCLASS</span>
        </button>

        <div>
          <h2 className="text-4xl font-700 leading-tight mb-4">
            Aprende con los mejores tutores de Colombia.
          </h2>
          <p className="text-white/60 leading-relaxed mb-8">
            Más de 1,200 tutores verificados listos para ayudarte a alcanzar tus metas.
          </p>

          <div className="space-y-4">
            {[
              { icon: '✅', text: 'Tutores verificados y calificados' },
              { icon: '📅', text: 'Agenda a tu ritmo, cuando quieras' },
              { icon: '💻', text: 'Virtual o presencial, tú decides' },
              { icon: '🤖', text: 'Recomendaciones personalizadas con IA' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-white/80">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&auto=format"
            alt="Laura Martínez"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-white/80 italic">"Con TALEMTUMCLASS aprobé cálculo diferencial. ¡Increíble experiencia!"</p>
            <p className="text-xs text-white/50 mt-1">— Mariana P., Ingeniería de Sistemas</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FFFDF8] px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <button onClick={() => navigate('landing')} className="flex items-center gap-2 mb-10 lg:hidden">
            <img src={logo} alt="TALEMTUMCLASS" className="h-9 w-auto object-contain" />
            <span className="font-700 text-[#221A3A]">TALEMTUMCLASS</span>
          </button>

          {/* LOGIN */}
          {step === 'login' && (
            <>
              <h1 className="text-2xl font-700 text-[#221A3A] mb-1">Bienvenido de vuelta</h1>
              <p className="text-gray-500 text-sm mb-8">Ingresa a tu cuenta para continuar</p>

              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="login-email" className="block text-sm font-500 text-[#3A3348] mb-1.5">Correo electrónico</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    className="w-full border border-[#E4DAC6] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10 transition-all"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {fieldError('email')}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="text-sm font-500 text-[#3A3348]">Contraseña</label>
                    <button
                      type="button"
                      onClick={() => setResetSent(true)}
                      className="text-xs text-[#5548C8] hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full border border-[#E4DAC6] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10 transition-all"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  {fieldError('password')}
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">
                    {error}
                  </div>
                )}

                {resetSent && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800" role="status">
                    La recuperación automática de contraseña estará disponible próximamente. Por ahora, escribe a
                    soporte@talemtumclass.com.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5548C8] text-white font-600 py-3 rounded-xl hover:bg-[#4338CA] transition-colors mt-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Verificando...' : 'Iniciar sesión'}
                </button>

                <div className="relative flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">o explora sin cuenta</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button type="button" onClick={() => navigate('role-select')} className="w-full flex items-center justify-center gap-3 border border-[#E4DAC6] rounded-xl py-3 text-sm font-500 text-[#3A3348] hover:bg-gray-50 transition-colors">
                  Ver la demo como invitado
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                ¿No tienes cuenta?{' '}
                <button onClick={() => navigate('register')} className="text-[#5548C8] font-500 hover:underline">
                  Crear cuenta
                </button>
              </p>
            </>
          )}

          {/* REGISTER */}
          {step === 'register' && (
            <>
              <h1 className="text-2xl font-700 text-[#221A3A] mb-1">Crea tu cuenta</h1>
              <p className="text-gray-500 text-sm mb-8">Únete a más de 8,500 estudiantes</p>

              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="register-name" className="block text-sm font-500 text-[#3A3348] mb-1.5">Nombre</label>
                    <input
                      id="register-name"
                      type="text"
                      required
                      autoComplete="given-name"
                      placeholder="Carlos"
                      className="w-full border border-[#E4DAC6] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10 transition-all"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {fieldError('nombre')}
                  </div>
                  <div>
                    <label htmlFor="register-lastname" className="block text-sm font-500 text-[#3A3348] mb-1.5">Apellido</label>
                    <input
                      id="register-lastname"
                      type="text"
                      required
                      autoComplete="family-name"
                      placeholder="López"
                      className="w-full border border-[#E4DAC6] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10 transition-all"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                    {fieldError('apellido')}
                  </div>
                </div>
                <div>
                  <label htmlFor="register-email" className="block text-sm font-500 text-[#3A3348] mb-1.5">Correo electrónico</label>
                  <input
                    id="register-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    className="w-full border border-[#E4DAC6] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10 transition-all"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {fieldError('email')}
                </div>
                <div>
                  <label htmlFor="register-password" className="block text-sm font-500 text-[#3A3348] mb-1.5">Contraseña</label>
                  <input
                    id="register-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres, una letra y un número"
                    className="w-full border border-[#E4DAC6] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10 transition-all"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  {fieldError('password')}
                </div>
                <div>
                  <label htmlFor="register-confirm" className="block text-sm font-500 text-[#3A3348] mb-1.5">Confirmar contraseña</label>
                  <input
                    id="register-confirm"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full border border-[#E4DAC6] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10 transition-all"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  />
                  {fieldError('confirm')}
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">
                    {error}
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Al registrarte aceptas nuestros{' '}
                  <a href="#" className="text-[#5548C8]">Términos de servicio</a> y{' '}
                  <a href="#" className="text-[#5548C8]">Política de privacidad</a>.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5548C8] text-white font-600 py-3 rounded-xl hover:bg-[#4338CA] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                ¿Ya tienes cuenta?{' '}
                <button onClick={() => navigate('login')} className="text-[#5548C8] font-500 hover:underline">
                  Iniciar sesión
                </button>
              </p>
            </>
          )}

          {/* ROLE SELECT */}
          {step === 'role-select' && (
            <>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <img src={logo} alt="TALEMTUMCLASS" className="h-14 w-auto object-contain" />
                </div>
                <h1 className="text-2xl font-700 text-[#221A3A] mb-2">¿Cómo quieres usar TALEMTUMCLASS?</h1>
                <p className="text-gray-500 text-sm">Elige tu rol para personalizar tu experiencia</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => onRole('student')}
                  className="w-full text-left border-2 border-[#E4DAC6] hover:border-[#5548C8] rounded-2xl p-6 transition-all group hover:bg-[#5548C8]/5"
                >
                  <div className="text-4xl mb-3">🎓</div>
                  <div className="font-700 text-[#221A3A] text-lg mb-1 group-hover:text-[#5548C8] transition-colors">Soy Estudiante</div>
                  <p className="text-sm text-gray-500">Quiero encontrar tutores y aprender nuevas habilidades.</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-600 text-[#5548C8]">
                    Continuar como estudiante →
                  </div>
                </button>

                <button
                  onClick={() => onRole('tutor')}
                  className="w-full text-left border-2 border-[#E4DAC6] hover:border-[#5548C8] rounded-2xl p-6 transition-all group hover:bg-[#5548C8]/5"
                >
                  <div className="text-4xl mb-3">👨‍🏫</div>
                  <div className="font-700 text-[#221A3A] text-lg mb-1 group-hover:text-[#5548C8] transition-colors">Soy Tutor</div>
                  <p className="text-sm text-gray-500">Quiero compartir mis conocimientos y enseñar a otros.</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-600 text-[#5548C8]">
                    Continuar como tutor →
                  </div>
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-6">
                Podrás cambiar tu rol más adelante desde configuración.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

