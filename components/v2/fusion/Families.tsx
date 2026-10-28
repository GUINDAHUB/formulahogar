"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { Container, Plate, SectionMark } from "../ui";

// Mismas familias tipo que components/fusion/FusionFamilies.tsx.
interface Family {
  id: string;
  name: string;
  situation: string;
  hoy: number;
  fusion: number;
  interesesExtra: number;
  how: string;
}

const FAMILIES: Family[] = [
  {
    id: "pareja-joven",
    name: "Pareja joven",
    situation: "Hipoteca de 180.000 € al 1,5 % y 26.000 € en deudas",
    hoy: 1485,
    fusion: 842,
    interesesExtra: 10600,
    how: "Su hipoteca es muy barata, así que no se toca: el banco añade solo un tramo nuevo con las deudas.",
  },
  {
    id: "variable-cara",
    name: "Hipoteca variable cara",
    situation: "Hipoteca de 220.000 € al 4,2 % y 39.000 € en deudas",
    hoy: 2372,
    fusion: 1179,
    interesesExtra: -5000,
    how: "El banco rehace toda la hipoteca a condiciones de hoy, con las deudas dentro. Aquí incluso se ahorran intereses.",
  },
  {
    id: "casi-terminada",
    name: "Hipoteca casi terminada",
    situation: "Hipoteca de 60.000 € al 2,5 % y 34.000 € en deudas",
    hoy: 1623,
    fusion: 747,
    interesesExtra: 5800,
    how: "El banco rehace la hipoteca con las deudas dentro: una sola cuota y un solo tipo.",
  },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { useGrouping: "always" } as Intl.NumberFormatOptions).format(Math.abs(n));

export default function Families() {
  const [activeId, setActiveId] = useState(FAMILIES[0].id);
  const f = FAMILIES.find((x) => x.id === activeId) ?? FAMILIES[0];
  const ahorroMes = f.hoy - f.fusion;
  const pct = Math.round((ahorroMes / f.hoy) * 100);
  const fusionWidth = `${(f.fusion / f.hoy) * 100}%`;

  return (
    <Plate tone="ink" id="familias" screen>
      <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-14">
        <div>
          <SectionMark />
          <h2 className="v2-display v2-h2 mt-7 max-w-[15ch]">
            Familias como la tuya, <span className="v2-it text-[#BFFF00]">con los números delante.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-white/70">
            Probamos Fusión con familias tipo. La cuota baja mucho en todas. Casi siempre se pagan más intereses en
            total, porque la deuda dura más años. Te enseñamos las dos cifras.
          </p>

          <p className="mt-10 max-w-[52ch] text-sm leading-relaxed text-white/55">
            Simulaciones ilustrativas con la hipoteca ampliada al 3 % y 5 años más de plazo. No son una oferta: tu
            estudio dará tus cifras reales.
          </p>
        </div>

        <div className="overflow-hidden rounded-[24px] bg-white text-[#141313]">
          {/* Selector dentro de la tarjeta: se lee como control, no como etiqueta */}
          <div className="border-b border-[#E8E8E6] p-3 sm:p-4">
            <p id="familias-label" className="px-2 pb-3 pt-1 text-xs font-semibold text-[#545454]">
              Elige una familia
            </p>
            <div role="tablist" aria-labelledby="familias-label" className="grid grid-cols-3 gap-1 rounded-[16px] bg-[#F2F2F0] p-1">
              {FAMILIES.map((fam) => {
                const selected = fam.id === activeId;
                return (
                  <button
                    key={fam.id}
                    role="tab"
                    type="button"
                    id={`tab-${fam.id}`}
                    aria-selected={selected}
                    aria-controls="familia-panel"
                    onClick={() => {
                      setActiveId(fam.id);
                      track("fusion_family_select", { family: fam.id });
                    }}
                    className={`min-h-14 cursor-pointer rounded-[12px] px-2 text-center text-[13px] font-semibold leading-tight transition-[background-color,color,box-shadow] duration-300 sm:text-sm ${
                      selected
                        ? "bg-[#141313] text-white shadow-[0_8px_18px_-10px_rgba(20,19,19,0.6)]"
                        : "text-[#545454] hover:bg-white hover:text-[#141313]"
                    }`}
                  >
                    {fam.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div id="familia-panel" role="tabpanel" aria-labelledby={`tab-${f.id}`}>
          <div className="p-6 sm:p-9">
            <p className="text-sm text-[#545454]">{f.situation}</p>

            <div className="mt-8 space-y-6">
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm font-semibold">Hoy paga al mes</span>
                  <span className="v2-display v2-num whitespace-nowrap text-2xl">{fmt(f.hoy)} €</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#D6D6D6]" />
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm font-semibold">Con Fusión</span>
                  <span className="v2-display v2-num whitespace-nowrap text-2xl">{fmt(f.fusion)} €</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#F2F2F0]">
                  <div
                    className="h-2 rounded-full bg-[#141313] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    style={{ width: fusionWidth }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 bg-[#BFFF00] px-6 py-5 sm:px-9">
            <span className="font-semibold">Ahorro cada mes</span>
            <span className="v2-num whitespace-nowrap">
              <span className="v2-display text-[1.75rem] leading-none sm:text-[2rem]">{fmt(ahorroMes)} €</span>{" "}
              <span className="text-base font-bold">(−{pct} %)</span>
            </span>
          </div>

          <div className="px-6 pb-7 sm:px-9">
            <div className="flex items-center justify-between gap-4 border-b border-[#E8E8E6] py-5">
              <span className="font-semibold">
                {f.interesesExtra < 0 ? "Intereses en total" : "Intereses de más en total"}
              </span>
              <span className="v2-display v2-num whitespace-nowrap text-xl">
                {f.interesesExtra < 0 ? `${fmt(f.interesesExtra)} € menos` : `+${fmt(f.interesesExtra)} €`}
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[#545454]">{f.how}</p>
          </div>
          </div>
        </div>
      </Container>
    </Plate>
  );
}
