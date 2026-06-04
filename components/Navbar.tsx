"use client";

import React, { useState, useEffect } from 'react';
import { List, X, CaretDown } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { sendGTMEvent } from '@next/third-parties/google';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Trigger when scrolled past ~80% of viewport height (hero area)
      setIsScrolled(window.scrollY > window.innerHeight * 0.6);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleViewportChange = (event: MediaQueryListEvent) =>
      setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleViewportChange);

    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const isActivePath = (href: string) => pathname === href;

  const scrollToSection = (id: string, event: string) => {
    const sectionMap: Record<string, string> = {
      'cómo-funciona': 'cómo-funciona',
      'como-funciona': 'como-funciona',
      reseñas: 'reseñas',
      ventajas: 'beneficios',
      faq: 'faq',
      'que-es': 'que-es',
    };

    const targetId = sectionMap[id] || id;
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      sendGTMEvent({ event: 'buttonClicked', value: event });
      return;
    }

    if (pathname !== '/') {
      window.location.href = `/#${targetId}`;
      setIsMenuOpen(false);
      sendGTMEvent({ event: 'buttonClicked', value: event });
      return;
    }

    setIsMenuOpen(false);
    sendGTMEvent({ event: 'buttonClicked', value: event });
  };

  // La home (/) es ahora la landing de Alquiler con Opción a Compra.
  // La de Cesión de Uso vive en /cesion-de-uso.
  const navItems =
    pathname === '/cesion-de-uso'
      ? [
          { label: 'Cómo funciona', id: 'cómo-funciona' },
          { label: 'Ventajas', id: 'ventajas' },
          { label: 'FAQ', id: 'faq' },
        ]
      : [
          { label: 'Cómo funciona', id: 'como-funciona' },
          { label: 'Ventajas', id: 'ventajas' },
          { label: 'Reseñas', id: 'reseñas' },
        ];

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
        <div className="pointer-events-auto mt-4 w-full px-4">
          <motion.div
            initial={false}
            animate={{
              maxWidth: isMobile
                ? 'calc(100vw - 2rem)'
                : isScrolled
                  ? 'min(52rem, calc(100vw - 2rem))'
                  : 'min(90rem, calc(100vw - 16rem))',
            }}
            transition={{
              duration: 0.6,
              ease: [0.32, 0.72, 0, 1],
            }}
            className={cn(
              'mx-auto flex w-full items-center justify-between rounded-full border px-5 py-3',
              'backdrop-blur-xl bg-white/80 border-white/40 shadow-[0_18px_45px_rgba(0,0,0,0.25)]',
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex flex-none items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              <Image
                src="/brand/logo-color.png"
                alt="FórmulaHogar"
                width={260}
                height={48}
                className="h-8 w-auto max-w-none shrink-0"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {/* Product Switcher Dropdown */}
              <div className="relative group mr-4">
                <button
                  className={cn(
                    'flex items-center gap-1 text-sm font-semibold text-[#545454] hover:text-[#141313] transition-all outline-none px-3 py-2 rounded-lg hover:bg-[#EBEBEB]',
                  )}
                >
                  Productos
                  <CaretDown
                    size={16}
                    weight="fill"
                    className="transition-transform group-hover:rotate-180"
                  />
                </button>

                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="bg-white rounded-xl shadow-xl p-2 border border-[#D6D6D6] flex flex-col gap-1 overflow-hidden">
                    <Link
                      href="/"
                      className={cn(
                        'block px-4 py-3 rounded-lg transition-colors group/item',
                        isActivePath('/')
                          ? 'bg-[#BFFF00]'
                          : 'hover:bg-[#EBEBEB]',
                      )}
                    >
                      <div className="text-sm font-bold text-[#141313]">
                        Alquiler con Opción a Compra
                      </div>
                      <div
                        className={cn(
                          'text-xs mt-0.5',
                          isActivePath('/') ? 'text-[#545454]' : 'text-[#9D9D9D]',
                        )}
                      >
                        Tu entrada, mes a mes
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() =>
                    scrollToSection(
                      item.id,
                      `${item.id}-menu`,
                    )
                  }
                  className={cn(
                    'text-sm font-semibold text-[#545454] hover:text-[#141313] transition-all px-3 py-2 rounded-lg hover:bg-[#EBEBEB] hover:underline underline-offset-4 decoration-[#141313]/40',
                  )}
                >
                  {item.label}
                </button>
              ))}
              <a
                href="/calculadora"
                className="px-5 py-2 rounded-lg font-bold text-sm transition-all transform hover:scale-105 bg-[#BFFF00] text-[#141313] cursor-pointer"
              >
                Comenzar
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden cursor-pointer text-[#141313] rounded-lg p-1.5 hover:bg-[#EBEBEB] transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? (
                <X size={24} weight="bold" />
              ) : (
                <List size={24} weight="regular" />
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú móvil"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[58] bg-[#141313]/45 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
              className="fixed z-[60] top-20 left-4 right-4 md:hidden"
            >
              <div className="bg-white shadow-2xl rounded-2xl border border-[#D6D6D6] flex flex-col p-5 gap-4 overflow-hidden">
                <div className="flex flex-col gap-1 border-b border-[#EBEBEB] pb-4 mb-1">
                  <p className="text-xs font-bold text-[#9D9D9D] uppercase tracking-widest mb-2 px-2">
                    Productos
                  </p>
                  <Link
                    href="/"
                    className={cn(
                      'text-base font-semibold px-3 py-2.5 rounded-xl transition-colors',
                      isActivePath('/')
                        ? 'bg-[#BFFF00] text-[#141313]'
                        : 'text-[#545454] hover:text-[#141313] hover:bg-[#EBEBEB]',
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Alquiler con Opción a Compra
                  </Link>
                </div>

                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      scrollToSection(
                        item.id,
                        `${item.id}-menu`,
                      )
                    }
                    className={cn(
                      'text-left text-base font-semibold px-3 py-2.5 rounded-xl transition-colors cursor-pointer',
                      'text-[#545454] hover:bg-[#EBEBEB] hover:text-[#141313]',
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                <a
                  href="/calculadora"
                  className={cn(
                    'w-full text-center py-3 rounded-xl font-bold mt-1 transition-all',
                    isActivePath('/calculadora')
                      ? 'bg-[#141313] text-white'
                      : 'bg-[#BFFF00] text-[#141313]',
                  )}
                >
                  Quiero mi casa
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
