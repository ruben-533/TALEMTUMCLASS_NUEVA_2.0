import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge, PageHeader } from '@/components/ui'
import { UPCOMING_SESSION } from '@/data/sessions'

export default function InPersonSession(props: NavProps) {
  const tutor = props.selectedTutor
  const location = `${tutor.location} · lugar acordado con el tutor`

  return (
    <DashboardLayout {...props} activeScreen="inperson-session">
      <div className="mx-auto max-w-5xl p-5 sm:p-6 lg:p-8">
        <PageHeader
          title="Tutoría presencial"
          subtitle="Revisa los detalles del encuentro y coordina con tu tutor."
          action={<Badge variant="success" dot>Confirmada</Badge>}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <img src={tutor.avatar} alt={tutor.name} className="h-20 w-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h2 className="text-lg font-700 text-[#221A3A]">{tutor.name}</h2>
                  <p className="text-sm text-gray-500">{tutor.subject}</p>
                  <div className="mt-1 text-xs text-gray-400">📍 {tutor.location} · {tutor.experience} de experiencia</div>
                </div>
                <div className="rounded-xl bg-[#F7F3E9] px-4 py-3 text-sm">
                  <p className="text-xs text-gray-400">Estudiante</p>
                  <p className="font-600 text-[#221A3A]">{props.userName}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-50 pt-5 sm:grid-cols-4">
                {[
                  ['Fecha', UPCOMING_SESSION.date],
                  ['Hora', UPCOMING_SESSION.time],
                  ['Duración', '60 minutos'],
                  ['Modalidad', '📍 Presencial'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-600 text-[#2B2140]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8]">
              <div className="relative h-56 bg-[#E8EAF6] sm:h-72">
                <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(#c7cbe8 1px, transparent 1px), linear-gradient(90deg, #c7cbe8 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[#5548C8] text-xl shadow-lg">📍</div>
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-sm backdrop-blur">
                  <p className="text-sm font-600 text-[#221A3A]">{location}</p>
                  <p className="mt-0.5 text-xs text-gray-500">Punto de encuentro acordado · 10 min antes</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4 sm:flex-row">
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-xl bg-[#5548C8] py-3 text-center text-sm font-600 text-white hover:bg-[#4338CA]"
                >
                  Ver ubicación
                </a>
                <button onClick={() => props.navigate('messages')} className="flex-1 rounded-xl border border-[#E4DAC6] py-3 text-sm font-500 text-[#3A3348] hover:bg-gray-50">
                  Contactar tutor
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5">
              <h3 className="font-700 text-[#221A3A]">Antes de tu sesión</h3>
              <ul className="mt-3 space-y-3 text-sm text-gray-600">
                {[
                  'Lleva tus apuntes y dudas anotadas.',
                  'Llega 10 minutos antes al punto de encuentro.',
                  'Confirma con el tutor por mensaje si hay algún cambio.',
                  'Lleva tu computador si la sesión lo requiere.',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <h3 className="font-700 text-[#221A3A]">Información de contacto</h3>
              <p className="mt-2 text-sm text-gray-600">{tutor.name}</p>
              <p className="text-sm text-gray-600">{tutor.location}</p>
              <button onClick={() => props.navigate('messages')} className="mt-3 w-full rounded-xl bg-[#FFFDF8] py-2.5 text-sm font-500 text-[#5548C8] hover:bg-indigo-100">
                Enviar mensaje
              </button>
            </div>

            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5">
              <h3 className="font-700 text-[#221A3A]">Estado de la tutoría</h3>
              <div className="mt-3 space-y-3 text-xs">
                {[
                  ['Reserva confirmada', true],
                  ['Recordatorio enviado', true],
                  ['Sesión en curso', false],
                  ['Valoración pendiente', false],
                ].map(([label, done]) => (
                  <div key={String(label)} className="flex items-center gap-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{done ? '✓' : '·'}</span>
                    <span className={done ? 'text-[#3A3348]' : 'text-gray-400'}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
