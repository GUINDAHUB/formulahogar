"use client";

import React, { useState, useEffect } from 'react';
import { Home, ArrowRight, ArrowLeft, CheckCircle, TrendingDown, Sparkles, Users, Phone, Mail, MapPin, Calendar, ChevronDown } from 'lucide-react';
import Link from 'next/link';

// Autonomous communities in Spain
const COMUNIDADES = [
    "Andalucía", "Aragón", "Asturias", "Islas Baleares", "Canarias",
    "Cantabria", "Castilla y León", "Castilla-La Mancha", "Cataluña",
    "Ceuta", "Comunidad Valenciana", "Extremadura", "Galicia", "La Rioja",
    "Madrid", "Melilla", "Murcia", "Navarra", "País Vasco"
];

const COUNTRY_CODES = [
    { code: '+34', flag: '🇪🇸', name: 'España' },
    { code: '+33', flag: '🇫🇷', name: 'Francia' },
    { code: '+44', flag: '🇬🇧', name: 'Reino Unido' },
    { code: '+351', flag: '🇵🇹', name: 'Portugal' },
    { code: '+39', flag: '🇮🇹', name: 'Italia' },
    { code: '+49', flag: '🇩🇪', name: 'Alemania' },
    { code: '+1', flag: '🇺🇸', name: 'Estados Unidos' },
];

const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string) => {
    // Remove spaces and non-digits for check
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 9; // Basic international validation
};

interface FormData {
    name: string;
    email: string;
    phone: string;
    price: number;
    community: string;
    buyingWith: 'alone' | 'partner';
    age: number;
}

const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        setDisplayValue(0); // Reset to 0 when value changes to restart animation
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

const CalculadoraPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        price: 200000,
        community: '',
        buyingWith: 'alone',
        age: 30
    });
    
    const [phonePrefix, setPhonePrefix] = useState('+34');
    const [phoneInput, setPhoneInput] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [phoneTouched, setPhoneTouched] = useState(false);
    
    const [showCelebration, setShowCelebration] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Sync phone parts to formData
        const fullPhone = `${phonePrefix} ${phoneInput}`;
        if (formData.phone !== fullPhone) {
            setFormData(prev => ({ ...prev, phone: fullPhone }));
        }
    }, [phonePrefix, phoneInput]);

    const colors = {
        darkGreen: '#163C2E',
        lightGreen: '#28A77D',
        white: '#FFFFFF',
        offWhite: '#F8FAFC',
        textDark: '#1E293B',
        textLight: '#94A3B8'
    };

    const totalSteps = 4;

    // Constants from Python algorithm
    const TASAS_ITP: Record<string, number> = {
        "Andalucía": 0.07,
        "Aragón": 0.09,
        "Asturias": 0.09,
        "Islas Baleares": 0.11,
        "Canarias": 0.065,
        "Cantabria": 0.09,
        "Castilla-La Mancha": 0.09,
        "Castilla y León": 0.09,
        "Cataluña": 0.11,
        "Ceuta": 0.06,
        "Madrid": 0.06,
        "Comunidad Valenciana": 0.11,
        "Extremadura": 0.10,
        "Galicia": 0.08,
        "La Rioja": 0.07,
        "Melilla": 0.06,
        "Murcia": 0.08,
        "Navarra": 0.06,
        "País Vasco": 0.07
    };

    const COSTES_FIJOS = {
        NOTARIA: 0.01,
        COMISION: 0.03
    };

    const TABLA_ADELANTOS: Record<number, number> = {
        12: 0.80,
        24: 0.70,
        36: 0.70,
        48: 0.65,
        60: 0.60
    };

    const RENTABILIDAD_BRUTA = 0.05;

    // Calculate results
    const calculateResults = () => {
        const tasaItp = TASAS_ITP[formData.community] || 0.06;
        
        // Base calculations
        const porcentajeGastosTotal = tasaItp + COSTES_FIJOS.NOTARIA + COSTES_FIJOS.COMISION;
        const precioTotal = formData.price * (1 + porcentajeGastosTotal);
        
        // Bank Entry (Depends on age)
        const porcentajeEntradaBanco = formData.age < 30 ? 0.10 : 0.20;
        const entradaBanco = precioTotal * porcentajeEntradaBanco;

        // Rentabilidad
        const rentabilidadBrutaAlquiler = formData.price * RENTABILIDAD_BRUTA;
        const rentabilidadMensual = rentabilidadBrutaAlquiler / 12;
        const garantia = rentabilidadMensual;

        // Optimization Algorithm
        let mejorOpcion = null;
        let menorEntradaEncontrada = Infinity;
        const listaOpciones = [12, 24, 36, 48, 60];

        for (const meses of listaOpciones) {
            const coeficiente = TABLA_ADELANTOS[meses];
            const adelantoCalc = (meses * coeficiente * rentabilidadMensual) - garantia;
            const entradaFhCalc = entradaBanco - adelantoCalc;

            if (entradaFhCalc >= 0) {
                if (entradaFhCalc < menorEntradaEncontrada) {
                    menorEntradaEncontrada = entradaFhCalc;
                    mejorOpcion = {
                        meses,
                        adelanto: adelantoCalc,
                        entradaFh: entradaFhCalc
                    };
                }
            }
        }

        // Fallback
        if (!mejorOpcion) {
            const meses = 12;
            const adelantoCalc = (meses * TABLA_ADELANTOS[meses] * rentabilidadMensual) - garantia;
            mejorOpcion = {
                meses,
                adelanto: adelantoCalc,
                entradaFh: entradaBanco - adelantoCalc
            };
        }

        return {
            traditionalDownPayment: Math.round(entradaBanco),
            formulaHogarDownPayment: Math.round(mejorOpcion.entradaFh),
            savings: Math.round(entradaBanco - mejorOpcion.entradaFh),
            monthlyPayment: Math.round(rentabilidadMensual),
            months: mejorOpcion.meses
        };
    };

    const { traditionalDownPayment, formulaHogarDownPayment, savings, monthlyPayment, months } = calculateResults();

    const sendToWebhook = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                calculatedResults: {
                    traditionalDownPayment,
                    formulaHogarDownPayment,
                    savings,
                    monthlyPayment,
                    months
                },
                submittedAt: new Date().toISOString()
            };

            // TODO: Configure this URL
            const WEBHOOK_URL = "https://n8n.srv954356.hstgr.cloud/webhook/fh";

            if (!WEBHOOK_URL) {
                console.warn("Webhook URL not configured");
                alert("Webhook URL no configurada en el código.");
                return;
            }

            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setIsSuccess(true);
                setShowCelebration(true);
            } else {
                alert("Hubo un error al enviar la información. Por favor, inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error sending to webhook:", error);
            alert("Error de conexión. Por favor, inténtalo más tarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            if (currentStep === 2) {
                // Show celebration when entering results
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 2000);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.name.length > 0 && 
                       isValidEmail(formData.email) && 
                       isValidPhone(phoneInput);
            case 2:
                return formData.community && formData.age > 0;
            default:
                return true;
        }
    };

    // Animated Number Component moved outside


    // Helper to format display values (divides by 2 if partner)
    const getDisplayValue = (value: number) => {
        if (formData.buyingWith === 'partner') {
            return Math.round(value / 2);
        }
        return value;
    };

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50 font-sans antialiased overflow-hidden">
            {/* Compact Header */}
            <header className="bg-white border-b border-slate-100 flex-shrink-0">
                <div className="container mx-auto px-4 md:px-6 py-2 md:py-3 flex justify-center">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl text-[#163C2E] hover:opacity-80 transition-opacity w-fit">
                        <Home className="w-5 h-5 text-[#28A77D]" />
                        FórmulaHogar
                    </Link>
                </div>
            </header>

            {/* Compact Progress Bar */}
            {!isSuccess && (
                <div className="bg-white border-b border-slate-100 flex-shrink-0">
                    <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-center">
                        <div className="flex items-center justify-center max-w-2xl w-full gap-4">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-500 ${step < currentStep
                                                ? 'bg-[#28A77D] text-white'
                                                : step === currentStep
                                                    ? 'bg-[#163C2E] text-white scale-110 shadow-lg'
                                                    : 'bg-slate-200 text-slate-400'
                                                }`}
                                        >
                                            {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                                        </div>
                                        <span className={`text-[10px] md:text-xs mt-1 font-medium whitespace-nowrap ${step === currentStep ? 'text-[#163C2E]' : 'text-slate-400'}`}>
                                            {step === 1 && 'Datos'}
                                            {step === 2 && 'Vivienda'}
                                            {step === 3 && 'Resultados'}
                                            {step === 4 && 'Acción'}
                                        </span>
                                    </div>
                                    {step < 4 && (
                                        <div className={`flex-1 h-0.5 mx-2 md:mx-4 transition-all duration-500 ${step < currentStep ? 'bg-[#28A77D]' : 'bg-slate-200'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content - Scrollable with flex-1 */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 h-full">
                    <div className="max-w-2xl mx-auto h-full flex flex-col">

                        {/* Celebration Effect */}
                        {showCelebration && (
                            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                                <div className="animate-ping absolute w-24 h-24 rounded-full bg-[#28A77D] opacity-20"></div>
                            </div>
                        )}

                        {/* Success Message */}
                        {isSuccess ? (
                            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100 animate-fade-in flex-1 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-[#28A77D]" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-[#163C2E] mb-4">
                                    ¡Gracias, {formData.name.split(' ')[0]}!
                                </h1>
                                <p className="text-lg text-slate-600 mb-8 max-w-md">
                                    Hemos recibido tu solicitud correctamente. Uno de nuestros expertos analizará tu caso y te contactará muy pronto.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#163C2E] text-white font-bold text-lg rounded-xl hover:bg-[#28A77D] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    <Home className="w-5 h-5" />
                                    Volver al inicio
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Step 1: Personal Information */}
                                {currentStep === 1 && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 animate-fade-in flex-1 flex flex-col">
                                <div className="text-center mb-4 md:mb-6">
                                    <div className="inline-flex items-center gap-2 bg-[#28A77D]/10 text-[#28A77D] px-3 py-1.5 rounded-full text-xs font-bold mb-3">
                                        <Sparkles className="w-3 h-3" />
                                        Paso 1 de 4
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-[#163C2E] mb-2">
                                        Cuéntanos sobre ti
                                    </h1>
                                    <p className="text-sm text-slate-600">
                                        Necesitamos algunos datos para personalizar tu análisis
                                    </p>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <label className="block text-xs md:text-sm font-bold text-[#163C2E] mb-1.5 flex items-center gap-2">
                                            <Users className="w-3 h-3 md:w-4 md:h-4 text-[#28A77D]" />
                                            Nombre completo
                                            <span className="text-[10px] font-normal text-slate-400 ml-auto">
                                                {formData.name.length}/50
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            maxLength={50}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ej: María García"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#28A77D] focus:outline-none focus:ring-2 focus:ring-[#28A77D]/10 transition-all text-base"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs md:text-sm font-bold text-[#163C2E] mb-1.5 flex items-center gap-2">
                                            <Mail className="w-3 h-3 md:w-4 md:h-4 text-[#28A77D]" />
                                            Correo electrónico
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                onBlur={() => setEmailTouched(true)}
                                                placeholder="tu@email.com"
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-base focus:outline-none focus:ring-2 ${
                                                    emailTouched && formData.email && !isValidEmail(formData.email)
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                                    : 'border-slate-200 focus:border-[#28A77D] focus:ring-[#28A77D]/10'
                                                }`}
                                            />
                                            {emailTouched && formData.email && !isValidEmail(formData.email) && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-medium">
                                                    Email no válido
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs md:text-sm font-bold text-[#163C2E] mb-1.5 flex items-center gap-2">
                                            <Phone className="w-3 h-3 md:w-4 md:h-4 text-[#28A77D]" />
                                            Teléfono
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="relative w-[100px] flex-shrink-0">
                                                <div className="w-full h-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-600 font-medium text-base">
                                                    <span>🇪🇸</span>
                                                    <span>+34</span>
                                                </div>
                                            </div>
                                            <div className="relative flex-1">
                                                <input
                                                    type="tel"
                                                    value={phoneInput}
                                                    maxLength={9}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 9) {
                                                            setPhoneInput(val);
                                                        }
                                                    }}
                                                    onBlur={() => setPhoneTouched(true)}
                                                    placeholder="600 000 000"
                                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-base focus:outline-none focus:ring-2 ${
                                                        phoneTouched && phoneInput && !isValidPhone(phoneInput)
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                                        : 'border-slate-200 focus:border-[#28A77D] focus:ring-[#28A77D]/10'
                                                    }`}
                                                />
                                                {phoneTouched && phoneInput && !isValidPhone(phoneInput) && (
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-medium hidden md:block">
                                                        Número incompleto
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Property Details */}
                        {currentStep === 2 && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 animate-fade-in flex-1 flex flex-col">
                                <div className="text-center mb-4 flex-shrink-0">
                                    <div className="inline-flex items-center gap-2 bg-[#28A77D]/10 text-[#28A77D] px-3 py-1.5 rounded-full text-xs font-bold mb-2">
                                        <Home className="w-3 h-3" />
                                        Paso 2 de 4
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-[#163C2E] mb-1">
                                        Tu vivienda ideal
                                    </h1>
                                    <p className="text-xs md:text-sm text-slate-600">
                                        ¿Qué casa estás buscando?
                                    </p>
                                </div>

                                <div className="space-y-5 flex-1 flex flex-col justify-center">
                                    {/* Price Slider - Compact */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm md:text-base font-bold text-[#163C2E]">
                                                Precio vivienda
                                            </label>
                                            <span className="text-2xl md:text-3xl font-bold text-[#28A77D]">
                                                {formData.price.toLocaleString('es-ES')}€
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="50000"
                                            max="1000000"
                                            step="10000"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#28A77D]"
                                            style={{
                                                background: `linear-gradient(to right, #28A77D 0%, #28A77D ${((formData.price - 50000) / (1000000 - 50000)) * 100}%, #e2e8f0 ${((formData.price - 50000) / (1000000 - 50000)) * 100}%, #e2e8f0 100%)`
                                            }}
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                            <span>50k€</span>
                                            <span>1M€</span>
                                        </div>
                                    </div>

                                    {/* Community */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-[#163C2E] mb-1.5 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-[#28A77D]" />
                                            Comunidad autónoma
                                        </label>
                                        <select
                                            value={formData.community}
                                            onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#28A77D] focus:outline-none focus:ring-2 focus:ring-[#28A77D]/10 transition-all text-sm md:text-base bg-white"
                                        >
                                            <option value="">Selecciona una comunidad</option>
                                            {COMUNIDADES.map((com) => (
                                                <option key={com} value={com}>{com}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Buying With & Age */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-[#163C2E] mb-2">
                                            ¿Compras solo/a o acompañado/a?
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, buyingWith: 'alone' })}
                                                className={`px-4 py-3 rounded-xl font-bold transition-all border-2 text-sm flex items-center justify-center gap-2 ${formData.buyingWith === 'alone'
                                                    ? 'bg-[#163C2E] text-white border-[#163C2E] shadow-lg'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#28A77D]'
                                                    }`}
                                            >
                                                <Users className="w-4 h-4" />
                                                Solo/a
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, buyingWith: 'partner' })}
                                                className={`px-4 py-3 rounded-xl font-bold transition-all border-2 text-sm flex items-center justify-center gap-2 ${formData.buyingWith === 'partner'
                                                    ? 'bg-[#163C2E] text-white border-[#163C2E] shadow-lg'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#28A77D]'
                                                    }`}
                                            >
                                                <Users className="w-4 h-4" />
                                                Acompañado/a
                                            </button>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm md:text-base font-bold text-[#163C2E] mb-1.5 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-[#28A77D]" />
                                                Tu edad
                                            </label>
                                            <input
                                                type="number"
                                                min="18"
                                                max="80"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                                                placeholder="Ej: 28"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#28A77D] focus:outline-none focus:ring-2 focus:ring-[#28A77D]/10 transition-all text-sm md:text-base"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Results */}
                        {currentStep === 3 && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 animate-fade-in flex-1 flex flex-col overflow-y-auto">
                                <div className="text-center mb-4 flex-shrink-0">
                                    <div className="inline-flex items-center gap-2 bg-[#28A77D]/10 text-[#28A77D] px-3 py-1.5 rounded-full text-xs font-bold mb-2">
                                        <TrendingDown className="w-3 h-3" />
                                        Paso 3 de 4
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-[#163C2E] mb-1">
                                        ¡Tus resultados!
                                    </h1>
                                    <p className="text-sm text-slate-600">
                                        Mira cuánto ahorras con FormulaHogar
                                    </p>
                                </div>

                                <div className="space-y-4 flex-1">
                                    {/* Comparison */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Traditional */}
                                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 relative">
                                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                                                Tradicional
                                            </div>
                                            <div className="mt-5">
                                                <p className="text-[10px] text-red-600 font-medium mb-1">
                                                    Entrada (30%){formData.buyingWith === 'partner' ? ' / persona' : ''}
                                                </p>
                                                <p className="text-xl md:text-2xl font-bold text-red-600 mb-2">
                                                    <AnimatedNumber value={getDisplayValue(traditionalDownPayment)} suffix="€" />
                                                </p>
                                                <p className="text-[10px] text-red-700 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                    ~{Math.ceil(getDisplayValue(traditionalDownPayment) / 12000)} años ahorrando
                                                </p>
                                            </div>
                                        </div>

                                        {/* FormulaHogar */}
                                        <div className="bg-emerald-50 border-2 border-[#28A77D] rounded-xl p-3 relative shadow-lg">
                                            <div className="absolute top-0 right-0 bg-[#28A77D] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                                                FórmulaHogar
                                            </div>
                                            <div className="mt-5">
                                                <p className="text-[10px] text-[#163C2E] font-medium mb-1">
                                                    Entrada (5%){formData.buyingWith === 'partner' ? ' / persona' : ''}
                                                </p>
                                                <p className="text-xl md:text-2xl font-bold text-[#28A77D] mb-2">
                                                    <AnimatedNumber value={getDisplayValue(formulaHogarDownPayment)} suffix="€" />
                                                </p>
                                                <p className="text-[10px] text-[#163C2E] flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3 text-[#28A77D]" />
                                                    Propietario día 1
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Savings */}
                                    <div className="bg-gradient-to-br from-[#163C2E] to-[#28A77D] rounded-xl p-5 text-white text-center">
                                        <p className="text-xs opacity-90 mb-1">
                                            Ahorras en entrada{formData.buyingWith === 'partner' ? ' (por persona)' : ''}
                                        </p>
                                        <p className="text-4xl md:text-5xl font-bold mb-1">
                                            <AnimatedNumber value={getDisplayValue(savings)} suffix="€" />
                                        </p>
                                        <p className="text-[10px] opacity-80">
                                            {((savings / traditionalDownPayment) * 100).toFixed(0)}% menos
                                        </p>
                                    </div>

                                    {/* Info */}
                                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                                        <p className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Cesión</p>
                                        <p className="text-lg md:text-xl font-bold text-[#163C2E]">{months} meses</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Final CTA */}
                        {currentStep === 4 && (
                            <div className="bg-gradient-to-br from-[#163C2E] via-[#1e4a3a] to-[#28A77D] rounded-2xl shadow-xl p-6 md:p-8 text-white animate-fade-in relative overflow-hidden flex-1 flex flex-col">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#28A77D]/20 rounded-full blur-3xl"></div>

                                <div className="relative z-10 flex-1 flex flex-col">
                                    <div className="text-center mb-4">
                                        <Sparkles className="w-12 h-12 mx-auto mb-3 text-yellow-300 animate-bounce" />
                                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                                            ¡A un paso de tu hogar!
                                        </h1>
                                        <p className="text-base md:text-lg text-emerald-100 mb-4">
                                            Con solo <span className="font-bold text-yellow-300">{getDisplayValue(formulaHogarDownPayment).toLocaleString('es-ES')}€</span> de entrada{formData.buyingWith === 'partner' ? ' por persona' : ''}
                                        </p>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-5 border border-white/20 flex-1 overflow-y-auto">
                                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-[#28A77D]" />
                                            Lo que conseguirás:
                                        </h3>
                                        <ul className="space-y-2 text-sm">
                                            {[
                                                `Ahorrar ${getDisplayValue(savings).toLocaleString('es-ES')}€${formData.buyingWith === 'partner' ? '/persona' : ''}`,
                                                'Propietario desde día 1',
                                                'No perder dinero en alquiler',
                                                'Revalorización incluida',
                                                '100% legal ante notario'
                                            ].map((benefit, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <div className="mt-0.5 p-0.5 bg-[#28A77D] rounded-full flex-shrink-0">
                                                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                    <span className="text-emerald-50 text-xs">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            onClick={sendToWebhook}
                                            disabled={isSubmitting}
                                            className={`group inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-[#163C2E] font-bold text-xl rounded-xl hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                                        >
                                            {isSubmitting ? 'Enviando...' : '¡Lo quiero!'}
                                            {!isSubmitting && <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                                        </button>
                                        <p className="text-xs text-emerald-100 mt-3">
                                            Sin compromiso • Gratis • Respuesta en 24h
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {currentStep < 4 && (
                            <div className="flex items-center justify-between mt-4 gap-3 flex-shrink-0">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm ${currentStep === 1
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-white text-[#163C2E] hover:bg-slate-50 border-2 border-slate-200'
                                        }`}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Atrás
                                </button>

                                <button
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm ${canProceed()
                                        ? 'bg-[#28A77D] text-white hover:bg-emerald-600 shadow-lg hover:shadow-xl hover:scale-105'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {currentStep === 3 ? '¡Ver mi plan!' : 'Siguiente'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="text-center mt-3 flex-shrink-0">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 text-slate-500 hover:text-[#28A77D] transition-colors text-xs"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Volver al inicio
                                </Link>
                            </div>
                        )}
                        </>
                    )}
                    </div>
                </div>
            </main>

            {/* Custom styles */}
            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
        </div>
    );
};

export default CalculadoraPage;
