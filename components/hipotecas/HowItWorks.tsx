"use client";

import {
  HandshakeIcon,
  KeyIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface Step {
  num: string;
  Icon: Icon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    Icon: MagnifyingGlassIcon,
    title: "Analizamos tu caso",
    description:
      "Estudiamos tu perfil, tu vivienda y tu situación laboral. Te decimos qué hipoteca podemos conseguirte, a qué condiciones reales, y si tu caso es viable. Todo en 48h.",
  },
  {
    num: "02",
    Icon: HandshakeIcon,
    title: "Negociamos con los bancos",
    description:
      "Llevamos tu caso a más de 20 entidades en paralelo. Te conseguimos al menos 3 ofertas reales con condiciones que no obtendrías yendo por tu cuenta.",
  },
  {
    num: "03",
    Icon: KeyIcon,
    title: "Tú eliges. Tú firmas.",
    description:
      "Te presentamos las ofertas en un comparativo claro. Eliges la que más te convenza. Nosotros gestionamos la documentación y te acompañamos hasta la firma.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#545454]">
            Cómo funciona
          </p>
          <h2 className="font-display mt-3 text-3xl text-[#141313] md:text-5xl">
            Tres pasos. Cero papeleo para ti.
          </h2>
          <p className="mt-4 text-base text-[#545454] md:text-lg">
            Tú nos cuentas tu caso, nosotros negociamos por ti, y tú eliges la
            oferta.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step) => (
            <article key={step.num} className="text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                <span
                  className="font-display text-[64px] font-bold leading-none"
                  style={{ color: "#BFFF00" }}
                >
                  {step.num}
                </span>
                <step.Icon
                  size={26}
                  weight="fill"
                  color="#141313"
                  className="mt-4"
                />
              </div>
              <h3 className="font-display mt-5 text-xl font-bold text-[#141313]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#545454]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
