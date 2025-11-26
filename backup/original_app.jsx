import React, { useState, useEffect } from 'react';
import {
    Home,
    Key,
    TrendingUp,
    CheckCircle,
    HelpCircle,
    Menu,
    X,
    ArrowRight,
    ChevronDown,
    Star,
    ShieldCheck,
    Users,
    Building2,
    Wallet
} from 'lucide-react';

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Manejo del scroll para la navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const colors = {
        darkGreen: '#163C2E',
        lightGreen: '#28A77D',
        white: '#FFFFFF',
        offWhite: '#F8FAFC',
        textDark: '#1E293B',
        textLight: '#94A3B8'
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="font-sans antialiased text-slate-800 bg-white selection:bg-[#28A77D] selection:text-white">

            {/* --- NAVBAR --- */}
            <nav
                className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-3' : 'bg-[#163C2E] py-5'
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className={`p-1.5 rounded-lg ${scrolled ? 'bg-[#163C2E]' : 'bg-[#28A77D]'}`}>
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <span className={scrolled ? 'text-[#163C2E]' : 'text-white'}>
                            Fórmula<span className={scrolled ? 'text-[#28A77D]' : 'text-[#28A77D]'}>Hogar</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {['Cómo funciona', 'Beneficios', 'Comparativa', 'FAQ'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                                className={`text-sm font-medium hover:text-[#28A77D] transition-colors ${scrolled ? 'text-slate-600' : 'text-slate-300'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                        <a
                            href="#formulario"
                            className="px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                            style={{ backgroundColor: colors.lightGreen, color: colors.white }}
                        >
                            Comenzar ahora
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
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 md:hidden flex flex-col p-6 gap-4">
                        {['Cómo funciona', 'Beneficios', 'Comparativa', 'FAQ'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                                className="text-left text-lg font-medium text-slate-700"
                            >
                                {item}
                            </button>
                        ))}
                        <a
                            href="#formulario"
                            className="w-full text-center py-3 rounded-xl font-bold mt-2"
                            style={{ backgroundColor: colors.lightGreen, color: colors.white }}
                        >
                            Quiero mi casa
                        </a>
                    </div>
                )}
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" style={{ backgroundColor: colors.darkGreen }}>
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#28A77D] text-sm font-semibold mb-6 border border-[#28A77D]/30 backdrop-blur-sm animate-fade-in-up">
                                <span className="w-2 h-2 rounded-full bg-[#28A77D] animate-pulse"></span>
                                Revolucionamos el acceso a la vivienda
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                Tu primera vivienda, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28A77D] to-emerald-300">
                                    sin la barrera del 30%
                                </span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                ¿Puedes pagar una hipoteca pero no la entrada? Transformamos el alquiler futuro en tu entrada actual. Conviértete en propietario desde el día 1 con tan solo un 5% de ahorro.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a
                                    href="#formulario"
                                    className="px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:translate-y-[-2px] hover:shadow-2xl shadow-lg hover:shadow-[#28A77D]/20"
                                    style={{ backgroundColor: colors.lightGreen, color: colors.white }}
                                >
                                    Analizar mi caso gratis
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={() => scrollToSection('cómo-funciona')}
                                    className="px-8 py-4 rounded-xl font-bold text-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                                >
                                    Ver cómo funciona
                                </button>
                            </div>

                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-400">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-600 border-2 border-[#163C2E] flex items-center justify-center text-xs font-bold text-white">
                                            {/* Placeholder avatars */}
                                            <Users className="w-4 h-4" />
                                        </div>
                                    ))}
                                </div>
                                <p>Más de <span className="text-white font-bold">500+</span> propietarios felices</p>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 lg:p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500 border border-slate-100">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#163C2E]">Simulación Real</h3>
                                        <p className="text-slate-500 text-sm">Apartamento en Madrid</p>
                                    </div>
                                    <div className="bg-green-100 text-[#163C2E] px-3 py-1 rounded-full text-xs font-bold">
                                        APROBADO
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                        <span className="text-slate-600 font-medium">Precio Vivienda</span>
                                        <span className="text-xl font-bold text-[#163C2E]">200.000€</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border-2 border-slate-100 opacity-50">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Tradicional</p>
                                            <p className="text-2xl font-bold text-slate-400">60.000€</p>
                                            <p className="text-xs text-red-400 font-medium mt-1">Necesitas 30%</p>
                                        </div>
                                        <div className="p-4 rounded-xl border-2 bg-[#F0FDF4] border-[#28A77D]">
                                            <p className="text-xs text-[#163C2E] uppercase font-bold mb-1">Fórmula Hogar</p>
                                            <p className="text-3xl font-bold text-[#28A77D]">10.000€</p>
                                            <p className="text-xs text-[#28A77D] font-medium mt-1">Solo necesitas 5%</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#163C2E] flex items-center justify-center text-white">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#163C2E]">Propietario desde el día 1</p>
                                                <p className="text-xs text-slate-500">Firmas en notaría inmediatamente</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-[#28A77D] text-white p-4 rounded-xl shadow-xl z-20 hidden md:block animate-bounce-slow">
                                <p className="text-xs font-bold opacity-80">AHORRO EN ENTRADA</p>
                                <p className="text-2xl font-bold">-50.000€</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- TRUST BADGES --- */}
            <section className="py-10 border-b border-slate-100 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Avalado por expertos financieros e inmobiliarios</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-60">
                        {/* Logos representados con texto estilizado para no usar imágenes externas */}
                        <div className="font-bold text-xl flex items-center gap-2"><Building2 className="w-6 h-6" /> FINTECH SPAIN</div>
                        <div className="font-bold text-xl flex items-center gap-2"><ShieldCheck className="w-6 h-6" /> PROPTECH HUB</div>
                        <div className="font-bold text-xl flex items-center gap-2"><TrendingUp className="w-6 h-6" /> INVERSIÓN SEGURA</div>
                        <div className="font-bold text-xl flex items-center gap-2"><Key className="w-6 h-6" /> NOTARÍA DIGITAL</div>
                    </div>
                </div>
            </section>

            {/* --- SOCIAL PROOF / REVIEWS --- */}
            <section className="py-20 bg-[#F8FAFC]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#163C2E] mb-4">Historias reales, viviendas reales</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Ellos ya consiguieron su casa sin tener que ahorrar durante 10 años.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Carlos y María",
                                age: "28 y 30 años",
                                text: "Llevábamos años pagando un alquiler altísimo y no podíamos ahorrar para la entrada. Fórmula Hogar nos permitió comprar nuestro piso. Ahora pagamos nuestra propia hipoteca.",
                                tag: "Compraron en Madrid"
                            },
                            {
                                name: "Laura D.",
                                age: "26 años",
                                text: "Pensaba que comprar sola era imposible. Con mis ahorros solo cubría el 7%. Gracias al adelanto de rentas, firmé la semana pasada. ¡Increíble!",
                                tag: "Compró en Valencia"
                            },
                            {
                                name: "Javier M.",
                                age: "34 años",
                                text: "La transparencia es total. Te explican que cedes el uso unos años, pero la casa ES TUYA desde el notario. Es la decisión financiera más inteligente que he tomado.",
                                tag: "Compró en Málaga"
                            }
                        ].map((review, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    <Star fill="currentColor" size={18} />
                                    <Star fill="currentColor" size={18} />
                                    <Star fill="currentColor" size={18} />
                                    <Star fill="currentColor" size={18} />
                                    <Star fill="currentColor" size={18} />
                                </div>
                                <p className="text-slate-600 mb-6 italic">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#163C2E] to-[#28A77D] flex items-center justify-center text-white font-bold">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#163C2E]">{review.name}</p>
                                        <p className="text-xs text-[#28A77D] font-medium">{review.tag}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- ROADMAP / HOW IT WORKS --- */}
            <section id="cómo-funciona" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#163C2E] mb-4">Tu camino a ser propietario</h2>
                        <p className="text-slate-600">Un proceso transparente, legal y seguro ante notario.</p>
                    </div>

                    <div className="relative">
                        {/* Line connector for desktop */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

                        <div className="grid md:grid-cols-4 gap-8 relative z-10">
                            {[
                                {
                                    icon: <Users className="w-6 h-6" />,
                                    title: "1. Análisis",
                                    desc: "Analizamos tu perfil con un broker aliado para confirmar tu capacidad de hipoteca futura."
                                },
                                {
                                    icon: <Wallet className="w-6 h-6" />,
                                    title: "2. Financiación",
                                    desc: "Adelantamos las rentas futuras (2-3 años) para cubrir el 20-25% de la entrada que te falta."
                                },
                                {
                                    icon: <Key className="w-6 h-6" />,
                                    title: "3. Firma y Compra",
                                    desc: "Firmas en notaría. Eres propietario legal al 100% desde este mismo instante."
                                },
                                {
                                    icon: <Home className="w-6 h-6" />,
                                    title: "4. Tu Hogar",
                                    desc: "Tras el periodo de cesión (donde se amortiza la entrada), entras a vivir en tu casa."
                                }
                            ].map((step, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg text-center group hover:-translate-y-2 transition-transform">
                                    <div className="w-16 h-16 mx-auto bg-[#163C2E] rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-900/20 group-hover:bg-[#28A77D] transition-colors">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#163C2E] mb-3">{step.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- WHY FORMULA HOGAR --- */}
            <section id="beneficios" className="py-20 overflow-hidden relative" style={{ backgroundColor: colors.darkGreen }}>
                {/* Decorative circle */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#28A77D] rounded-full opacity-10 blur-3xl"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                                ¿Por qué elegir <br />
                                <span className="text-[#28A77D]">Fórmula Hogar?</span>
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    "No tiras dinero en alquiler: Estás invirtiendo en tu propiedad.",
                                    "Sin comisiones ocultas: No cobramos al comprador ni inflamos precios.",
                                    "Intermediario integral: Coordinamos banco, comprador y gestión de alquiler.",
                                    "Seguridad Jurídica: Todo se firma ante notario."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1 p-1 bg-[#28A77D] rounded-full">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-lg text-slate-200">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                <a href="#formulario" className="inline-block px-8 py-4 bg-[#28A77D] text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                                    Quiero agendar una llamada
                                </a>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            {/* Visual Representation of Savings */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                                <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-[#28A77D]" />
                                    Revalorización de Mercado
                                </h3>
                                <p className="text-slate-300 text-sm mb-6">
                                    Mientras esperas esos 2-3 años de cesión de uso, tu vivienda sigue revalorizándose. Cuando entres a vivir, probablemente valga más de lo que pagaste.
                                </p>
                                <div className="h-40 flex items-end justify-between gap-4">
                                    <div className="w-full bg-white/10 rounded-t-lg h-2/3 relative group">
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Compra Hoy</span>
                                    </div>
                                    <div className="w-full bg-[#28A77D] rounded-t-lg h-full relative group">
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#28A77D] font-bold text-xs bg-white px-2 py-1 rounded">Valor Futuro</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- COMPARISON TABLE --- */}
            <section id="comparativa" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#163C2E]">La Comparativa Definitiva</h2>
                        <p className="text-slate-600 mt-4">¿Por qué seguir alquilando si puedes comprar?</p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                        <div className="grid grid-cols-3 bg-[#163C2E] text-white p-6 text-sm md:text-base font-bold text-center">
                            <div className="flex items-center justify-center">Concepto</div>
                            <div className="flex items-center justify-center opacity-70">Tradicional</div>
                            <div className="flex items-center justify-center text-[#28A77D] bg-white/10 rounded-lg py-2">Fórmula Hogar</div>
                        </div>

                        {[
                            { label: "Ahorro Necesario", trad: "30% (Entrada + Gastos)", formula: "Solo 5%", highlight: true },
                            { label: "Propiedad", trad: "Inmediata", formula: "Inmediata (Desde día 1)" },
                            { label: "Uso de la vivienda", trad: "Inmediato", formula: "Tras 2-3 años (Cesión)" },
                            { label: "Esfuerzo Financiero", trad: "Muy Alto", formula: "Muy Bajo", highlight: true },
                            { label: "Revalorización", trad: "Sí", formula: "Sí (Ganas desde la firma)" },
                        ].map((row, idx) => (
                            <div key={idx} className={`grid grid-cols-3 p-6 text-center border-b border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                <div className="text-left font-semibold text-slate-700">{row.label}</div>
                                <div className="text-slate-500">{row.trad}</div>
                                <div className={`font-bold ${row.highlight ? 'text-[#28A77D]' : 'text-[#163C2E]'}`}>{row.formula}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section id="faq" className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-[#163C2E] text-center mb-12">Preguntas Frecuentes</h2>

                    <div className="space-y-4">
                        {[
                            { q: "¿Qué es Fórmula Hogar?", a: "Somos un intermediario financiero y operativo. Coordinamos al comprador, al banco y a los partners que adelantan las rentas. No somos una inmobiliaria tradicional." },
                            { q: "¿Soy propietario desde el primer día?", a: "Sí, absolutamente. Desde la firma en notaría la vivienda es tuya. Solo cedes el uso y el cobro del alquiler temporalmente para pagar tu entrada." },
                            { q: "¿Hay requisitos para acceder?", a: "Necesitas tener ingresos estables (capacidad de hipoteca futura) y disponer de un ahorro mínimo del 5% para los gastos de gestión iniciales." },
                            { q: "¿Cuándo puedo entrar a vivir?", a: "Una vez finaliza el periodo de cesión acordado (normalmente entre 2 y 3 años). La vivienda se te entrega en perfecto estado." },
                            { q: "¿Y si quiero vender mi casa actual?", a: "También te ayudamos. Te acompañamos sin coste y te ponemos en contacto con compradores que ya tienen financiación aprobada." }
                        ].map((faq, idx) => (
                            <details key={idx} className="group bg-slate-50 rounded-xl p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex items-center justify-between font-bold text-[#163C2E] group-hover:text-[#28A77D] transition-colors">
                                    {faq.q}
                                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                                </summary>
                                <p className="mt-4 text-slate-600 leading-relaxed text-sm">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA / FORM SECTION --- */}
            <section id="formulario" className="py-20" style={{ backgroundColor: colors.darkGreen }}>
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
                        <h2 className="text-3xl font-bold text-[#163C2E] mb-4">¿Listo para ser propietario?</h2>
                        <p className="text-slate-600 mb-8">Déjanos tu correo y te enviaremos el formulario de estudio financiero gratuito. Sin compromiso.</p>

                        <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="flex-1 px-6 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#28A77D] bg-slate-50 text-lg"
                                required
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 bg-[#28A77D] text-white font-bold rounded-xl text-lg hover:bg-emerald-600 transition-colors shadow-lg whitespace-nowrap"
                            >
                                Solicitar Estudio
                            </button>
                        </form>
                        <p className="text-xs text-slate-400 mt-4">Al enviar, aceptas nuestra política de privacidad. Tus datos están seguros.</p>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-[#0f291e] text-slate-400 py-12 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <div className="flex items-center gap-2 font-bold text-2xl text-white mb-4 md:mb-0">
                            <Home className="w-6 h-6 text-[#28A77D]" />
                            FórmulaHogar
                        </div>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Aviso Legal</a>
                            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                            <a href="#" className="hover:text-white transition-colors">Cookies</a>
                        </div>
                    </div>
                    <div className="text-center md:text-left text-xs opacity-60">
                        © {new Date().getFullYear()} Fórmula Hogar. Todos los derechos reservados. Una revolución en el sector PropTech.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;