"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, CheckCircleIcon, SpinnerGapIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { readUtms, track } from "@/lib/analytics";
import { V2Button } from "../ui";
import { ChipGroup, Progress, RangeField, TextField } from "../fields";

// Misma lógica, validación, borrador y payload que
// components/hipotecas/LeadForm.tsx; solo cambia la presentación.

const formatEUR = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));

type Fase = "buscando" | "casa_elegida" | "arras_firmadas" | "mejorar_hipoteca";
type Situacion = "empleado" | "autonomo" | "funcionario" | "mixto" | "otros";

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

  useEffect(() => {
    const draft = loadDraft();
    if (Object.keys(draft).length > 0) {
      setState((s) => ({ ...s, ...draft }));
    }
  }, []);

  useEffect(() => {
    saveDraft(state);
  }, [state]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const goToStep = (next: 1 | 2 | 3) => {
    track("form_step", { step: next });
    setStep(next);
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const validateStep1 = () => !!state.fase;
  const validateStep2 = () => state.ingresos_mensuales > 0 && !!state.situacion_laboral;
  const validateStep3 = () => {
    if (!state.nombre.trim()) return "Falta el nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) return "Email no válido.";
    const tel = state.telefono.replace(/\s/g, "");
    if (!/^[679]\d{8}$/.test(tel)) return "Introduce un móvil español (9 dígitos, empieza por 6, 7 o 9).";
    if (!state.consentimiento) return "Necesitamos que aceptes la política de privacidad.";
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
      setErrorMsg("No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const card =
    "scroll-mt-28 rounded-[24px] bg-white p-6 text-[#141313] shadow-[0_32px_64px_-32px_rgba(0,0,0,0.6)] sm:p-9";

  if (success) {
    return (
      <div ref={cardRef} id={LEAD_FORM_ID} className={card} role="status">
        <div className="py-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#BFFF00]">
            <CheckCircleIcon size={30} weight="fill" color="#141313" />
          </span>
          <h3 className="v2-display v2-h3 mt-6">¡Lo tenemos!</h3>
          <p className="mx-auto mt-4 max-w-[38ch] leading-relaxed text-[#545454]">
            Un asesor revisa tu caso y te llama en menos de 48h laborables. Mientras tanto, prepara DNI y nóminas (o IRPF
            si eres autónomo) — así avanzamos más rápido en la primera llamada.
          </p>
          <p className="mt-4 text-xs text-[#545454]">Si es urgente, escríbenos por WhatsApp desde el botón del header.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} id={LEAD_FORM_ID} className={card}>
      <h3 className="v2-display v2-h3">Analiza tu caso gratis</h3>
      <p className="mt-2 text-sm text-[#545454]">Te llamamos en menos de 48h.</p>

      <div className="mt-7">
        <Progress step={step} total={3} names={["Tu vivienda", "Tu situación", "Tus datos"]} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">
        {step === 1 && (
          <>
            <RangeField
              label="Precio aproximado de la vivienda"
              value={state.precio_vivienda}
              min={50000}
              max={600000}
              step={5000}
              format={(v) => formatEUR(v)}
              onChange={(v) => update("precio_vivienda", v)}
            />
            <ChipGroup
              label="¿En qué fase estás?"
              name="fase"
              value={state.fase}
              options={FASES}
              onChange={(v) => update("fase", v)}
            />
            <V2Button type="button" disabled={!validateStep1()} onClick={() => goToStep(2)} className="w-full !justify-between">
              Siguiente
            </V2Button>
          </>
        )}

        {step === 2 && (
          <>
            <RangeField
              label="Ahorro disponible"
              value={state.ahorro_disponible}
              min={0}
              max={100000}
              step={1000}
              format={(v) => formatEUR(v)}
              onChange={(v) => update("ahorro_disponible", v)}
            />
            <TextField
              label="Ingresos mensuales netos del hogar"
              type="number"
              inputMode="numeric"
              min={500}
              max={20000}
              step={100}
              suffix="€/mes"
              value={state.ingresos_mensuales || ""}
              onChange={(v) => update("ingresos_mensuales", Number(v))}
            />
            <ChipGroup
              label="Situación laboral"
              name="situacion_laboral"
              value={state.situacion_laboral}
              options={SITUACIONES}
              onChange={(v) => update("situacion_laboral", v)}
            />
            <div className="flex gap-3">
              <BackButton onClick={() => goToStep(1)} />
              <V2Button type="button" disabled={!validateStep2()} onClick={() => goToStep(3)} className="flex-1 !justify-between">
                Siguiente
              </V2Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <TextField label="Nombre y apellido" value={state.nombre} autoComplete="name" onChange={(v) => update("nombre", v)} />
            <TextField
              label="Email"
              type="email"
              inputMode="email"
              value={state.email}
              autoComplete="email"
              onChange={(v) => update("email", v)}
            />
            <TextField
              label="Teléfono móvil"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              prefix="+34"
              placeholder="600 000 000"
              maxLength={9}
              value={state.telefono}
              onChange={(v) => update("telefono", v.replace(/[^\d]/g, ""))}
            />
            <label className="flex items-start gap-3 text-sm leading-relaxed text-[#545454]">
              <input
                type="checkbox"
                checked={state.consentimiento}
                onChange={(e) => update("consentimiento", e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#141313]"
              />
              <span>
                Acepto la{" "}
                <a
                  href="https://formulahogar.com/politicas#privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#141313] underline underline-offset-2"
                >
                  política de privacidad
                </a>
                .
              </span>
            </label>
            {errorMsg && (
              <p role="alert" className="flex items-start gap-2 rounded-[14px] bg-[#FDECEA] px-4 py-3 text-sm text-[#7A271A]">
                <WarningCircleIcon size={18} weight="fill" className="mt-px shrink-0" />
                {errorMsg}
              </p>
            )}
            <div className="flex gap-3">
              <BackButton onClick={() => goToStep(2)} />
              <V2Button type="submit" disabled={submitting} arrow={!submitting} className="flex-1 !justify-between disabled:cursor-progress">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <SpinnerGapIcon size={18} weight="bold" className="motion-safe:animate-spin" />
                    Enviando…
                  </span>
                ) : (
                  "Quiero mi análisis"
                )}
              </V2Button>
            </div>
            <p className="text-center text-xs text-[#545454]">Sin compromiso · Precio fijo · Sin spam</p>
          </>
        )}
      </form>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-[52px] items-center gap-1.5 rounded-full border border-[#D6D6D6] px-5 text-sm font-semibold text-[#141313] transition-colors hover:border-[#141313]"
    >
      <ArrowLeftIcon size={16} weight="bold" />
      Atrás
    </button>
  );
}
