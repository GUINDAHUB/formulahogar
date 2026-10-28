"use client";

import { useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { track } from "@/lib/analytics";
import { Container, SCREEN, SectionMark } from "./ui";

export interface FaqItem {
  q: string;
  a: string;
}

export default function FAQ({
  items,
  page,
  defaultOpen = null,
  screen = false,
}: {
  items: FaqItem[];
  page: string;
  defaultOpen?: number | null;
  /** A pantalla completa en escritorio (Fusión v2). */
  screen?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const reduce = useReducedMotion();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const toggle = (i: number) => {
    setOpenIndex((current) => {
      const next = current === i ? null : i;
      if (next !== null) track("faq_open", { question: items[i].q, page });
      return next;
    });
  };

  return (
    <section id="faq" className={`scroll-mt-20 py-20 sm:py-32 ${screen ? SCREEN : ""}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Container inset className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionMark />
          <h2 className="v2-display v2-h2 mt-7">Preguntas frecuentes.</h2>
        </div>

        <ul className="border-t border-[#E8E8E6]">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li key={item.q} className="border-b border-[#E8E8E6]">
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className={`group flex w-full items-center justify-between gap-6 py-6 text-left ${screen ? "lg:py-4" : ""}`}
                  >
                    <span className="text-[17px] font-semibold leading-snug text-[#141313] sm:text-lg">{item.q}</span>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                        isOpen
                          ? "border-[#BFFF00] bg-[#BFFF00]"
                          : "border-[#D6D6D6] group-hover:border-[#141313]"
                      }`}
                    >
                      <PlusIcon
                        size={16}
                        weight="bold"
                        color="#141313"
                        className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-45" : ""}`}
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className={`max-w-[62ch] pb-7 pr-12 text-base leading-relaxed text-[#545454] ${screen ? "lg:pb-5" : ""}`}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
