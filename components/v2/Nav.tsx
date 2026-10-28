"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CaretDownIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { scrollToId } from "./ui";

const PRODUCTS = [
  { href: "/v2", label: "Hipotecas", note: "Negociamos por ti, a precio fijo" },
  { href: "/alquiler-opcion-compra", label: "Alquiler con Opción a Compra", note: "Tu entrada, mes a mes" },
  { href: "/v2/fusion", label: "Fusión", note: "Tus deudas, en una sola cuota" },
];

export interface NavLink {
  label: string;
  id: string;
}

export default function Nav({
  current,
  links,
  cta,
}: {
  current: string;
  links: NavLink[];
  cta: { label: string; mobileLabel?: string; target: string; event: string };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string, event: string) => {
    setOpen(false);
    sendGTMEvent({ event: "buttonClicked", value: event });
    scrollToId(id);
  };

  // Sobre la foto del hero la barra es transparente y clara; al hacer
  // scroll se recoge en una píldora blanca.
  const light = !scrolled && !open;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3">
        <nav
          aria-label="Principal"
          className={`pointer-events-auto mx-auto flex h-16 items-center justify-between gap-4 rounded-[18px] transition-[max-width,background-color,box-shadow,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-[72px] sm:rounded-[22px] ${
            light
              ? "max-w-[1440px] bg-transparent px-4 sm:px-8 lg:px-10"
              : "max-w-[1040px] bg-white/90 px-3 pl-4 shadow-[0_12px_32px_-18px_rgba(20,19,19,0.45)] backdrop-blur-xl sm:px-3 sm:pl-6"
          }`}
        >
          <Link href={current} aria-label="FórmulaHogar, inicio" className="flex shrink-0 items-center" onClick={() => window.scrollTo(0, 0)}>
            <Image
              src={light ? "/brand/logo-negative.png" : "/brand/logo-color.png"}
              alt="FórmulaHogar"
              width={260}
              height={48}
              priority
              className="h-6 w-auto sm:h-8"
            />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <div className="group relative">
              <button
                type="button"
                aria-haspopup="true"
                className={`flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                  light ? "text-white/85 hover:bg-white/10 hover:text-white" : "text-[#545454] hover:bg-[#F2F2F0] hover:text-[#141313]"
                }`}
              >
                Productos
                <CaretDownIcon size={14} weight="bold" className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
              </button>
              <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <ul className="rounded-[20px] border border-[#E8E8E6] bg-white p-2 shadow-[0_24px_48px_-24px_rgba(20,19,19,0.4)]">
                  {PRODUCTS.map((p) => {
                    const active = p.href === current;
                    return (
                      <li key={p.href}>
                        <Link
                          href={p.href}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-start gap-3 rounded-[14px] px-4 py-3 transition-colors ${
                            active ? "bg-[#F4FFD6]" : "hover:bg-[#F6F6F4]"
                          }`}
                        >
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${active ? "bg-[#141313]" : "bg-[#D6D6D6]"}`} />
                          <span>
                            <span className="block text-sm font-bold text-[#141313]">{p.label}</span>
                            <span className="mt-0.5 block text-xs text-[#545454]">{p.note}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {links.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => go(l.id, `${l.id}-menu`)}
                className={`h-11 rounded-full px-4 text-sm font-semibold transition-colors ${
                  light ? "text-white/85 hover:bg-white/10 hover:text-white" : "text-[#545454] hover:bg-[#F2F2F0] hover:text-[#141313]"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => go(cta.target, cta.event)}
              className="h-11 whitespace-nowrap rounded-full bg-[#BFFF00] px-4 text-[13px] font-bold sm:px-5 sm:text-sm text-[#141313] transition-colors hover:bg-[#D4FF4D]"
            >
              <span className="sm:hidden">{cta.mobileLabel ?? cta.label}</span>
              <span className="hidden sm:inline">{cta.label}</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="v2-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className={`grid h-11 w-11 place-items-center rounded-full transition-colors md:hidden ${
                light ? "text-white hover:bg-white/10" : "text-[#141313] hover:bg-[#F2F2F0]"
              }`}
            >
              {open ? <XIcon size={22} weight="bold" /> : <ListIcon size={22} weight="bold" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-[#141313]/50 md:hidden"
            />
            <motion.div
              id="v2-menu"
              initial={{ opacity: 0, y: reduce ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -12 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-2 top-[80px] z-50 rounded-[22px] bg-white p-3 shadow-[0_24px_48px_-24px_rgba(20,19,19,0.5)] md:hidden"
            >
              <p className="px-3 pb-1 pt-2 text-xs font-semibold text-[#545454]">Productos</p>
              <ul>
                {PRODUCTS.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      onClick={() => setOpen(false)}
                      aria-current={p.href === current ? "page" : undefined}
                      className={`flex min-h-14 flex-col justify-center rounded-[14px] px-3 py-2.5 ${
                        p.href === current ? "bg-[#F4FFD6]" : "hover:bg-[#F6F6F4]"
                      }`}
                    >
                      <span className="text-base font-semibold text-[#141313]">{p.label}</span>
                      <span className="mt-0.5 text-sm text-[#545454]">{p.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="my-2 h-px bg-[#E8E8E6]" />
              <ul>
                {links.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => go(l.id, `${l.id}-menu`)}
                      className="flex min-h-12 w-full items-center rounded-[14px] px-3 text-left text-base font-semibold text-[#545454] hover:bg-[#F6F6F4] hover:text-[#141313]"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
