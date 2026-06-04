"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  House,
  CheckCircle,
  ArrowRight,
  Clock,
  Coins,
} from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import GrainOverlay from "@/components/GrainOverlay";
import Footer from "@/components/Footer";
import { sendGTMEvent } from "@next/third-parties/google";

const VideoSection = dynamic(() => import("@/components/VideoSection"), {
  ssr: false,
});

const ReviewsSlider = dynamic(() => import("@/components/ReviewsSlider"), {
  ssr: false,
});

const AlquilerOpcionCompraPage = () => {
  const scrollToSection = (id: string, event: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    sendGTMEvent({ event: "buttonClicked", value: event });
  };

  return (
    <div className="font-sans antialiased text-[#141313] bg-white selection:bg-[#BFFF00] selection:text-[#141313]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/aoc-hero-mobile.jpg"
            alt="Fachada de vivienda para alquiler con opción a compra"
            fill
            priority
            sizes="100vw"
            className="object-cover md:hidden"
          />
          <Image
            src="/aoc-hero-desktop.jpg"
            alt="Fachada de vivienda para alquiler con opción a compra"
            fill
            priority
            sizes="100vw"
            className="hidden object-cover md:block"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white via-white/95 to-white/50 lg:via-white/80 lg:to-transparent" />

        <div className="relative z-10 container mx-auto px-5 sm:px-6">
          <div className="max-w-lg pt-24 pb-10 sm:pt-28 lg:max-w-xl lg:py-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#141313] px-3 py-1.5 text-xs font-semibold text-[#BFFF00] sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#BFFF00] animate-pulse" />
              Alquiler con opción a compra
            </div>

            <h1 className="mb-5 font-display text-[2rem] font-bold text-[#141313] sm:mb-6 sm:text-[2.5rem] lg:text-[3.5rem]">
              Tu camino a la <br />
              <span className="underline decoration-[#BFFF00] decoration-[6px] underline-offset-4">
                vivienda propia empieza aquí
              </span>
            </h1>

            <p className="mb-7 max-w-xl text-base leading-relaxed text-[#545454] sm:mb-8 sm:text-lg lg:text-xl">
              Vive en tu futura casa hoy mientras construyes la entrada. Sin
              bancos iniciales, sin papeleo complicado.
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
                onClick={() =>
                  scrollToSection("como-funciona", "como-funciona-btn")
                }
                className="w-full rounded-lg border-2 border-[#141313]/20 bg-white/60 backdrop-blur-sm px-6 py-3.5 text-base font-bold text-[#141313] transition-all hover:bg-white/80 sm:w-auto sm:px-8 sm:py-4 sm:text-lg cursor-pointer"
              >
                ¿Cómo funciona?
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-[#545454] sm:mt-8 sm:gap-4 sm:text-sm">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <img
                    src="https://randomuser.me/api/portraits/men/12.jpg"
                    alt="Usuario"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <img
                    src="https://randomuser.me/api/portraits/women/24.jpg"
                    alt="Usuario"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <img
                    src="https://randomuser.me/api/portraits/men/46.jpg"
                    alt="Usuario"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <img
                    src="https://randomuser.me/api/portraits/women/58.jpg"
                    alt="Usuario"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <p>
                Más de <span className="font-bold text-[#141313]">500+</span>{" "}
                propietarios felices
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 z-20 hidden lg:block rounded-2xl border border-[#D6D6D6] bg-white/90 p-5 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#9D9D9D]">
            Entrada que construyes
          </p>
          <p className="text-3xl font-bold text-[#141313]">Mes a mes</p>
          <div className="mt-1 flex items-center gap-1.5">
            <CheckCircle size={14} weight="fill" className="text-[#141313]" />
            <span className="text-xs text-[#545454]">
              Con opción real de compra
            </span>
          </div>
        </div>
      </header>

      {/* --- VIDEO EXPLAINER --- */}
      <VideoSection
        playbackId="cJ9ZMRcoDPhxq6Tz11uj6jCdbsmeYBWfOEQIxdGp6Kg"
        steps={[
          {
            icon: <House size={24} weight="fill" />,
            title: "1. Elige tu casa",
            desc: "Busca la vivienda que te gusta y nosotros la analizamos para asegurar su viabilidad.",
          },
          {
            icon: <Coins size={24} weight="fill" />,
            title: "2. Aportación Inicial",
            desc: "Entras con una cuota reducida, mucho menor que la entrada tradicional de un banco.",
          },
          {
            icon: <Clock size={24} weight="fill" />,
            title: "3. Vive y Ahorra",
            desc: "Pagas un alquiler y una cuota extra que se acumula para tu futura entrada.",
          },
          {
            icon: <CheckCircle size={24} weight="fill" />,
            title: "4. Compra tu Hogar",
            desc: "A los 3-7 años ejerces tu opción de compra con la entrada ya generada.",
          },
        ]}
      />

      {/* --- HOW IT WORKS --- */}
      <section id="como-funciona" className="relative py-28 bg-white overflow-hidden">
        <GrainOverlay />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9D9D9D] mb-4">
              Proceso
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#141313] mb-5">
              ¿Cómo funciona, <br className="hidden sm:block" />
              <span className="underline decoration-[#BFFF00] decoration-[5px] underline-offset-4">
                paso a paso
              </span>
              ?
            </h2>
            <p className="text-[#545454] text-lg leading-relaxed">
              Un proceso sencillo y transparente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Eliges la vivienda que te gusta",
                description:
                  "Y la analizamos para confirmar que cumple criterios de seguridad y viabilidad.",
              },
              {
                step: "02",
                title: "Un inversor la compra por ti",
                description: "Tú te mudas desde el primer día.",
              },
              {
                step: "03",
                title: "Entras con una cuota inicial reducida",
                description:
                  "Mucho más baja que la entrada tradicional de un banco.",
              },
              {
                step: "04",
                title: "Pagas un alquiler similar al del mercado",
                description: "Con la seguridad de que es tu futura casa.",
              },
              {
                step: "05",
                title: "Aportas una cuota mensual extra",
                description:
                  "Esta cuota se acumula mes a mes para generar tu futura entrada.",
              },
              {
                step: "06",
                title: "A los 3-7 años, compras la vivienda",
                description:
                  "El precio ya está pactado desde el inicio. Sin sorpresas. Y ya tienes tu entrada generada.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative bg-white p-8 rounded-2xl border border-[#D6D6D6] shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-6xl font-bold text-[#EBEBEB] absolute top-4 right-4 pointer-events-none">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-[#141313] mb-3 pr-8">
                    {item.title}
                  </h3>
                  <p className="text-[#545454] text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF / REVIEWS --- */}
      <section id="reseñas" className="relative py-28 bg-white overflow-hidden">
        <GrainOverlay />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9D9D9D] mb-4">
              Testimonios
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#141313] mb-5">
              Historias reales, <br className="hidden sm:block" />
              <span className="underline decoration-[#BFFF00] decoration-[5px] underline-offset-4">
                viviendas reales
              </span>
            </h2>
            <p className="text-[#545454] text-lg leading-relaxed">
              Ellos ya consiguieron su casa sin tener que ahorrar durante 10
              años.
            </p>
          </div>
          <ReviewsSlider />
        </div>
      </section>

      {/* --- BENEFITS --- */}
      <section id="beneficios" className="py-28 overflow-hidden relative bg-[#141313]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9D9D9D] mb-4">
              Ventajas
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Beneficios principales{" "}
              <span className="underline decoration-[#BFFF00] decoration-[5px] underline-offset-4">
                para ti
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                title: "Entra a vivir ya",
                desc: "No esperas años ahorrando para la entrada.",
              },
              {
                title: "Te aseguras el precio de compra",
                desc: "Aunque el mercado suba, tu precio está congelado desde el primer día.",
              },
              {
                title: "Construye tu propia entrada",
                desc: "Automáticamente, mes a mes, sin estrés.",
              },
              {
                title: "Seguridad jurídica",
                desc: "Todo se firma ante notario con contratos claros y transparentes.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-1 p-1 bg-[#BFFF00] rounded-full">
                  <CheckCircle
                    size={16}
                    weight="fill"
                    className="text-[#141313]"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#D6D6D6] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-28 bg-[#141313]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9D9D9D] mb-4">
              ¿Qué necesitas ahora?
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#141313] mb-4">
              Reserva una{" "}
              <span className="underline decoration-[#BFFF00] decoration-[5px] underline-offset-4">
                llamada gratuita
              </span>
            </h2>
            <p className="text-[#545454] text-lg mb-10">
              Analizaremos tu caso y te ayudaremos a buscar tu futuro hogar
              manteniendo este mismo modelo de compra.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
              <div className="flex-1 bg-[#EBEBEB] p-6 rounded-xl border border-[#D6D6D6]">
                <div className="bg-[#BFFF00] w-8 h-8 rounded-full text-[#141313] flex items-center justify-center font-bold mb-4 mx-auto">
                  1
                </div>
                <h3 className="font-bold text-[#141313] mb-2">
                  Rellenar el formulario
                </h3>
                <p className="text-sm text-[#9D9D9D]">Datos económicos básicos</p>
              </div>
              <div className="flex-1 bg-[#EBEBEB] p-6 rounded-xl border border-[#D6D6D6]">
                <div className="bg-[#BFFF00] w-8 h-8 rounded-full text-[#141313] flex items-center justify-center font-bold mb-4 mx-auto">
                  2
                </div>
                <h3 className="font-bold text-[#141313] mb-2">Buscar tu hogar</h3>
                <p className="text-sm text-[#9D9D9D]">Te ayudamos a encontrarlo</p>
              </div>
            </div>

            <a
              href="/calculadora"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#BFFF00] text-[#141313] font-bold rounded-lg text-xl transition-all hover:scale-105 cursor-pointer"
            >
              Empezar ahora
              <ArrowRight size={24} weight="fill" />
            </a>
            <p className="text-xs text-[#9D9D9D] mt-6">
              Sin compromiso • Estudio gratuito • 100% personalizado
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AlquilerOpcionCompraPage;
