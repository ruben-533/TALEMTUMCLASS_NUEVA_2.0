export interface Conversation {
  id: number
  name: string
  avatar: string
  subject: string
  lastMessage: string
  time: string
  unread: number
}

export interface ChatMessage {
  id: number
  from: 'me' | 'them'
  text: string
  time: string
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: 'Laura Martínez',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    subject: 'Cálculo Diferencial',
    lastMessage: 'Claro, te comparto unos ejercicios antes de la sesión.',
    time: '10:42',
    unread: 2,
  },
  {
    id: 2,
    name: 'Andrés Gómez',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    subject: 'React',
    lastMessage: 'Recuerda subir tu proyecto para revisarlo juntos.',
    time: 'Ayer',
    unread: 0,
  },
  {
    id: 3,
    name: 'Valentina Cruz',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format',
    subject: 'Inglés conversacional',
    lastMessage: 'Great job today! See you next week. 🎉',
    time: 'Lun',
    unread: 0,
  },
]

export const CHAT_MESSAGES: ChatMessage[] = [
  { id: 1, from: 'them', text: '¡Hola Carlos! ¿Cómo vas con los ejercicios de derivadas?', time: '10:35' },
  { id: 2, from: 'me', text: 'Hola Laura, me trabé en el ejercicio 4. No entiendo la regla de la cadena.', time: '10:38' },
  { id: 3, from: 'them', text: 'Tranquilo, es normal. Lo repasamos al inicio de la sesión del lunes.', time: '10:40' },
  { id: 4, from: 'them', text: 'Claro, te comparto unos ejercicios antes de la sesión.', time: '10:42' },
]
