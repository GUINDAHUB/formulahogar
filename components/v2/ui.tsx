"use client";

import { useEffect } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";

/**
 * Activa las entradas al hacer scroll (barra de sección y filas con
 * data-reveal). Sin JS o con movimiento reducido todo queda visible.
 */
export function useV2Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("v2-js");

    const targets = document.querySelectorAll<HTMLElement>(".v2-mark, [data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      root.classList.remove("v2-js");
    };
  }, []);
}

/** Barra lima del dossier sobre cada titular de sección. */
export function SectionMark({ tone = "lime", className = "" }: { tone?: "lime" | "ink"; className?: string }) {
  return <span aria-hidden className={`v2-mark ${className}`} data-tone={tone} />;
}

/** Placa redondeada inserta en el borde de la ventana. */
export function Plate({
  tone,
  id,
  screen = false,
  className = "",
  children,
}: {
  tone: "ink" | "lime";
  id?: string;
  /** En escritorio la placa ocupa la ventana entera, con las cuatro esquinas a la vista. */
  screen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const toneClass = tone === "ink" ? "v2-dark bg-[#141313] text-white" : "bg-[#BFFF00] text-[#141313]";
  return (
    <section
      id={id}
      className={`scroll-mt-20 px-2 sm:px-3 ${screen ? "v2-screen lg:flex lg:min-h-svh lg:scroll-mt-0 lg:flex-col lg:py-3" : ""}`}
    >
      <div
        className={`overflow-clip rounded-[22px] sm:rounded-[28px] ${toneClass} ${
          screen ? "lg:flex lg:flex-1 lg:flex-col lg:justify-center" : ""
        } ${className}`}
      >
        {children}
      </div>
    </section>
  );
}

/** Sección blanca a pantalla completa en escritorio, con el contenido centrado. */
export const SCREEN = "v2-screen lg:flex lg:min-h-svh lg:scroll-mt-0 lg:flex-col lg:justify-center lg:pb-10 lg:pt-24";

export function Container({
  className = "",
  inset = false,
  children,
}: {
  className?: string;
  /** Secciones blancas: mismo margen lateral que el contenido de las placas. */
  inset?: boolean;
  children: React.ReactNode;
}) {
  const inner = <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
  return inset ? <div className="px-2 sm:px-3">{inner}</div> : inner;
}

type ButtonVariant = "primary" | "ink" | "ghost" | "ghost-light";

export function V2Button({
  variant = "primary",
  arrow = variant === "primary" || variant === "ink",
  className = "",
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`v2-btn v2-btn-${variant} ${!arrow ? "!px-6" : ""} ${className}`} {...rest}>
      <span>{children}</span>
      {arrow && (
        <span aria-hidden className="v2-btn-arrow">
          <ArrowRightIcon size={18} weight="bold" />
        </span>
      )}
    </button>
  );
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
