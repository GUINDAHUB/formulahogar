"use client";

import { track } from "@/lib/analytics";
import { Container, SectionMark, V2Button, scrollToId } from "../ui";

// Logos en sus colores de marca, en un slider continuo.
// Bankinter sigue oculto, como en la página en vivo. El Banco de España no
// aparece aquí: es el registro, no una entidad que financie.
const BANKS = [
  { name: "Santander", svg: "/logos/banks/santander.svg", h: "h-10 sm:h-12" },
  { name: "Sabadell", svg: "/logos/banks/sabadell.svg", h: "h-7 sm:h-9" },
  { name: "Abanca", svg: "/logos/banks/abanca.svg", h: "h-6 sm:h-8" },
  { name: "Caja Rural", svg: "/logos/banks/caja_rural_del_sur.svg", h: "h-9 sm:h-12" },
  { name: "Deutsche Bank", svg: "/logos/banks/deutsche_bank.svg", h: "h-7 sm:h-9" },
];

// Con solo cinco logos, cada mitad del bucle lleva la lista dos veces para
// ser más ancha que la pantalla; la animación desplaza exactamente una mitad.
const HALF = [...BANKS, ...BANKS];
const LOOP = [...HALF, ...HALF];

export default function Banks() {
  return (
    <section id="bancos" className="scroll-mt-20 py-20 sm:py-32">
      <Container inset>
        <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-20">
          <div>
            <SectionMark />
            <h2 className="v2-display v2-h2 mt-7 max-w-[18ch]">Las 20 entidades del país. Compitiendo por tu caso.</h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-[36ch] text-lg leading-relaxed text-[#545454]">
              Nosotros llevamos tu caso a todas. Tú comparas y eliges.
            </p>
            <V2Button
              className="mt-6"
              onClick={() => {
                track("cta_click", { cta_location: "bank-logos" });
                scrollToId("lead-form");
              }}
            >
              Quiero las mejores ofertas
            </V2Button>
          </div>
        </div>


      </Container>

      {/* Slider continuo a todo el ancho de la ventana, como en la home en vivo */}
      <div
        className="group mt-16 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        }}
      >
        <ul aria-label="Bancos con los que trabajamos" className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
          {LOOP.map((bank, i) => (
            <li
              key={`${bank.name}-${i}`}
              aria-hidden={i >= BANKS.length}
              className="mr-3 flex h-28 w-[220px] shrink-0 items-center justify-center rounded-[20px] border border-[#E8E8E6] bg-white px-6 sm:h-36 sm:w-[280px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bank.svg} alt={i < BANKS.length ? bank.name : ""} loading="lazy" className={`w-auto max-w-[80%] object-contain ${bank.h}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
