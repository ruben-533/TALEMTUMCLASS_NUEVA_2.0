import { useState } from 'react'
import type { NavProps } from '@/app/navigation'
import { TUTORS, CATEGORIES, TESTIMONIALS } from '@/data/tutors'
import logo from '@/assets/logo.png'

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

export default function Landing(props: NavProps) {
  const { navigate } = props
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    navigate('search')
  }

  return (
    <div className="min-h-full bg-[#FFFDF8] font-sans overflow-y-auto">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#EAE1CD]">
        <div className="max-w-7xl mx-auto px-6 flex items-end justify-between" style={{ height: '98px', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '8px' }}>
          <div className="flex items-center gap-2">
            <img src={logo} alt="TALEMTUMCLASS" className="object-contain -m-0.5 rounded-2xl" style={{ width: '49px', height: '55px' }} />
            <span className="text-lg font-700 text-[#221A3A]" style={{ height: '22px', marginLeft: '-9px', marginRight: '-9px' }}>TALEMTUMCLASS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#como-funciona" className="hover:text-[#5548C8] transition-colors">Cómo funciona</a>
            <a href="#categorias" className="hover:text-[#5548C8] transition-colors">Materias</a>
            <a href="#tutores" className="hover:text-[#5548C8] transition-colors">Tutores</a>
            <a href="#testimonios" className="hover:text-[#5548C8] transition-colors">Testimonios</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('login')}
              className="text-sm font-500 text-[#3A3348] hover:text-[#5548C8] transition-colors"
              style={{ width: '51px', height: '52px' }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate('register')}
              className="text-sm font-500 bg-[#5548C8] text-white rounded-2xl hover:bg-[#4338CA] transition-colors"
              style={{ width: '69px', height: '47px' }}
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #5548C8 80%, #7c3aed 100%)' }}>
        {/* Mesh overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #818cf8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a78bfa 0%, transparent 40%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-white/80 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>+1,200 tutores activos en Colombia</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-800 text-white leading-tight mb-4">
              Encuentra el tutor
              <br />
              <span className="text-indigo-300">que necesitas.</span>
            </h1>

            <p className="text-lg text-white/70 mb-10 leading-relaxed">
              Aprende de expertos y alcanza tus objetivos con tutorías
              <br className="hidden md:block" /> virtuales o presenciales.
            </p>

            {/* Search bar */}
            <div className="flex gap-3 mb-8">
              <div className="flex-1 flex items-center gap-3 bg-[#FFFDF8] rounded-xl px-4 py-3 shadow-lg">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar tutores, materias o temas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 outline-none text-[#2B2140] placeholder-gray-400 text-sm bg-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-[#5548C8] hover:bg-[#4338CA] text-white font-600 px-6 py-3 rounded-xl transition-colors shadow-lg whitespace-nowrap"
              >
                Buscar
              </button>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('search')}
                className="bg-[#FFFDF8] text-[#5548C8] font-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Buscar un tutor
              </button>
              <button
                onClick={() => navigate('register')}
                className="border border-white/30 text-white font-500 px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Quiero ser tutor
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '1,200+', label: 'Tutores activos' },
              { value: '8,500+', label: 'Estudiantes' },
              { value: '24,000+', label: 'Sesiones realizadas' },
              { value: '4.9 ★', label: 'Calificación promedio' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-700 text-white">{stat.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="py-20 bg-[#F7F3E9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-700 text-[#221A3A] mb-3">Categorías populares</h2>
            <p className="text-gray-500">Encuentra el área que mejor se ajusta a tus objetivos</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate('search')}
                className="bg-[#FFFDF8] rounded-2xl p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all border border-[#EAE1CD] group"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-sm font-600 text-[#2B2140] group-hover:text-[#5548C8] transition-colors">{cat.name}</div>
                <div className="text-xs text-gray-400 mt-1">{cat.count} tutores</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured tutors */}
      <section id="tutores" className="py-20 bg-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-700 text-[#221A3A] mb-2">Tutores destacados</h2>
              <p className="text-gray-500">Los mejor valorados por nuestra comunidad</p>
            </div>
            <button onClick={() => navigate('search')} className="text-[#5548C8] font-500 text-sm hover:underline hidden md:block">
              Ver todos →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TUTORS.slice(0, 3).map((tutor) => (
              <div
                key={tutor.id}
                className="bg-[#FFFDF8] border border-[#EAE1CD] rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => { props.selectTutor(tutor.id); navigate('tutor-profile') }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        className="w-14 h-14 rounded-full object-cover bg-indigo-100"
                      />
                      {tutor.available && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-600 text-[#221A3A] truncate">{tutor.name}</h3>
                        {tutor.verified && (
                          <svg className="w-4 h-4 text-[#5548C8] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{tutor.subject}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tutor.bio}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <StarRating rating={tutor.rating} />
                    <span className="text-sm font-600 text-[#221A3A]">{tutor.rating}</span>
                    <span className="text-sm text-gray-400">({tutor.reviews} reseñas)</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tutor.modalities.map((m) => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-[#5548C8] font-500">
                        {m === 'Virtual' ? '💻' : '📍'} {m}
                      </span>
                    ))}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{tutor.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#EAE1CD]">
                    <div>
                      <span className="text-xs text-gray-400">Desde</span>
                      <span className="ml-1 text-base font-700 text-[#221A3A]">${tutor.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">/hora</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); props.selectTutor(tutor.id); navigate('tutor-profile') }}
                      className="text-sm font-500 text-[#5548C8] hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Ver perfil →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <button onClick={() => navigate('search')} className="text-[#5548C8] font-500 text-sm border border-[#5548C8]/30 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
              Ver todos los tutores
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 bg-[#F7F3E9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-700 text-[#221A3A] mb-3">¿Cómo funciona?</h2>
            <p className="text-gray-500">En 3 pasos empieza a aprender con tu tutor ideal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Busca tu tutor',
                desc: 'Filtra por materia, nivel, modalidad, precio y disponibilidad. Revisa perfiles y opiniones.',
              },
              {
                step: '02',
                icon: '📅',
                title: 'Reserva tu sesión',
                desc: 'Elige fecha, hora y modalidad. El tutor confirma tu solicitud en minutos.',
              },
              {
                step: '03',
                icon: '🎓',
                title: 'Aprende y valora',
                desc: 'Conéctate a tu tutoría virtual o preséntate en el lugar acordado. Califica tu experiencia.',
              },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#EAE1CD] h-full">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <div className="text-xs font-700 text-[#5548C8] mb-2 tracking-widest">PASO {step.step}</div>
                  <h3 className="text-xl font-700 text-[#221A3A] mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
                {step.step !== '03' && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10 text-gray-300 text-2xl -translate-y-1/2">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutor disponible ahora */}
      <section className="py-16 bg-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-[#312e81] to-[#5548C8] rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4 text-white/80 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Disponible ahora</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-700 text-white mb-3">⚡ ¿Necesitas ayuda ahora?</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Encuentra tutores disponibles en este momento para tu materia. Sin esperas, sin agendas.
              </p>
              <button
                onClick={() => navigate('available-now')}
                className="bg-[#FFFDF8] text-[#5548C8] font-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Buscar tutor disponible
              </button>
            </div>
            <div className="shrink-0 grid grid-cols-2 gap-3">
              {TUTORS.filter((t) => t.available).slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 border border-white/10">
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-500 text-white truncate max-w-[80px]">{t.name.split(' ')[0]}</div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-[10px] text-white/60">Disponible</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Feature */}
      <section className="py-16 bg-[#F7F3E9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#FFFDF8] rounded-3xl p-10 md:p-14 border border-[#EAE1CD] flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-2xl md:text-3xl font-700 text-[#221A3A] mb-3">Encuentra tu tutor con IA</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Cuéntanos qué necesitas aprender con tus propias palabras y nuestra IA encontrará el tutor perfecto para ti.
              </p>
              <button
                onClick={() => navigate('ai-recommend')}
                className="bg-[#5548C8] text-white font-600 px-6 py-3 rounded-xl hover:bg-[#4338CA] transition-colors"
              >
                Probar ahora
              </button>
            </div>
            <div className="flex-1 bg-[#F7F3E9] rounded-2xl p-6 text-sm">
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#5548C8]/20 flex items-center justify-center text-sm shrink-0">👤</div>
                <div className="bg-[#FFFDF8] rounded-2xl rounded-tl-sm px-4 py-3 text-[#3A3348] shadow-sm">
                  "Necesito ayuda con cálculo diferencial. Tengo un examen esta semana y no entiendo derivadas."
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5548C8] flex items-center justify-center text-sm shrink-0">🤖</div>
                <div className="bg-[#FFFDF8] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="text-[#3A3348] mb-2">Encontré lo que necesitas:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[['Materia', 'Matemáticas'], ['Tema', 'Cálculo diferencial'], ['Nivel', 'Universitario'], ['Objetivo', 'Preparación examen']].map(([k, v]) => (
                      <div key={k}>
                        <span className="text-gray-400">{k}: </span>
                        <span className="font-500 text-[#3A3348]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-20 bg-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-700 text-[#221A3A] mb-3">Lo que dicen nuestros estudiantes</h2>
            <p className="text-gray-500">Más de 8,500 personas ya cambiaron su forma de aprender</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-[#F7F3E9] rounded-2xl p-7 border border-[#EAE1CD]">
                <StarRating rating={t.stars} />
                <p className="text-[#3A3348] leading-relaxed my-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-indigo-100" />
                  <div>
                    <div className="font-600 text-sm text-[#221A3A]">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role} · Tutor: {t.tutor}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#1e1b4b]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-700 text-white mb-4">
            Empieza a aprender hoy
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Únete a más de 8,500 estudiantes que ya encontraron su tutor ideal. Primera sesión con garantía de satisfacción.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('search')}
              className="bg-[#5548C8] text-white font-600 px-8 py-3.5 rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Buscar un tutor
            </button>
            <button
              onClick={() => navigate('register')}
              className="border border-white/20 text-white font-500 px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Quiero ser tutor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src={logo} alt="TALEMTUMCLASS" className="h-8 w-auto object-contain brightness-200" />
                <span className="text-white font-600">TALEMTUMCLASS</span>
              </div>
              <p className="text-sm leading-relaxed">Conectamos estudiantes con tutores calificados en toda Colombia.</p>
            </div>
            {[
              { title: 'Plataforma', links: ['Buscar tutores', 'Ser tutor', 'Precios', 'Lumen IA'] },
              { title: 'Soporte', links: ['Centro de ayuda', 'Contáctanos', 'Política de privacidad', 'Términos'] },
              { title: 'Comunidad', links: ['Blog', 'Testimonios', 'Referidos', 'Programa tutores'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-500 text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 pb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <button onClick={() => navigate('screens')} className="hover:text-white transition-colors">Mapa de pantallas</button>
            <button onClick={() => navigate('design-system')} className="hover:text-white transition-colors">Design system</button>
            <button onClick={() => navigate('admin')} className="hover:text-white transition-colors">Panel administrador</button>
            <button onClick={() => navigate('available-now')} className="hover:text-white transition-colors">Tutor disponible ahora</button>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            © 2026 TALEMTUMCLASS. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

