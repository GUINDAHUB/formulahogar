"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { readUtms, track } from "@/lib/analytics";

const formatEUR = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));

type Fase =
  | "buscando"
  | "casa_elegida"
  | "arras_firmadas"
  | "mejorar_hipoteca";

type Situacion =
  | "empleado"
  | "autonomo"
  | "funcionario"
  | "mixto"
  | "otros";

interface FormState {
  precio_vivienda: number;
  fase: Fase | "";
  ahorro_disponible: number;
  ingresos_mensuales: number;
  situacion_laboral: Situacion | "";
  nombre: string;
  email: string;
  telefono: string;
  consentimiento: boolean;
}

const INITIAL: FormState = {
  precio_vivienda: 200000,
  fase: "",
  ahorro_disponible: 30000,
  ingresos_mensuales: 2500,
  situacion_laboral: "",
  nombre: "",
  email: "",
  telefono: "",
  consentimiento: false,
};

const DRAFT_KEY = "fh_hipotecas_lead_draft";

export const LEAD_FORM_ID = "lead-form";

function loadDraft(): Partial<FormState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<FormState>) : {};
  } catch {
    return {};
  }
}

function saveDraft(state: FormState) {
  if (typeof window === "undefined") return;
  try {
    // Solo persistimos paso 1+2, no datos personales del paso 3.
    const { nombre, email, telefono, consentimiento, ...safe } = state;
    void nombre;
    void email;
    void telefono;
    void consentimiento;
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(safe));
  } catch {
    // ignore
  }
}

const FASES: { value: Fase; label: string }[] = [
  { value: "buscando", label: "Buscando casa" },
  { value: "casa_elegida", label: "Casa elegida" },
  { value: "arras_firmadas", label: "Arras firmadas" },
  { value: "mejorar_hipoteca", label: "Mejorar hipoteca actual" },
];

const SITUACIONES: { value: Situacion; label: string }[] = [
  { value: "empleado", label: "Empleado" },
  { value: "autonomo", label: "Autónomo" },
  { value: "funcionario", label: "Funcionario" },
  { value: "mixto", label: "Mixto" },
  { value: "otros", label: "Otros" },
];

export default function LeadForm() {
  const [state, setState] = useState<FormState>(INITIAL);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Restaurar borrador si el usuario abandonó antes de enviar
  useEffect(() => {
    const draft = loadDraft();
    if (Object.keys(draft).length > 0) {
      setState((s) => ({ ...s, ...draft }));
    }
  }, []);

  // Persistir borrador (debounced via React batching is enough)
  useEffect(() => {
    saveDraft(state);
  }, [state]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const goToStep = (next: 1 | 2 | 3) => {
    track("form_step", { step: next });
    setStep(next);
    // Scroll al inicio de la card para que el siguiente paso sea visible
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const validateStep1 = () => !!state.fase;
  const validateStep2 = () =>
    state.ingresos_mensuales > 0 && !!state.situacion_laboral;
  const validateStep3 = () => {
    if (!state.nombre.trim()) return "Falta el nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email))
      return "Email no válido.";
    const tel = state.telefono.replace(/\s/g, "");
    if (!/^[679]\d{8}$/.test(tel))
      return "Introduce un móvil español (9 dígitos, empieza por 6, 7 o 9).";
    if (!state.consentimiento)
      return "Necesitamos que aceptes la política de privacidad.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep3();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);

    const payload = {
      ...state,
      telefono: state.telefono.replace(/\s/g, ""),
      ...readUtms(),
    };

    try {
      const resp = await fetch("/api/hipotecas-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || "submit_failed");
      }
      track("form_submit", {
        precio_vivienda: state.precio_vivienda,
        fase: state.fase || "",
        situacion_laboral: state.situacion_laboral || "",
      });
      try {
        window.sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      setSuccess(true);
    } catch {
      setErrorMsg(
        "No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        ref={cardRef}
        id={LEAD_FORM_ID}
        className="rounded-xl border border-[#D6D6D6] bg-white p-8 shadow-sm"
      >
        <div className="flex flex-col items-center text-center gap-4 py-6">
          <div className="rounded-full bg-[#BFFF00] p-3">
            <CheckCircleIcon size={32} weight="fill" color="#141313" />
          </div>
          <h3 className="font-display text-2xl text-[#141313]">¡Lo tenemos!</h3>
          <p className="text-[#545454]">
            Un asesor revisa tu caso y te llama en menos de 48h laborables.
            Mientras tanto, prepara DNI y nóminas (o IRPF si eres autónomo) —
            así avanzamos más rápido en la primera llamada.
          </p>
          <p className="text-xs text-[#9D9D9D]">
            Si es urgente, escríbenos por WhatsApp desde el botón del header.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      id={LEAD_FORM_ID}
      className="rounded-xl border border-[#D6D6D6] bg-white p-6 sm:p-8 shadow-sm"
    >
      <div className="mb-5">
        <h3 className="font-display text-2xl text-[#141313]">
          Analiza tu caso gratis
        </h3>
        <p className="text-sm text-[#545454] mt-1">
          Te llamamos en menos de 48h.
        </p>
      </div>

      <ProgressIndicator step={step} />

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {step === 1 && (
          <>
            <SliderField
              label="Precio aproximado de la vivienda"
              value={state.precio_vivienda}
              min={50000}
              max={600000}
              step={5000}
              format={(v) => formatEUR(v)}
              onChange={(v) => update("precio_vivienda", v)}
            />
            <SelectField
              label="¿En qué fase estás?"
              value={state.fase}
              placeholder="Selecciona una opción"
              options={FASES}
              onChange={(v) => update("fase", v as Fase | "")}
            />
            <PrimaryButton
              type="button"
              disabled={!validateStep1()}
              onClick={() => goToStep(2)}
            >
              Siguiente <ArrowRightIcon size={18} weight="bold" />
            </PrimaryButton>
          </>
        )}

        {step === 2 && (
          <>
            <SliderField
              label="Ahorro disponible"
              value={state.ahorro_disponible}
              min={0}
              max={100000}
              step={1000}
              format={(v) => formatEUR(v)}
              onChange={(v) => update("ahorro_disponible", v)}
            />
            <NumberField
              label="Ingresos mensuales netos del hogar"
              value={state.ingresos_mensuales}
              min={500}
              max={20000}
              step={100}
              suffix="€/mes"
              onChange={(v) => update("ingresos_mensuales", v)}
            />
            <SelectField
              label="Situación laboral"
              value={state.situacion_laboral}
              placeholder="Selecciona una opción"
              options={SITUACIONES}
              onChange={(v) => update("situacion_laboral", v as Situacion | "")}
            />
            <div className="flex items-center gap-3">
              <SecondaryButton type="button" onClick={() => goToStep(1)}>
                Atrás
              </SecondaryButton>
              <PrimaryButton
                type="button"
                disabled={!validateStep2()}
                onClick={() => goToStep(3)}
              >
                Siguiente <ArrowRightIcon size={18} weight="bold" />
              </PrimaryButton>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              label="Nombre y apellido"
              value={state.nombre}
              autoComplete="name"
              onChange={(v) => update("nombre", v)}
            />
            <TextField
              label="Email"
              type="email"
              value={state.email}
              autoComplete="email"
              onChange={(v) => update("email", v)}
            />
            <PhoneField
              value={state.telefono}
              onChange={(v) => update("telefono", v)}
            />
            <label className="flex items-start gap-2 text-sm text-[#545454]">
              <input
                type="checkbox"
                checked={state.consentimiento}
                onChange={(e) => update("consentimiento", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#BFFF00]"
              />
              <span>
                Acepto la{" "}
                <a
                  href="https://formulahogar.com/politicas#privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#141313]"
                >
                  política de privacidad
                </a>
                .
              </span>
            </label>
            {errorMsg && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}
            <div className="flex items-center gap-3">
              <SecondaryButton type="button" onClick={() => goToStep(2)}>
                Atrás
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={submitting} fullWidth>
                {submitting ? (
                  <>
                    <SpinnerGapIcon size={18} weight="bold" className="animate-spin" />
                    Enviando…
                  </>
                ) : (
                  <>Quiero mi análisis</>
                )}
              </PrimaryButton>
            </div>
            <p className="text-xs text-[#9D9D9D] text-center">
              Sin compromiso · Precio fijo · Sin spam
            </p>
          </>
        )}
      </form>
    </div>
  );
}

function ProgressIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Paso ${step} de 3`}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`h-1 flex-1 rounded-full ${
            n <= step ? "bg-[#BFFF00]" : "bg-[#EBEBEB]"
          }`}
        />
      ))}
    </div>
  );
}

function PrimaryButton({
  children,
  type = "button",
  disabled,
  onClick,
  fullWidth = true,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#BFFF00] px-5 py-3 text-sm font-bold text-[#141313] transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-lg border-2 border-[#141313] px-5 py-2.5 text-sm font-semibold text-[#141313] hover:bg-[#141313] hover:text-white transition-colors"
    >
      {children}
    </button>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-[#141313]">{label}</label>
        <span className="text-sm font-semibold text-[#141313]">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#BFFF00]"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#141313] block mb-2">
        {label}
      </label>
      <div className="flex items-center rounded-lg border border-[#D6D6D6] bg-white focus-within:border-[#141313]">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
        />
        {suffix && (
          <span className="pr-3 text-sm text-[#9D9D9D]">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: T | "";
  placeholder: string;
  options: { value: T; label: string }[];
  onChange: (v: T | "") => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#141313] block mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "")}
        className="w-full rounded-lg border border-[#D6D6D6] bg-white px-3 py-2.5 text-sm text-[#141313] outline-none focus:border-[#141313]"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  value,
  type = "text",
  autoComplete,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  autoComplete?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#141313] block mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#D6D6D6] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#141313]"
      />
    </div>
  );
}

function PhoneField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#141313] block mb-2">
        Teléfono móvil
      </label>
      <div className="flex items-center rounded-lg border border-[#D6D6D6] bg-white focus-within:border-[#141313]">
        <span className="pl-3 pr-2 text-sm text-[#9D9D9D]">+34</span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="600 000 000"
          maxLength={9}
          className="w-full bg-transparent py-2.5 pr-3 text-sm outline-none"
        />
      </div>
    </div>
  );
}
