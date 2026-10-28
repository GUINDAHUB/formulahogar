"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CarIcon, CreditCardIcon, HandCoinsIcon, HouseLineIcon } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { track } from "@/lib/analytics";
import { Container, V2Button, scrollToId } from "../ui";

// Mismo ejemplo ilustrativo que components/fusion/FusionHero.tsx:
// 220.000 € al 4,2 % + 39.000 € en deudas → 2.372 €/mes hoy, 1.179 €/mes con Fusión.
interface Bill {
  id: string;
  Icon: Icon;
  label: string;
  amount: number;
}

const BILLS: Bill[] = [
  { id: "hipoteca", Icon: HouseLineIcon, label: "Hipoteca", amount: 1186 },
  { id: "tarjeta", Icon: CreditCardIcon, label: "Tarjeta de crédito", amount: 412 },
  { id: "prestamo", Icon: HandCoinsIcon, label: "Préstamo personal", amount: 486 },
  { id: "coche", Icon: CarIcon, label: "Financiación del coche", amount: 288 },
];

const TOTAL_HOY = BILLS.reduce((sum, b) => sum + b.amount, 0);
const TOTAL_FUSION = 1179;
const AHORRO_PCT = Math.round((1 - TOTAL_FUSION / TOTAL_HOY) * 100);

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { useGrouping: "always" } as Intl.NumberFormatOptions).format(Math.round(n));

const EASE = [0.16, 1, 0.3, 1] as const;

const FIGURES = [
  { value: "28–59 %", label: "menos de cuota al mes en nuestras simulaciones" },
  { value: "300–1.150 €", label: "menos al mes en esas mismas simulaciones" },
  { value: "2 a 5 meses", label: "hasta tener un solo recibo en tu hipoteca" },
];

const d = (ms: number) => ({ "--v2-delay": `${ms}ms` }) as React.CSSProperties;

function useTweenedNumber(target: number, duration: number) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    if (duration === 0) {
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      const v = from + (target - from) * eased;
      fromRef.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return duration === 0 ? target : value;
}

function FusionCard() {
  const reduce = useReducedMotion();
  const [merged, setMerged] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) return;
    const id = window.setTimeout(() => setMerged(true), reduce ? 0 : 1600);
    return () => window.clearTimeout(id);
  }, [reduce, touched]);

  const select = (next: boolean) => {
    setTouched(true);
    setMerged(next);
    track("fusion_card_toggle", { state: next ? "fusion" : "hoy" });
  };

  const duration = reduce ? 0 : 700;
  const total = useTweenedNumber(merged ? TOTAL_FUSION : TOTAL_HOY, duration);
  const transition = { duration: reduce ? 0 : 0.6, ease: EASE };

  return (
    <div className="rounded-[24px] bg-white p-5 text-[#141313] shadow-[0_32px_64px_-36px_rgba(20,19,19,0.45)] ring-1 ring-[#141313]/5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="whitespace-nowrap text-sm font-semibold">Tus recibos al mes</p>
        <div role="group" aria-label="Comparar recibos" className="inline-flex rounded-full bg-[#F2F2F0] p-1">
          {[
            { value: false, label: "Hoy" },
            { value: true, label: "Con Fusión" },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              aria-pressed={merged === opt.value}
              onClick={() => select(opt.value)}
              className={`min-h-10 whitespace-nowrap rounded-full px-3.5 text-sm sm:px-4 font-semibold transition-colors duration-300 ${
                merged === opt.value ? "bg-[#141313] text-white" : "text-[#545454] hover:text-[#141313]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4 sm:mt-5">
        {BILLS.map((bill, i) => (
          <li key={bill.id} className="flex items-center gap-3 border-b border-[#E8E8E6] py-2.5 sm:py-3">
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2F2F0] transition-opacity duration-500 ${
                merged ? "opacity-40" : "opacity-100"
              }`}
            >
              <bill.Icon size={18} weight="fill" color="#141313" />
            </span>
            <span
              className={`min-w-0 flex-1 text-[15px] font-semibold transition-colors duration-500 sm:text-base ${
                merged ? "text-[#545454]" : "text-[#141313]"
              }`}
            >
              {bill.label}
            </span>
            <span
              className={`v2-num relative whitespace-nowrap text-[15px] font-bold transition-colors duration-500 sm:text-base ${
                merged ? "text-[#545454]" : "text-[#141313]"
              }`}
            >
              {fmt(bill.amount)} €
              <motion.span
                aria-hidden
                initial={false}
                animate={{ scaleX: merged ? 1 : 0 }}
                transition={{ ...transition, delay: reduce ? 0 : merged ? 0.15 + i * 0.07 : 0 }}
                className="absolute inset-x-[-2px] top-1/2 h-[2px] origin-left bg-[#545454]"
              />
            </span>
          </li>
        ))}
      </ul>

      <div
        aria-live="polite"
        className={`mt-4 flex items-center justify-between gap-3 rounded-[18px] px-4 py-4 transition-colors duration-500 sm:px-5 ${
          merged ? "bg-[#BFFF00]" : "bg-[#F2F2F0]"
        }`}
      >
        <div>
          <p className="whitespace-nowrap text-sm font-semibold">{merged ? "Con Fusión" : "Hoy pagas"}</p>
          <p className="whitespace-nowrap text-sm text-[#141313]/70">
            {merged ? `1 recibo, antes ${BILLS.length}` : `${BILLS.length} recibos al mes`}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          {merged && (
            <span className="v2-num whitespace-nowrap rounded-full bg-[#141313] px-2.5 py-1 text-xs font-bold text-white">
              −{AHORRO_PCT} %
            </span>
          )}
          <p className="v2-display v2-num whitespace-nowrap text-[1.75rem] leading-none sm:text-[2rem]">{fmt(total)} €</p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[#545454]">
        Ejemplo ilustrativo de una simulación: hipoteca de 220.000 € y 39.000 € en deudas. El desglose es orientativo y tu
        estudio dará tus cifras.
      </p>
    </div>
  );
}

export default function Hero() {
  const go = (id: string, location: string) => {
    track("cta_click", { cta_location: location, page: "fusion" });
    scrollToId(id);
  };

  return (
    <header id="top" className="v2-screen px-2 pt-2 sm:px-3 sm:pt-3">
      {/* En escritorio la placa mide exactamente la ventana (12 px de aire arriba y abajo) */}
      <div className="v2-dark relative isolate overflow-hidden rounded-[22px] bg-[#141313] text-white sm:rounded-[28px] lg:flex lg:min-h-[calc(100svh-24px)] lg:flex-col">
        <div className="absolute inset-x-0 top-0 -z-10 h-[420px] sm:inset-0 sm:h-full">
          {/* Foto espejada para que la pareja quede a la derecha, fuera del texto */}
          <Image
            src="/v2/fusion-pareja-cocina.jpg"
            alt="Pareja sonriendo abrazada en la cocina de su casa"
            fill
            priority
            sizes="100vw"
            className="-scale-x-100 object-cover object-[43%_40%] sm:object-[100%_40%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,19,19,0.45)_0%,rgba(20,19,19,0)_28%,rgba(20,19,19,0)_55%,#141313_96%)] sm:bg-[linear-gradient(90deg,rgba(20,19,19,0.94)_0%,rgba(20,19,19,0.82)_34%,rgba(20,19,19,0.3)_62%,rgba(20,19,19,0.05)_82%)]"
          />
          <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(0deg,rgba(20,19,19,0.85)_0%,rgba(20,19,19,0)_40%)] lg:block" />
        </div>

        <Container className="pb-32 pt-[320px] sm:pb-40 sm:pt-40 lg:flex lg:flex-1 lg:flex-col lg:pb-9 lg:pt-28">
          <div className="lg:flex lg:flex-1 lg:flex-col">
            <div className="lg:my-auto lg:pb-6">
            <h1 className="v2-display v2-h1 v2-rise max-w-[11ch] lg:max-w-[17ch] lg:text-[clamp(3.25rem,8.2svh,5.5rem)]" style={d(0)}>
              Todas tus deudas, <span className="v2-it text-[#BFFF00]">en una sola cuota más baja.</span>
            </h1>

            <p className="v2-rise mt-6 max-w-[40ch] text-[17px] leading-relaxed text-white/80 sm:text-[19px]" style={d(100)}>
              Tarjetas, préstamos y coche, dentro de tu hipoteca. Antes de firmar, te enseñamos con cifras lo que
              cuesta.
            </p>

            <div className="v2-rise mt-8 flex flex-col gap-3 sm:flex-row" style={d(180)}>
              <V2Button onClick={() => go("estudio", "hero")} className="min-h-14 !justify-between sm:!justify-center">
                Quiero mi estudio
              </V2Button>
              <V2Button variant="ghost-light" onClick={() => go("como-funciona", "hero-secondary")} className="min-h-14">
                Cómo funciona
              </V2Button>
            </div>
            </div>

            {/* Regla de pruebas al pie de la placa, como en Hipotecas */}
            <div className="v2-rise mt-14 border-t border-white/15 pt-6 lg:mt-0 lg:max-w-[calc(100%-544px)]" style={d(300)}>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
                {FIGURES.map((item) => (
                  <div key={item.value} className="text-sm leading-snug text-white/70">
                    <dt className="sr-only">{item.label}</dt>
                    <dd>
                      <span className="v2-num block font-bold text-white">{item.value}</span>
                      {item.label}
                    </dd>
                  </div>
                ))}
                <div className="mt-2 flex items-center gap-3 border-t border-white/15 pt-4 text-xs leading-snug text-white/70 sm:col-span-3">
                  <dt className="sr-only">Registro</dt>
                  <dd className="flex items-center gap-3">
                    <Image
                      src="/brand/banco-de-espana.webp"
                      alt="Banco de España"
                      width={3840}
                      height={838}
                      className="h-5 w-auto brightness-0 invert"
                    />
                    <span aria-hidden className="h-7 w-px bg-white/20" />
                    <span>
                      Intermediaria inscrita · <span className="font-bold text-white">E783</span>
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </div>

      {/* La tarjeta monta sobre el borde inferior de la placa: mitad sobre la
          foto, mitad sobre el blanco. */}
      <Container className="relative z-10 -mt-24 mb-14 sm:-mt-28 sm:mb-20 lg:-mt-[290px] lg:mb-16 lg:grid lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16">
        <div className="v2-rise lg:col-start-2" style={d(220)}>
          <FusionCard />
        </div>
      </Container>
    </header>
  );
}
