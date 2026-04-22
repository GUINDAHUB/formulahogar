'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SpinnerGap, UploadSimple, FileDoc, CheckCircle, XCircle } from '@phosphor-icons/react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

// --- Types ---
type EmploymentStatus = 'autonomo' | 'cuenta_ajena';
type PurchaseType = 'solo' | 'acompanado';

interface IFormInput {
    phone: string;
    employmentStatus: EmploymentStatus;
    purchaseType: PurchaseType;
}

export default function ViabilityFormPage() {
    return (
        <React.Suspense fallback={null}>
            <ViabilityFormContent />
        </React.Suspense>
    );
}

function ViabilityFormContent() {
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'task_not_found' | 'already_submitted' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
    const [fileSizeErrors, setFileSizeErrors] = useState<{ [key: string]: string }>({});
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<IFormInput>();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [phoneInput, setPhoneInput] = useState('');
    const [phoneTouched, setPhoneTouched] = useState(false);

    useEffect(() => {
        const tel = searchParams.get('tel');
        if (tel) {
            const raw = tel.replace(/\D/g, '');
            const digits = (raw.startsWith('34') && raw.length > 9 ? raw.slice(2) : raw).slice(0, 9);
            setPhoneInput(digits);
            setValue('phone', digits);
        }

        const tipo = searchParams.get('tipo');
        if (tipo === 'autonomo' || tipo === 'cuenta_ajena') {
            setValue('employmentStatus', tipo);
        }
    }, [searchParams, setValue]);

    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [privacyTouched, setPrivacyTouched] = useState(false);

    const employmentStatus = watch('employmentStatus');
    const purchaseType = watch('purchaseType');

    const isValidPhone = (phone: string) => {
        const digits = phone.replace(/\D/g, '');
        return /^[67]\d{8}$/.test(digits);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 9) {
            setPhoneInput(val);
            setValue('phone', val);
        }
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        if (!isValidPhone(data.phone)) {
            setPhoneTouched(true);
            return;
        }

        if (!privacyAccepted) {
            setPrivacyTouched(true);
            return;
        }

        setSubmissionStatus('loading');
        const formData = new FormData();
        formData.append('phone', `+34 ${data.phone}`);
        formData.append('employmentStatus', data.employmentStatus);
        formData.append('purchaseType', data.purchaseType);

        const requiredFiles = getRequiredFiles(data.employmentStatus, data.purchaseType);
        const missingFiles = requiredFiles.filter(key => !selectedFiles[key]);

        if (missingFiles.length > 0) {
            alert(`Te faltan subir los siguientes archivos: ${missingFiles.join(', ')}`);
            setSubmissionStatus('idle');
            return;
        }

        Object.entries(selectedFiles).forEach(([key, file]) => {
            if (file) {
                formData.append(`file_${key}`, file);
            }
        });

        try {
            const response = await axios.post('/api/viability', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setSubmissionStatus('success');
            }
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                setSubmissionStatus('task_not_found');
            } else if (err.response && err.response.status === 409) {
                setSubmissionStatus('already_submitted');
            } else if (err.response && err.response.status === 400 && err.response.data?.error) {
                setErrorMessage(err.response.data.error);
                setSubmissionStatus('error');
            } else {
                setErrorMessage(null);
                setSubmissionStatus('error');
            }
        }
    };

    const MAX_FILE_SIZE_MB = 10;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const handleFileChange = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setFileSizeErrors(prev => ({ ...prev, [key]: `El archivo supera el límite de ${MAX_FILE_SIZE_MB} MB.` }));
                event.target.value = '';
                return;
            }
            setFileSizeErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
            setSelectedFiles(prev => ({ ...prev, [key]: file }));
        }
    };

    const getRequiredFiles = (status: EmploymentStatus, type: PurchaseType) => {
        const baseFiles = status === 'autonomo'
            ? ['vida_laboral', 'trimestrales', 'renta']
            : ['vida_laboral', 'nominas', 'renta'];

        if (type === 'acompanado') {
            const secondPersonFiles = baseFiles.map(file => `${file}_persona2`);
            return [...baseFiles, ...secondPersonFiles];
        }

        return baseFiles;
    };

    const renderFileInput = (key: string, label: string) => (
        <div className="mb-6 animate-fade-in-up">
            <label className="block text-sm font-bold text-[#141313] mb-2">{label}</label>
            <div className="flex items-center justify-center w-full group">
                <label htmlFor={`file-${key}`} className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${selectedFiles[key] ? 'border-[#BFFF00] bg-[#BFFF00]/5' : 'border-[#D6D6D6] hover:border-[#141313] hover:bg-[#EBEBEB]'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                        {selectedFiles[key] ? (
                            <>
                                <div className="absolute top-3 right-3">
                                    <div className="bg-[#BFFF00] rounded-full p-1">
                                        <CheckCircle size={16} weight="fill" className="text-[#141313]" />
                                    </div>
                                </div>
                                <FileDoc size={40} weight="fill" className="text-[#141313] mb-3" />
                                <p className="mb-1 text-sm text-[#141313] font-bold text-center w-full truncate">{selectedFiles[key]?.name}</p>
                                <p className="text-xs text-[#545454] font-medium">Click para cambiar</p>
                            </>
                        ) : (
                            <>
                                <div className="p-3 bg-[#EBEBEB] rounded-full mb-3 group-hover:bg-[#D6D6D6] transition-colors">
                                    <UploadSimple size={24} weight="fill" className="text-[#9D9D9D] group-hover:text-[#141313]" />
                                </div>
                                <p className="mb-2 text-sm text-[#9D9D9D] text-center"><span className="font-bold text-[#141313]">Haz clic para subir</span> o arrastra</p>
                                <p className="text-xs text-[#9D9D9D]">PDF, PNG, JPG (MAX. 10MB)</p>
                            </>
                        )}
                    </div>
                    <input
                        id={`file-${key}`}
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(key, e)}
                    />
                </label>
            </div>
            {fileSizeErrors[key] && (
                <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                    <XCircle size={14} weight="fill" className="flex-shrink-0" />
                    {fileSizeErrors[key]}
                </p>
            )}
        </div>
    );

    // --- Status screens (shared header component) ---
    const PageHeader = () => (
        <header className="bg-white border-b border-[#D6D6D6] flex-shrink-0">
            <div className="container mx-auto px-4 md:px-6 py-2 md:py-3 flex justify-center">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
                    <img src="/brand/logo-color.png" alt="FórmulaHogar" className="h-7 w-auto" />
                </Link>
            </div>
        </header>
    );

    if (submissionStatus === 'success') {
        return (
            <div className="min-h-screen bg-[#EBEBEB] flex flex-col font-sans">
                <PageHeader />
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-[#D6D6D6]">
                        <div className="w-20 h-20 bg-[#BFFF00]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} weight="fill" className="text-[#141313]" />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-[#141313] mb-4">¡Documentación Recibida!</h2>
                        <p className="text-[#545454] mb-8 leading-relaxed">Hemos recibido tus archivos correctamente y los hemos adjuntado a tu expediente. Nuestro equipo de viabilidad los revisará en breve.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-[#BFFF00] hover:opacity-90 text-[#141313] font-bold py-4 px-6 rounded-xl transition-all cursor-pointer"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (submissionStatus === 'already_submitted') {
        return (
            <div className="min-h-screen bg-[#EBEBEB] flex flex-col font-sans">
                <PageHeader />
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-[#D6D6D6]">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} weight="fill" className="text-amber-500" />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-[#141313] mb-4">Documentación ya enviada</h2>
                        <p className="text-[#545454] mb-8 leading-relaxed">
                            Ya hemos recibido tu documentación anteriormente. Nuestro equipo la está revisando y se pondrá en contacto contigo en breve.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-[#141313] hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all cursor-pointer"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (submissionStatus === 'task_not_found') {
        return (
            <div className="min-h-screen bg-[#EBEBEB] flex flex-col font-sans">
                <PageHeader />
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-[#D6D6D6]">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle size={40} weight="fill" className="text-red-500" />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-[#141313] mb-4">No encontramos tu expediente</h2>
                        <p className="text-[#545454] mb-8 leading-relaxed">No se ha creado aún tu perfil en nuestro sistema. Por favor, asegúrate de haber introducido el teléfono correctamente o realiza el estudio previo.</p>
                        <button
                            onClick={() => setSubmissionStatus('idle')}
                            className="w-full bg-[#EBEBEB] text-[#141313] font-bold py-4 px-6 rounded-xl hover:bg-[#D6D6D6] transition-colors mb-3 cursor-pointer"
                        >
                            Intentar de nuevo
                        </button>
                        <button
                            onClick={() => router.push('/calculadora')}
                            className="w-full bg-[#141313] hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all cursor-pointer"
                        >
                            Ir a la Calculadora
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EBEBEB] font-sans antialiased flex flex-col">
            <PageHeader />

            <div className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl border border-[#D6D6D6] overflow-hidden animate-fade-in-up">

                    {/* Form Header */}
                    <div className="bg-[#EBEBEB] p-8 md:p-10 border-b border-[#D6D6D6] text-center">
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-[#141313] mb-2">Estudio de Viabilidad</h1>
                        <p className="text-sm text-[#545454] max-w-lg mx-auto leading-relaxed">Sube la documentación necesaria para que nuestro equipo financiero analice tu caso sin compromiso.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10 space-y-8">

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-bold text-[#141313] mb-1.5 flex items-center gap-2">
                                Teléfono de contacto
                            </label>
                            <div className="flex gap-2">
                                <div className="relative w-[100px] flex-shrink-0">
                                    <div className="w-full h-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#D6D6D6] bg-[#EBEBEB] text-[#545454] font-medium text-base py-3">
                                        <span>🇪🇸</span>
                                        <span>+34</span>
                                    </div>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        {...register('phone', { required: true })}
                                        type="tel"
                                        value={phoneInput}
                                        maxLength={9}
                                        onChange={handlePhoneChange}
                                        onBlur={() => setPhoneTouched(true)}
                                        placeholder="600 000 000"
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-base focus:outline-none focus:ring-2 ${phoneTouched && phoneInput && !isValidPhone(phoneInput)
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                            : 'border-[#D6D6D6] focus:border-[#141313] focus:ring-[#141313]/10'
                                            }`}
                                    />
                                    {phoneTouched && phoneInput && !isValidPhone(phoneInput) && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-medium hidden md:block">
                                            Móvil no válido
                                        </span>
                                    )}
                                </div>
                            </div>
                            {errors.phone && <span className="text-red-500 text-xs font-medium mt-1 block">Este campo es obligatorio</span>}
                        </div>

                        {/* Situación Laboral */}
                        <div>
                            <label className="block text-sm font-bold text-[#141313] mb-3">Situación Laboral</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`cursor-pointer relative p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${employmentStatus === 'autonomo' ? 'border-[#BFFF00] bg-[#BFFF00]/5 shadow-sm' : 'border-[#D6D6D6] hover:border-[#141313]/50 hover:bg-[#EBEBEB]'}`}>
                                    <input {...register('employmentStatus', { required: true })} type="radio" value="autonomo" className="sr-only" />
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${employmentStatus === 'autonomo' ? 'border-[#BFFF00]' : 'border-[#D6D6D6]'}`}>
                                        {employmentStatus === 'autonomo' && <div className="w-3 h-3 rounded-full bg-[#BFFF00]" />}
                                    </div>
                                    <span className={`font-bold ${employmentStatus === 'autonomo' ? 'text-[#141313]' : 'text-[#545454]'}`}>Soy Autónomo</span>
                                </label>

                                <label className={`cursor-pointer relative p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${employmentStatus === 'cuenta_ajena' ? 'border-[#BFFF00] bg-[#BFFF00]/5 shadow-sm' : 'border-[#D6D6D6] hover:border-[#141313]/50 hover:bg-[#EBEBEB]'}`}>
                                    <input {...register('employmentStatus', { required: true })} type="radio" value="cuenta_ajena" className="sr-only" />
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${employmentStatus === 'cuenta_ajena' ? 'border-[#BFFF00]' : 'border-[#D6D6D6]'}`}>
                                        {employmentStatus === 'cuenta_ajena' && <div className="w-3 h-3 rounded-full bg-[#BFFF00]" />}
                                    </div>
                                    <span className={`font-bold ${employmentStatus === 'cuenta_ajena' ? 'text-[#141313]' : 'text-[#545454]'}`}>Por Cuenta Ajena</span>
                                </label>
                            </div>
                            {errors.employmentStatus && <p className="text-red-500 text-sm mt-2 font-medium flex items-center gap-1"><XCircle size={16} weight="fill" /> Selecciona tu situación laboral</p>}
                        </div>

                        {/* Tipo de Compra */}
                        <div>
                            <label className="block text-sm font-bold text-[#141313] mb-3">¿Compras solo o acompañado?</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`cursor-pointer relative p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${purchaseType === 'solo' ? 'border-[#BFFF00] bg-[#BFFF00]/5 shadow-sm' : 'border-[#D6D6D6] hover:border-[#141313]/50 hover:bg-[#EBEBEB]'}`}>
                                    <input {...register('purchaseType', { required: true })} type="radio" value="solo" className="sr-only" />
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${purchaseType === 'solo' ? 'border-[#BFFF00]' : 'border-[#D6D6D6]'}`}>
                                        {purchaseType === 'solo' && <div className="w-3 h-3 rounded-full bg-[#BFFF00]" />}
                                    </div>
                                    <span className={`font-bold ${purchaseType === 'solo' ? 'text-[#141313]' : 'text-[#545454]'}`}>Compro Solo</span>
                                </label>

                                <label className={`cursor-pointer relative p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${purchaseType === 'acompanado' ? 'border-[#BFFF00] bg-[#BFFF00]/5 shadow-sm' : 'border-[#D6D6D6] hover:border-[#141313]/50 hover:bg-[#EBEBEB]'}`}>
                                    <input {...register('purchaseType', { required: true })} type="radio" value="acompanado" className="sr-only" />
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${purchaseType === 'acompanado' ? 'border-[#BFFF00]' : 'border-[#D6D6D6]'}`}>
                                        {purchaseType === 'acompanado' && <div className="w-3 h-3 rounded-full bg-[#BFFF00]" />}
                                    </div>
                                    <span className={`font-bold ${purchaseType === 'acompanado' ? 'text-[#141313]' : 'text-[#545454]'}`}>Compro Acompañado</span>
                                </label>
                            </div>
                            {errors.purchaseType && <p className="text-red-500 text-sm mt-2 font-medium flex items-center gap-1"><XCircle size={16} weight="fill" /> Selecciona si compras solo o acompañado</p>}
                        </div>

                        {/* Archivos Condicionales */}
                        <AnimatePresence>
                            {employmentStatus && purchaseType && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-8 border-t border-[#D6D6D6]">
                                        <h3 className="text-lg font-bold text-[#141313] mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-[#BFFF00]/15 rounded-lg">
                                                <UploadSimple size={20} weight="fill" className="text-[#141313]" />
                                            </div>
                                            Documentación Requerida {purchaseType === 'acompanado' && '- Persona 1'}
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="col-span-1 md:col-span-2">
                                                {renderFileInput('vida_laboral', 'Vida Laboral (Actualizada)')}
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                {renderFileInput('renta', 'Última Declaración de la Renta')}
                                            </div>
                                            {employmentStatus === 'autonomo' && (
                                                <div className="col-span-1 md:col-span-2">
                                                    {renderFileInput('trimestrales', 'Últimas 3 Declaraciones Trimestrales (IVA/IRPF)')}
                                                </div>
                                            )}
                                            {employmentStatus === 'cuenta_ajena' && (
                                                <div className="col-span-1 md:col-span-2">
                                                    {renderFileInput('nominas', 'Últimas 3 Nóminas')}
                                                </div>
                                            )}
                                        </div>

                                        {purchaseType === 'acompanado' && (
                                            <>
                                                <h3 className="text-lg font-bold text-[#141313] mb-6 mt-8 flex items-center gap-3">
                                                    <div className="p-2 bg-[#BFFF00]/15 rounded-lg">
                                                        <UploadSimple size={20} weight="fill" className="text-[#141313]" />
                                                    </div>
                                                    Documentación Requerida - Persona 2
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="col-span-1 md:col-span-2">
                                                        {renderFileInput('vida_laboral_persona2', 'Vida Laboral (Actualizada) - Persona 2')}
                                                    </div>
                                                    <div className="col-span-1 md:col-span-2">
                                                        {renderFileInput('renta_persona2', 'Última Declaración de la Renta - Persona 2')}
                                                    </div>
                                                    {employmentStatus === 'autonomo' && (
                                                        <div className="col-span-1 md:col-span-2">
                                                            {renderFileInput('trimestrales_persona2', 'Últimas 3 Declaraciones Trimestrales (IVA/IRPF) - Persona 2')}
                                                        </div>
                                                    )}
                                                    {employmentStatus === 'cuenta_ajena' && (
                                                        <div className="col-span-1 md:col-span-2">
                                                            {renderFileInput('nominas_persona2', 'Últimas 3 Nóminas - Persona 2')}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Privacy Consent */}
                        <div className="pt-2">
                            <label className={`flex items-start gap-3 cursor-pointer group ${privacyTouched && !privacyAccepted ? 'text-red-600' : 'text-[#545454]'}`}>
                                <div className="relative flex-shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={privacyAccepted}
                                        onChange={(e) => {
                                            setPrivacyAccepted(e.target.checked);
                                            setPrivacyTouched(true);
                                        }}
                                    />
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${privacyAccepted ? 'bg-[#BFFF00] border-[#BFFF00]' : privacyTouched && !privacyAccepted ? 'border-red-400 bg-red-50' : 'border-[#D6D6D6] group-hover:border-[#141313]/60'}`}>
                                        {privacyAccepted && (
                                            <svg className="w-3 h-3 text-[#141313]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm leading-relaxed">
                                    He leído y acepto la{' '}
                                    <a
                                        href="/politica-de-privacidad"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold text-[#141313] underline underline-offset-2 hover:opacity-70"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Política de Privacidad
                                    </a>{' '}
                                    y consiento el tratamiento de mis datos personales para la realización del estudio de viabilidad.
                                </span>
                            </label>
                            {privacyTouched && !privacyAccepted && (
                                <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                                    <XCircle size={14} weight="fill" />
                                    Debes aceptar la política de privacidad para continuar.
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submissionStatus === 'loading'}
                                className="w-full bg-[#BFFF00] hover:opacity-90 disabled:bg-[#D6D6D6] disabled:text-[#9D9D9D] disabled:cursor-not-allowed text-[#141313] font-bold py-5 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg active:scale-95 cursor-pointer"
                            >
                                {submissionStatus === 'loading' ? (
                                    <>
                                        <SpinnerGap size={24} weight="fill" className="animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar Documentación'
                                )}
                            </button>
                        </div>

                        {submissionStatus === 'error' && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center font-medium flex items-center justify-center gap-2">
                                <XCircle size={20} weight="fill" className="flex-shrink-0" />
                                {errorMessage ?? 'Ocurrió un error al enviar. Inténtalo más tarde.'}
                            </div>
                        )}

                    </form>

                    {/* Security Note */}
                    <div className="bg-[#EBEBEB] py-6 px-8 text-center border-t border-[#D6D6D6]">
                        <p className="text-xs text-[#9D9D9D] flex items-center justify-center gap-2">
                            <CheckCircle size={12} weight="fill" />
                            Tus datos están protegidos y encriptados. Solo serán utilizados para el estudio de viabilidad.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
