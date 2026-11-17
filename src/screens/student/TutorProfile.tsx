import type { NavProps } from '@/app/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'

const reviews = [
  { name: 'Mariana P.', date: 'Ago 2026', rating: 5, text: 'Excelente tutora. Explica de forma clara y paciente. Recomendadísima.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format' },
  { name: 'Felipe O.', date: 'Jul 2026', rating: 5, text: 'Pude entender derivadas en una sola sesión. Muy buena metodología.', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&auto=format' },
  { name: 'Isabella V.', date: 'Jul 2026', rating: 4, text: 'Muy puntual y profesional. El contenido fue exactamente lo que necesitaba.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&auto=format' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

export default function TutorProfile(props: NavProps) {
  const tutor = props.selectedTutor

  return (
    <DashboardLayout {...props} activeScreen="search">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => props.navigate('search')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5548C8] transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a resultados
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#EAE1CD]">
              <div className="flex gap-5 mb-5">
                <div className="relative shrink-0">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-24 h-24 rounded-2xl object-cover bg-indigo-100"
                  />
                  {tutor.available && (
                    <span className="absolute -top-1.5 -right-1.5 bg-green-400 text-white text-[10px] font-700 px-2 py-0.5 rounded-full">
                      🟢 Disponible
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-2xl font-700 text-[#221A3A]">{tutor.name}</h1>
                    {tutor.verified && (
                      <div className="flex items-center gap-1 bg-indigo-50 text-[#5548C8] text-xs font-600 px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verificado
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 mb-2">{tutor.subject}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Stars rating={Math.round(tutor.rating)} />
                    <span className="font-700 text-[#221A3A]">{tutor.rating}</span>
                    <span className="text-gray-400 text-sm">· {tutor.reviews} reseñas</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    <span>📍 {tutor.location}</span>
                    <span>·</span>
                    <span>🎓 {tutor.experience} de experiencia</span>
                    <span>·</span>
                    <span>✅ {tutor.sessions} sesiones</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">{tutor.bio}</p>
            </div>

            {/* Especialidades */}
            <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#EAE1CD]">
              <h2 className="font-700 text-[#221A3A] mb-4">Especialidades</h2>
              <div className="flex flex-wrap gap-2">
                {tutor.tags.map((tag) => (
                  <span key={tag} className="bg-indigo-50 text-[#5548C8] text-sm font-500 px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modalities & Pricing */}
            <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#EAE1CD]">
              <h2 className="font-700 text-[#221A3A] mb-4">Modalidades y precios</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💻</span>
                    <div>
                      <p className="font-600 text-[#221A3A]">Virtual</p>
                      <p className="text-xs text-gray-500">Videollamada con pantalla compartida</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-700 text-[#5548C8]">${tutor.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">/hora</p>
                  </div>
                </div>
                {tutor.modalities.includes('Presencial') && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-[#EAE1CD]">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📍</span>
                      <div>
                        <p className="font-600 text-[#221A3A]">Presencial</p>
                        <p className="text-xs text-gray-500">{tutor.location} · lugar acordado</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-700 text-[#221A3A]">${tutor.pricePresencial.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">/hora</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#EAE1CD]">
              <h2 className="font-700 text-[#221A3A] mb-4">Disponibilidad esta semana</h2>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { day: 'Lun', slots: ['09:00', '10:00', '14:00'] },
                  { day: 'Mar', slots: ['10:00', '11:00', '15:00', '16:00'] },
                  { day: 'Mié', slots: [] },
                  { day: 'Jue', slots: ['09:00', '14:00'] },
                  { day: 'Vie', slots: ['10:00', '11:00'] },
                ].map(({ day, slots }) => (
                  <div key={day} className="text-center">
                    <p className="text-xs font-600 text-gray-500 mb-2">{day}</p>
                    <div className="space-y-1">
                      {slots.length > 0 ? slots.slice(0, 3).map((s) => (
                        <button
                          key={s}
                          onClick={() => props.navigate('booking')}
                          className="w-full text-xs bg-indigo-50 text-[#5548C8] font-500 py-1 rounded-lg hover:bg-[#5548C8] hover:text-white transition-colors"
                        >
                          {s}
                        </button>
                      )) : (
                        <div className="text-[10px] text-gray-300 py-1">No disp.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#EAE1CD]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-700 text-[#221A3A]">Opiniones ({tutor.reviews})</h2>
                <div className="flex items-center gap-2">
                  <Stars rating={5} />
                  <span className="font-700 text-[#221A3A]">{tutor.rating}</span>
                </div>
              </div>

              <div className="space-y-5">
                {reviews.map((r) => (
                  <div key={r.name} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover bg-indigo-100" />
                      <div>
                        <p className="font-600 text-sm text-[#221A3A]">{r.name}</p>
                        <div className="flex items-center gap-2">
                          <Stars rating={r.rating} />
                          <span className="text-xs text-gray-400">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-[#FFFDF8] rounded-2xl p-6 border border-[#EAE1CD] shadow-lg">
              <div className="text-center mb-5 pb-5 border-b border-[#EAE1CD]">
                <p className="text-sm text-gray-500 mb-1">Precio por hora</p>
                <div className="text-3xl font-700 text-[#221A3A]">
                  ${tutor.price.toLocaleString()}
                  <span className="text-base font-400 text-gray-400 ml-1">COP</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <Stars rating={Math.round(tutor.rating)} />
                  <span className="text-sm text-gray-500">{tutor.rating} · {tutor.reviews} reseñas</span>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Responde en menos de 1 hora
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Primera sesión con garantía
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Perfil verificado
                </div>
              </div>

              <button
                onClick={() => props.navigate('booking')}
                className="w-full bg-[#5548C8] text-white font-700 py-4 rounded-xl hover:bg-[#4338CA] transition-colors text-sm"
              >
                Reservar tutoría
              </button>
              <button
                onClick={() => props.navigate('messages')}
                className="w-full mt-2 border border-[#E4DAC6] text-[#3A3348] font-500 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Enviar mensaje
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Sin cargos hasta confirmar la sesión
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

