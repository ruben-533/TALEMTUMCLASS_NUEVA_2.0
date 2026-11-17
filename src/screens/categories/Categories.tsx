import { useEffect, useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { PageHeader } from '@/components/ui'
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  type Category,
} from '@/lib/categories'
import { AuthError, type AuthUser } from '@/lib/auth'

interface Props extends NavProps {
  user: AuthUser | null
}

const EMPTY_FORM = { nombre: '', descripcion: '', icono: '📚' }

export default function Categories({ user, ...props }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setCategories(await listCategories())
    } catch {
      setError('No se pudieron cargar las categorías. Verifica que el servidor esté activo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFieldErrors({})
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setForm({
      nombre: category.nombre,
      descripcion: category.descripcion || '',
      icono: category.icono || '📚',
    })
    setFieldErrors({})
    setError('')
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return

    setSaving(true)
    setError('')
    setNotice('')
    setFieldErrors({})

    try {
      if (editingId) {
        const updated = await updateCategory(editingId, form)
        setCategories((prev) => prev.map((item) => (item.id === editingId ? updated : item)))
        setNotice('Categoría actualizada correctamente.')
      } else {
        const created = await createCategory(form)
        setCategories((prev) =>
          [...prev, created].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
        )
        setNotice('Categoría creada correctamente.')
      }
      resetForm()
    } catch (caught) {
      if (caught instanceof AuthError) {
        setError(caught.message)
        const next: Record<string, string> = {}
        for (const item of caught.errors) {
          if (item?.field) next[item.field] = item.message
        }
        setFieldErrors(next)
        if (caught.status === 401) {
          setError('Tu sesión expiró. Inicia sesión de nuevo para administrar las categorías.')
        }
      } else {
        setError('Ocurrió un error inesperado al guardar la categoría.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    if (!user) return
    const confirmed = window.confirm(`¿Eliminar la categoría "${category.nombre}"?`)
    if (!confirmed) return

    setError('')
    setNotice('')
    try {
      await deleteCategory(category.id)
      setCategories((prev) => prev.filter((item) => item.id !== category.id))
      if (editingId === category.id) resetForm()
      setNotice('Categoría eliminada.')
    } catch (caught) {
      setError(caught instanceof AuthError ? caught.message : 'No se pudo eliminar la categoría.')
    }
  }

  return (
    <DashboardLayout {...props} activeScreen="categories">
      <div className="mx-auto max-w-5xl p-5 sm:p-6 lg:p-8">
        <PageHeader
          title="Categorías"
          subtitle="CRUD de categorías respaldado por SQLite. Para crear, editar o eliminar necesitas una sesión activa."
          action={
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-600 ${
                user
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              {user ? `Sesión: ${user.email}` : 'Sin sesión'}
            </span>
          }
        />

        {!user && (
          <div className="mb-6 rounded-2xl border border-[#E6D8B8] bg-[#FBF7EE] p-5">
            <h2 className="text-base font-700 text-[#221A3A]">Inicia sesión para administrar</h2>
            <p className="mt-1 text-sm text-[#6B5A3E]">
              El listado es público, pero las operaciones de creación, edición y eliminación requieren
              autenticación. Crea una cuenta o entra con la cuenta de administrador de prueba.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => props.navigate('login')}
                className="rounded-xl bg-[#5548C8] px-4 py-2.5 text-sm font-600 text-white transition-colors hover:bg-[#4338CA]"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => props.navigate('register')}
                className="rounded-xl border border-[#E4DAC6] bg-[#FFFDF8] px-4 py-2.5 text-sm font-500 text-[#3A3348] transition-colors hover:border-[#5548C8]"
              >
                Crear cuenta
              </button>
            </div>
          </div>
        )}

        {user && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] p-5 shadow-[0_2px_12px_rgba(34,26,58,0.05)]"
          >
            <h2 className="text-base font-700 text-[#221A3A]">
              {editingId ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-[90px_1fr]">
              <div>
                <label htmlFor="category-icon" className="mb-1.5 block text-xs font-600 text-[#3A3348]">
                  Icono
                </label>
                <input
                  id="category-icon"
                  value={form.icono}
                  onChange={(event) => setForm({ ...form, icono: event.target.value })}
                  maxLength={8}
                  className="w-full rounded-xl border border-[#E4DAC6] bg-white px-3 py-3 text-center text-lg outline-none transition-colors focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10"
                  aria-label="Icono de la categoría"
                />
              </div>
              <div>
                <label htmlFor="category-name" className="mb-1.5 block text-xs font-600 text-[#3A3348]">
                  Nombre
                </label>
                <input
                  id="category-name"
                  value={form.nombre}
                  onChange={(event) => setForm({ ...form, nombre: event.target.value })}
                  placeholder="Ej. Estadística"
                  maxLength={60}
                  required
                  className="w-full rounded-xl border border-[#E4DAC6] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10"
                />
                {fieldErrors.nombre && <p className="mt-1 text-xs text-red-600">{fieldErrors.nombre}</p>}
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="category-description" className="mb-1.5 block text-xs font-600 text-[#3A3348]">
                Descripción
              </label>
              <input
                id="category-description"
                value={form.descripcion}
                onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
                placeholder="Describe brevemente qué se aprende en esta categoría"
                maxLength={240}
                className="w-full rounded-xl border border-[#E4DAC6] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#5548C8] focus:ring-2 focus:ring-[#5548C8]/10"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#5548C8] px-5 py-2.5 text-sm font-600 text-white transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear categoría'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[#E4DAC6] bg-[#FFFDF8] px-5 py-2.5 text-sm font-500 text-[#3A3348] transition-colors hover:border-[#5548C8]"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
            {notice}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8]">
          <div className="flex items-center justify-between border-b border-[#EAE1CD] px-5 py-4">
            <h2 className="text-sm font-700 text-[#221A3A]">
              Categorías registradas ({categories.length})
            </h2>
            <button
              type="button"
              onClick={load}
              className="text-xs font-500 text-[#5548C8] hover:underline"
            >
              Recargar
            </button>
          </div>

          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-gray-500">Cargando categorías...</div>
          ) : categories.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-500">
              Todavía no hay categorías registradas.
            </div>
          ) : (
            <ul className="divide-y divide-[#EAE1CD]">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F3E9] text-xl">
                      {category.icono}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-600 text-[#221A3A]">{category.nombre}</p>
                        <span className="rounded-full bg-[#F3E9D2] px-2 py-0.5 text-[10px] font-600 text-[#8A6A22]">
                          #{category.id}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {category.descripcion || 'Sin descripción'}
                      </p>
                    </div>
                  </div>

                  {user && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="rounded-lg border border-[#E4DAC6] px-3 py-1.5 text-xs font-500 text-[#3A3348] transition-colors hover:border-[#5548C8] hover:text-[#5548C8]"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-500 text-red-600 transition-colors hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
