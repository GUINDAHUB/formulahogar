"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import CampaignFooter from "@/components/hipotecas/CampaignFooter";
import Hero from "@/components/hipotecas/Hero";
import HowItWorks from "@/components/hipotecas/HowItWorks";
import BankLogosGrid from "@/components/hipotecas/BankLogosGrid";
import LeadAndStories from "@/components/hipotecas/LeadAndStories";
import HipotecasFAQ from "@/components/hipotecas/HipotecasFAQ";
import {
  captureUtmsFromUrl,
  initScrollDepthTracking,
  track,
} from "@/lib/analytics";

// Datos estructurados del servicio de intermediación hipotecaria (SEO/GEO).
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://formulahogar.com/#servicio-hipotecas",
  name: "Intermediación hipotecaria",
  serviceType: "Intermediación de crédito inmobiliario",
  description:
    "Negociación de hipotecas con más de 20 bancos en paralelo. Precio fijo sin porcentajes sobre el precio de la vivienda, mínimo 3 ofertas reales para comparar y análisis gratuito de viabilidad en 48 horas.",
  provider: { "@id": "https://formulahogar.com/#organization" },
  areaServed: { "@type": "Country", name: "España" },
  url: "https://formulahogar.com/",
  offers: {
    "@type": "Offer",
    description:
      "Análisis de viabilidad gratuito en 48h. Honorarios a precio fijo, solo si se firma la hipoteca.",
    price: "0",
    priceCurrency: "EUR",
    category: "Análisis inicial gratuito",
  },
};

// Hipotecas es ahora la home (/). Alquiler con Opción a Compra vive en
// /alquiler-opcion-compra y Cesión de Uso en /cesion-de-uso.
export default function HomePage() {
  useEffect(() => {
    captureUtmsFromUrl();
    track("page_view", { page: "hipotecas_landing" });
    const cleanup = initScrollDepthTracking();
    return cleanup;
  }, []);

  return (
    <main className="bg-white text-[#141313]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Navbar />
      <Hero />
      <HowItWorks />
      <BankLogosGrid />
      <LeadAndStories />
      <HipotecasFAQ />
      <CampaignFooter />
    </main>
  );
}
