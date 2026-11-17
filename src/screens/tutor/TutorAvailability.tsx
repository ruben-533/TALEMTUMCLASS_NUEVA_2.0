import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Modal, PageHeader, Toast } from '@/components/ui'

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const BOOKED = new Set(['Lun-10:00', 'Mar-14:00', 'Jue-15:00'])

type SlotState = 'available' | 'blocked'

function initialSlots(): Record<string, Record<string, SlotState>> {
  const result: Record<string, Record<string, SlotState>> = {}
  DAYS.forEach((day) => {
    result[day] = {}
    HOURS.forEach((hour) => {
      const isWeekend = day === 'Sáb'
      const morning = Number(hour.slice(0, 2)) < 12
      result[day][hour] = isWeekend ? 'blocked' : (day === 'Lun' || day === 'Jue' || day === 'Mar' || (day === 'Vie' && morning)) ? 'available' : 'blocked'
    })
  })
  return result
}

export default function TutorAvailability(props: NavProps) {
  const [slots, setSlots] = useState(initialSlots)
  const [durations, setDurations] = useState<number[]>([60])
  const [buffer, setBuffer] = useState('10')
  const [exceptionOpen, setExceptionOpen] = useState(false)
  const [exceptionDate, setExceptionDate] = useState('')
  const [exceptionReason, setExceptionReason] = useState('')
  const [exceptions, setExceptions] = useState<Array<{ date: string; reason: string }>>([
    { date: '2026-09-15', reason: 'Congreso de educación' },
  ])
  const [toast, setToast] = useState('')

  const toggleSlot = (day: string, hour: string) => {
    if (BOOKED.has(`${day}-${hour}`)) return
    setSlots((prev) => ({
      ...prev,
      [day]: { ...prev[day], [hour]: prev[day][hour] === 'available' ? 'blocked' : 'available' },
    }))
  }

  const save = () => {
    setToast('Disponibilidad guardada correctamente.')
    window.setTimeout(() => setToast(''), 3000)
  }

  const addException = () => {
    if (!exceptionDate) return
    setExceptions((prev) => [...prev, { date: exceptionDate, reason: exceptionReason || 'Día no disponible' }])
    setExceptionOpen(false)
    setExceptionDate('')
    setExceptionReason('')
  }

  return (
    <DashboardLayout {...props} activeScreen="tutor-availability">
      <div className="mx-auto max-w-6xl p-5 sm:p-6 lg:p-8">
        <PageHeader
          title="Mi disponibilidad"
          subtitle="Define cuándo pueden reservar los estudiantes. Los horarios ocupados se bloquean automáticamente."
          action={
            <button onClick={save} className="rounded-xl bg-[#5548C8] px-5 py-3 text-sm font-600 text-white hover:bg-[#4338CA]">
              Guardar cambios
            </button>
          }
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-700 text-[#221A3A]">Semana del 1 al 6 de septiembre</h2>
                <p className="text-xs text-gray-400">Toca un horario para activarlo o bloquearlo.</p>
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[#5548C8]" /> Disponible</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-gray-100" /> Bloqueado</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-gray-300" /> Ocupado</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="w-12 text-left text-[10px] font-500 text-gray-400">Hora</th>
                    {DAYS.map((day) => (
                      <th key={day} className="text-center text-xs font-600 text-gray-600">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((hour) => (
                    <tr key={hour}>
                      <td className="pr-2 text-right text-[10px] text-gray-400">{hour}</td>
                      {DAYS.map((day) => {
                        const booked = BOOKED.has(`${day}-${hour}`)
                        const state = slots[day][hour]
                        return (
                          <td key={`${day}-${hour}`}>
                            <button
                              disabled={booked}
                              onClick={() => toggleSlot(day, hour)}
                              aria-label={`${day} ${hour}: ${booked ? 'ocupado' : state === 'available' ? 'disponible' : 'bloqueado'}`}
                              className={`h-8 w-full rounded-lg text-[9px] font-500 transition-colors ${
                                booked
                                  ? 'cursor-not-allowed bg-gray-300 text-gray-600'
                                  : state === 'available'
                                    ? 'bg-[#5548C8] text-white hover:bg-[#4338CA]'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              {booked ? 'Ocupado' : state === 'available' ? 'Libre' : '—'}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5">
              <h3 className="font-700 text-[#221A3A]">Duración de sesiones</h3>
              <div className="mt-3 flex gap-2">
                {[30, 60, 90].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setDurations((prev) => (prev.includes(duration) ? prev.filter((item) => item !== duration) : [...prev, duration]))}
                    className={`flex-1 rounded-xl border py-2.5 text-xs font-500 ${durations.includes(duration) ? 'border-[#5548C8] bg-[#5548C8] text-white' : 'border-[#E4DAC6] text-gray-600'}`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>

              <label htmlFor="buffer" className="mt-4 block text-sm font-500 text-[#3A3348]">Descanso entre sesiones</label>
              <select id="buffer" value={buffer} onChange={(event) => setBuffer(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#E4DAC6] px-3 py-2.5 text-sm outline-none focus:border-[#5548C8]">
                <option value="0">Sin descanso</option>
                <option value="10">10 minutos</option>
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
              </select>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                <div>
                  <p className="text-xs font-500 text-[#3A3348]">Repetir cada semana</p>
                  <p className="text-[10px] text-gray-400">Aplica esta disponibilidad todas las semanas</p>
                </div>
                <span className="flex h-6 w-10 items-center rounded-full bg-[#5548C8] p-1">
                  <span className="ml-auto h-4 w-4 rounded-full bg-[#FFFDF8]" />
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-700 text-[#221A3A]">Excepciones</h3>
                <button onClick={() => setExceptionOpen(true)} className="text-xs font-500 text-[#5548C8] hover:underline">+ Agregar</button>
              </div>
              <div className="mt-3 space-y-2">
                {exceptions.map((exception) => (
                  <div key={`${exception.date}-${exception.reason}`} className="rounded-xl bg-amber-50 px-3 py-2 text-xs">
                    <p className="font-600 text-amber-800">{exception.date}</p>
                    <p className="text-amber-700">{exception.reason}</p>
                  </div>
                ))}
                {exceptions.length === 0 && <p className="text-xs text-gray-400">No tienes excepciones configuradas.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-xs leading-relaxed text-[#5548C8]">
              💡 Los estudiantes solo pueden reservar en los horarios marcados como disponibles. Si aceptas una tutoría, el horario se bloquea automáticamente.
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={exceptionOpen}
        title="Agregar excepción"
        onClose={() => setExceptionOpen(false)}
        footer={
          <>
            <button onClick={() => setExceptionOpen(false)} className="flex-1 rounded-xl border border-[#E4DAC6] py-3 text-sm font-500 text-gray-600">Cancelar</button>
            <button onClick={addException} className="flex-1 rounded-xl bg-[#5548C8] py-3 text-sm font-600 text-white">Agregar</button>
          </>
        }
      >
        <label htmlFor="exception-date" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Fecha</label>
        <input id="exception-date" type="date" value={exceptionDate} onChange={(event) => setExceptionDate(event.target.value)} className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8]" />
        <label htmlFor="exception-reason" className="mb-1.5 mt-3 block text-sm font-500 text-[#3A3348]">Motivo (opcional)</label>
        <input id="exception-reason" value={exceptionReason} onChange={(event) => setExceptionReason(event.target.value)} placeholder="Ej. Viaje, feriado, compromiso personal..." className="w-full rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8]" />
      </Modal>

      {toast && <Toast message={toast} />}
    </DashboardLayout>
  )
}
