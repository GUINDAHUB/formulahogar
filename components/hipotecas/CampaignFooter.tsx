"use client";

import Image from "next/image";

export default function CampaignFooter() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white text-[#141313] pt-12 pb-12 border-t border-[#EBEBEB]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          <a
            href="#top"
            onClick={scrollToTop}
            aria-label="FórmulaHogar"
            className="flex items-center"
          >
            <Image
              src="/brand/logo-color.png"
              alt="FórmulaHogar"
              width={240}
              height={44}
              className="h-7 w-auto"
            />
          </a>

          <nav className="flex items-center gap-3 text-sm text-[#545454]">
            <a
              href="https://formulahogar.com/politicas#aviso-legal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#141313] transition-colors"
            >
              Aviso Legal
            </a>
            <span aria-hidden className="text-[#9D9D9D]">·</span>
            <a
              href="https://formulahogar.com/politicas#privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#141313] transition-colors"
            >
              Privacidad
            </a>
            <span aria-hidden className="text-[#9D9D9D]">·</span>
            <a
              href="https://formulahogar.com/politicas#cookies"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#141313] transition-colors"
            >
              Cookies
            </a>
          </nav>

          <p className="text-xs text-[#9D9D9D]">© {new Date().getFullYear()} FórmulaHogar</p>
        </div>
      </div>
    </footer>
  );
}
