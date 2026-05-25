"use client";

import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { track } from "@/lib/analytics";

// TODO: cambia /hero-house.png por una foto editorial específica de la
// campaña de hipotecas cuando la tengas. Mantén ratio ~16:9 y peso < 400KB.
export default function Hero() {
  const scrollToForm = () => {
    track("cta_click", { cta_location: "hero" });
    const el = document.getElementById("lead-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-white"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-house.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Velo blanco para legibilidad sin perder la imagen */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/55 to-white/95"
        />
      </div>

      <div className="container mx-auto px-6 py-28 md:py-40 lg:py-48">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-[2.25rem] leading-tight text-[#141313] sm:text-[2.75rem] lg:text-[3.5rem]">
            <span className="font-bold">Tu hipoteca, en las mejores manos.</span>
          </h1>
          <p className="mt-5 text-base text-[#545454] sm:text-lg">
            Negociamos con más de 20 bancos para conseguirte la mejor oferta.
            Análisis gratuito en 48h.
          </p>
          <button
            type="button"
            onClick={scrollToForm}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#BFFF00] px-6 py-3.5 text-base font-bold text-[#141313] hover:opacity-90 transition-opacity"
          >
            Quiero mi análisis gratis
            <ArrowRightIcon size={18} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
}
