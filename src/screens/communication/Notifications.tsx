import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge, EmptyState, PageHeader } from '@/components/ui'
import { NOTIFICATIONS, type AppNotification } from '@/data/notifications'

export default function Notifications(props: NavProps) {
  // Solo el recorrido de invitado conserva las notificaciones de ejemplo.
  const [items, setItems] = useState<AppNotification[]>(props.isAuthenticated ? [] : NOTIFICATIONS)
  const [tab, setTab] = useState<'all' | 'unread'>('all')

  const unread = items.filter((item) => item.unread).length
  const visible = tab === 'unread' ? items.filter((item) => item.unread) : items

  const markAll = () => setItems((prev) => prev.map((item) => ({ ...item, unread: false })))

  const openNotification = (item: AppNotification) => {
    setItems((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, unread: false } : entry)))
    if (item.kind === 'request') props.navigate('tutor-requests')
    else if (item.kind === 'confirmed' || item.kind === 'reminder') props.navigate('virtual-session')
    else if (item.kind === 'available') props.navigate('available-now')
    else if (item.kind === 'message') props.navigate('messages')
    else if (item.kind === 'review') props.navigate('rating')
  }

  return (
    <DashboardLayout {...props} activeScreen="notifications">
      <div className="mx-auto max-w-3xl p-5 sm:p-6 lg:p-8">
        <PageHeader
          title="Notificaciones"
          subtitle={unread > 0 ? `Tienes ${unread} notificaciones sin leer.` : 'Estás al día con tus notificaciones.'}
          action={
            <button onClick={markAll} className="text-sm font-500 text-[#5548C8] hover:underline">
              Marcar todas como leídas
            </button>
          }
        />

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTab('all')}
            className={`rounded-full px-4 py-2 text-sm font-500 ${tab === 'all' ? 'bg-[#5548C8] text-white' : 'bg-[#FFFDF8] text-gray-600 border border-[#E4DAC6]'}`}
          >
            Todas ({items.length})
          </button>
          <button
            onClick={() => setTab('unread')}
            className={`rounded-full px-4 py-2 text-sm font-500 ${tab === 'unread' ? 'bg-[#5548C8] text-white' : 'bg-[#FFFDF8] text-gray-600 border border-[#E4DAC6]'}`}
          >
            Sin leer ({unread})
          </button>
        </div>

        {visible.length === 0 ? (
          <EmptyState icon="🔔" title="No tienes notificaciones nuevas" description="Cuando un tutor confirme una sesión o recibas un mensaje, lo verás aquí." />
        ) : (
          <div className="space-y-2">
            {visible.map((item) => (
              <button
                key={item.id}
                onClick={() => openNotification(item)}
                className={`w-full rounded-2xl border p-4 text-left transition-all hover:shadow-sm ${
                  item.unread ? 'border-indigo-100 bg-[#FFFDF8]' : 'border-[#EAE1CD] bg-gray-50/60'
                }`}
              >
                <div className="flex gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${item.unread ? 'bg-indigo-50' : 'bg-gray-100'}`}>
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className={`text-sm ${item.unread ? 'font-700 text-[#221A3A]' : 'font-500 text-[#3A3348]'}`}>{item.title}</span>
                      <span className="shrink-0 text-[10px] text-gray-400">{item.time}</span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-gray-500">{item.body}</span>
                    {item.action && <span className="mt-2 inline-block text-xs font-600 text-[#5548C8]">{item.action} →</span>}
                  </span>
                  {item.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5548C8]" aria-label="No leída" />}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-[#EAE1CD] bg-[#FFFDF8] p-3 text-xs text-gray-500">
          <Badge variant="primary">Consejo</Badge>
          Puedes configurar qué notificaciones recibir desde Perfil y ajustes.
          <button onClick={() => props.navigate('profile-settings')} className="font-500 text-[#5548C8] hover:underline">Configurar</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
