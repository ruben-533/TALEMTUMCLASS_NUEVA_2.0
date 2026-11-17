export type UserRole = 'estudiante' | 'tutor' | 'admin'

export interface AuthUser {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: UserRole
  ciudad: string
  telefono: string
  biografia: string
  creadoEn: string
  ultimoAcceso: string | null
}

export interface RegisterPayload {
  nombre: string
  apellido: string
  email: string
  password: string
  rol?: 'estudiante' | 'tutor'
  ciudad?: string
}

export interface FieldError {
  field: string
  message: string
}

export class AuthError extends Error {
  code?: string
  status?: number
  errors: FieldError[]

  constructor(message: string, code?: string, status?: number, errors: FieldError[] = []) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    this.status = status
    this.errors = errors
  }
}

async function readJson(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    })
  } catch {
    throw new AuthError('No se pudo conectar con el servidor. Verifica que `npm run dev` esté activo.')
  }

  if (response.status === 204) return undefined as T

  const data = await readJson(response)

  if (!response.ok) {
    throw new AuthError(
      typeof data?.message === 'string' ? data.message : 'La solicitud no se pudo completar.',
      typeof data?.code === 'string' ? data.code : undefined,
      response.status,
      Array.isArray(data?.errors) ? data.errors : [],
    )
  }

  return (data || {}) as T
}

export async function registerUser(payload: RegisterPayload): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.user
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return data.user
}

export async function logoutUser(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST' })
}

/** Devuelve el usuario de la sesión o `null` si no hay sesión activa. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const data = await request<{ user: AuthUser }>('/api/auth/me')
    return data.user
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) return null
    return null
  }
}

export async function updateUserRole(rol: 'estudiante' | 'tutor'): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>('/api/auth/role', {
    method: 'PATCH',
    body: JSON.stringify({ rol }),
  })
  return data.user
}

export interface ProfilePayload {
  nombre: string
  apellido: string
  ciudad?: string
  telefono?: string
  biografia?: string
}

/** Guarda los datos personales del usuario autenticado. */
export async function updateProfile(payload: ProfilePayload): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>('/api/perfil', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return data.user
}

/** Lista de usuarios reales. Solo disponible para administradores. */
export async function getUsers(): Promise<AuthUser[]> {
  const data = await request<{ users: AuthUser[] }>('/api/usuarios')
  return data.users
}

export function displayName(user: AuthUser | null): string {
  if (!user) return ''
  return [user.nombre, user.apellido].filter(Boolean).join(' ')
}
