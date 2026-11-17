import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  createReservation,
  formatReservationDate,
  shortDayLabel,
  upcomingDays,
  type Reservation,
} from '@/lib/bookings'

const SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
const UNAVAILABLE = ['11:00', '15:00']

type Modality = 'virtual' | 'presencial' | null

export default function BookingFlow(props: NavProps) {
  const tutor = props.selectedTutor
  const days = upcomingDays(7)
  const [step, setStep] = useState(1)
  const [modality, setModality] = useState<Modality>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [duration, setDuration] = useState(60)
  const [confirmed, setConfirmed] = useState(false)
  const [booking, setBooking] = useState<Reservation | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const price = modality === 'presencial' ? tutor.pricePresencial : tutor.price
  const total = price * (duration / 60)
  const materia = tutor.specialty || tutor.subject

  const monthLabel = new Date(days[0]).toLocaleDateString('es-CO', {
    month: 'long',
    year: 'numeric',
  })
  const monthTitle = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  const steps = ['Modalidad', 'Fecha', 'Horario', 'Confirmar']

  const confirm = async () => {
    if (!modality || !selectedDay || !selectedSlot) return
    setError('')

    // El invitado recorre la demo sin guardar nada.
    if (!props.isAuthenticated) {
      setBooking(null)
      setConfirmed(true)
      return
    }

    setSaving(true)
    try {
      const created = await createReservation({
        tutorId: tutor.id,
        tutorNombre: tutor.name,
        tutorAvatar: tutor.avatar,
        materia,
        nivel: tutor.level,
        modalidad: modality,
        fecha: selectedDay,
        hora: selectedSlot,
        duracion: duration,
        precio: total,
      })
      setBooking(created)
      props.setActiveBooking(created)
      setConfirmed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la reserva.')
    } finally {
      setSaving(false)
    }
  }

  if (confirmed) {
    const view = booking
    const shownDate = view ? formatReservationDate(view.fecha) : selectedDay ? formatReservationDate(selectedDay) : 'Por confirmar'
    const shownTime = view ? view.hora : selectedSlot
    const shownDuration = view ? view.duracion : duration
    const shownModality = view ? view.modalidad : modality

    return (
      <DashboardLayout {...props} activeScreen="booking">
        <div className="flex items-center justify-center min-h-full p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-700 text-[#221A3A] mb-2">¡Tutoría reservada! 🎉</h1>
            <p className="text-gray-500 mb-8">
              {view
                ? `${tutor.name} ya tiene tu sesión agendada. Puedes verla en tu inicio y en tu historial.`
                : 'Esta es una reserva de demostración: en una cuenta real quedará guardada en tu historial.'}
            </p>

            <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#EAE1CD] text-left mb-6 space-y-3">
              {[
                ['Tutor', tutor.name],
                ['Materia', materia],
                ['Modalidad', shownModality === 'virtual' ? '💻 Virtual' : '📍 Presencial'],
                ['Fecha', shownDate],
                ['Hora', `${shownTime ?? '10:00'} — ${shownDuration} min`],
                ['Total', `$${total.toLocaleString()} COP`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-600 text-[#221A3A] text-right max-w-[60%]">{v}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => props.navigate(shownModality === 'presencial' ? 'inperson-session' : 'virtual-session')}
              className="w-full bg-[#5548C8] text-white font-600 py-4 rounded-xl hover:bg-[#4338CA] transition-colors"
            >
              Ver mi tutoría
            </button>
            <button
              onClick={() => props.navigate('history')}
              className="w-full mt-2 border border-[#E4DAC6] text-[#3A3348] font-500 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Ver mi historial
            </button>
            <button
              onClick={() => props.navigate('search')}
              className="w-full mt-2 text-gray-500 py-3 text-sm hover:text-[#5548C8] transition-colors"
            >
              Buscar más tutores
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout {...props} activeScreen="booking">
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={() => step > 1 ? setStep(step - 1) : props.navigate('tutor-profile')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5548C8] transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {step > 1 ? 'Paso anterior' : 'Volver al perfil'}
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-700 transition-all ${
                  i + 1 < step ? 'bg-green-500 text-white' :
                  i + 1 === step ? 'bg-[#5548C8] text-white' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i + 1 < step ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-xs font-500 hidden md:block ${i + 1 === step ? 'text-[#5548C8]' : 'text-gray-400'}`}>{s}</span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <h1 className="text-xl font-700 text-[#221A3A]">
            {step === 1 && 'Selecciona modalidad'}
            {step === 2 && 'Selecciona fecha'}
            {step === 3 && 'Selecciona horario'}
            {step === 4 && 'Confirma tu reserva'}
          </h1>
        </div>

        {/* Tutor mini card */}
        <div className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#EAE1CD] flex items-center gap-4 mb-6">
          <img src={tutor.avatar} alt={tutor.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-600 text-[#221A3A]">{tutor.name}</p>
            <p className="text-xs text-gray-500">{tutor.subject}</p>
          </div>
        </div>

        {/* STEP 1 — Modality */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="text-sm font-500 text-[#3A3348] block mb-2">Duración de la sesión</label>
              <div className="flex gap-2">
                {[30, 60, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2 rounded-xl border text-sm font-500 transition-all ${
                      duration === d ? 'bg-[#5548C8] text-white border-[#5548C8]' : 'border-[#E4DAC6] text-[#3A3348] hover:border-[#5548C8]'
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {[
              { value: 'virtual' as Modality, icon: '💻', label: 'Virtual', desc: 'Sesión por videollamada con pantalla compartida', price: tutor.price },
              { value: 'presencial' as Modality, icon: '📍', label: 'Presencial', desc: `Encuentro en ${tutor.location}`, price: tutor.pricePresencial },
            ].filter(({ value }) => value === 'virtual' || tutor.modalities.includes('Presencial')).map((opt) => (
              <button
                key={opt.value!}
                onClick={() => setModality(opt.value)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                  modality === opt.value
                    ? 'border-[#5548C8] bg-indigo-50'
                    : 'border-[#E4DAC6] hover:border-[#5548C8]/40 bg-[#FFFDF8]'
                }`}
              >
                <span className="text-3xl">{opt.icon}</span>
                <div className="flex-1">
                  <p className={`font-700 ${modality === opt.value ? 'text-[#5548C8]' : 'text-[#221A3A]'}`}>{opt.label}</p>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </div>
                <div className="text-right">
                  <p className="font-700 text-[#221A3A]">${opt.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">/hora</p>
                </div>
              </button>
            ))}

            <button
              disabled={!modality}
              onClick={() => setStep(2)}
              className="w-full mt-2 bg-[#5548C8] text-white font-600 py-4 rounded-xl hover:bg-[#4338CA] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}

        {/* STEP 2 — Date */}
        {step === 2 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">{monthTitle} · próximos 7 días</p>
            <div className="grid grid-cols-4 gap-2 mb-6 sm:grid-cols-7">
              {days.map((iso) => {
                const [day] = shortDayLabel(iso).split(' ')
                const label = shortDayLabel(iso)
                const dayNumber = label.split(' ')[1]
                return (
                  <button
                    key={iso}
                    onClick={() => setSelectedDay(iso)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all border ${
                      selectedDay === iso
                        ? 'bg-[#5548C8] text-white border-[#5548C8]'
                        : 'bg-[#FFFDF8] text-[#3A3348] border-[#E4DAC6] hover:border-[#5548C8]'
                    }`}
                  >
                    <span className="text-[10px] opacity-70">{day}</span>
                    <span className="font-700">{dayNumber}</span>
                  </button>
                )
              })}
            </div>
            <button
              disabled={!selectedDay}
              onClick={() => setStep(3)}
              className="w-full bg-[#5548C8] text-white font-600 py-4 rounded-xl hover:bg-[#4338CA] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}

        {/* STEP 3 — Time slot */}
        {step === 3 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Horarios disponibles para {selectedDay ? formatReservationDate(selectedDay) : 'la fecha elegida'}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
              {SLOTS.map((slot) => {
                const unavail = UNAVAILABLE.includes(slot)
                return (
                  <button
                    key={slot}
                    disabled={unavail}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 rounded-xl text-sm font-500 border transition-all ${
                      unavail
                        ? 'border-[#EAE1CD] text-gray-300 bg-gray-50 cursor-not-allowed line-through'
                        : selectedSlot === slot
                          ? 'bg-[#5548C8] text-white border-[#5548C8]'
                          : 'bg-[#FFFDF8] border-[#E4DAC6] text-[#3A3348] hover:border-[#5548C8]'
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
            <button
              disabled={!selectedSlot}
              onClick={() => setStep(4)}
              className="w-full bg-[#5548C8] text-white font-600 py-4 rounded-xl hover:bg-[#4338CA] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}

        {/* STEP 4 — Confirm */}
        {step === 4 && (
          <div>
            <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#EAE1CD] mb-6 space-y-3">
              <h3 className="font-700 text-[#221A3A] mb-4">Resumen de tu reserva</h3>
              {[
                ['Tutor', tutor.name],
                ['Materia', materia],
                ['Modalidad', modality === 'virtual' ? '💻 Virtual' : '📍 Presencial'],
                ['Fecha', selectedDay ? formatReservationDate(selectedDay) : '—'],
                ['Hora', `${selectedSlot ?? '—'} · ${duration} minutos`],
                ...(modality === 'presencial' ? [['Ubicación', 'Bogotá — lugar por acordar con el tutor']] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-600 text-[#221A3A] text-right max-w-[60%]">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#F7F3E9] rounded-2xl p-5 border border-indigo-100 mb-6 flex items-center justify-between">
              <span className="font-700 text-[#221A3A]">Total a pagar</span>
              <span className="text-2xl font-700 text-[#5548C8]">${total.toLocaleString()} <span className="text-sm font-400 text-gray-400">COP</span></span>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={confirm}
              disabled={saving}
              className="w-full bg-[#5548C8] text-white font-700 py-4 rounded-xl hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando reserva...' : 'Confirmar y reservar'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              {props.isAuthenticated
                ? 'La sesión quedará guardada en tu historial inmediatamente.'
                : 'Modo demo: la reserva no se guarda. Inicia sesión para conservarla.'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
