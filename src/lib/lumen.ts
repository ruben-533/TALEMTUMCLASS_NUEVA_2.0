export type LumenRole = 'student' | 'tutor'

export interface LumenChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface LumenHealth {
  configured: boolean
  model: string
  provider: string
}

export interface LumenReply {
  reply: string
  model: string
}

export class LumenError extends Error {
  code?: string
  status?: number

  constructor(message: string, code?: string, status?: number) {
    super(message)
    this.name = 'LumenError'
    this.code = code
    this.status = status
  }
}

async function readJson(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function getLumenHealth(): Promise<LumenHealth> {
  let response: Response

  try {
    response = await fetch('/api/lumen/health')
  } catch {
    throw new LumenError('No se pudo conectar con el servidor de Lumen IA. Verifica que `npm run dev` esté corriendo.')
  }

  const data = await readJson(response)

  if (!response.ok || !data) {
    throw new LumenError('El servidor de Lumen IA no respondió correctamente.')
  }

  return {
    configured: Boolean(data.configured),
    model: typeof data.model === 'string' ? data.model : 'gemini-3.5-flash',
    provider: typeof data.provider === 'string' ? data.provider : 'Google Gemini',
  }
}

export async function askLumen({
  messages,
  role,
  userName,
}: {
  messages: LumenChatMessage[]
  role: LumenRole
  userName: string
}): Promise<LumenReply> {
  let response: Response

  try {
    response = await fetch('/api/lumen/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, role, userName }),
    })
  } catch {
    throw new LumenError('No se pudo conectar con el servidor de Lumen IA. Revisa que `npm run dev` esté activo.')
  }

  const data = await readJson(response)

  if (!response.ok || !data?.reply) {
    throw new LumenError(
      typeof data?.message === 'string' ? data.message : 'Lumen IA no pudo responder en este momento.',
      typeof data?.code === 'string' ? data.code : undefined,
      response.status,
    )
  }

  return {
    reply: String(data.reply),
    model: typeof data.model === 'string' ? data.model : 'gemini-3.5-flash',
  }
}
