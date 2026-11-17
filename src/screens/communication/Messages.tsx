import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { PageHeader, EmptyState } from '@/components/ui'
import { CHAT_MESSAGES, CONVERSATIONS, type ChatMessage } from '@/data/messages'

export default function Messages(props: NavProps) {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id)
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES)
  const [input, setInput] = useState('')
  const [mobileChat, setMobileChat] = useState(false)

  const conversation = CONVERSATIONS.find((item) => item.id === activeId) ?? CONVERSATIONS[0]

  // Las cuentas reales empiezan sin conversaciones. El contenido de ejemplo
  // queda solo para el recorrido de invitado.
  if (props.isAuthenticated) {
    return (
      <DashboardLayout {...props} activeScreen="messages">
        <div className="p-5 sm:p-6 lg:p-8">
          <PageHeader title="Mensajes" subtitle="Habla con tus tutores antes y después de cada sesión." />
          <EmptyState
            icon="💬"
            title="Aún no tienes conversaciones"
            description="Cuando reserves una tutoría o le escribas a un tutor, tus mensajes aparecerán aquí."
            action={
              <button
                onClick={() => props.navigate('search')}
                className="rounded-xl bg-[#5548C8] px-5 py-3 text-sm font-600 text-white hover:bg-[#4338CA]"
              >
                Buscar un tutor
              </button>
            }
          />
        </div>
      </DashboardLayout>
    )
  }

  const send = () => {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: 'me', text: input.trim(), time: 'Ahora' },
    ])
    setInput('')
  }

  return (
    <DashboardLayout {...props} activeScreen="messages">
      <div className="flex h-full flex-col">
        <div className={`${mobileChat ? 'hidden' : 'block'} p-5 sm:p-6 lg:p-8`}>
          <PageHeader title="Mensajes" subtitle="Habla con tus tutores antes y después de cada sesión." />
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden border-t border-[#EAE1CD] bg-[#FFFDF8]">
          <aside className={`${mobileChat ? 'hidden' : 'flex'} w-full flex-col border-r border-[#EAE1CD] sm:w-80 lg:w-96`}>
            <div className="border-b border-[#EAE1CD] p-4">
              <div className="flex items-center gap-2 rounded-xl bg-[#F7F3E9] px-3 py-2.5">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input placeholder="Buscar conversación..." className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {CONVERSATIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveId(item.id); setMobileChat(true) }}
                  className={`flex w-full gap-3 border-b border-gray-50 p-4 text-left transition-colors hover:bg-gray-50 ${activeId === item.id ? 'bg-indigo-50/60' : ''}`}
                >
                  <img src={item.avatar} alt={item.name} className="h-11 w-11 rounded-full object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-600 text-[#221A3A]">{item.name}</span>
                      <span className="shrink-0 text-[10px] text-gray-400">{item.time}</span>
                    </span>
                    <span className="block text-xs text-gray-400">{item.subject}</span>
                    <span className="mt-1 block truncate text-xs text-gray-500">{item.lastMessage}</span>
                  </span>
                  {item.unread > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5548C8] text-[10px] font-700 text-white">{item.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          <section className={`${mobileChat ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col sm:flex`}>
            <div className="flex items-center gap-3 border-b border-[#EAE1CD] p-4">
              <button onClick={() => setMobileChat(false)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 sm:hidden" aria-label="Volver a conversaciones">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <img src={conversation.avatar} alt={conversation.name} className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-600 text-[#221A3A]">{conversation.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-gray-400"><span className="h-1.5 w-1.5 rounded-full bg-green-400" /> En línea · {conversation.subject}</p>
              </div>
              <button onClick={() => props.navigate('tutor-profile')} className="hidden rounded-lg border border-[#E4DAC6] px-3 py-1.5 text-xs font-500 text-gray-600 hover:bg-gray-50 sm:block">
                Ver perfil
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#F9F8FF] p-4 sm:p-6">
              <div className="text-center text-[10px] text-gray-400">Hoy</div>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${message.from === 'me' ? 'rounded-tr-sm bg-[#5548C8] text-white' : 'rounded-tl-sm border border-[#EAE1CD] bg-[#FFFDF8] text-[#3A3348]'}`}>
                    {message.text}
                    <div className={`mt-1 text-[10px] ${message.from === 'me' ? 'text-white/60' : 'text-gray-400'}`}>{message.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EAE1CD] p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && send()}
                  placeholder="Escribe un mensaje..."
                  className="min-w-0 flex-1 rounded-xl bg-[#F7F3E9] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5548C8]/20"
                />
                <button onClick={send} disabled={!input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5548C8] text-white transition-colors hover:bg-[#4338CA] disabled:opacity-40" aria-label="Enviar mensaje">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
