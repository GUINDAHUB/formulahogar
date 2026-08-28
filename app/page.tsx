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
