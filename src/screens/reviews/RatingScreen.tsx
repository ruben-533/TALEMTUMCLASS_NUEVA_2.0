import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge, Stars } from '@/components/ui'
import { formatReservationDate, rateReservation } from '@/lib/bookings'

const TAGS = ['Explica claramente', 'Puntual', 'Buena comunicación', 'Domina el tema', 'Recomendaría este tutor']

export default function RatingScreen(props: NavProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [tags, setTags] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const booking = props.activeBooking
  const tutorName = booking?.tutorNombre ?? props.selectedTutor.name
  const tutorAvatar = booking?.tutorAvatar || props.selectedTutor.avatar
  const subject = booking?.materia ?? props.selectedTutor.subject
  const sessionLabel = booking
    ? `${formatReservationDate(booking.fecha)} · ${booking.hora}`
    : 'Sesión de prueba'

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))
  }

  const submit = async () => {
    if (rating === 0 || saving) return
    setError('')

    // Sin una reserva real (invitado) se mantiene el recorrido de demostración.
    if (!props.isAuthenticated || !booking) {
      setSubmitted(true)
      return
    }

    setSaving(true)
    try {
      const updated = await rateReservation(booking.id, rating, comment)
      props.setActiveBooking(updated)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar tu valoración.')
    } finally {
      setSaving(false)
    }
  }


  if (submitted) {
    return (
      <DashboardLayout {...props} activeScreen="rating">
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-up text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">⭐</div>
            <h1 className="text-2xl font-700 text-[#221A3A]">¡Gracias por tu valoración!</h1>
            <p className="mt-2 text-gray-500">
              Tu opinión ayuda a otros estudiantes a elegir mejor y actualiza la reputación de {tutorName}.
            </p>
            <div className="mt-5 rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5">
              <Stars rating={rating} size="lg" />
              <p className="mt-2 text-sm text-gray-600">"{comment || 'Excelente tutoría, muy clara y puntual.'}"</p>
            </div>
            <button
              onClick={() => props.navigate('history')}
              className="mt-6 w-full rounded-xl bg-[#5548C8] py-3.5 font-600 text-white hover:bg-[#4338CA]"
            >
              Ver mi historial
            </button>
            <button onClick={() => props.navigate('student-dashboard')} className="mt-3 text-sm text-gray-400 hover:text-[#5548C8]">
              Volver al inicio
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout {...props} activeScreen="rating">
      <div className="mx-auto max-w-xl p-5 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-6 sm:p-8">
          <div className="text-center">
            <img src={tutorAvatar} alt={tutorName} className="mx-auto h-16 w-16 rounded-full object-cover" />
            <h1 className="mt-3 text-xl font-700 text-[#221A3A]">¿Cómo fue tu experiencia?</h1>
            <p className="mt-1 text-sm text-gray-500">Tutoría de {subject} con {tutorName}</p>
            <div className="mt-1 text-xs text-gray-400">{sessionLabel}</div>
          </div>

          <div className="mt-6 flex justify-center gap-2" role="radiogroup" aria-label="Calificación">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                role="radio"
                aria-checked={rating === star}
                aria-label={`${star} estrellas`}
                className="rounded-lg p-1 transition-transform hover:scale-110"
              >
                <svg className={`h-10 w-10 ${star <= (hover || rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <p className="mt-1 text-center text-xs font-500 text-gray-500">
            {rating === 0 ? 'Selecciona una calificación' : rating === 5 ? '¡Increíble!' : rating >= 4 ? 'Muy buena' : rating === 3 ? 'Regular' : 'Podemos mejorar'}
          </p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-500 text-[#3A3348]">¿Qué destacarías?</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={tags.includes(tag)}
                  className={`rounded-full border px-3 py-2 text-xs transition-all ${tags.includes(tag) ? 'border-[#5548C8] bg-indigo-50 font-500 text-[#5548C8]' : 'border-[#E4DAC6] text-gray-600 hover:border-[#5548C8]'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="comment" className="mb-1.5 block text-sm font-500 text-[#3A3348]">Cuéntanos sobre tu experiencia</label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="¿Qué te ayudó más? ¿Qué podría mejorar?"
              className="w-full resize-none rounded-xl border border-[#E4DAC6] px-4 py-3 text-sm outline-none focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10"
            />
          </div>

          <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-[#5548C8]">
            Tu valoración se publicará de forma anónima y actualizará el perfil del tutor.
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            disabled={rating === 0 || saving}
            onClick={submit}
            className="mt-5 w-full rounded-xl bg-[#5548C8] py-4 font-600 text-white transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? 'Guardando valoración...' : 'Enviar valoración'}
          </button>
          <button onClick={() => props.navigate('history')} className="mt-3 w-full text-center text-sm text-gray-400 hover:text-gray-600">
            Omitir por ahora
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
