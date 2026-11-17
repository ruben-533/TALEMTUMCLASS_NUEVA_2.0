import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge, EmptyState, Modal, PageHeader, Toast } from '@/components/ui'
import { TUTOR_REQUESTS, type RequestStatus } from '@/data/requests'
import { formatCOP } from '@/lib/format'

const statusVariant: Record<RequestStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'danger',
}

const statusLabel: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Confirmada',
  rejected: 'Rechazada',
}

export default function TutorRequests(props: NavProps) {
  // Solo el invitado ve solicitudes de ejemplo.
  const source = props.isAuthenticated ? [] : TUTOR_REQUESTS
  const [states, setStates] = useState<Record<number, RequestStatus>>(
    Object.fromEntries(source.map((request) => [request.id, 'pending'])),
  )
  const [tab, setTab] = useState<'pending' | 'all'>('pending')
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const [toast, setToast] = useState('')

  const pendingRequests = source.filter((request) => states[request.id] === 'pending')
  const visible = tab === 'pending' ? pendingRequests : source

  const accept = (id: number) => {
    setStates((prev) => ({ ...prev, [id]: 'accepted' }))
    setToast('Tutoría confirmada. El estudiante recibirá una notificación.')
    window.setTimeout(() => setToast(''), 3000)
  }

  const confirmReject = () => {
    if (rejectId === null) return
    setStates((prev) => ({ ...prev, [rejectId]: 'rejected' }))
    setRejectId(null)
    setReason('')
    setToast('Solicitud rechazada. Puedes escribirle al estudiante si quieres explicar el motivo.')
    window.setTimeout(() => setToast(''), 3000)
  }

  return (
    <DashboardLayout {...props} activeScreen="tutor-requests">
      <div className="mx-auto max-w-3xl p-5 sm:p-6 lg:p-8">
        <PageHeader
          title="Solicitudes de tutoría"
          subtitle={`${pendingRequests.length} solicitud${pendingRequests.length === 1 ? '' : 'es'} esperando respuesta.`}
          action={pendingRequests.length > 0 ? <Badge variant="warning" dot>{pendingRequests.length} pendientes</Badge> : <Badge variant="success">Todo al día</Badge>}
        />

        <div className="mb-4 flex gap-2">
          <button onClick={() => setTab('pending')} className={`rounded-full px-4 py-2 text-sm font-500 ${tab === 'pending' ? 'bg-[#5548C8] text-white' : 'border border-[#E4DAC6] bg-[#FFFDF8] text-gray-600'}`}>
            Pendientes ({pendingRequests.length})
          </button>
          <button onClick={() => setTab('all')} className={`rounded-full px-4 py-2 text-sm font-500 ${tab === 'all' ? 'bg-[#5548C8] text-white' : 'border border-[#E4DAC6] bg-[#FFFDF8] text-gray-600'}`}>
            Todas ({source.length})
          </button>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No tienes solicitudes pendientes"
            description="Cuando un estudiante solicite una tutoría, aparecerá aquí para que puedas aceptarla o rechazarla."
            action={<button onClick={() => props.navigate('tutor-availability')} className="rounded-xl bg-[#5548C8] px-5 py-3 text-sm font-600 text-white hover:bg-[#4338CA]">Revisar mi disponibilidad</button>}
          />
        ) : (
          <div className="space-y-3">
            {visible.map((request) => {
              const status = states[request.id]
              return (
                <div key={request.id} className={`rounded-2xl border bg-[#FFFDF8] p-5 transition-all ${status === 'accepted' ? 'border-green-200' : status === 'rejected' ? 'border-[#EAE1CD] opacity-70' : 'border-[#EAE1CD]'}`}>
                  <div className="flex gap-4">
                    <img src={request.avatar} alt={request.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-600 text-[#221A3A]">{request.name}</p>
                          <p className="text-xs text-gray-500">{request.subject} · {request.level}</p>
                        </div>
                        <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>📅 {request.date}</span>
                        <span>🕐 {request.time}</span>
                        <span>{request.modality === 'Virtual' ? '💻' : '📍'} {request.modality}</span>
                        <span className="font-600 text-[#3A3348]">{formatCOP(request.price)}</span>
                      </div>

                      <p className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-xs italic text-gray-600">"{request.message}"</p>

                      {status === 'pending' && (
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => accept(request.id)} className="flex-1 rounded-xl bg-[#5548C8] py-2.5 text-sm font-600 text-white hover:bg-[#4338CA]">
                            Aceptar
                          </button>
                          <button onClick={() => setRejectId(request.id)} className="flex-1 rounded-xl border border-[#E4DAC6] py-2.5 text-sm font-500 text-[#3A3348] hover:bg-gray-50">
                            Rechazar
                          </button>
                        </div>
                      )}

                      {status === 'accepted' && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button onClick={() => props.navigate('virtual-session')} className="rounded-xl bg-[#5548C8] px-4 py-2 text-xs font-600 text-white hover:bg-[#4338CA]">Ver tutoría</button>
                          <button onClick={() => props.navigate('messages')} className="rounded-xl border border-[#E4DAC6] px-4 py-2 text-xs font-500 text-gray-600 hover:bg-gray-50">Enviar mensaje</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Modal
        open={rejectId !== null}
        title="¿Por qué rechazas esta solicitud?"
        onClose={() => setRejectId(null)}
        footer={
          <>
            <button onClick={() => setRejectId(null)} className="flex-1 rounded-xl border border-[#E4DAC6] py-3 text-sm font-500 text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button onClick={confirmReject} className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-600 text-white hover:bg-red-600">Rechazar solicitud</button>
          </>
        }
      >
        <p>El motivo es opcional y ayuda al estudiante a entender tu decisión.</p>
        <textarea
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Ej. No tengo disponibilidad en ese horario..."
          className="mt-3 w-full resize-none rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8]"
        />
      </Modal>

      {toast && <Toast message={toast} />}
    </DashboardLayout>
  )
}
