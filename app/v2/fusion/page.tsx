"use client";

import { useEffect } from "react";
import Nav from "@/components/v2/Nav";
import Hero from "@/components/v2/fusion/Hero";
import Steps from "@/components/v2/fusion/Steps";
import Lead from "@/components/v2/fusion/Lead";
import Families from "@/components/v2/fusion/Families";
import Balance from "@/components/v2/fusion/Balance";
import FAQ from "@/components/v2/FAQ";
import Footer from "@/components/v2/Footer";
import MobileCta from "@/components/v2/MobileCta";
import { V2Button, scrollToId, useV2Reveal } from "@/components/v2/ui";
import { FUSION_FAQS } from "@/components/v2/fusion/faqs";
import { captureUtmsFromUrl, initScrollDepthTracking, track } from "@/lib/analytics";

export default function FusionV2() {
  useV2Reveal();

  // Cada sección es una pantalla: el scroll se asienta al inicio de cada una.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("v2-snap");
    return () => root.classList.remove("v2-snap");
  }, []);

  useEffect(() => {
    captureUtmsFromUrl();
    track("page_view", { page: "fusion_landing_v2" });
    return initScrollDepthTracking();
  }, []);

  return (
    <main className="v2 pb-24 lg:pb-0">
      <Nav
        current="/v2/fusion"
        links={[
          { label: "Cómo funciona", id: "como-funciona" },
          { label: "Familias tipo", id: "familias" },
          { label: "FAQ", id: "faq" },
        ]}
        cta={{ label: "Quiero mi estudio", mobileLabel: "Mi estudio", target: "estudio", event: "cta-navbar-fusion" }}
      />
      <Hero />
      <Steps />
      <Lead />
      <Families />
      <Balance />
      <FAQ items={FUSION_FAQS} page="fusion" defaultOpen={0} screen />
      <Footer
        closing={
          <h2 className="v2-display mt-8 max-w-[14ch] text-[clamp(2.5rem,1.6rem+3.4vw,5rem)] leading-[1.02]">
            Un recibo. Más bajo. <span className="v2-it text-[#BFFF00]">Con los números claros.</span>
          </h2>
        }
        action={
          <div className="max-w-sm">
            <p className="text-lg leading-relaxed text-white/70">
              Cuéntanos tu situación y te explicamos tu caso, sin compromiso.
            </p>
            <V2Button
              className="mt-6"
              onClick={() => {
                track("cta_click", { cta_location: "closing", page: "fusion" });
                scrollToId("estudio");
              }}
            >
              Quiero mi estudio
            </V2Button>
          </div>
        }
      />
      <MobileCta label="Quiero mi estudio" target="estudio" page="fusion" />
    </main>
  );
}
