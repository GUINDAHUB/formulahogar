import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alquiler con Opción a Compra — FórmulaHogar",
  description:
    "Conviértete en propietario con solo un 5% de entrada. Vive en tu futura casa hoy mientras construyes la entrada, mes a mes.",
  alternates: {
    canonical: "https://formulahogar.com/alquiler-opcion-compra",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Alquiler con Opción a Compra — FórmulaHogar",
    description:
      "Tu camino a la vivienda propia empieza aquí. Entra a vivir hoy y construye tu entrada mes a mes.",
    url: "https://formulahogar.com/alquiler-opcion-compra",
    siteName: "FórmulaHogar",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alquiler con Opción a Compra — FórmulaHogar",
    description:
      "Tu camino a la vivienda propia empieza aquí. Entra a vivir hoy y construye tu entrada mes a mes.",
  },
};

export default function AlquilerOpcionCompraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
