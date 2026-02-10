import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0f291e] text-slate-400 py-12 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="flex items-center gap-2 font-bold text-2xl text-white mb-4 md:mb-0">
                        <Home className="w-6 h-6 text-[#28A77D]" />
                        FórmulaHogar
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link href="/politicas#aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link>
                        <Link href="/politicas#privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
                <div className="text-center md:text-left text-xs opacity-60">
                    © {new Date().getFullYear()} Fórmula Hogar. Todos los derechos reservados. Una revolución en el sector PropTech.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
