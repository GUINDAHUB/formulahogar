"use client";

import Image from "next/image";
import { Container, SectionMark } from "./ui";

const LEGAL = [
  { href: "https://formulahogar.com/politicas#aviso-legal", label: "Aviso Legal" },
  { href: "https://formulahogar.com/politicas#privacidad", label: "Privacidad" },
  { href: "https://formulahogar.com/politicas#cookies", label: "Cookies" },
];

/**
 * Cierre en placa negra, como la última página del dossier. `closing`
 * sustituye al bloque "Hablemos." cuando la página tiene su propio cierre.
 */
export default function Footer({ closing, action }: { closing?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <footer className="px-2 pb-2 pt-2 sm:px-3 sm:pb-3 sm:pt-3">
      <div className="v2-dark overflow-hidden rounded-[22px] bg-[#141313] text-white sm:rounded-[28px]">
        <Container className="pb-8 pt-16 sm:pt-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SectionMark />
              {closing ?? (
                <p className="v2-display v2-it mt-8 text-[clamp(3.5rem,2rem+6vw,7.5rem)] leading-[0.95] text-[#BFFF00]">
                  Hablemos.
                </p>
              )}
            </div>
            {action && <div className="lg:pb-3">{action}</div>}
          </div>

          <dl className="mt-14 grid border-t border-white/15 sm:grid-cols-2">
            <div className="border-b border-white/15 py-5 sm:border-r sm:pr-8">
              <dt className="text-xs font-semibold text-white/55">Correo</dt>
              <dd className="mt-2">
                <a
                  href="mailto:hola@formulahogar.com"
                  className="v2-display text-xl text-white underline decoration-white/25 underline-offset-[6px] transition-colors hover:decoration-[#BFFF00] sm:text-2xl"
                >
                  hola@formulahogar.com
                </a>
              </dd>
            </div>
            <div className="border-b border-white/15 py-5 sm:pl-8">
              <dt className="text-xs font-semibold text-white/55">Registro</dt>
              <dd className="mt-2 flex items-center gap-4">
                <Image
                  src="/brand/banco-de-espana.webp"
                  alt="Banco de España"
                  width={3840}
                  height={838}
                  className="h-6 w-auto brightness-0 invert"
                />
                <span className="text-sm leading-snug text-white/70">
                  Certificada como Intermediaria de Crédito Inmobiliario{" "}
                  <span className="font-bold text-white">E783</span>
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Image src="/brand/logo-negative.png" alt="FórmulaHogar" width={240} height={44} className="h-7 w-auto self-start" />
            <nav aria-label="Legal" className="-mx-3 flex flex-wrap items-center">
              {LEGAL.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center px-3 text-sm text-white/65 transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <p className="text-xs text-white/50">© {new Date().getFullYear()} FórmulaHogar</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
