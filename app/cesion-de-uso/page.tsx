"use client";

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  TrendUp,
  CheckCircle,
  ArrowRight,
  CaretDown,
} from '@phosphor-icons/react';
import Navbar from '@/components/Navbar';
import GrainOverlay from '@/components/GrainOverlay';
import Footer from '@/components/Footer';
import CertificationBadge from '@/components/CertificationBadge';
import { sendGTMEvent } from '@next/third-parties/google'

const VideoSection = dynamic(() => import('@/components/VideoSection'), {
  ssr: false,
});

const ReviewsSlider = dynamic(() => import('@/components/ReviewsSlider'), {
  ssr: false,
});

const LandingPage = () => {
  const scrollToSection = (id: string, event: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    sendGTMEvent({ event: 'buttonClicked', value: event })
  };


  return (
    <div className="font-sans antialiased text-[#141313] bg-white selection:bg-[#BFFF00] selection:text-[#141313]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/cesion-hero-mobile.jpg"
            alt="Pareja feliz mudándose a su nuevo hogar"
            fill
            priority
            sizes="100vw"
            className="object-cover md:hidden"
          />
          <Image
            src="/cesion-hero-desktop.jpg"
            alt="Pareja feliz mudándose a su nuevo hogar"
            fill
            priority
            sizes="100vw"
            className="hidden object-cover md:block"
          />
        </div>

        {/* Gradient overlay — white from left for text readability, transparent on right to reveal photo */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white via-white/95 to-white/50 lg:via-white/80 lg:to-transparent" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-5 sm:px-6">
          <div className="max-w-lg pt-24 pb-10 sm:pt-28 lg:max-w-xl lg:py-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#141313] px-3 py-1.5 text-xs font-semibold text-[#BFFF00] sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#BFFF00] animate-pulse" />
              Revolucionamos el acceso a la vivienda
            </div>

            <h1 className="mb-5 font-display text-[2rem] font-bold text-[#141313] sm:mb-6 sm:text-[2.5rem] lg:text-[3.5rem]">
              Tu primera vivienda, <br />
              <span className="underline decoration-[#BFFF00] decoration-[6px] underline-offset-4">
                sin la barrera de la entrada
              </span>
            </h1>

            <p className="mb-7 max-w-xl text-base leading-relaxed text-[#545454] sm:mb-8 sm:text-lg lg:text-xl">
              ¿Puedes pagar una hipoteca pero no la entrada? Transformamos el alquiler futuro en tu entrada actual. Conviértete en propietario desde el día 1 con tan solo un 5% de ahorro.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="/calculadora"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#BFFF00] px-6 py-3.5 text-base font-bold text-[#141313] transition-all hover:translate-y-[-2px] sm:w-auto sm:px-8 sm:py-4 sm:text-lg cursor-pointer"
              >
                Analizar mi caso gratis
                <ArrowRight size={20} weight="fill" />
              </a>
              <button
                onClick={() => scrollToSection('cómo-funciona', 'como-funciona')}
                className="w-full rounded-lg border-2 border-[#141313]/20 bg-white/60 backdrop-blur-sm px-6 py-3.5 text-base font-bold text-[#141313] transition-all hover:bg-white/80 sm:w-auto sm:px-8 sm:py-4 sm:text-lg cursor-pointer"
              >
                Ver cómo funciona
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-[#545454] sm:mt-8 sm:gap-4 sm:text-sm">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Usuario" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Usuario" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="Usuario" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Usuario" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
              </div>
              <p>Más de <span className="font-bold text-[#141313]">500+</span> propietarios felices</p>
            </div>

            <div className="mt-6 sm:mt-7">
              <CertificationBadge framed />
            </div>
          </div>
        </div>

        {/* Floating stat card — desktop only, over the image area */}
        <div className="absolute bottom-12 right-12 z-20 hidden lg:block rounded-2xl border border-[#D6D6D6] bg-white/90 p-5 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#9D9D9D]">Ahorro medio en entrada</p>
          <p className="text-3xl font-bold text-[#141313]">-50.000€</p>
          <div className="mt-1 flex items-center gap-1.5">
            <CheckCircle size={14} weight="fill" className="text-[#141313]" />
            <span className="text-xs text-[#545454]">Propietario desde el día 1</span>
          </div>
        </div>
      </header>

      {/* --- VIDEO EXPLAINER --- */}
      <VideoSection playbackId="02LkyVlxls01u2OFEyVqk00ZLuMVNM9FxaBtAfSNQcVr02g" />

      {/* --- SOCIAL PROOF / REVIEWS --- */}
      <section id="reseñas" className="relative py-28 bg-white overflow-hidden">
        <GrainOverlay />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9D9D9D] mb-4">Testimonios</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#141313] mb-5">
              Historias reales, <br className="hidden sm:block" />
              <span className="underline decoration-[#BFFF00] decoration-[5px] underline-offset-4">viviendas reales</span>
            </h2>
            <p className="text-[#545454] text-lg leading-relaxed">Ellos ya consiguieron su casa sin tener que ahorrar durante 10 años.</p>
          </div>

          <ReviewsSlider />
        </div>
      </section>

      {/* --- WHY FORMULA HOGAR --- */}
      <section id="beneficios" className="py-28 overflow-hidden relative bg-[#141313]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9D9D9D] mb-4">Ventajas</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-8">
                ¿Por qué elegir <br />
                <span className="underline decoration-[#BFFF00] decoration-[5px] underline-offset-4">Fórmula Hogar</span>?
              </h2>
              <ul className="space-y-6">
                {[
                  "Compras a precio de hoy, mientras el precio sigue subiendo.",
                  "Sin comisiones ocultas: No cobramos al vendedor ni inflamos precios.",
                  "Intermediario integral: Coordinamos banco, adelanto de rentas, comprador y gestión del alquiler.",
                  "Compras sin tener que aportar enormes cantidades de dinero para la entrada."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 p-1 bg-[#BFFF00] rounded-full">
                      <CheckCircle size={16} weight="fill" className="text-[#141313]" />
                    </div>
                    <span className="text-lg text-[#D6D6D6]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <a href="/calculadora" className="inline-block px-8 py-4 bg-[#BFFF00] text-[#141313] font-bold rounded-lg transition-colors cursor-pointer">
                  Quiero agendar una llamada
                </a>
              </div>
            </div>

            <div className="lg:w-1/2">
              {/* Visual Representation of Savings & Growth */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 relative overflow-hidden group hover:border-[#BFFF00]/30 transition-colors duration-500">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-white text-xl font-bold flex items-center gap-2 mb-2">
                        <TrendUp size={24} weight="fill" className="text-[#BFFF00]" />
                        Plusvalía Automática
                      </h3>
                      <p className="text-[#9D9D9D] text-sm max-w-xs">
                        Tu vivienda se revaloriza mientras pagas tu entrada.
                      </p>
                    </div>
                    <div className="bg-[#BFFF00]/20 text-[#BFFF00] px-3 py-1 rounded-lg text-xs font-bold border border-[#BFFF00]/30 animate-pulse">
                      +12.5% Estimado
                    </div>
                  </div>

                  {/* Chart Container */}
                  <div className="relative h-60 w-full mt-4">
                    <div className="absolute inset-0 z-10">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 60" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#BFFF00" stopOpacity="0" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        <line x1="0" y1="15" x2="100" y2="15" stroke="white" strokeOpacity="0.05" strokeDasharray="2" />
                        <line x1="0" y1="30" x2="100" y2="30" stroke="white" strokeOpacity="0.05" strokeDasharray="2" />
                        <line x1="0" y1="45" x2="100" y2="45" stroke="white" strokeOpacity="0.05" strokeDasharray="2" />

                        <path
                          d="M0,45 C30,42 60,25 100,10 V60 H0 Z"
                          fill="url(#chartGradient)"
                          className="transition-all duration-1000 ease-out"
                        />

                        <path
                          d="M0,45 C30,42 60,25 100,10"
                          fill="none"
                          stroke="#BFFF00"
                          strokeWidth="0.8"
                          strokeLinecap="round"
                          filter="url(#glow)"
                          className="drop-shadow-[0_0_8px_rgba(191,255,0,0.5)]"
                        />
                      </svg>

                      <div className="absolute left-0 top-[75%] w-3 h-3 bg-white border-2 border-[#BFFF00] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg z-20"></div>

                      <div className="absolute right-0 top-[16.66%] w-3 h-3 bg-[#BFFF00] border-2 border-white rounded-full translate-x-1/2 -translate-y-1/2 shadow-lg z-20 animate-pulse">
                        <div className="absolute inset-0 w-full h-full bg-[#BFFF00] rounded-full animate-ping opacity-30"></div>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 text-right z-30 -mt-6">
                      <div className="bg-[#141313] border border-[#BFFF00] px-3 py-1 rounded-lg shadow-lg">
                        <p className="text-[#BFFF00] font-bold text-lg leading-none">225.000€</p>
                        <p className="text-[10px] text-[#D6D6D6] uppercase tracking-wider mt-1">Valor Futuro</p>
                      </div>
                    </div>

                    <div className="absolute top-[55%] left-0 z-30 -translate-y-1/2">
                      <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                        <p className="text-white font-bold text-lg leading-none">200.000€</p>
                        <p className="text-[10px] text-[#9D9D9D] uppercase tracking-wider mt-1">Precio Compra</p>
                      </div>
                    </div>

                    <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-[#9D9D9D] font-medium uppercase tracking-widest z-30">
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

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="relative py-28 bg-white overflow-hidden">
        <GrainOverlay />
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9D9D9D] mb-4">Resolvemos tus dudas</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#141313]">
              Preguntas <span className="underline decoration-[#BFFF00] decoration-[5px] underline-offset-4">Frecuentes</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "¿Qué es Fórmula Hogar?", a: "Fórmula Hogar es una solución financiera-operativa, no una inmobiliaria. Combinamos hipoteca + adelanto de rentas + gestión del uso para que puedas comprar tu casa sin pagar la entrada, cediendo el uso durante unos años. Tú compras; un tercero usa tu vivienda temporalmente." },
              { q: "¿Soy propietario desde el primer día?", a: "Sí. Desde que firmas en notaría, la vivienda es 100% tuya. Lo único que cedes temporalmente es el uso y el cobro del alquiler, que sirven para financiar tu entrada. Esta mecánica está explicada en el proceso operativo oficial de FH." },
              { q: "¿Cuánto tiempo cedo el uso?", a: "Depende del dinero que necesites para cubrir la entrada, puedes elegir entre 1 y 5 años según tus intereses." },
              { q: "¿Qué requisitos necesito?", a: "Solo dos: Ingresos estables para obtener hipoteca (capacidad real de pago). Un mínimo del 5% aprox. para cubrir los gastos iniciales de gestión (tasación, notaría, validaciones). " },
              { q: "¿Puedo elegir la vivienda que quiero comprar?", a: "Sí. Tú eliges la vivienda y nuestro equipo valida que el precio sea coherente con la tasación bancaria y que la operación sea viable. FH no vende stock: te guiamos para que compres tu casa, no una que nos interese a nosotros. " },
              { q: "¿Qué pasa si quiero vender mi vivienda actual?", a: "Te ayudamos sin coste. Tenemos compradores preaprobados capaces de cerrar rápido operaciones que suelen estar bloqueadas por falta de entrada." }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-[#EBEBEB] rounded-xl p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between font-bold text-[#141313] group-hover:text-[#545454] transition-colors">
                  {faq.q}
                  <CaretDown size={20} weight="fill" className="transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-[#545454] leading-relaxed text-sm">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA / FORM SECTION --- */}
      <section id="formulario" className="py-28 bg-[#141313]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9D9D9D] mb-4">Da el primer paso</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#141313] mb-4">
              ¿Listo para ser <span className="underline decoration-[#BFFF00] decoration-[5px] underline-offset-4">propietario</span>?
            </h2>
            <p className="text-[#545454] text-lg mb-8">Calcula en 2 minutos cuánto puedes ahorrar en la entrada de tu vivienda.</p>

            <a
              href="/calculadora"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#BFFF00] text-[#141313] font-bold rounded-lg text-xl transition-all hover:scale-105 cursor-pointer"
            >
              Calcular mi ahorro ahora
              <ArrowRight size={24} weight="fill" />
            </a>
            <p className="text-xs text-[#9D9D9D] mt-6">Sin compromiso • Cálculo instantáneo • 100% gratis</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

export default LandingPage;
