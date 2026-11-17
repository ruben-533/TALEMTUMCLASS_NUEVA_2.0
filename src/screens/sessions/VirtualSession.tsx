import { useEffect, useState } from 'react'
import type { NavProps } from '@/app/navigation'
import { Logo } from '@/components/ui'
import { updateReservationStatus } from '@/lib/bookings'

export default function VirtualSession(props: NavProps) {
  const booking = props.activeBooking
  const tutorName = booking?.tutorNombre ?? props.selectedTutor.name
  const tutorAvatar = booking?.tutorAvatar || props.selectedTutor.avatar
  const subject = booking?.materia ?? props.selectedTutor.subject

  const [mic, setMic] = useState(true)
  const [camera, setCamera] = useState(true)
  const [sharing, setSharing] = useState(false)
  const [chatOpen, setChatOpen] = useState(() => window.innerWidth >= 1024)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { from: 'them', text: `¡Hola ${props.userName}! ¿Me escuchas bien?` },
    { from: 'me', text: 'Sí, perfecto. ¿Empezamos?' },
    { from: 'them', text: 'Claro, te comparto la pantalla con los ejercicios.' },
  ])
  const [seconds, setSeconds] = useState(0)
  const [finishing, setFinishing] = useState(false)

  const finish = async () => {
    if (finishing) return
    setFinishing(true)
    if (booking && props.isAuthenticated) {
      try {
        const updated = await updateReservationStatus(booking.id, 'completada')
        props.setActiveBooking(updated)
      } catch {
        // Aunque falle el cambio de estado, permitimos calificar la sesión.
      }
    }
    props.navigate('rating')
  }

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages((prev) => [...prev, { from: 'me', text: message.trim() }])
    setMessage('')
  }

  return (
    <div className="flex h-full flex-col bg-[#0F0D1E] text-white">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Logo size="sm" showWordmark={false} />
          <div>
            <p className="text-sm font-600">{subject}</p>
            <p className="text-[11px] text-white/50">{tutorName} · {props.userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1.5 text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Conexión estable
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 font-500 tabular-nums">⏱ {clock}</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="relative flex min-w-0 flex-1 flex-col">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#14122b] to-[#0f0d1e]">
            <div className="flex flex-col items-center">
              <img src={tutorAvatar} alt={tutorName} className="h-28 w-28 rounded-full border-4 border-white/10 object-cover sm:h-36 sm:w-36" />
              <p className="mt-4 font-600">{tutorName}</p>
              <p className="mt-1 text-xs text-white/50">{camera ? 'Cámara activa' : 'Cámara apagada'}</p>
            </div>

            {sharing && (
              <div className="absolute inset-4 flex flex-col rounded-2xl border border-[#5548C8]/40 bg-[#171432] p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                  <span>Compartiendo pantalla</span>
                  <span className="text-[#A5B4FC]">Ejercicios · Cálculo diferencial</span>
                </div>
                <div className="flex flex-1 items-center justify-center rounded-xl bg-white/5 font-mono text-2xl text-indigo-200">
                  d/dx (x² + 3x) = 2x + 3
                </div>
              </div>
            )}

            <div className="absolute bottom-4 right-4 flex h-24 w-32 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-white/50 sm:h-32 sm:w-44">
              {camera ? <span className="text-center">Tu cámara<br />{props.userName}</span> : 'Cámara apagada'}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center gap-2 border-t border-white/10 bg-[#14122b] px-4 py-3 sm:gap-3">
            <button onClick={() => setMic(!mic)} aria-pressed={mic} aria-label={mic ? 'Silenciar micrófono' : 'Activar micrófono'} className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${mic ? 'bg-white/10 hover:bg-white/15' : 'bg-red-500 text-white'}`}>
              {mic ? '🎙️' : '🔇'}
            </button>
            <button onClick={() => setCamera(!camera)} aria-pressed={camera} aria-label={camera ? 'Apagar cámara' : 'Encender cámara'} className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${camera ? 'bg-white/10 hover:bg-white/15' : 'bg-red-500 text-white'}`}>
              {camera ? '📹' : '🚫'}
            </button>
            <button onClick={() => setSharing(!sharing)} aria-pressed={sharing} className={`flex h-11 items-center gap-2 rounded-full px-4 text-xs font-500 transition-colors ${sharing ? 'bg-[#5548C8]' : 'bg-white/10 hover:bg-white/15'}`}>
              🖥️ <span className="hidden sm:inline">Compartir</span>
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className="flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-xs font-500 transition-colors hover:bg-white/15 lg:hidden">
              💬 Chat
            </button>
            <button onClick={finish} disabled={finishing} className="flex h-11 items-center gap-2 rounded-full bg-red-500 px-4 text-xs font-600 transition-colors hover:bg-red-600 disabled:opacity-60">
              📞 <span className="hidden sm:inline">{finishing ? 'Guardando...' : 'Finalizar'}</span>
            </button>
          </div>
        </main>

        {chatOpen && (
          <aside className="flex w-full shrink-0 flex-col border-l border-white/10 bg-[#14122b] lg:w-80">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-sm font-600">Chat de la sesión</p>
              <button onClick={() => setChatOpen(false)} className="text-white/40 hover:text-white lg:hidden" aria-label="Cerrar chat">✕</button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((item, index) => (
                <div key={index} className={`flex ${item.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${item.from === 'me' ? 'bg-[#5548C8] text-white' : 'bg-white/10 text-white/80'}`}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 p-3">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/40"
                />
                <button onClick={sendMessage} className="rounded-xl bg-[#5548C8] px-3 text-sm" aria-label="Enviar">➤</button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
