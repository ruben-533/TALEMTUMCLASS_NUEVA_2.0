export type NotificationKind =
  | 'request'
  | 'confirmed'
  | 'cancelled'
  | 'reminder'
  | 'review'
  | 'available'
  | 'message'

export interface AppNotification {
  id: number
  kind: NotificationKind
  title: string
  body: string
  time: string
  unread: boolean
  icon: string
  action?: string
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    kind: 'confirmed',
    title: 'Tutoría confirmada',
    body: 'Laura Martínez confirmó tu sesión de Cálculo Diferencial para el lunes 2 de septiembre a las 10:00 AM.',
    time: 'Hace 5 min',
    unread: true,
    icon: '✅',
    action: 'Ver tutoría',
  },
  {
    id: 2,
    kind: 'reminder',
    title: 'Recordatorio de tutoría',
    body: 'Tu tutoría empieza en 1 hora. Ten a mano tus apuntes y una buena conexión a internet.',
    time: 'Hace 1 h',
    unread: true,
    icon: '⏰',
    action: 'Entrar a la sesión',
  },
  {
    id: 3,
    kind: 'available',
    title: 'Tutor disponible ahora',
    body: 'Andrés Gómez está en línea y puede ayudarte con React en este momento.',
    time: 'Hace 3 h',
    unread: true,
    icon: '⚡',
    action: 'Ver disponibilidad',
  },
  {
    id: 4,
    kind: 'review',
    title: 'Nueva valoración',
    body: 'Mariana P. te dejó una reseña de 5 estrellas después de tu tutoría de cálculo.',
    time: 'Ayer',
    unread: false,
    icon: '⭐',
  },
  {
    id: 5,
    kind: 'message',
    title: 'Mensaje de Valentina Cruz',
    body: '¿Te sirvió el material de práctica que te compartí? Cualquier duda me escribes.',
    time: 'Ayer',
    unread: false,
    icon: '💬',
    action: 'Abrir mensaje',
  },
  {
    id: 6,
    kind: 'request',
    title: 'Nueva solicitud de tutoría',
    body: 'Isabella Vargas quiere una tutoría de Estadística el miércoles 4 de septiembre.',
    time: 'Hace 2 días',
    unread: false,
    icon: '📩',
    action: 'Revisar solicitud',
  },
  {
    id: 7,
    kind: 'cancelled',
    title: 'Tutoría cancelada',
    body: 'Miguel Torres canceló la tutoría presencial del 10 de agosto. El pago será reembolsado.',
    time: 'Hace 3 días',
    unread: false,
    icon: '❌',
  },
]
