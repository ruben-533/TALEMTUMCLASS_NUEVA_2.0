import { AuthError, type FieldError } from './auth'

export interface Category {
  id: number
  nombre: string
  descripcion: string
  icono: string
  creado_en: string
  actualizado_en: string
}

export interface CategoryPayload {
  nombre: string
  descripcion: string
  icono: string
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
      typeof data?.message === 'string' ? data.message : 'La operación no se pudo completar.',
      typeof data?.code === 'string' ? data.code : undefined,
      response.status,
      Array.isArray(data?.errors) ? (data.errors as FieldError[]) : [],
    )
  }

  return (data || {}) as T
}

export async function listCategories(): Promise<Category[]> {
  const data = await request<{ categories: Category[] }>('/api/categorias')
  return data.categories
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const data = await request<{ category: Category }>('/api/categorias', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.category
}

export async function updateCategory(id: number, payload: CategoryPayload): Promise<Category> {
  const data = await request<{ category: Category }>(`/api/categorias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return data.category
}

export async function deleteCategory(id: number): Promise<void> {
  await request(`/api/categorias/${id}`, { method: 'DELETE' })
}
