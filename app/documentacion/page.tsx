import type { Metadata } from "next";
import Image from "next/image";
import Redirect from "./redirect";

const BELENDER_URL =
  "https://widget.belender.net/widget-boxed/clavepin/6d17c1b9-3ec4-431d-b009-be7742eff16c/e75aa965-4851-4cb9-b2d1-00b49d3b7950";

const TITLE = "Fórmula Hogar — Autoriza el acceso a tu documentación";
const DESCRIPTION =
  "Da tu consentimiento de forma segura y protegida. Tus datos están a salvo y solo tú decides cuándo avanzar con tu solicitud.";

export const metadata: Metadata = {
  metadataBase: new URL("https://formulahogar.com"),
  title: TITLE,
  description: DESCRIPTION,
  // Es una pasarela de redirección: no queremos que se indexe en Google,
  // pero las vistas previas sociales (que sí leen Open Graph) seguirán funcionando.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: "https://formulahogar.com/documentacion",
    siteName: "Fórmula Hogar",
    locale: "es_ES",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-documentacion.jpg",
        width: 1200,
        height: 675,
        alt: "Fórmula Hogar — Tu propio hogar, es posible",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-documentacion.jpg"],
  },
};

export default function DocumentacionPage() {
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
          Autoriza el acceso de forma segura
        </p>
        <p className="mt-2 text-sm text-brand-gray-600">
          Te llevamos a un entorno seguro y protegido para que confirmes el
          acceso a tu documentación. Solo será un momento.
        </p>
      </div>

      <noscript>
        <a
          href={BELENDER_URL}
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-near-black"
        >
          Continuar de forma segura
        </a>
      </noscript>
    </main>
  );
}
