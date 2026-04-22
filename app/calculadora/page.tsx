"use client";

import React, { useState, useEffect } from 'react';
import { House, ArrowRight, ArrowLeft, CheckCircle, TrendDown, Sparkle, Users, Phone, EnvelopeSimple, MapPin, Calendar, CaretDown } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';
import { calculateResults } from '@/utils/calculator';

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
    const digits = phone.replace(/\D/g, '');
    return /^[67]\d{8}$/.test(digits);
};

interface FormData {
    name: string;
    email: string;
    phone: string;
    price: number;
    community: string;
    buyingWith: 'alone' | 'partner';
    age: number;
    salary: string;
    employmentStatus: string;
    purchasePhase: string;
}

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

const CalculadoraPage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        price: 200000,
        community: '',
        buyingWith: 'alone',
        age: 30,
        salary: '',
        employmentStatus: '',
        purchasePhase: ''
    });

    const [phonePrefix, setPhonePrefix] = useState('+34');
    const [phoneInput, setPhoneInput] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [phoneTouched, setPhoneTouched] = useState(false);

    const [showCelebration, setShowCelebration] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fullPhone = `${phonePrefix} ${phoneInput}`;
        if (formData.phone !== fullPhone) {
            setFormData(prev => ({ ...prev, phone: fullPhone }));
        }
    }, [phonePrefix, phoneInput]);

    const totalSteps = 3;

    const { traditionalDownPayment, formulaHogarDownPayment, savings, monthlyPayment, months } = calculateResults({
        price: formData.price,
        community: formData.community,
        age: formData.age
    });

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
                sendGTMEvent({
                    event: 'calculator_form_submitted'
                });

                setIsSuccess(true);
                setShowCelebration(true);

                sessionStorage.setItem('fh_calculator_data', JSON.stringify({
                    price: formData.price,
                    community: formData.community,
                    age: formData.age,
                    buyingWith: formData.buyingWith
                }));

                router.push('/gracias');
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
        sendGTMEvent({
            event: `calculator_step_${currentStep}_complete`,
            step_completed: currentStep.toString()
        });

        if (currentStep === totalSteps) {
            sendToWebhook();
        } else if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
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
                return formData.community && formData.age > 0 && formData.purchasePhase !== '';
            case 3:
                return formData.salary !== '' && formData.employmentStatus !== '';
            default:
                return true;
        }
    };

    const getDisplayValue = (value: number) => {
        if (formData.buyingWith === 'partner') {
            return Math.round(value / 2);
        }
        return value;
    };

    return (
        <div className="h-screen flex flex-col bg-[#EBEBEB] font-sans antialiased overflow-hidden">
            {/* Compact Header */}
            <header className="bg-white border-b border-[#D6D6D6] flex-shrink-0">
                <div className="container mx-auto px-4 md:px-6 py-2 md:py-3 flex justify-center">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
                        <img src="/brand/logo-color.png" alt="FórmulaHogar" className="h-7 w-auto" />
                    </Link>
                </div>
            </header>

            {/* Compact Progress Bar */}
            {!isSuccess && (
                <div className="bg-white border-b border-[#D6D6D6] flex-shrink-0">
                    <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-center">
                        <div className="flex items-center justify-center max-w-2xl w-full gap-4">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-500 ${step < currentStep
                                                ? 'bg-[#BFFF00] text-[#141313]'
                                                : step === currentStep
                                                    ? 'bg-[#141313] text-white scale-110 shadow-lg'
                                                    : 'bg-[#D6D6D6] text-[#9D9D9D]'
                                                }`}
                                        >
                                            {step < currentStep ? <CheckCircle size={16} weight="fill" /> : step}
                                        </div>
                                        <span className={`text-[10px] md:text-xs mt-1 font-medium whitespace-nowrap ${step === currentStep ? 'text-[#141313]' : 'text-[#9D9D9D]'}`}>
                                            {step === 1 && 'Datos'}
                                            {step === 2 && 'Vivienda'}
                                            {step === 3 && 'Laboral'}
                                        </span>
                                    </div>
                                    {step < 3 && (
                                        <div className={`flex-1 h-0.5 mx-2 md:mx-4 transition-all duration-500 ${step < currentStep ? 'bg-[#BFFF00]' : 'bg-[#D6D6D6]'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 h-full">
                    <div className="max-w-2xl mx-auto h-full flex flex-col">

                        {/* Celebration Effect */}
                        {showCelebration && (
                            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                                <div className="animate-ping absolute w-24 h-24 rounded-full bg-[#BFFF00] opacity-20"></div>
                            </div>
                        )}

                        {/* Step 1: Personal Information */}
                                {currentStep === 1 && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#D6D6D6] animate-fade-in flex-1 flex flex-col">
                                <div className="text-center mb-4 md:mb-6">
                                    <div className="inline-flex items-center gap-2 bg-[#BFFF00]/15 text-[#141313] px-3 py-1.5 rounded-full text-xs font-bold mb-3">
                                        <Sparkle size={12} weight="fill" />
                                        Paso 1 de 3
                                    </div>
                                    <h1 className="font-display text-2xl md:text-3xl font-bold text-[#141313] mb-2">
                                        Cuéntanos sobre ti
                                    </h1>
                                    <p className="text-sm text-[#545454]">
                                        Necesitamos algunos datos para personalizar tu análisis
                                    </p>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <label className="block text-xs md:text-sm font-bold text-[#141313] mb-1.5 flex items-center gap-2">
                                            <Users size={16} weight="fill" className="text-[#141313]" />
                                            Nombre completo
                                            <span className="text-[10px] font-normal text-[#9D9D9D] ml-auto">
                                                {formData.name.length}/50
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            maxLength={50}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ej: María García"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#D6D6D6] focus:border-[#141313] focus:outline-none focus:ring-2 focus:ring-[#141313]/10 transition-all text-base"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs md:text-sm font-bold text-[#141313] mb-1.5 flex items-center gap-2">
                                            <EnvelopeSimple size={16} weight="fill" className="text-[#141313]" />
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
                                                    : 'border-[#D6D6D6] focus:border-[#141313] focus:ring-[#141313]/10'
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
                                        <label className="block text-xs md:text-sm font-bold text-[#141313] mb-1.5 flex items-center gap-2">
                                            <Phone size={16} weight="fill" className="text-[#141313]" />
                                            Teléfono
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="relative w-[100px] flex-shrink-0">
                                                <div className="w-full h-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#D6D6D6] bg-[#EBEBEB] text-[#545454] font-medium text-base">
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
                                                        : 'border-[#D6D6D6] focus:border-[#141313] focus:ring-[#141313]/10'
                                                    }`}
                                                />
                                            {phoneTouched && phoneInput && !isValidPhone(phoneInput) && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-medium hidden md:block">
                                                    Móvil no válido (6xx.../7xx...)
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
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#D6D6D6] animate-fade-in flex-1 flex flex-col">
                                <div className="text-center mb-4 flex-shrink-0">
                                    <div className="inline-flex items-center gap-2 bg-[#BFFF00]/15 text-[#141313] px-3 py-1.5 rounded-full text-xs font-bold mb-2">
                                        <Users size={12} weight="fill" />
                                        Paso 2 de 3
                                    </div>
                                    <h1 className="font-display text-2xl md:text-3xl font-bold text-[#141313] mb-1">
                                        Tu vivienda ideal
                                    </h1>
                                    <p className="text-xs md:text-sm text-[#545454]">
                                        ¿Qué casa estás buscando?
                                    </p>
                                </div>

                                <div className="space-y-5 flex-1 flex flex-col justify-center">
                                    {/* Price Slider */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm md:text-base font-bold text-[#141313]">
                                                Precio vivienda
                                            </label>
                                            <span className="text-2xl md:text-3xl font-bold text-[#141313]">
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
                                            className="w-full h-2 bg-[#D6D6D6] rounded-full appearance-none cursor-pointer accent-[#BFFF00]"
                                            style={{
                                                background: `linear-gradient(to right, #BFFF00 0%, #BFFF00 ${((formData.price - 50000) / (1000000 - 50000)) * 100}%, #D6D6D6 ${((formData.price - 50000) / (1000000 - 50000)) * 100}%, #D6D6D6 100%)`
                                            }}
                                        />
                                        <div className="flex justify-between text-[10px] text-[#9D9D9D] mt-1">
                                            <span>50k€</span>
                                            <span>1M€</span>
                                        </div>
                                    </div>

                                    {/* Purchase Phase */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-[#141313] mb-1.5 flex items-center gap-2">
                                            <House size={16} weight="fill" className="text-[#141313]" />
                                            ¿En qué fase estás de adquirir una vivienda?
                                        </label>
                                        <select
                                            value={formData.purchasePhase}
                                            onChange={(e) => setFormData({ ...formData, purchasePhase: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#D6D6D6] focus:border-[#141313] focus:outline-none focus:ring-2 focus:ring-[#141313]/10 transition-all text-sm md:text-base bg-white"
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="No he empezado a buscar">No he empezado a buscar</option>
                                            <option value="Estoy buscando">Estoy buscando</option>
                                            <option value="Tengo la vivienda reservada">Tengo la vivienda reservada</option>
                                            <option value="He firmado arras">He firmado arras</option>
                                        </select>
                                    </div>

                                    {/* Community */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-[#141313] mb-1.5 flex items-center gap-2">
                                            <MapPin size={16} weight="fill" className="text-[#141313]" />
                                            Comunidad autónoma
                                        </label>
                                        <select
                                            value={formData.community}
                                            onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#D6D6D6] focus:border-[#141313] focus:outline-none focus:ring-2 focus:ring-[#141313]/10 transition-all text-sm md:text-base bg-white"
                                        >
                                            <option value="">Selecciona una comunidad</option>
                                            {COMUNIDADES.map((com) => (
                                                <option key={com} value={com}>{com}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Buying With & Age */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-[#141313] mb-2">
                                            ¿Compras solo/a o acompañado/a?
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, buyingWith: 'alone' })}
                                                className={`px-4 py-3 rounded-xl font-bold transition-all border-2 text-sm flex items-center justify-center gap-2 cursor-pointer ${formData.buyingWith === 'alone'
                                                    ? 'bg-[#141313] text-white border-[#141313] shadow-lg'
                                                    : 'bg-white text-[#545454] border-[#D6D6D6] hover:border-[#141313]'
                                                    }`}
                                            >
                                                <Users size={16} weight="fill" />
                                                Solo/a
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, buyingWith: 'partner' })}
                                                className={`px-4 py-3 rounded-xl font-bold transition-all border-2 text-sm flex items-center justify-center gap-2 cursor-pointer ${formData.buyingWith === 'partner'
                                                    ? 'bg-[#141313] text-white border-[#141313] shadow-lg'
                                                    : 'bg-white text-[#545454] border-[#D6D6D6] hover:border-[#141313]'
                                                    }`}
                                            >
                                                <Users size={16} weight="fill" />
                                                Acompañado/a
                                            </button>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm md:text-base font-bold text-[#141313] mb-1.5 flex items-center gap-2">
                                                <Calendar size={16} weight="fill" className="text-[#141313]" />
                                                Tu edad
                                            </label>
                                            <input
                                                type="number"
                                                min="18"
                                                max="80"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                                                placeholder="Ej: 28"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-[#D6D6D6] focus:border-[#141313] focus:outline-none focus:ring-2 focus:ring-[#141313]/10 transition-all text-sm md:text-base"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Employment Details */}
                        {currentStep === 3 && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#D6D6D6] animate-fade-in flex-1 flex flex-col">
                                <div className="text-center mb-4 flex-shrink-0">
                                    <div className="inline-flex items-center gap-2 bg-[#BFFF00]/15 text-[#141313] px-3 py-1.5 rounded-full text-xs font-bold mb-2">
                                        <Users size={12} weight="fill" />
                                        Paso 3 de 3
                                    </div>
                                    <h1 className="font-display text-2xl md:text-3xl font-bold text-[#141313] mb-1">
                                        Tu perfil laboral
                                    </h1>
                                    <p className="text-xs md:text-sm text-[#545454]">
                                        Para ofrecerte la mejor solución financiera
                                    </p>
                                </div>

                                <div className="space-y-6 flex-1 flex flex-col justify-center">
                                    {/* Salary Range */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-[#141313] mb-3">
                                            ¿Cuál es tu salario mensual neto?
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['<1.500€', '1.500€ - 2.000€', '2.000€ - 3.000€', '+4.000€'].map((range) => (
                                                <button
                                                    key={range}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, salary: range })}
                                                    className={`px-4 py-3 rounded-xl font-bold transition-all border-2 text-sm md:text-base cursor-pointer ${formData.salary === range
                                                        ? 'bg-[#141313] text-white border-[#141313] shadow-lg transform scale-[1.02]'
                                                        : 'bg-white text-[#545454] border-[#D6D6D6] hover:border-[#141313] hover:bg-[#EBEBEB]'
                                                        }`}
                                                >
                                                    {range}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Employment Status */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-[#141313] mb-3">
                                            ¿Cuál es tu situación laboral?
                                        </label>
                                        <select
                                            value={formData.employmentStatus}
                                            onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#D6D6D6] focus:border-[#141313] focus:outline-none focus:ring-2 focus:ring-[#141313]/10 transition-all text-sm md:text-base bg-white"
                                        >
                                            <option value="">Selecciona tu situación</option>
                                            {[
                                                "Contrato Indefinido",
                                                "Contrato Temporal",
                                                "Funcionario",
                                                "Autónomo / Empresario",
                                                "Prácticas / Becario",
                                                "Desempleado",
                                                "Incapacidad laboral (Temporal o Permanente)",
                                                "Jubilado",
                                                "Estudiante"
                                            ].map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Privacy Policy Disclaimer */}
                                    <div className="text-center px-4">
                                        <p className="text-[10px] text-[#9D9D9D] leading-tight">
                                            Al hacer clic en &quot;¡Ver mi plan!&quot;, aceptas nuestra <Link href="/politicas#privacidad" target="_blank" className="underline hover:text-[#141313]">Política de Privacidad</Link> y <Link href="/politicas#aviso-legal" target="_blank" className="underline hover:text-[#141313]">Aviso Legal</Link>, y consientes el tratamiento de tus datos para el estudio de viabilidad.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Results and Success */}
                        {currentStep === 4 && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#D6D6D6] animate-fade-in flex-1 flex flex-col overflow-y-auto">
                                <div className="text-center mb-4 flex-shrink-0">
                                    {isSuccess && (
                                        <div className="mb-4 bg-[#BFFF00]/15 border border-[#BFFF00]/30 p-3 rounded-xl animate-fade-in">
                                            <div className="flex items-center justify-center gap-2 text-[#141313] font-bold mb-1">
                                                <CheckCircle size={20} weight="fill" />
                                                ¡Solicitud Recibida!
                                            </div>
                                            <p className="text-xs text-[#545454]">
                                                Gracias {formData.name.split(' ')[0]}, un experto analizará tu caso.
                                            </p>
                                        </div>
                                    )}
                                    <div className="inline-flex items-center gap-2 bg-[#BFFF00]/15 text-[#141313] px-3 py-1.5 rounded-full text-xs font-bold mb-2">
                                        <TrendDown size={12} weight="fill" />
                                        Paso 4 de 4
                                    </div>
                                    <h1 className="font-display text-2xl md:text-3xl font-bold text-[#141313] mb-1">
                                        ¡Tus resultados!
                                    </h1>
                                    <p className="text-sm text-[#545454]">
                                        Mira cuánto ahorras con FórmulaHogar
                                    </p>
                                </div>

                                <div className="space-y-4 flex-1">
                                    {/* Comparison */}
                                    <div className="grid grid-cols-2 gap-3">
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

                                        <div className="bg-[#BFFF00]/10 border-2 border-[#BFFF00] rounded-xl p-3 relative shadow-lg">
                                            <div className="absolute top-0 right-0 bg-[#BFFF00] text-[#141313] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                                                FórmulaHogar
                                            </div>
                                            <div className="mt-5">
                                                <p className="text-[10px] text-[#141313] font-medium mb-1">
                                                    Entrada (5%){formData.buyingWith === 'partner' ? ' / persona' : ''}
                                                </p>
                                                <p className="text-xl md:text-2xl font-bold text-[#141313] mb-2">
                                                    <AnimatedNumber value={getDisplayValue(formulaHogarDownPayment)} suffix="€" />
                                                </p>
                                                <p className="text-[10px] text-[#141313] flex items-center gap-1">
                                                    <CheckCircle size={12} weight="fill" className="text-[#141313]" />
                                                    Propietario día 1
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Savings */}
                                    <div className="bg-[#141313] rounded-xl p-5 text-white text-center">
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
                                    <div className="bg-[#EBEBEB] rounded-xl p-3 text-center">
                                        <p className="text-[9px] text-[#9D9D9D] uppercase font-bold mb-0.5">Cesión</p>
                                        <p className="text-lg md:text-xl font-bold text-[#141313]">{months} meses</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {currentStep <= 3 && (
                            <div className="flex items-center justify-between mt-4 gap-3 flex-shrink-0">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1 || isSubmitting}
                                    className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer ${currentStep === 1 || isSubmitting
                                        ? 'bg-[#EBEBEB] text-[#9D9D9D] cursor-not-allowed'
                                        : 'bg-white text-[#141313] hover:bg-[#EBEBEB] border-2 border-[#D6D6D6]'
                                        }`}
                                >
                                    <ArrowLeft size={16} weight="fill" />
                                    Atrás
                                </button>

                                <button
                                    onClick={nextStep}
                                    disabled={!canProceed() || isSubmitting}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer ${canProceed() && !isSubmitting
                                        ? 'bg-[#BFFF00] text-[#141313] hover:scale-105'
                                        : 'bg-[#D6D6D6] text-[#9D9D9D] cursor-not-allowed'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin h-4 w-4 border-2 border-[#141313] border-t-transparent rounded-full"></span>
                                            Calculando...
                                        </span>
                                    ) : (
                                        <>
                                            {currentStep === 3 ? '¡Ver mi plan!' : 'Siguiente'}
                                            <ArrowRight size={16} weight="fill" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {currentStep > 3 && (
                            <div className="text-center mt-3 flex-shrink-0">
                                <p className="text-sm text-[#9D9D9D]">Preparando tus resultados...</p>
                            </div>
                        )}
                    {currentStep > 3 && (
                         <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BFFF00]"></div>
                         </div>
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
