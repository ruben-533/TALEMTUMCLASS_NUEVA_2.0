import { useEffect, useRef, useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MarkdownText } from '@/components/ui'
import { TUTORS } from '@/data/tutors'
import {
  askLumen,
  getLumenHealth,
  LumenError,
  type LumenChatMessage,
  type LumenHealth,
  type LumenRole,
} from '@/lib/lumen'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ParsedResult {
  subject: string
  topic: string
  level: string
  goal: string
}

const STUDENT_SUGGESTIONS = [
  'Explícame la derivada de una función con un ejemplo paso a paso',
  'No entiendo la diferencia entre velocidad y aceleración',
  'Ayúdame a crear un plan de estudio para un examen en 5 días',
  '¿Cómo funciona una API REST en JavaScript?',
]

const TUTOR_SUGGESTIONS = [
  'Diseña una clase de 60 minutos sobre derivadas para principiantes',
  'Crea 5 ejercicios con dificultad progresiva sobre ecuaciones lineales',
  '¿Cómo explico la programación orientada a objetos con una analogía?',
  'Ayúdame a escribir una rúbrica para evaluar una tutoría de inglés',
]

function parseQuery(text: string): ParsedResult {
  const lower = text.toLowerCase()
  const subjectMap: Record<string, string> = {
    cálculo: 'Matemáticas',
    álgebra: 'Matemáticas',
    derivada: 'Matemáticas',
    integral: 'Matemáticas',
    matemática: 'Matemáticas',
    estadística: 'Matemáticas',
    python: 'Programación',
    javascript: 'Programación',
    programar: 'Programación',
    código: 'Programación',
    'inglés': 'Inglés',
    english: 'Inglés',
    física: 'Física',
    velocidad: 'Física',
    aceleración: 'Física',
    fuerza: 'Física',
    energía: 'Física',
    química: 'Química',
    diseño: 'Diseño',
    finanzas: 'Finanzas',
  }

  let subject = 'General'
  for (const [key, value] of Object.entries(subjectMap)) {
    if (lower.includes(key)) {
      subject = value
      break
    }
  }

  const level = lower.includes('universitari')
    ? 'Universitario'
    : lower.includes('bachillerat')
      ? 'Bachillerato'
      : lower.includes('básico')
        ? 'Básico'
        : 'Intermedio'

  const goal =
    lower.includes('examen') || lower.includes('prueba')
      ? 'Preparación para examen'
      : lower.includes('trabajar') || lower.includes('empleo')
        ? 'Inserción laboral'
        : lower.includes('proyecto')
          ? 'Desarrollo de proyecto'
          : lower.includes('mejorar')
            ? 'Mejorar habilidades'
            : 'Aprender desde cero'

  const topicMap: Record<string, string> = {
    'cálculo diferencial': 'Cálculo diferencial',
    derivada: 'Derivadas e integrales',
    'álgebra lineal': 'Álgebra lineal',
    python: 'Python y algoritmos',
    javascript: 'JavaScript y web',
    'inglés de negocios': 'Business English',
    conversación: 'Inglés conversacional',
  }

  let topic = subject
  for (const [key, value] of Object.entries(topicMap)) {
    if (lower.includes(key)) {
      topic = value
      break
    }
  }

  return { subject, topic, level, goal }
}

function greetingFor(role: LumenRole, userName: string) {
  if (role === 'tutor') {
    return `Hola, ${userName}. Soy **Lumen IA** ✨, tu asistente educativa de TALEMTUMCLASS.

Puedo ayudarte a preparar clases, explicar temas difíciles, crear ejercicios, rúbricas y material didáctico. ¿Qué estás preparando hoy?`
  }

  return `Hola, ${userName}. Soy **Lumen IA** ✨, tu asistente educativa de TALEMTUMCLASS.

Puedo explicarte cualquier tema, resolver dudas, proponerte ejemplos y ayudarte a estudiar. Pregúntame con tus propias palabras. ¿Qué quieres aprender hoy?`
}

function SparkleIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5l1.8 5.2L19 9.5l-5.2 1.8L12 16.5l-1.8-5.2L5 9.5l5.2-1.8L12 2.5Z"
        fill="currentColor"
      />
      <path d="M19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15Z" fill="currentColor" opacity=".7" />
      <path d="M5 14l.7 2 2 .7-2 .7L5 19.4l-.7-2-2-.7 2-.7L5 14Z" fill="currentColor" opacity=".55" />
    </svg>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-3.5 w-3.5 ${star <= n ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

export default function LumenIA(props: NavProps) {
  const role: LumenRole = props.role === 'tutor' ? 'tutor' : 'student'
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: greetingFor(role, props.userName) }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [failedText, setFailedText] = useState<string | null>(null)
  const [health, setHealth] = useState<LumenHealth | null>(null)
  const [serverOffline, setServerOffline] = useState(false)
  const [parsed, setParsed] = useState<ParsedResult | null>(null)
  const [recommendations, setRecommendations] = useState<typeof TUTORS>([])

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    let active = true

    getLumenHealth()
      .then((result) => {
        if (!active) return
        setHealth(result)
        setServerOffline(false)
      })
      .catch(() => {
        if (!active) return
        setHealth(null)
        setServerOffline(true)
      })

    return () => {
      active = false
    }
  }, [])

  // Si se cambia de rol (estudiante ↔ tutor), reiniciamos la conversación.
  useEffect(() => {
    setMessages([{ role: 'assistant', content: greetingFor(role, props.userName) }])
    setParsed(null)
    setRecommendations([])
    setError(null)
    setFailedText(null)
  }, [role, props.userName])

  const requestReply = async (history: ChatMessage[], sourceText: string) => {
    setLoading(true)
    setError(null)
    setFailedText(null)

    try {
      const payload: LumenChatMessage[] = history.map((message) => ({
        role: message.role,
        content: message.content,
      }))

      const result = await askLumen({ messages: payload, role, userName: props.userName })

      setMessages((previous) => [...previous, { role: 'assistant', content: result.reply }])

      if (role === 'student') {
        const analysis = parseQuery(sourceText)
        setParsed(analysis)
        if (analysis.subject !== 'General') {
          setRecommendations(
            TUTORS.filter((tutor) => tutor.subject.toLowerCase().includes(analysis.subject.toLowerCase())).slice(0, 3),
          )
        } else {
          setRecommendations([])
        }
      }
    } catch (requestError) {
      const message =
        requestError instanceof LumenError
          ? requestError.message
          : 'Lumen IA no pudo responder en este momento. Inténtalo de nuevo.'
      setError(message)
      setFailedText(sourceText)
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  const send = (rawText?: string) => {
    const text = (rawText ?? input).trim()
    if (!text || loading) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setParsed(null)
    setRecommendations([])
    void requestReply(nextMessages, text)
  }

  const retry = () => {
    if (!failedText || loading) return
    void requestReply(messages, failedText)
  }

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: greetingFor(role, props.userName) }])
    setParsed(null)
    setRecommendations([])
    setError(null)
    setFailedText(null)
    setInput('')
    textareaRef.current?.focus()
  }

  const suggestions = role === 'tutor' ? TUTOR_SUGGESTIONS : STUDENT_SUGGESTIONS
  const statusLabel = serverOffline
    ? 'Sin conexión con el servidor'
    : health?.configured
      ? 'Gemini conectada'
      : health
        ? 'Falta configurar Gemini'
        : 'Comprobando conexión...'

  return (
    <DashboardLayout {...props} activeScreen="ai-recommend">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col bg-[#F7F3E9]">
        <div className="h-1 shrink-0 bg-gradient-to-r from-[#221A3A] via-[#C6A15B] to-[#221A3A]" />
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#EAE1CD] bg-[#FBF8F1] px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#221A3A] via-[#3A2C5E] to-[#C6A15B] text-[#F7F3E9] shadow-[0_4px_14px_rgba(34,26,58,0.25)] ring-1 ring-[#C6A15B]/40">
              <SparkleIcon className="h-6 w-6" />
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                  health?.configured ? 'bg-green-400' : serverOffline ? 'bg-red-400' : 'bg-amber-400'
                }`}
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-700 text-[#221A3A] sm:text-lg">Lumen IA</h1>
                <span className="rounded-full border border-[#E8D5A8] bg-[#F3E9D2] px-2 py-0.5 text-[10px] font-600 text-[#8A6A22]">
                  {role === 'tutor' ? 'Modo tutor' : 'Modo estudiante'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#9A8F7A]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    health?.configured ? 'bg-green-500' : serverOffline ? 'bg-red-400' : 'bg-amber-400'
                  }`}
                />
                <span className="truncate">{statusLabel}</span>
                {health?.configured && (
                  <span className="hidden truncate sm:inline">· {health.model}</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={clearChat}
            className="shrink-0 rounded-xl border border-[#E0D3B4] bg-white/70 px-3 py-2 text-xs font-500 text-[#6B5A3E] transition-colors hover:border-[#C6A15B] hover:text-[#221A3A]"
          >
            Limpiar
          </button>
        </header>

        {/* Avisos de configuración */}
        {health && !health.configured && (
          <div className="mx-4 mt-3 shrink-0 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 sm:mx-6">
            <p className="font-600">Lumen IA está lista, pero falta conectar Gemini.</p>
            <p className="mt-1 leading-relaxed">
              Crea un archivo <code className="rounded bg-[#FFFDF8] px-1 py-0.5 font-mono">.env</code> en la raíz del
              proyecto con <code className="rounded bg-[#FFFDF8] px-1 py-0.5 font-mono">GEMINI_API_KEY=tu_clave</code> y
              reinicia <code className="rounded bg-[#FFFDF8] px-1 py-0.5 font-mono">npm run dev</code>.
            </p>
          </div>
        )}

        {serverOffline && (
          <div className="mx-4 mt-3 shrink-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 sm:mx-6">
            No se pudo conectar con el servidor de Lumen IA. Ejecuta{' '}
            <code className="rounded bg-[#FFFDF8] px-1 py-0.5 font-mono">npm run dev</code> y recarga la página.
          </div>
        )}

        {/* Conversación */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#221A3A] to-[#4A3A6E] text-[#E8CF9C] ring-1 ring-[#C6A15B]/50">
                  <SparkleIcon className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === 'user'
                    ? 'rounded-tr-sm border border-[#C6A15B]/30 bg-gradient-to-br from-[#2E2450] to-[#43356F] text-[#FDFBF6] shadow-[0_8px_22px_rgba(34,26,58,0.28)]'
                    : 'rounded-tl-sm border border-[#EAE1CD] bg-[#FFFDF8] text-[#3A3348] shadow-[0_2px_12px_rgba(34,26,58,0.06)]'
                }`}
              >
                {message.role === 'assistant' ? (
                  <MarkdownText text={message.content} />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                )}
              </div>

              {message.role === 'user' && (
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E2D4B4] bg-[#EFE7D6] text-xs font-600 text-[#6B5A3E]">
                  {props.userName.charAt(0)}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#221A3A] to-[#4A3A6E] text-[#E8CF9C] ring-1 ring-[#C6A15B]/50">
                <SparkleIcon className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-[#EAE1CD] bg-[#FFFDF8] px-4 py-3 shadow-[0_2px_12px_rgba(34,26,58,0.06)]">
                <div className="flex h-5 items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#C6A15B]" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#C6A15B]" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#C6A15B]" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start gap-3">
              <div className="h-8 w-8 shrink-0" />
              <div className="max-w-[85%] rounded-2xl border border-[#E7C4B8] bg-[#FBF1EC] px-4 py-3 text-sm text-[#8F3D2C]">
                <p>{error}</p>
                {failedText && (
                  <button
                    type="button"
                    onClick={retry}
                    disabled={loading}
                    className="mt-2 rounded-lg bg-[#8F3D2C] px-3 py-1.5 text-xs font-600 text-white hover:bg-[#7A3325] disabled:opacity-40"
                  >
                    Reintentar
                  </button>
                )}
              </div>
            </div>
          )}

          {parsed && role === 'student' && !loading && !error && (
            <div className="flex justify-start gap-3">
              <div className="h-8 w-8 shrink-0" />
              <div className="max-w-[85%] rounded-2xl border border-[#E6D8B8] bg-[#FBF7EE] p-4 text-sm">
                <p className="mb-2 text-xs font-600 uppercase tracking-wide text-[#A8843F]">
                  Análisis de tu solicitud
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['Materia', parsed.subject],
                    ['Tema', parsed.topic],
                    ['Nivel', parsed.level],
                    ['Objetivo', parsed.goal],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="text-xs text-[#8B8069]">{label}: </span>
                      <span className="text-xs font-600 text-[#2B2140]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {recommendations.length > 0 && role === 'student' && !loading && (
            <div className="flex justify-start gap-3">
              <div className="h-8 w-8 shrink-0" />
              <div className="max-w-[calc(100%-44px)] flex-1 space-y-3">
                <p className="text-xs font-500 text-gray-500">Tutores que pueden ayudarte a profundizar:</p>
                {recommendations.map((tutor) => (
                  <div
                    key={tutor.id}
                    onClick={() => {
                      props.selectTutor(tutor.id)
                      props.navigate('tutor-profile')
                    }}
                    className="cursor-pointer rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-4 transition-all hover:-translate-y-0.5 hover:border-[#C6A15B]/60 hover:shadow-[0_10px_26px_rgba(34,26,58,0.10)]"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img src={tutor.avatar} alt={tutor.name} className="h-10 w-10 rounded-full object-cover" />
                        {tutor.available && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-600 text-[#221A3A]">{tutor.name}</p>
                        <p className="truncate text-xs text-gray-500">{tutor.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-700 text-[#221A3A]">${tutor.price.toLocaleString()}</p>
                        <p className="text-[10px] text-[#A79C86]">/hora</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Stars n={Math.round(tutor.rating)} />
                        <span className="text-xs text-gray-500">
                          {tutor.rating} ({tutor.reviews})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          props.selectTutor(tutor.id)
                          props.navigate('tutor-profile')
                        }}
                        className="text-xs font-600 text-[#8A6A22] hover:underline"
                      >
                        Ver perfil →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Sugerencias */}
        {messages.length === 1 && !loading && (
          <div className="shrink-0 px-4 pb-3 sm:px-6">
            <p className="mb-2 text-xs text-[#9A8F7A]">Prueba con:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="rounded-full border border-[#E3D7BD] bg-white/80 px-3 py-2 text-left text-xs text-[#4B4360] transition-colors hover:border-[#C6A15B] hover:bg-[#FBF7EE] hover:text-[#8A6A22]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t border-[#EAE1CD] bg-[#FBF8F1] p-3 sm:p-4">
          <div className="flex items-end gap-2 rounded-2xl border border-[#E8DFC9] bg-[#FFFDF8] px-3 py-2 transition-colors focus-within:border-[#C6A15B] focus-within:ring-2 focus-within:ring-[#C6A15B]/20">
            <textarea
              ref={textareaRef}
              rows={1}
              maxLength={4000}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  send()
                }
              }}
              placeholder={
                role === 'tutor'
                  ? 'Pregunta sobre una clase, un ejercicio o una estrategia...'
                  : 'Escribe tu duda y Lumen IA te explicará...'
              }
              className="max-h-32 min-h-[28px] flex-1 resize-none bg-transparent py-1 text-sm text-[#2B2140] outline-none placeholder-[#A79C86]"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E2450] to-[#4A3A6E] shadow-[0_4px_12px_rgba(34,26,58,0.25)] transition-all hover:from-[#3A2C5E] hover:to-[#5A4785] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Enviar mensaje"
            >
              <svg className="h-5 w-5 text-[#E8CF9C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-[#A79C86]">
            Lumen IA puede cometer errores. Verifica la información importante.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
