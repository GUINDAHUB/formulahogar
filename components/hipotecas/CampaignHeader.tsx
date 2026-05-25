"use client";

import Image from "next/image";

export default function CampaignHeader() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-[#EBEBEB]">
      <div className="container mx-auto h-16 flex items-center justify-center px-6">
        <a
          href="#top"
          onClick={scrollToTop}
          aria-label="FórmulaHogar"
          className="inline-flex items-center"
        >
          <Image
            src="/brand/logo-color.png"
            alt="FórmulaHogar"
            width={260}
            height={48}
            priority
            className="h-8 w-auto"
          />
        </a>
      </div>
    </header>
  );
}
