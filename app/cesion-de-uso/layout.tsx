import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cesión de Uso — FórmulaHogar | Tu primera vivienda sin la barrera de la entrada",
  description:
    "¿Puedes pagar una hipoteca pero no la entrada? Transformamos el alquiler futuro en tu entrada actual. Conviértete en propietario desde el día 1 con tan solo un 5% de ahorro.",
  alternates: {
    canonical: "https://formulahogar.com/cesion-de-uso",
  },
  openGraph: {
    title: "Cesión de Uso — FórmulaHogar",
    description:
      "Conviértete en propietario desde el día 1 con tan solo un 5% de ahorro.",
    url: "https://formulahogar.com/cesion-de-uso",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://formulahogar.com/cesion-de-uso#servicio",
  name: "Cesión de uso",
  serviceType: "Acceso alternativo a la vivienda",
  description:
    "Fórmula de acceso a la primera vivienda con solo un 5% de ahorro: el alquiler futuro se transforma en la entrada actual y el cliente se convierte en propietario desde el día 1.",
  provider: { "@id": "https://formulahogar.com/#organization" },
  areaServed: { "@type": "Country", name: "España" },
  url: "https://formulahogar.com/cesion-de-uso",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://formulahogar.com/" },
    { "@type": "ListItem", position: 2, name: "Cesión de Uso", item: "https://formulahogar.com/cesion-de-uso" },
  ],
};

export default function CesionDeUsoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
