"use client";

import React, { useState, useEffect } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { sendGTMEvent } from '@next/third-parties/google'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const isScrolled = latest > 50;
        if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
        }
    });

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const scrollToSection = (id: string, event: string) => {
        // Map clean names to section IDs
        const sectionMap: { [key: string]: string } = {
            'cómo-funciona': 'cómo-funciona',
            'reseñas': 'reseñas',
            'ventajas': 'beneficios',
            'faq': 'faq'
        };

        const element = document.getElementById(sectionMap[id] || id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
        sendGTMEvent({ event: 'buttonClicked', value: event })
    };

    const navItems = ['Cómo funciona', 'Reseñas', 'Ventajas', 'FAQ'];

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "fixed z-50 left-0 right-0 mx-auto",
                    scrolled
                        ? "top-4 w-[95%] md:w-[95%] lg:w-[85%] xl:w-[70%] rounded-full"
                        : "top-0 w-full"
                )}
                style={{
                    transition: 'top 0.3s ease, border-radius 0.3s ease'
                }}
            >
                <div
                    className={cn(
                        "flex items-center px-6 mx-auto",
                        scrolled
                            ? "bg-white/80 backdrop-blur-md shadow-lg py-3 rounded-full border border-white/20 justify-between"
                            : "bg-[#163C2E] py-5 container justify-between"
                    )}
                    style={{
                        transition: 'background-color 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease, border 0.3s ease'
                    }}
                >
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer"
                        onClick={() => window.scrollTo(0, 0)}
                    >
                        <div className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            scrolled ? "bg-[#163C2E]" : "bg-[#28A77D]"
                        )}>
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <span className={cn(
                            "transition-colors",
                            scrolled ? "text-[#163C2E]" : "text-white"
                        )}>
                            Fórmula<span className={scrolled ? "text-[#28A77D]" : "text-[#28A77D]"}>Hogar</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6">
                        {navItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'), item.toLowerCase().replace(' ', '-') + '-menu')}
                                className={cn(
                                    "text-sm font-medium hover:text-[#28A77D] transition-colors",
                                    scrolled ? "text-slate-600" : "text-slate-300"
                                )}
                            >
                                {item}
                            </button>
                        ))}
                        <a
                            href="/calculadora"
                            className={cn(
                                "px-5 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-xl",
                                "bg-[#28A77D] text-white"
                            )}
                        >
                            Comenzar
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <X className={scrolled ? 'text-[#163C2E]' : 'text-white'} />
                        ) : (
                            <Menu className={scrolled ? 'text-[#163C2E]' : 'text-white'} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 w-full mt-2 bg-white shadow-xl rounded-2xl border border-slate-100 md:hidden flex flex-col p-6 gap-4 overflow-hidden"
                        >
                            {navItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'), item.toLowerCase().replace(' ', '-') + '-menu')}
                                    className="text-left text-lg font-medium text-slate-700"
                                >
                                    {item}
                                </button>
                            ))}
                            <a
                                href="/calculadora"
                                className="w-full text-center py-3 rounded-xl font-bold mt-2 bg-[#28A77D] text-white"
                            >
                                Quiero mi casa
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};

export default Navbar;
