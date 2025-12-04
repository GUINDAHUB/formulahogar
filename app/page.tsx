"use client";

import React from 'react';
import {
  Home,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Users
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import LogoSlider from '@/components/LogoSlider';
import ReviewsSlider from '@/components/ReviewsSlider';
import VideoSection from '@/components/VideoSection';
import { SpeedInsights } from "@vercel/speed-insights/next"

const LandingPage = () => {
  const colors = {
    darkGreen: '#163C2E',
    lightGreen: '#28A77D',
    white: '#FFFFFF',
    offWhite: '#F8FAFC',
    textDark: '#1E293B',
    textLight: '#94A3B8'
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans antialiased text-slate-800 bg-white selection:bg-[#28A77D] selection:text-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" style={{ backgroundColor: colors.darkGreen }}>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#28A77D] text-sm font-semibold mb-6 border border-[#28A77D]/30 backdrop-blur-sm animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-[#28A77D] animate-pulse"></span>
                Revolucionamos el acceso a la vivienda
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Tu primera vivienda, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28A77D] to-emerald-300">
                sin la barrera de la entrada
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                ¿Puedes pagar una hipoteca pero no la entrada? Transformamos el alquiler futuro en tu entrada actual. Conviértete en propietario desde el día 1 con tan solo un 5% de ahorro.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/calculadora"
                  className="px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:translate-y-[-2px] hover:shadow-2xl shadow-lg hover:shadow-[#28A77D]/20"
                  style={{ backgroundColor: colors.lightGreen, color: colors.white }}
                >
                  Analizar mi caso gratis
                  <ArrowRight className="w-5 h-5" />
                </a>
                <button
                  onClick={() => scrollToSection('cómo-funciona')}
                  className="px-8 py-4 rounded-xl font-bold text-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  Ver cómo funciona
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-600 border-2 border-[#163C2E] flex items-center justify-center text-xs font-bold text-white">
                      {/* Placeholder avatars */}
                      <Users className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                <p>Más de <span className="text-white font-bold">500+</span> propietarios felices</p>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500 border border-slate-100">
                {/* Image Section */}
                <div className="relative h-48 w-full">
                  <img
                    src="/hero-house.png"
                    alt="Interior vivienda moderna"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="text-xs font-medium opacity-90">Tu futuro hogar</p>
                    <p className="font-bold">Madrid, Centro</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-[#163C2E]">
                    DISPONIBLE
                  </div>
                </div>

                {/* Simulation Content */}
                <div className="p-6 lg:p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#163C2E]">Simulación Real</h3>
                      <p className="text-slate-500 text-sm">Apartamento en Madrid</p>
                    </div>
                    <div className="bg-green-100 text-[#163C2E] px-3 py-1 rounded-full text-xs font-bold">
                      APROBADO
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                      <span className="text-slate-600 font-medium">Precio Vivienda</span>
                      <span className="text-xl font-bold text-[#163C2E]">200.000€</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border-2 border-slate-100 opacity-50">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Entrada Tradicional</p>
                        <p className="text-2xl font-bold text-slate-400">60.000€</p>
                        <p className="text-xs text-red-400 font-medium mt-1">Necesitas 30%</p>
                      </div>
                      <div className="p-4 rounded-xl border-2 bg-[#F0FDF4] border-[#28A77D]">
                        <p className="text-xs text-[#163C2E] uppercase font-bold mb-1">Entrada Fórmula Hogar</p>
                        <p className="text-3xl font-bold text-[#28A77D]">0 €</p>
                        <p className="text-xs text-[#28A77D] font-medium mt-1">Solo necesitas 5%</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#163C2E] flex items-center justify-center text-white">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-[#163C2E]">Propietario desde el día 1</p>
                          <p className="text-xs text-slate-500">Firmas en notaría inmediatamente</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#28A77D] text-white p-4 rounded-xl shadow-xl z-20 hidden md:block animate-bounce-slow">
                <p className="text-xs font-bold opacity-80">AHORRO EN ENTRADA</p>
                <p className="text-2xl font-bold">-60.000€</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- VIDEO EXPLAINER --- */}
      <VideoSection />

      {/* --- TRUST BADGES --- */}
      {/* <section className="py-10 border-b border-slate-100 bg-white">
        <div className="container mx-auto px-6">
          <p className="text-sm font-semibold text-slate-400 mb-8 uppercase tracking-wider text-center">Confianza en nosotros</p>
          <LogoSlider />
        </div>
      </section> */}

      {/* --- SOCIAL PROOF / REVIEWS --- */}
      <section id="reseñas" className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163C2E] mb-4">Historias reales, viviendas reales</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Ellos ya consiguieron su casa sin tener que ahorrar durante 10 años.</p>
          </div>

          <ReviewsSlider />
        </div>
      </section>

      {/* --- WHY FORMULA HOGAR --- */}
      <section id="beneficios" className="py-20 overflow-hidden relative" style={{ backgroundColor: colors.darkGreen }}>
        {/* Decorative circle */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#28A77D] rounded-full opacity-10 blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                ¿Por qué elegir <br />
                <span className="text-[#28A77D]">Fórmula Hogar?</span>
              </h2>
              <ul className="space-y-6">
                {[
                  "Compras a precio de hoy, mientras el precio sigue subiendo.",
                  "Sin comisiones ocultas: No cobramos al vendedor ni inflamos precios.",
                  "Intermediario integral: Coordinamos banco, adelanto de rentas, comprador y gestión del alquiler.",
                  "Compras sin tener que aportar enormes cantidades de dinero para la entrada."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 p-1 bg-[#28A77D] rounded-full">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <a href="/calculadora" className="inline-block px-8 py-4 bg-[#28A77D] text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                  Quiero agendar una llamada
                </a>
              </div>
            </div>

            <div className="lg:w-1/2">
              {/* Visual Representation of Savings & Growth */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 relative overflow-hidden group hover:border-[#28A77D]/30 transition-colors duration-500">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-white text-xl font-bold flex items-center gap-2 mb-2">
                        <TrendingUp className="text-[#28A77D]" />
                        Plusvalía Automática
                      </h3>
                      <p className="text-slate-400 text-sm max-w-xs">
                        Tu vivienda se revaloriza mientras pagas tu entrada.
                      </p>
                    </div>
                    <div className="bg-[#28A77D]/20 text-[#28A77D] px-3 py-1 rounded-lg text-xs font-bold border border-[#28A77D]/30 animate-pulse">
                      +12.5% Estimado
                    </div>
                  </div>

                  {/* Chart Container */}
                  <div className="relative h-60 w-full mt-4">
                    {/* Wrapper for SVG and Dots ensuring shared coordinate space */}
                    <div className="absolute inset-0 z-10">
                      {/* SVG Graph */}
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 60" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#28A77D" stopOpacity="0.5"/>
                            <stop offset="100%" stopColor="#28A77D" stopOpacity="0"/>
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        
                        {/* Grid Lines Horizontal */}
                        <line x1="0" y1="15" x2="100" y2="15" stroke="white" strokeOpacity="0.05" strokeDasharray="2" />
                        <line x1="0" y1="30" x2="100" y2="30" stroke="white" strokeOpacity="0.05" strokeDasharray="2" />
                        <line x1="0" y1="45" x2="100" y2="45" stroke="white" strokeOpacity="0.05" strokeDasharray="2" />

                        {/* Area Path */}
                        <path 
                          d="M0,45 C30,42 60,25 100,10 V60 H0 Z" 
                          fill="url(#chartGradient)" 
                          className="transition-all duration-1000 ease-out"
                        />
                        
                        {/* Line Path */}
                        <path 
                          d="M0,45 C30,42 60,25 100,10" 
                          fill="none" 
                          stroke="#28A77D" 
                          strokeWidth="0.8" 
                          strokeLinecap="round"
                          filter="url(#glow)"
                          className="drop-shadow-[0_0_8px_rgba(40,167,125,0.5)]"
                        />
                      </svg>

                      {/* Absolute Positioned Dots (Inside the same wrapper as SVG) */}
                      {/* Start Point - Corresponds to 0,45 in 100x60 viewBox -> Top: 75%, Left: 0% */}
                      <div className="absolute left-0 top-[75%] w-3 h-3 bg-white border-2 border-[#28A77D] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-emerald-500/50 z-20"></div>

                      {/* End Point - Corresponds to 100,10 in 100x60 viewBox -> Top: 16.66%, Left: 100% */}
                      <div className="absolute right-0 top-[16.66%] w-3 h-3 bg-[#28A77D] border-2 border-white rounded-full translate-x-1/2 -translate-y-1/2 shadow-lg shadow-emerald-500/50 z-20 animate-pulse">
                        <div className="absolute inset-0 w-full h-full bg-[#28A77D] rounded-full animate-ping opacity-30"></div>
                      </div>
                    </div>

                    {/* Labels placed absolutely relative to the main container */}
                    <div className="absolute top-0 right-0 text-right z-30 -mt-6">
                      <div className="bg-[#163C2E] border border-[#28A77D] px-3 py-1 rounded-lg shadow-lg">
                        <p className="text-[#28A77D] font-bold text-lg leading-none">225.000€</p>
                        <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-1">Valor Futuro</p>
                      </div>
                    </div>
                    
                    {/* Moved Start Label higher (approx 55% top) to sit above the line start (75%) */}
                    <div className="absolute top-[55%] left-0 z-30 -translate-y-1/2">
                      <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                        <p className="text-white font-bold text-lg leading-none">200.000€</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Precio Compra</p>
                      </div>
                    </div>

                    {/* X Axis Labels */}
                    <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-slate-500 font-medium uppercase tracking-widest z-30">
                      <span>Hoy</span>
                      <span>Año 1</span>
                      <span>Año 2</span>
                      <span>Año 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMPARISON TABLE --- */}
      {/* <section id="comparativa" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163C2E]">La Comparativa Definitiva</h2>
            <p className="text-slate-600 mt-4">¿Por qué seguir alquilando si puedes comprar?</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            <div className="grid grid-cols-3 bg-[#163C2E] text-white p-6 text-sm md:text-base font-bold text-center">
              <div className="flex items-center justify-center">Concepto</div>
              <div className="flex items-center justify-center opacity-70">Tradicional</div>
              <div className="flex items-center justify-center text-[#28A77D] bg-white/10 rounded-lg py-2">Fórmula Hogar</div>
            </div>

            {[
              { label: "Ahorro Necesario", trad: "30% (Entrada + Gastos)", formula: "Solo 5%", highlight: true },
              { label: "Propiedad", trad: "Inmediata", formula: "Inmediata (Desde día 1)" },
              { label: "Uso de la vivienda", trad: "Inmediato", formula: "Tras 2-3 años (Cesión)" },
              { label: "Esfuerzo Financiero", trad: "Muy Alto", formula: "Muy Bajo", highlight: true },
              { label: "Revalorización", trad: "Sí", formula: "Sí (Ganas desde la firma)" },
            ].map((row, idx) => (
              <div key={idx} className={`grid grid-cols-3 p-6 text-center border-b border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <div className="text-left font-semibold text-slate-700">{row.label}</div>
                <div className="text-slate-500">{row.trad}</div>
                <div className={`font-bold ${row.highlight ? 'text-[#28A77D]' : 'text-[#163C2E]'}`}>{row.formula}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-[#163C2E] text-center mb-12">Preguntas Frecuentes</h2>

          <div className="space-y-4">
            {[
              { q: "¿Qué es Fórmula Hogar?", a: "Fórmula Hogar es una solución financiera-operativa, no una inmobiliaria. Combinamos hipoteca + adelanto de rentas + gestión del uso para que puedas comprar tu casa sin pagar la entrada, cediendo el uso durante unos años. Tú compras; un tercero usa tu vivienda temporalmente." },
              { q: "¿Soy propietario desde el primer día?", a: "Sí. Desde que firmas en notaría, la vivienda es 100% tuya. Lo único que cedes temporalmente es el uso y el cobro del alquiler, que sirven para financiar tu entrada. Esta mecánica está explicada en el proceso operativo oficial de FH." },
              { q: "¿Cuánto tiempo cedo el uso?", a: "Depende del dinero que necesites para cubrir la entrada, puedes elegir entre 1 y 5 años según tus intereses." },
              { q: "¿Qué requisitos necesito?", a: "Solo dos: Ingresos estables para obtener hipoteca (capacidad real de pago). Un mínimo del 5% aprox. para cubrir los gastos iniciales de gestión (tasación, notaría, validaciones). " },
              { q: "¿Puedo elegir la vivienda que quiero comprar?", a: "Sí. Tú eliges la vivienda y nuestro equipo valida que el precio sea coherente con la tasación bancaria y que la operación sea viable. FH no vende stock: te guiamos para que compres tu casa, no una que nos interese a nosotros. " },
              { q: "¿Qué pasa si quiero vender mi vivienda actual?", a: "Te ayudamos sin coste. Tenemos compradores preaprobados capaces de cerrar rápido operaciones que suelen estar bloqueadas por falta de entrada." }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-slate-50 rounded-xl p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between font-bold text-[#163C2E] group-hover:text-[#28A77D] transition-colors">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed text-sm">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA / FORM SECTION --- */}
      <section id="formulario" className="py-20" style={{ backgroundColor: colors.darkGreen }}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-[#163C2E] mb-4">¿Listo para ser propietario?</h2>
            <p className="text-slate-600 mb-8">Calcula en 2 minutos cuánto puedes ahorrar en la entrada de tu vivienda con nuestra calculadora interactiva.</p>

            <a
              href="/calculadora"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#28A77D] text-white font-bold rounded-xl text-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Calcular mi ahorro ahora
              <ArrowRight className="w-6 h-6" />
            </a>
            <p className="text-xs text-slate-400 mt-6">Sin compromiso • Cálculo instantáneo • 100% gratis</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0f291e] text-slate-400 py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 font-bold text-2xl text-white mb-4 md:mb-0">
              <Home className="w-6 h-6 text-[#28A77D]" />
              FórmulaHogar
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Aviso Legal</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
          <div className="text-center md:text-left text-xs opacity-60">
            © {new Date().getFullYear()} Fórmula Hogar. Todos los derechos reservados. Una revolución en el sector PropTech.
          </div>
        </div>
      </footer>
      <SpeedInsights />
    </div>
  );
};

export default LandingPage;