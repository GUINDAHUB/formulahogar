"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@/lib/analytics";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "¿Cuánto cuesta vuestro servicio?",
    a: "Cero euros. Nuestros honorarios los paga la entidad con la que firmes, y solo si firmas. Si no encontramos una oferta que te convenza, no pagas nada. Sin permanencias, sin cuotas de estudio.",
  },
  {
    q: "¿En cuánto tiempo tengo una respuesta?",
    a: "En 48h tienes nuestro primer análisis. El proceso completo hasta la firma suele ir entre 6 y 8 semanas.",
  },
  {
    q: "¿Qué documentación necesito al principio?",
    a: "Para el análisis inicial: DNI, últimas dos nóminas (o IRPF si eres autónomo), vida laboral, y datos básicos de la vivienda si ya la tienes elegida. Si todavía estás buscando, podemos avanzar igualmente.",
  },
  {
    q: "¿Trabajáis con autónomos y perfiles complejos?",
    a: "Sí. Autónomos, funcionarios, no residentes y perfiles mixtos. Cada entidad tiene políticas distintas — nuestro trabajo es saber a cuál llevar tu caso.",
  },
  {
    q: "¿Hipoteca fija, variable o mixta? ¿Cuál me conviene?",
    a: "Depende de tu perfil, tu plazo previsto y el escenario de tipos. Nuestro asesor te lo explica en la primera llamada con tu caso concreto. En general: fija para tranquilidad, variable si esperas amortizar pronto, mixta como punto intermedio.",
  },
  {
    q: "¿Y si quiero mejorar mi hipoteca actual?",
    a: "También lo hacemos. Subrogación (cambio de banco) y novación (renegociar con el tuyo) son operaciones habituales. Si llevas más de 3 años pagando, normalmente hay margen de mejora.",
  },
  {
    q: "¿Y si no llego al 20% de entrada?",
    a: "La hipoteca tradicional requiere ~28% de ahorro previo (20% entrada + 8% gastos). Si te quedas corto, en algunos perfiles podemos negociar hipoteca al 90% (~18% de ahorro necesario). Si aún así no llegas, FórmulaHogar tiene otras fórmulas alternativas que podemos comentarte. Cuéntanos tu caso en el formulario y te orientamos.",
  },
];

export default function HipotecasFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((current) => {
      const next = current === i ? null : i;
      if (next !== null) track("faq_open", { question: FAQS[i].q });
      return next;
    });
  };

  return (
    <section id="faq" className="bg-white py-20 md:py-28 border-t border-[#EBEBEB]">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-center text-3xl text-[#141313] md:text-5xl">
            Preguntas frecuentes.
          </h2>

          <ul className="mt-12 divide-y divide-[#EBEBEB] border-t border-b border-[#EBEBEB]">
            {FAQS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <li key={item.q}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-semibold text-[#141313]">
                      {item.q}
                    </span>
                    <span
                      className={`shrink-0 rounded-full p-1 transition-colors ${
                        isOpen ? "bg-[#BFFF00]" : "bg-[#EBEBEB]"
                      }`}
                    >
                      {isOpen ? (
                        <MinusIcon size={18} weight="bold" color="#141313" />
                      ) : (
                        <PlusIcon size={18} weight="bold" color="#141313" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-10 text-sm leading-relaxed text-[#545454]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
