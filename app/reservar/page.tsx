import type { Metadata } from "next";
import Image from "next/image";
import Redirect, { RESERVAR_URL } from "./redirect";

const PAGE_URL = "https://formulahogar.com/reservar";
const TITLE = "Reserva tu llamada con Fórmula Hogar";
const DESCRIPTION =
  "Elige el hueco que mejor te venga. Son 10 minutos por teléfono para ver cómo conseguirte tu casa, sin compromiso.";

export const metadata: Metadata = {
  metadataBase: new URL("https://formulahogar.com"),
  title: TITLE,
  description: DESCRIPTION,
  // Es una pasarela de redirección: no queremos que se indexe en Google,
  // pero las vistas previas sociales (que sí leen Open Graph) seguirán funcionando.
  robots: { index: false, follow: false },
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Fórmula Hogar",
    locale: "es_ES",
    title: TITLE,
    description: DESCRIPTION,
    // La imagen la genera app/reservar/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ReservarPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6 text-center">
      <Redirect />

      <Image
        src="/brand/logo-color.png"
        alt="Fórmula Hogar"
        width={200}
        height={38}
        priority
        className="h-auto w-[180px]"
      />

      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-brand-gray-200 border-t-brand"
        role="status"
        aria-label="Cargando"
      />

      <div className="max-w-sm">
        <p className="font-display text-xl text-near-black">
          Te llevamos a la agenda
        </p>
        <p className="mt-2 text-sm text-brand-gray-600">
          Elige el hueco que mejor te venga para tu llamada de 10 minutos.
          Solo será un momento.
        </p>
      </div>

      <noscript>
        <a
          href={RESERVAR_URL}
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-near-black"
        >
          Reservar mi llamada
        </a>
      </noscript>
    </main>
  );
}
