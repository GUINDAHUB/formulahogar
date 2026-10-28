"use client";

import Image from "next/image";
import { BankIcon, CheckCircleIcon, ClockIcon } from "@phosphor-icons/react";
import { track } from "@/lib/analytics";
import { Container, V2Button, scrollToId } from "../ui";

const PROOF = [
  { Icon: BankIcon, label: "+20 bancos compitiendo" },
  { Icon: ClockIcon, label: "Análisis gratuito en 48h" },
  { Icon: CheckCircleIcon, label: "Precio fijo, sin % de la vivienda" },
];

const d = (ms: number) => ({ "--v2-delay": `${ms}ms` }) as React.CSSProperties;

export default function Hero() {
  const go = (id: string, location: string) => {
    track("cta_click", { cta_location: location });
    scrollToId(id);
  };

  return (
    <header id="top" className="px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="v2-dark relative isolate flex min-h-[calc(100svh-16px)] flex-col overflow-hidden rounded-[22px] bg-[#141313] text-white sm:min-h-[max(680px,calc(100svh-24px))] sm:rounded-[28px]">
        {/* Foto a sangre: en móvil ocupa la mitad superior y funde con la tinta */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[440px] sm:inset-0 sm:h-full">
          <Image
            src="/aoc-hero-desktop.jpg"
            alt="Pareja sonriendo tumbada en el suelo de su nueva casa, entre cajas de mudanza"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] sm:object-[70%_center] lg:object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,19,19,0.45)_0%,rgba(20,19,19,0)_28%,rgba(20,19,19,0)_55%,#141313_96%)] sm:bg-[linear-gradient(90deg,rgba(20,19,19,0.92)_0%,rgba(20,19,19,0.8)_34%,rgba(20,19,19,0.35)_58%,rgba(20,19,19,0)_80%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 hidden bg-[linear-gradient(0deg,rgba(20,19,19,0.75)_0%,rgba(20,19,19,0)_32%)] sm:block"
          />
        </div>

        <Container className="flex flex-1 flex-col pb-8 pt-[360px] sm:justify-center sm:pb-0 sm:pt-36 lg:justify-start lg:pt-[clamp(9rem,17svh,11rem)]">
          <div className="max-w-[880px]">
            <h1 className="v2-display v2-h1 v2-rise lg:text-[5.25rem]" style={d(0)}>
              Tu hipoteca,{" "}
              <span className="v2-it block text-[#BFFF00] lg:whitespace-nowrap">en las mejores manos</span>
            </h1>

            <p className="v2-rise mt-7 max-w-[44ch] text-[17px] leading-relaxed text-white/80 sm:text-[19px]" style={d(180)}>
              Negociamos con más de 20 bancos en paralelo para conseguirte la mejor oferta del mercado. Tú comparas,
              eliges y firmas.
            </p>

            <div className="v2-rise mt-9 flex flex-col gap-3 sm:flex-row" style={d(260)}>
              <V2Button onClick={() => go("lead-form", "hero")} className="min-h-14 !justify-between sm:!justify-center">
                Quiero mi análisis gratis
              </V2Button>
              <V2Button variant="ghost-light" onClick={() => go("como-funciona", "hero-secondary")} className="min-h-14">
                ¿Cómo funciona?
              </V2Button>
            </div>
          </div>
        </Container>

        <Container className="pb-6 sm:pb-8">
          <div
            className="v2-rise grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3 lg:grid-cols-[repeat(3,auto)_1fr] lg:items-center lg:gap-10"
            style={d(380)}
          >
            {PROOF.map(({ Icon, label }) => (
              <p key={label} className="flex items-center gap-2.5 text-sm font-semibold text-white/85">
                <Icon size={18} weight="fill" className="shrink-0 text-[#BFFF00]" />
                {label}
              </p>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-white/15 pt-5 sm:col-span-3 lg:col-span-1 lg:mt-0 lg:justify-self-end lg:border-0 lg:pt-0">
              <Image
                src="/brand/banco-de-espana.webp"
                alt="Banco de España"
                width={3840}
                height={838}
                className="h-5 w-auto brightness-0 invert"
              />
              <span aria-hidden className="h-7 w-px bg-white/20" />
              <span className="text-xs leading-snug text-white/70">
                Certificada como Intermediaria
                <br />
                de Crédito Inmobiliario <span className="font-bold text-white">E783</span>
              </span>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
