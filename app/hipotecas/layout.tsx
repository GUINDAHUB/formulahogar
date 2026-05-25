import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hipotecas — FórmulaHogar | Negociamos por ti, sin coste",
  description:
    "Negociamos con más de 20 bancos para conseguirte la mejor hipoteca del mercado. Sin coste para ti. Análisis gratuito en 48h.",
  alternates: {
    canonical: "https://formulahogar.com/hipotecas",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Hipotecas — FórmulaHogar",
    description:
      "Tu mejor hipoteca, negociada por nosotros. Sin coste para ti. Respuesta en 48h.",
    url: "https://formulahogar.com/hipotecas",
    siteName: "FórmulaHogar",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hipotecas — FórmulaHogar",
    description:
      "Tu mejor hipoteca, negociada por nosotros. Sin coste para ti. Respuesta en 48h.",
  },
};

export default function HipotecasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
