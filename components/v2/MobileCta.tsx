"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { V2Button, scrollToId } from "./ui";

/**
 * Barra inferior en móvil: aparece al salir del hero y se esconde mientras
 * el formulario (o el cierre) está en pantalla.
 */
export default function MobileCta({ label, target, page }: { label: string; target: string; page: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const stops = [document.getElementById(target), document.querySelector("footer")].filter(Boolean) as Element[];
    const visible = new Set<Element>();

    const heroIo = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0.05 });
    const stopIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setHidden(visible.size > 0);
    });

    if (hero) heroIo.observe(hero);
    stops.forEach((s) => stopIo.observe(s));
    return () => {
      heroIo.disconnect();
      stopIo.disconnect();
    };
  }, [target]);

  const show = pastHero && !hidden;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
        show ? "translate-y-0" : "translate-y-[120%]"
      }`}
    >
      <div className="rounded-full bg-white/90 p-1.5 shadow-[0_16px_40px_-16px_rgba(20,19,19,0.45)] backdrop-blur-xl">
        <V2Button
          tabIndex={show ? 0 : -1}
          className="w-full !justify-between"
          onClick={() => {
            track("cta_click", { cta_location: "mobile-bar", page });
            scrollToId(target);
          }}
        >
          {label}
        </V2Button>
      </div>
    </div>
  );
}
