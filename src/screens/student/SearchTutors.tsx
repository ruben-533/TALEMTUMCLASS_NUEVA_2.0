import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { TUTORS } from '@/data/tutors'

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

const SUBJECTS = ['Todas', 'Matemáticas', 'Programación', 'Inglés', 'Física', 'Química', 'Biología', 'Diseño', 'Finanzas', 'Negocios', 'Marketing', 'Historia', 'Música', 'Tecnología', 'Francés']
const MODALITIES = ['Todas', 'Virtual', 'Presencial']
const LEVELS = ['Todos', 'Básico', 'Intermedio', 'Avanzado', 'Universitario']

export default function SearchTutors(props: NavProps) {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('Todas')
  const [modality, setModality] = useState('Todas')
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100000)
  const [sort, setSort] = useState<'rating' | 'price' | 'reviews'>('rating')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = TUTORS
    .filter((t) => {
      if (query && !t.name.toLowerCase().includes(query.toLowerCase()) && !t.subject.toLowerCase().includes(query.toLowerCase())) return false
      if (subject !== 'Todas' && !t.subject.toLowerCase().includes(subject.toLowerCase())) return false
      if (modality !== 'Todas' && !t.modalities.includes(modality)) return false
      if (onlyAvailable && !t.available) return false
      if (t.rating < minRating) return false
      if (t.price > maxPrice) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'price') return a.price - b.price
      return b.reviews - a.reviews
    })

  return (
    <DashboardLayout {...props} activeScreen="search">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-700 text-[#221A3A] mb-1">Buscar tutores</h1>
          <p className="text-gray-500 text-sm">{filtered.length} tutores encontrados</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 bg-[#FFFDF8] rounded-xl px-4 py-3 border border-[#E4DAC6]">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="¿Qué quieres aprender?"
              className="flex-1 outline-none text-[#2B2140] placeholder-gray-400 text-sm bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center gap-2 border border-[#E4DAC6] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm font-500 text-[#3A3348]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </button>
        </div>

        {/* Subject pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-500 transition-all border ${
                subject === s
                  ? 'bg-[#5548C8] text-white border-[#5548C8]'
                  : 'bg-[#FFFDF8] text-gray-600 border-[#E4DAC6] hover:border-[#5548C8] hover:text-[#5548C8]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          <aside className={`shrink-0 w-64 space-y-6 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#EAE1CD]">
              <h3 className="font-700 text-[#221A3A] mb-4 text-sm">Filtros</h3>

              {/* Available now */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-500 text-[#2B2140]">Disponible ahora</p>
                  <p className="text-xs text-gray-400">Solo tutores activos</p>
                </div>
                <button
                  onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${onlyAvailable ? 'bg-[#5548C8]' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-[#FFFDF8] rounded-full transition-transform shadow-sm ${onlyAvailable ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Modality */}
              <div className="mb-5">
                <p className="text-sm font-500 text-[#2B2140] mb-2">Modalidad</p>
                <div className="space-y-1.5">
                  {MODALITIES.map((m) => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="modality"
                        checked={modality === m}
                        onChange={() => setModality(m)}
                        className="accent-[#5548C8]"
                      />
                      <span className="text-sm text-[#3A3348]">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="mb-5">
                <p className="text-sm font-500 text-[#2B2140] mb-2">Nivel</p>
                <select className="w-full border border-[#E4DAC6] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5548C8] transition-colors bg-[#FFFDF8]">
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>

              {/* Min rating */}
              <div className="mb-5">
                <p className="text-sm font-500 text-[#2B2140] mb-2">Calificación mínima</p>
                <div className="flex gap-2">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`text-xs px-2 py-1 rounded-full border font-500 transition-all ${
                        minRating === r ? 'bg-[#5548C8] text-white border-[#5548C8]' : 'border-[#E4DAC6] text-gray-600 hover:border-[#5548C8]'
                      }`}
                    >
                      {r === 0 ? 'Todas' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-500 text-[#2B2140]">Precio máx.</p>
                  <span className="text-xs font-600 text-[#5548C8]">${maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={100000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#5548C8]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$20k</span><span>$100k</span>
                </div>
              </div>
            </div>

            {/* Available now box */}
              <div
                className="bg-gradient-to-br from-[#312e81] to-[#5548C8] rounded-2xl p-5 text-white cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => props.navigate('available-now')}
              >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-600">Tutor disponible ahora</span>
              </div>
              <p className="text-xs text-white/70">
                Activa el filtro para ver tutores que pueden atenderte en este momento.
              </p>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Sort */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{filtered.length} resultados</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Ordenar:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="border border-[#E4DAC6] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#5548C8] bg-[#FFFDF8]"
                >
                  <option value="rating">Mejor calificación</option>
                  <option value="price">Menor precio</option>
                  <option value="reviews">Más reseñas</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-[#FFFDF8] rounded-2xl border border-[#EAE1CD]">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-700 text-[#221A3A] mb-2">No encontramos tutores disponibles</h3>
                <p className="text-gray-500 text-sm mb-4">Intenta cambiar el horario o ampliar tu búsqueda.</p>
                <button onClick={() => { setQuery(''); setSubject('Todas'); setModality('Todas'); setOnlyAvailable(false) }} className="text-[#5548C8] font-500 text-sm border border-[#5548C8]/30 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  Modificar búsqueda
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filtered.map((tutor) => (
                  <div
                    key={tutor.id}
                    onClick={() => { props.selectTutor(tutor.id); props.navigate('tutor-profile') }}
                    className="bg-[#FFFDF8] rounded-2xl border border-[#EAE1CD] p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className="relative shrink-0">
                        <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-2xl object-cover bg-indigo-100" />
                        {tutor.available ? (
                          <span className="absolute -top-1 -right-1 bg-green-400 text-white text-[9px] font-700 px-1.5 py-0.5 rounded-full">LIVE</span>
                        ) : (
                          <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-[9px] font-700 px-1.5 py-0.5 rounded-full">OFF</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-700 text-[#221A3A]">{tutor.name}</h3>
                              {tutor.verified && (
                                <svg className="w-4 h-4 text-[#5548C8]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{tutor.subject}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-base font-700 text-[#221A3A]">${tutor.price.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">/hora</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mb-2">
                          <StarRating rating={tutor.rating} />
                          <span className="text-xs font-600 text-[#221A3A]">{tutor.rating}</span>
                          <span className="text-xs text-gray-400">({tutor.reviews})</span>
                        </div>

                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{tutor.specialty}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {tutor.modalities.map((m) => (
                              <span key={m} className="text-[10px] px-2 py-0.5 bg-indigo-50 text-[#5548C8] rounded-full font-500">
                                {m === 'Virtual' ? '💻' : '📍'} {m}
                              </span>
                            ))}
                            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                              📍 {tutor.location}
                            </span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); props.selectTutor(tutor.id); props.navigate('tutor-profile') }}
                            className="text-xs font-600 text-[#5548C8] hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Ver perfil →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

