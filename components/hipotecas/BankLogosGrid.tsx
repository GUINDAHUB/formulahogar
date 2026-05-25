"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { track } from "@/lib/analytics";

// TODO: deja caer los SVG en /public/logos/banks/<archivo>.svg y rellena
// el campo `svg` de cada entrada. Mientras el SVG no exista, se renderiza
// un placeholder tipográfico con el nombre del banco para no romper el
// carrusel. Mantén alturas alrededor de 32-40px en el SVG original.
interface Bank {
  name: string;
  svg?: string;
}

const BANKS: Bank[] = [
  { name: "Santander", svg: "/logos/banks/santander.svg" },
  { name: "Sabadell", svg: "/logos/banks/sabadell.svg" },
  { name: "Bankinter", svg: "/logos/banks/bankinter.svg" },
  { name: "Caja Rural", svg: "/logos/banks/caja_rural_del_sur.svg" },
  { name: "Banco de España", svg: "/logos/banks/banco_de_espana.png" }
];

export default function BankLogosGrid() {
  const scrollToForm = () => {
    track("cta_click", { cta_location: "bank-logos" });
    const el = document.getElementById("lead-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Duplicamos la lista para que el loop sea visualmente continuo.
  const loop = [...BANKS, ...BANKS];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#545454]">
            Negociamos con los principales bancos
          </p>
          <h2 className="font-display mt-3 text-3xl text-[#141313] md:text-5xl">
            Las 20 entidades del país. Compitiendo por tu caso.
          </h2>
        </div>
      </div>

      <div
        className="mt-12 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <ul
          className="flex w-max items-center animate-marquee"
          aria-label="Bancos con los que trabajamos"
        >
          {loop.map((bank, i) => (
            <li
              key={`${bank.name}-${i}`}
              // mr-16 sobre cada item (en vez de gap en el padre) asegura
              // que el último item de cada copia también lleve separación.
              // Sin esto, translateX(-50%) no cae exacto al inicio del
              // siguiente loop y se ve un "salto" visual.
              className="flex h-16 shrink-0 items-center justify-center mr-16 md:mr-24"
              aria-hidden={i >= BANKS.length}
            >
              {bank.svg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bank.svg}
                  alt={bank.name}
                  className="h-12 w-auto md:h-14 object-contain"
                  loading="lazy"
                />
              ) : (
                <span className="whitespace-nowrap text-base font-semibold tracking-tight text-[#9D9D9D]">
                  {bank.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="container mx-auto px-6 mt-14 text-center">
        <p className="mx-auto max-w-xl text-sm text-[#545454] sm:text-base">
          Nosotros llevamos tu caso a todas. Tú comparas y eliges.
        </p>
        <button
          type="button"
          onClick={scrollToForm}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#BFFF00] px-6 py-3.5 text-base font-bold text-[#141313] hover:opacity-90 transition-opacity"
        >
          Quiero las mejores ofertas
          <ArrowRightIcon size={18} weight="bold" />
        </button>
      </div>
    </section>
  );
}
