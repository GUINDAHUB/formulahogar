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

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://formulahogar.com/alquiler-opcion-compra#servicio",
  name: "Alquiler con opción a compra",
  serviceType: "Acceso alternativo a la vivienda",
  description:
    "El cliente elige la vivienda, un inversor la compra y el cliente entra a vivir desde el primer día con una cuota inicial reducida. Paga un alquiler de mercado más una cuota extra que se acumula para su futura entrada, y a los 3-7 años ejerce la opción de compra a un precio pactado desde el inicio.",
  provider: { "@id": "https://formulahogar.com/#organization" },
  areaServed: { "@type": "Country", name: "España" },
  url: "https://formulahogar.com/alquiler-opcion-compra",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://formulahogar.com/" },
    { "@type": "ListItem", position: 2, name: "Alquiler con Opción a Compra", item: "https://formulahogar.com/alquiler-opcion-compra" },
  ],
};

export default function AlquilerOpcionCompraLayout({
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
