"use client";

import Image from "next/image";
import {
  ArrowRightIcon,
  BankIcon,
  CaretDownIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@phosphor-icons/react";
import CertificationBadge from "@/components/CertificationBadge";
import { track } from "@/lib/analytics";

// TODO: cambia /hero-house.png por una foto editorial específica de la
// campaña de hipotecas cuando la tengas. Mantén ratio ~16:9 y peso < 400KB.
export default function Hero() {
  const scrollTo = (id: string, location: string) => {
    track("cta_click", { cta_location: location });
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-white"
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
          className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/55 to-white/95"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.75)_0%,transparent_65%)]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-5 sm:px-6">
        <div className="mx-auto max-w-3xl pb-20 pt-28 text-center sm:pt-32 lg:py-0">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#141313] px-3 py-1.5 text-xs font-semibold text-[#BFFF00] sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#BFFF00] animate-pulse" />
            Hipotecas · Precio fijo
          </div>

          <h1 className="mb-5 font-display text-[2.25rem] font-bold text-[#141313] sm:mb-6 sm:text-[2.75rem] lg:text-[3.75rem]">
            Tu hipoteca, <br />
            <span className="underline decoration-[#BFFF00] decoration-[6px] underline-offset-4">
              en las mejores manos
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[#545454] sm:mb-9 sm:text-lg lg:text-xl">
            Negociamos con más de 20 bancos en paralelo para conseguirte la
            mejor oferta del mercado. Tú comparas, eliges y firmas.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => scrollTo("lead-form", "hero")}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#BFFF00] px-6 py-3.5 text-base font-bold text-[#141313] transition-all hover:translate-y-[-2px] sm:w-auto sm:px-8 sm:py-4 sm:text-lg cursor-pointer"
            >
              Quiero mi análisis gratis
              <ArrowRightIcon size={20} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("como-funciona", "hero-secondary")}
              className="w-full rounded-lg border-2 border-[#141313]/20 bg-white/60 px-6 py-3.5 text-base font-bold text-[#141313] backdrop-blur-sm transition-all hover:bg-white/80 sm:w-auto sm:px-8 sm:py-4 sm:text-lg cursor-pointer"
            >
              ¿Cómo funciona?
            </button>
          </div>

          {/* Prueba de confianza rápida */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#545454] sm:mt-9 sm:gap-x-7 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <BankIcon size={16} weight="fill" className="text-[#141313]" />
              +20 bancos compitiendo
            </span>
            <span aria-hidden className="hidden h-4 w-px bg-[#141313]/15 sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon size={16} weight="fill" className="text-[#141313]" />
              Análisis gratuito en 48h
            </span>
            <span aria-hidden className="hidden h-4 w-px bg-[#141313]/15 sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <CheckCircleIcon size={16} weight="fill" className="text-[#141313]" />
              Precio fijo, sin % de la vivienda
            </span>
          </div>

          <div className="mt-7 flex justify-center sm:mt-8">
            <CertificationBadge framed />
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <button
        type="button"
        onClick={() => scrollTo("como-funciona", "hero-scroll-cue")}
        aria-label="Ver cómo funciona"
        className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 text-[#141313]/50 transition-colors hover:text-[#141313] md:block cursor-pointer"
      >
        <CaretDownIcon size={24} weight="bold" className="animate-bounce" />
      </button>
    </header>
  );
}
