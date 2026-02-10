"use client";

import React from 'react';
import {
    Home,
    CheckCircle,
    ArrowRight,
    ChevronDown,
    TrendingUp,
    ShieldCheck,
    Clock,
    Coins
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import VideoSection from '@/components/VideoSection';
import Footer from '@/components/Footer';
import ReviewsSlider from '@/components/ReviewsSlider';
import { sendGTMEvent } from '@next/third-parties/google';

const AlquilerOpcionCompraPage = () => {
    const colors = {
        darkGreen: '#163C2E',
        lightGreen: '#28A77D',
        white: '#FFFFFF',
        offWhite: '#F8FAFC',
        textDark: '#1E293B',
        textLight: '#94A3B8'
    };

    const scrollToSection = (id: string, event: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        sendGTMEvent({ event: 'buttonClicked', value: event });
    };

    return (
        <div className="font-sans antialiased text-slate-800 bg-white selection:bg-[#28A77D] selection:text-white">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-16 overflow-hidden" style={{ backgroundColor: colors.darkGreen }}>
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#28A77D] text-sm font-semibold mb-6 border border-[#28A77D]/30 backdrop-blur-sm animate-fade-in-up">
                                <span className="w-2 h-2 rounded-full bg-[#28A77D] animate-pulse"></span>
                                Alquiler con Opción a Compra
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                Tu camino a la <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28A77D] to-emerald-300">
                                    vivienda propia
                                </span> empieza aquí
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Vive en tu futura casa hoy mientras construyes la entrada. Sin bancos iniciales, sin papeleo complicado.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a
                                    href="/calculadora"
                                    className="px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:translate-y-[-2px] hover:shadow-2xl shadow-lg hover:shadow-[#28A77D]/20"
                                    style={{ backgroundColor: colors.lightGreen, color: colors.white }}
                                >
                                    Analizar mi caso gratis
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={() => scrollToSection('que-es', 'que-es-btn')}
                                    className="px-8 py-4 rounded-xl font-bold text-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                                >
                                    ¿Cómo funciona?
                                </button>
                            </div>
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-400">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-[#163C2E] overflow-hidden">
                                        <img src="https://randomuser.me/api/portraits/men/12.jpg" alt="Usuario" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-[#163C2E] overflow-hidden">
                                        <img src="https://randomuser.me/api/portraits/women/24.jpg" alt="Usuario" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-[#163C2E] overflow-hidden">
                                        <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="Usuario" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-[#163C2E] overflow-hidden">
                                        <img src="https://randomuser.me/api/portraits/women/58.jpg" alt="Usuario" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <p>Más de <span className="text-white font-bold">500+</span> propietarios felices</p>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="/hero-house.png" // Using same hero image for now
                                    alt="Interior vivienda moderna"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-[#28A77D] text-white text-xs font-bold px-2 py-1 rounded">DISPONIBLE</span>
                                    </div>
                                    <p className="text-2xl font-bold">Tu futura casa</p>
                                    <p className="opacity-90">Construye tu entrada mes a mes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- VIDEO EXPLAINER (Moved After Hero) --- */}
            <VideoSection
                playbackId="cJ9ZMRcoDPhxq6Tz11uj6jCdbsmeYBWfOEQIxdGp6Kg"
                steps={[
                    {
                        icon: <Home className="w-6 h-6" />,
                        title: "1. Elige tu casa",
                        desc: "Busca la vivienda que te gusta y nosotros la analizamos para asegurar su viabilidad."
                    },
                    {
                        icon: <Coins className="w-6 h-6" />,
                        title: "2. Aportación Inicial",
                        desc: "Entras con una cuota reducida, mucho menor que la entrada tradicional de un banco."
                    },
                    {
                        icon: <Clock className="w-6 h-6" />,
                        title: "3. Vive y Ahorra",
                        desc: "Pagas un alquiler y una cuota extra que se acumula para tu futura entrada."
                    },
                    {
                        icon: <CheckCircle className="w-6 h-6" />,
                        title: "4. Compra tu Hogar",
                        desc: "A los 3-7 años ejerces tu opción de compra con la entrada ya generada."
                    }
                ]}
            />



            {/* --- HOW IT WORKS (STEP BY STEP) --- */}
            <section id="como-funciona" className="py-20 bg-[#F8FAFC]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#163C2E] mb-4">¿Cómo funciona, paso a paso?</h2>
                        <p className="text-slate-600">Un proceso sencillo y transparente.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Eliges la vivienda que te gusta",
                                description: "Y la analizamos para confirmar que cumple criterios de seguridad y viabilidad."
                            },
                            {
                                step: "02",
                                title: "Un inversor la compra por ti",
                                description: "Tú te mudas desde el primer día."
                            },
                            {
                                step: "03",
                                title: "Entras con una cuota inicial reducida",
                                description: "Mucho más baja que la entrada tradicional de un banco."
                            },
                            {
                                step: "04",
                                title: "Pagas un alquiler similar al del mercado",
                                description: "Con la seguridad de que es tu futura casa."
                            },
                            {
                                step: "05",
                                title: "Aportas una cuota mensual extra",
                                description: "Esta cuota se acumula mes a mes para generar tu futura entrada."
                            },
                            {
                                step: "06",
                                title: "A los 3-7 años, compras la vivienda",
                                description: "El precio ya está pactado desde el inicio. Sin sorpresas. Y ya tienes tu entrada generada."
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                <div className="text-6xl font-bold text-slate-100 absolute top-4 right-4 pointer-events-none">
                                    {item.step}
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-[#163C2E] mb-3 pr-8">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SOCIAL PROOF / REVIEWS --- */}
            <section id="reseñas" className="py-20 bg-[#F8FAFC]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#163C2E] mb-4">Historias reales, viviendas reales</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Ellos ya consiguieron su casa sin tener que ahorrar durante 10 años.</p>
                    </div>

                    <ReviewsSlider />
                </div>
            </section>

            {/* --- BENEFITS --- */}
            <section id="beneficios" className="py-20 bg-[#163C2E] text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Beneficios principales para ti</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            {[
                                {
                                    title: "Entra a vivir ya",
                                    desc: "No esperas años ahorrando para la entrada."
                                },
                                {
                                    title: "Te aseguras el precio de compra",
                                    desc: "Aunque el mercado suba, tu precio está congelado desde el primer día."
                                }
                            ].map((b, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 p-2 bg-[#28A77D] rounded-lg h-fit">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                                        <p className="text-slate-300">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-8">
                            {[
                                {
                                    title: "Construye tu propia entrada",
                                    desc: "Automáticamente, mes a mes, sin estrés."
                                },
                                {
                                    title: "Seguridad jurídica",
                                    desc: "Todo se firma ante notario con contratos claros y transparentes."
                                }
                            ].map((b, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 p-2 bg-[#28A77D] rounded-lg h-fit">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                                        <p className="text-slate-300">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA / NEXT STEPS --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#163C2E] mb-6">¿Qué necesitas ahora?</h2>
                    <p className="text-lg text-slate-600 mb-10">
                        Simplemente reservar una llamada de estudio gratuito, donde analizaremos tu caso y buscaremos tu futuro hogar.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div className="bg-[#28A77D] w-8 h-8 rounded-full text-white flex items-center justify-center font-bold mb-4 mx-auto">1</div>
                            <h3 className="font-bold text-[#163C2E] mb-2">Rellenar el formulario</h3>
                            <p className="text-sm text-slate-500">Datos económicos básicos</p>
                        </div>
                        <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div className="bg-[#28A77D] w-8 h-8 rounded-full text-white flex items-center justify-center font-bold mb-4 mx-auto">2</div>
                            <h3 className="font-bold text-[#163C2E] mb-2">Buscar tu hogar</h3>
                            <p className="text-sm text-slate-500">Te ayudamos a encontrarlo</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <a
                            href="/calculadora"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-[#28A77D] text-white font-bold rounded-xl text-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Empezar ahora
                            <ArrowRight className="w-6 h-6" />
                        </a>
                        <p className="text-slate-500 mt-6 italic">
                            "Tu camino a la vivienda propia empieza con un simple paso."
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AlquilerOpcionCompraPage;
