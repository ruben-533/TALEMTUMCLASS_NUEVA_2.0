import type { NavProps } from '@/app/navigation'
import { Badge, Logo, Stars } from '@/components/ui'

const colors = [
  { name: 'Primary', value: '#5548C8', className: 'bg-[#5548C8]' },
  { name: 'Primary dark', value: '#4338CA', className: 'bg-[#4338CA]' },
  { name: 'Primary light', value: '#EFEDFC', className: 'bg-[#EFEDFC]' },
  { name: 'Accent', value: '#0EA5E9', className: 'bg-[#0EA5E9]' },
  { name: 'Success', value: '#10B981', className: 'bg-[#10B981]' },
  { name: 'Warning', value: '#F59E0B', className: 'bg-[#F59E0B]' },
  { name: 'Danger', value: '#EF4444', className: 'bg-[#EF4444]' },
  { name: 'Surface', value: '#F7F3E9', className: 'bg-[#F7F3E9] border border-[#E4DAC6]' },
]

const typeScale = [
  { name: 'Display', className: 'text-4xl font-800', sample: 'Aprende sin límites' },
  { name: 'H1', className: 'text-3xl font-700', sample: 'Encuentra tu tutor ideal' },
  { name: 'H2', className: 'text-2xl font-700', sample: 'Tutores recomendados' },
  { name: 'H3', className: 'text-xl font-600', sample: 'Laura Martínez' },
  { name: 'H4', className: 'text-lg font-600', sample: 'Cálculo diferencial' },
  { name: 'Body', className: 'text-base', sample: 'Aprende de expertos y alcanza tus objetivos.' },
  { name: 'Body Small', className: 'text-sm text-gray-600', sample: 'Reserva tu sesión en menos de un minuto.' },
  { name: 'Caption', className: 'text-xs text-gray-400', sample: 'Actualizado hace 5 minutos' },
  { name: 'Button', className: 'text-sm font-600', sample: 'Reservar tutoría' },
  { name: 'Label', className: 'text-xs font-600 uppercase tracking-wider', sample: 'Correo electrónico' },
]

export default function DesignSystem({ navigate }: NavProps) {
  return (
    <div className="min-h-full bg-[#FFFDF8]">
      <header className="sticky top-0 z-20 border-b border-[#EAE1CD] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => navigate('landing')} aria-label="Ir a la landing"><Logo size="sm" /></button>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('screens')} className="rounded-xl border border-[#E4DAC6] px-3 py-2 text-xs font-500 text-gray-600 hover:bg-gray-50">🗂️ Mapa de pantallas</button>
            <button onClick={() => navigate('landing')} className="rounded-xl bg-[#5548C8] px-3 py-2 text-xs font-600 text-white hover:bg-[#4338CA]">Volver a la app</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-600 uppercase tracking-widest text-[#5548C8]">Design system</p>
          <h1 className="mt-1 text-3xl font-800 text-[#221A3A]">Una base visual consistente</h1>
          <p className="mt-2 text-gray-500">
            Colores, tipografía y componentes reutilizables que mantienen la misma experiencia en web y móvil.
            Todos los elementos están implementados con Tailwind CSS y componentes de React.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-700 text-[#221A3A]">1. Paleta de color</h2>
          <p className="mt-1 text-sm text-gray-500">Azul-violeta como color principal, con estados accesibles y fondos claros.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {colors.map((color) => (
              <div key={color.name} className="overflow-hidden rounded-2xl border border-[#EAE1CD]">
                <div className={`h-20 ${color.className}`} />
                <div className="p-3">
                  <p className="text-sm font-600 text-[#221A3A]">{color.name}</p>
                  <p className="text-xs text-gray-400">{color.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-700 text-[#221A3A]">2. Tipografía · Inter</h2>
          <div className="mt-4 divide-y divide-gray-100 rounded-2xl border border-[#EAE1CD]">
            {typeScale.map((item) => (
              <div key={item.name} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-6">
                <span className="w-24 shrink-0 text-xs font-500 text-gray-400">{item.name}</span>
                <span className={`${item.className} text-[#221A3A]`}>{item.sample}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-700 text-[#221A3A]">3. Botones</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-[#EAE1CD] p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-2 text-xs text-gray-400">Primary</p>
              <button className="w-full rounded-xl bg-[#5548C8] py-3 text-sm font-600 text-white hover:bg-[#4338CA]">Reservar tutoría</button>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-400">Secondary</p>
              <button className="w-full rounded-xl border border-[#E4DAC6] py-3 text-sm font-500 text-[#3A3348] hover:bg-gray-50">Ver perfil</button>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-400">Ghost</p>
              <button className="w-full rounded-xl py-3 text-sm font-500 text-[#5548C8] hover:bg-indigo-50">Cancelar</button>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-400">Disabled</p>
              <button disabled className="w-full cursor-not-allowed rounded-xl bg-[#5548C8] py-3 text-sm font-600 text-white opacity-40">Continuar</button>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-400">Loading</p>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5548C8] py-3 text-sm font-600 text-white">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Guardando...
              </button>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-400">Success</p>
              <button className="w-full rounded-xl bg-green-500 py-3 text-sm font-600 text-white">Confirmar</button>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-400">Danger</p>
              <button className="w-full rounded-xl bg-red-500 py-3 text-sm font-600 text-white">Rechazar</button>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-400">Focus</p>
              <button className="w-full rounded-xl bg-[#5548C8] py-3 text-sm font-600 text-white outline outline-[3px] outline-offset-2 outline-[#5548C8]/30">Con foco</button>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-700 text-[#221A3A]">4. Formularios</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-[#EAE1CD] p-5 sm:grid-cols-2">
            <div>
              <label htmlFor="demo-email" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Correo electrónico</label>
              <input id="demo-email" placeholder="tu@correo.com" className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10" />
              <p className="mt-1 text-xs text-gray-400">Nunca compartiremos tu correo.</p>
            </div>
            <div>
              <label htmlFor="demo-error" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Contraseña</label>
              <input id="demo-error" type="password" placeholder="••••••••" className="w-full rounded-xl border border-red-300 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
              <p className="mt-1 text-xs text-red-500">La contraseña debe tener al menos 8 caracteres.</p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="demo-search" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Buscador</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#E4DAC6] px-4 py-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input id="demo-search" placeholder="¿Qué quieres aprender?" className="w-full bg-transparent text-sm outline-none" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-700 text-[#221A3A]">5. Badges y estados</h2>
          <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-[#EAE1CD] p-5">
            <Badge variant="primary" dot>Disponible ahora</Badge>
            <Badge variant="success" dot>Confirmada</Badge>
            <Badge variant="warning" dot>Pendiente</Badge>
            <Badge variant="danger">Cancelada</Badge>
            <Badge variant="info">Verificado</Badge>
            <Badge variant="neutral">Sin disponibilidad</Badge>
            <Badge>Nuevo</Badge>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">✅ Tutoría reservada correctamente.</div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">⚠️ Este horario ya está ocupado.</div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">❌ No pudimos procesar tu solicitud.</div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-700 text-[#221A3A]">6. Estrellas y tarjetas</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#EAE1CD] p-5">
              <p className="text-sm font-500 text-[#3A3348]">Rating</p>
              <div className="mt-2 space-y-2">
                <Stars rating={5} size="lg" showValue reviews={127} />
                <Stars rating={4} size="md" showValue reviews={89} />
                <Stars rating={3} size="sm" />
              </div>
            </div>
            <div className="rounded-2xl border border-[#EAE1CD] p-5">
              <p className="text-sm font-500 text-[#3A3348]">Tutor card</p>
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#EAE1CD] p-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" alt="Laura" className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-600 text-[#221A3A]">Laura Martínez</p>
                  <p className="text-xs text-gray-500">Matemáticas · Física</p>
                  <Stars rating={5} reviews={127} />
                </div>
                <span className="text-sm font-700 text-[#221A3A]">$40.000</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-700 text-[#221A3A]">7. Estados de pantalla</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#EAE1CD] p-5 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-[#5548C8]" />
              <p className="text-sm font-500 text-[#3A3348]">Cargando tutores...</p>
            </div>
            <div className="rounded-2xl border border-[#EAE1CD] p-5 text-center">
              <div className="text-3xl">🔍</div>
              <p className="mt-2 text-sm font-600 text-[#221A3A]">No encontramos tutores</p>
              <p className="text-xs text-gray-500">Intenta ampliar tu búsqueda.</p>
            </div>
            <div className="rounded-2xl border border-[#EAE1CD] p-5 text-center">
              <div className="text-3xl">🟢</div>
              <p className="mt-2 text-sm font-600 text-[#221A3A]">Disponible ahora</p>
              <p className="text-xs text-gray-500">Listo para recibir estudiantes.</p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-[#F7F3E9] p-6">
          <h2 className="text-lg font-700 text-[#221A3A]">Buenas prácticas aplicadas</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
            {[
              'Contraste AA en textos y botones.',
              'Áreas táctiles de al menos 44 × 44 px en móvil.',
              'Estados visibles: hover, focus, disabled, loading.',
              'Mensajes de error junto al campo que los origina.',
              'No se comunica estado solo con color: se agregan iconos y texto.',
              'Navegación consistente entre desktop y móvil.',
            ].map((item) => (
              <p key={item} className="flex gap-2"><span className="text-green-500">✓</span>{item}</p>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
