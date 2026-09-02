import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal y política de privacidad — FórmulaHogar",
  description:
    "Aviso legal, política de privacidad y condiciones de uso de FórmulaHogar, Intermediaria de Crédito Inmobiliario certificada por el Banco de España (registro E783).",
  alternates: {
    canonical: "https://formulahogar.com/politicas",
  },
};

export default function PoliticasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
