import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de ahorro — FórmulaHogar",
  description:
    "Calcula cuánto necesitas para tu vivienda: compara la entrada tradicional (~30% con gastos e impuestos) con la fórmula de FórmulaHogar según tu comunidad autónoma, el precio y tu edad.",
  alternates: {
    canonical: "https://formulahogar.com/calculadora",
  },
  openGraph: {
    title: "Calculadora de ahorro — FórmulaHogar",
    description:
      "Compara la entrada tradicional con la fórmula de FórmulaHogar y descubre cuánto puedes ahorrar.",
    url: "https://formulahogar.com/calculadora",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://formulahogar.com/" },
    { "@type": "ListItem", position: 2, name: "Calculadora de ahorro", item: "https://formulahogar.com/calculadora" },
  ],
};

export default function CalculadoraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
