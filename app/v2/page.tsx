"use client";

import { useEffect } from "react";
import Nav from "@/components/v2/Nav";
import Hero from "@/components/v2/hipotecas/Hero";
import Steps from "@/components/v2/hipotecas/Steps";
import Banks from "@/components/v2/hipotecas/Banks";
import Lead from "@/components/v2/hipotecas/Lead";
import FAQ from "@/components/v2/FAQ";
import Footer from "@/components/v2/Footer";
import MobileCta from "@/components/v2/MobileCta";
import { V2Button, scrollToId, useV2Reveal } from "@/components/v2/ui";
import { captureUtmsFromUrl, initScrollDepthTracking, track } from "@/lib/analytics";
import { HIPOTECAS_FAQS } from "@/components/v2/hipotecas/faqs";

export default function HipotecasV2() {
  useV2Reveal();

  useEffect(() => {
    captureUtmsFromUrl();
    track("page_view", { page: "hipotecas_landing_v2" });
    return initScrollDepthTracking();
  }, []);

  return (
    <main className="v2 pb-24 lg:pb-0">
      <Nav
        current="/v2"
        links={[
          { label: "Cómo funciona", id: "como-funciona" },
          { label: "Bancos", id: "bancos" },
          { label: "FAQ", id: "faq" },
        ]}
        cta={{ label: "Análisis gratis", target: "lead-form", event: "cta-navbar-hipotecas" }}
      />
      <Hero />
      <Steps />
      <Banks />
      <Lead />
      <FAQ items={HIPOTECAS_FAQS} page="hipotecas" />
      <Footer
        action={
          <V2Button
            onClick={() => {
              track("cta_click", { cta_location: "footer" });
              scrollToId("lead-form");
            }}
          >
            Quiero mi análisis gratis
          </V2Button>
        }
      />
      <MobileCta label="Quiero mi análisis gratis" target="lead-form" page="hipotecas" />
    </main>
  );
}
