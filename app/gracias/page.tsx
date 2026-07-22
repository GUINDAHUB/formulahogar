"use client";

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { House, CheckCircle, TrendUp, Calendar, Wallet } from '@phosphor-icons/react';
import { calculateResults } from '@/utils/calculator';
import CertificationBadge from '@/components/CertificationBadge';

const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        setDisplayValue(0);
        const duration = 1200;
        const steps = 50;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <span>
            {prefix}{displayValue.toLocaleString('es-ES')}{suffix}
        </span>
    );
};

const ResultsContent = () => {
    const router = useRouter();
    const [data, setData] = useState<{
        price: number;
        community: string;
        age: number;
        buyingWith: string;
    } | null>(null);

    useEffect(() => {
        const savedData = sessionStorage.getItem('fh_calculator_data');

        if (savedData) {
            try {
                setData(JSON.parse(savedData));
            } catch (e) {
                console.error("Error parsing saved data", e);
                setData({
                    price: 200000,
                    community: 'Madrid',
                    age: 30,
                    buyingWith: 'alone'
                });
            }
        } else {
            setData({
                price: 200000,
                community: 'Madrid',
                age: 30,
                buyingWith: 'alone'
            });
        }
    }, []);

    if (!data) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#EBEBEB]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BFFF00]"></div>
            </div>
        );
    }

    const { traditionalDownPayment, formulaHogarDownPayment, savings, months } = calculateResults({
        price: data.price,
        community: data.community,
        age: data.age
    });

    const getDisplayValue = (value: number) => {
        if (data.buyingWith === 'partner') {
            return Math.round(value / 2);
        }
        return value;
    };

    return (
        <div className="h-screen flex flex-col bg-[#EBEBEB] font-sans antialiased overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-[#D6D6D6] flex-shrink-0">
                <div className="container mx-auto px-4 md:px-6 py-2 md:py-3 flex justify-center">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
                        <img src="/brand/logo-color.png" alt="FórmulaHogar" className="h-7 w-auto" />
                    </Link>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 h-full">
                    <div className="max-w-2xl mx-auto h-full flex flex-col">

                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#D6D6D6] animate-fade-in flex-1 flex flex-col">

                            {/* Header Section */}
                            <div className="text-center mb-6 flex-shrink-0">
                                <div className="mb-4 bg-[#BFFF00]/15 border border-[#BFFF00]/30 p-3 rounded-xl inline-block animate-fade-in">
                                    <div className="flex items-center justify-center gap-2 text-[#141313] font-bold mb-1">
                                        <CheckCircle size={20} weight="fill" />
                                        ¡Solicitud Recibida!
                                    </div>
                                    <p className="text-xs text-[#545454]">
                                        Un experto analizará tu caso en breve.
                                    </p>
                                </div>
                                <h1 className="font-display text-2xl md:text-3xl font-bold text-[#141313] mb-1">
                                    ¡Tu Plan Personalizado!
                                </h1>
                                <p className="text-sm text-[#545454]">
                                    Ahorras <span className="font-bold text-[#141313]"><AnimatedNumber value={getDisplayValue(savings)} suffix="€" /></span> en tu entrada
                                </p>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                                {/* Comparison Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 relative">
                                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                                            Tradicional
                                        </div>
                                        <div className="mt-5">
                                            <p className="text-[10px] text-red-600 font-medium mb-1">
                                                Entrada (30%){data.buyingWith === 'partner' ? ' / persona' : ''}
                                            </p>
                                            <p className="text-xl md:text-2xl font-bold text-red-600 mb-2">
                                                {getDisplayValue(traditionalDownPayment).toLocaleString('es-ES')}€
                                            </p>
                                            <p className="text-[10px] text-red-700 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                ~{Math.ceil(getDisplayValue(traditionalDownPayment) / 12000)} años ahorrando
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-[#BFFF00]/10 border-2 border-[#BFFF00] rounded-xl p-3 relative shadow-lg">
                                        <div className="absolute top-0 right-0 bg-[#BFFF00] text-[#141313] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                                            FórmulaHogar
                                        </div>
                                        <div className="mt-5">
                                            <p className="text-[10px] text-[#141313] font-medium mb-1">
                                                Entrada (5%){data.buyingWith === 'partner' ? ' / persona' : ''}
                                            </p>
                                            <p className="text-xl md:text-2xl font-bold text-[#141313] mb-2">
                                                {getDisplayValue(formulaHogarDownPayment).toLocaleString('es-ES')}€
                                            </p>
                                            <p className="text-[10px] text-[#141313] flex items-center gap-1">
                                                <CheckCircle size={12} weight="fill" />
                                                Propietario día 1
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Stats Row */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-[#EBEBEB] p-3 rounded-xl border border-[#D6D6D6] text-center">
                                        <div className="w-6 h-6 rounded-full bg-[#D6D6D6] text-[#141313] flex items-center justify-center mx-auto mb-1">
                                            <TrendUp size={12} weight="fill" />
                                        </div>
                                        <p className="text-[9px] text-[#9D9D9D] uppercase font-bold mb-0.5">Plusvalía</p>
                                        <p className="text-xs font-bold text-[#141313]">100% Tuya</p>
                                    </div>
                                    <div className="bg-[#EBEBEB] p-3 rounded-xl border border-[#D6D6D6] text-center">
                                        <div className="w-6 h-6 rounded-full bg-[#D6D6D6] text-[#141313] flex items-center justify-center mx-auto mb-1">
                                            <Calendar size={12} weight="fill" />
                                        </div>
                                        <p className="text-[9px] text-[#9D9D9D] uppercase font-bold mb-0.5">Cesión</p>
                                        <p className="text-xs font-bold text-[#141313]">{months} Meses</p>
                                    </div>
                                     <div className="bg-[#BFFF00]/10 p-3 rounded-xl border border-[#BFFF00]/30 text-center">
                                        <div className="w-6 h-6 rounded-full bg-[#BFFF00] text-[#141313] flex items-center justify-center mx-auto mb-1">
                                            <Wallet size={12} weight="fill" />
                                        </div>
                                        <p className="text-[9px] text-[#545454] uppercase font-bold mb-0.5">Ahorro</p>
                                        <p className="text-xs font-bold text-[#141313]">{getDisplayValue(savings).toLocaleString('es-ES')}€</p>
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="bg-[#EBEBEB] rounded-xl p-4 border border-[#D6D6D6]">
                                    <h3 className="text-xs font-bold text-[#141313] mb-3 uppercase tracking-wider">Próximos pasos</h3>
                                    <div className="flex justify-between gap-2">
                                        {[
                                            { step: 1, title: "Análisis" },
                                            { step: 2, title: "Contacto" },
                                            { step: 3, title: "Propuesta" }
                                        ].map((item) => (
                                            <div key={item.step} className="flex flex-col items-center text-center flex-1">
                                                <div className="w-6 h-6 rounded-full bg-[#141313] text-white flex items-center justify-center text-xs font-bold mb-1 shadow-md">
                                                    {item.step}
                                                </div>
                                                <p className="text-[10px] font-medium text-[#545454]">{item.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Bottom CTA */}
                            <div className="mt-4 pt-4 border-t border-[#D6D6D6] flex-shrink-0 text-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-[#141313] text-white font-bold rounded-xl hover:bg-[#141313]/90 transition-all shadow-lg text-sm cursor-pointer"
                                >
                                    <House size={16} weight="fill" />
                                    Volver al inicio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Certification strip */}
            <div className="bg-white border-t border-[#D6D6D6] flex-shrink-0 py-2.5 flex justify-center">
                <CertificationBadge />
            </div>

            <style jsx>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                  animation: fade-in 0.4s ease-out;
                }
            `}</style>
        </div>
    );
};

const GraciasPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#EBEBEB]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BFFF00]"></div>
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
};

export default GraciasPage;
