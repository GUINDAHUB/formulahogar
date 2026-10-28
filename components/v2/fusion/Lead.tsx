"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, CheckCircleIcon, CircleNotchIcon, FileTextIcon } from "@phosphor-icons/react";
import { readUtms, track } from "@/lib/analytics";
import { Container, SCREEN, SectionMark, V2Button } from "../ui";
import { ChipGroup, FieldError, Progress, RangeField, TextField } from "../fields";

// Misma lógica, validación, borrador y payload que
// components/fusion/FusionLead.tsx; solo cambia la presentación.

type TieneHipoteca = "si" | "no";
type Situacion = "empleado" | "funcionario" | "autonomo" | "otros";

interface FormState {
  tiene_hipoteca: TieneHipoteca | "";
  hipoteca_pendiente: number;
  deudas_consumo: number;
  cuota_mensual_total: number;
  situacion_laboral: Situacion | "";
  nombre: string;
  email: string;
  telefono: string;
  consentimiento: boolean;
}

const INITIAL: FormState = {
  tiene_hipoteca: "",
  hipoteca_pendiente: 150000,
  deudas_consumo: 30000,
  cuota_mensual_total: 1800,
  situacion_laboral: "",
  nombre: "",
  email: "",
  telefono: "",
  consentimiento: false,
};

const DRAFT_KEY = "fh_fusion_draft";

const SITUACIONES: { value: Situacion; label: string }[] = [
  { value: "empleado", label: "Por cuenta ajena" },
  { value: "funcionario", label: "Funcionario" },
  { value: "autonomo", label: "Autónomo" },
  { value: "otros", label: "Otra situación" },
];

const DOCUMENTOS = [
  "Tus dos últimas nóminas (o el IRPF si eres autónomo)",
  "Extractos de tus tarjetas y préstamos",
  "El último recibo de tu hipoteca",
];

function loadDraft(): Partial<FormState> {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<FormState>;
    delete parsed.consentimiento;
    return parsed;
  } catch {
    return {};
  }
}

export default function Lead() {
  const [state, setState] = useState<FormState>(INITIAL);
  const [step, setStep] = useState<1 | 2>(1);
  const [restored, setRestored] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const draft = loadDraft();
    if (Object.keys(draft).length > 0) {
      setState((s) => ({ ...s, ...draft }));
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("form_start", { form: "fusion" });
    }
    setState((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const scrollCardIntoView = () =>
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

  const goNext = () => {
    const next: typeof errors = {};
    if (!state.tiene_hipoteca) next.tiene_hipoteca = "Elige una opción.";
    if (!state.situacion_laboral) next.situacion_laboral = "Elige tu situación laboral.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    track("form_step", { form: "fusion", step: 2 });
    setStep(2);
    scrollCardIntoView();
  };

  const goBack = () => {
    setStep(1);
    scrollCardIntoView();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      goNext();
      return;
    }

    const next: typeof errors = {};
    if (!state.nombre.trim()) next.nombre = "Escribe tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) next.email = "Revisa el email: falta la @ o el dominio.";
    if (!/^[679]\d{8}$/.test(state.telefono.replace(/\s/g, "")))
      next.telefono = "Escribe un teléfono español de 9 cifras (empieza por 6, 7 o 9).";
    if (!state.consentimiento) next.consentimiento = "Necesitamos tu permiso para llamarte.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      const resp = await fetch("/api/fusion-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...state,
          hipoteca_pendiente: state.tiene_hipoteca === "si" ? state.hipoteca_pendiente : undefined,
          email: state.email.trim(),
          telefono: state.telefono.replace(/\s/g, ""),
          ...readUtms(),
        }),
      });
      if (!resp.ok) throw new Error("submit_failed");
      track("form_submit", {
        form: "fusion",
        deudas_consumo: state.deudas_consumo,
        tiene_hipoteca: state.tiene_hipoteca,
        situacion_laboral: state.situacion_laboral,
      });
      try {
        window.sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      setSuccess(true);
      scrollCardIntoView();
    } catch {
      setSubmitError(
        "No hemos podido enviar tu solicitud. Vuelve a intentarlo en un momento o escríbenos a hola@formulahogar.com.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="estudio" className={`scroll-mt-20 py-20 sm:py-32 ${SCREEN}`}>
      <Container inset className="grid gap-14 lg:grid-cols-[1fr_minmax(0,500px)] lg:items-center lg:gap-20">
        <div>
          <SectionMark />
          <h2 className="v2-display v2-h2 mt-7 max-w-[13ch]">Pide tu estudio de Fusión.</h2>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-[#545454]">
            Cuéntanos tu situación en un minuto. Un asesor revisa tus números y te llama para explicarte cuánto bajaría tu
            cuota y cuánto cuesta.
          </p>

          <div className="mt-12 max-w-md">
            <p className="text-sm font-semibold">Para el estudio te pediremos:</p>
            <ul className="mt-4 border-t border-[#141313]">
              {DOCUMENTOS.map((doc, i) => (
                <li
                  key={doc}
                  data-reveal
                  style={{ "--v2-delay": `${i * 80}ms` } as React.CSSProperties}
                  className="flex items-center gap-4 border-b border-[#E8E8E6] py-4 text-base"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2F2F0]">
                    <FileTextIcon size={18} weight="fill" color="#141313" />
                  </span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          ref={cardRef}
          className="scroll-mt-28 rounded-[24px] border border-[#E8E8E6] bg-white p-6 shadow-[0_32px_64px_-36px_rgba(20,19,19,0.35)] sm:p-9"
        >
          {success ? (
            <div className="py-6 text-center" role="status">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#BFFF00]">
                <CheckCircleIcon size={30} weight="fill" color="#141313" />
              </span>
              <h3 className="v2-display v2-h3 mt-6">Recibido. Te llamamos.</h3>
              <p className="mx-auto mt-4 max-w-[36ch] leading-relaxed text-[#545454]">
                Un asesor revisa tus números y te llama para explicarte tu caso. Si tienes a mano nóminas, extractos y el
                recibo de la hipoteca, avanzaremos más rápido.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h3 className="v2-display v2-h3">Tu situación hoy</h3>

              <div className="mt-7">
                <Progress step={step} total={2} names={["Tus números", "Tus datos"]} />
              </div>

              {restored && step === 1 && (
                <p className="mt-6 rounded-[14px] bg-[#F4FFD6] px-4 py-3 text-sm text-[#141313]">
                  Hemos recuperado lo que ya habías rellenado.
                </p>
              )}

              {step === 1 ? (
                <div className="mt-8 space-y-7">
                  <ChipGroup
                    label="¿Tienes hipoteca?"
                    name="tiene_hipoteca"
                    value={state.tiene_hipoteca}
                    onChange={(v) => update("tiene_hipoteca", v)}
                    options={[
                      { value: "si", label: "Sí" },
                      { value: "no", label: "No" },
                    ]}
                    error={errors.tiene_hipoteca}
                  />
                  <RangeField
                    label="Lo que te queda de hipoteca"
                    value={state.hipoteca_pendiente}
                    min={20000}
                    max={500000}
                    step={5000}
                    suffix="€"
                    disabled={state.tiene_hipoteca === "no"}
                    hint={
                      state.tiene_hipoteca === "no"
                        ? "Fusión se apoya en una hipoteca. Igualmente te llamamos y vemos qué opciones tienes."
                        : undefined
                    }
                    onChange={(v) => update("hipoteca_pendiente", v)}
                  />
                  <RangeField
                    label="Deudas de tarjetas, préstamos y coche"
                    value={state.deudas_consumo}
                    min={3000}
                    max={100000}
                    step={1000}
                    suffix="€"
                    onChange={(v) => update("deudas_consumo", v)}
                  />
                  <RangeField
                    label="Lo que pagas al mes entre todo"
                    value={state.cuota_mensual_total}
                    min={300}
                    max={5000}
                    step={50}
                    suffix="€/mes"
                    onChange={(v) => update("cuota_mensual_total", v)}
                  />
                  <ChipGroup
                    label="Situación laboral"
                    name="situacion_laboral"
                    value={state.situacion_laboral}
                    onChange={(v) => update("situacion_laboral", v)}
                    options={SITUACIONES}
                    error={errors.situacion_laboral}
                  />
                  <V2Button type="submit" className="w-full !justify-between">
                    Continuar
                  </V2Button>
                </div>
              ) : (
                <div className="mt-8 space-y-6">
                  <TextField
                    label="Nombre y apellido"
                    autoComplete="name"
                    value={state.nombre}
                    onChange={(v) => update("nombre", v)}
                    error={errors.nombre}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={state.email}
                    onChange={(v) => update("email", v)}
                    error={errors.email}
                  />
                  <TextField
                    label="Teléfono"
                    type="tel"
                    autoComplete="tel-national"
                    inputMode="tel"
                    prefix="+34"
                    value={state.telefono}
                    onChange={(v) => update("telefono", v)}
                    error={errors.telefono}
                    hint="Te llamamos a este número para explicarte el estudio."
                  />

                  <div>
                    <label className="flex items-start gap-3 text-sm leading-relaxed text-[#545454]">
                      <input
                        type="checkbox"
                        checked={state.consentimiento}
                        onChange={(e) => update("consentimiento", e.target.checked)}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-[#141313]"
                        aria-invalid={!!errors.consentimiento}
                      />
                      <span>
                        Acepto la{" "}
                        <a
                          href="/politicas#privacidad"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#141313] underline underline-offset-2"
                        >
                          política de privacidad
                        </a>{" "}
                        y que FórmulaHogar me contacte sobre mi estudio.
                      </span>
                    </label>
                    {errors.consentimiento && <FieldError>{errors.consentimiento}</FieldError>}
                  </div>

                  {submitError && (
                    <p role="alert" className="rounded-[14px] bg-[#FDECEA] px-4 py-3 text-sm text-[#7A271A]">
                      {submitError}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex min-h-[52px] items-center gap-1.5 rounded-full border border-[#D6D6D6] px-5 text-sm font-semibold text-[#141313] transition-colors hover:border-[#141313]"
                    >
                      <ArrowLeftIcon size={16} weight="bold" />
                      Atrás
                    </button>
                    <V2Button
                      type="submit"
                      disabled={submitting}
                      arrow={!submitting}
                      className="flex-1 !justify-between disabled:cursor-progress"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <CircleNotchIcon size={18} weight="bold" className="motion-safe:animate-spin" />
                          Enviando…
                        </span>
                      ) : (
                        "Quiero mi estudio"
                      )}
                    </V2Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
