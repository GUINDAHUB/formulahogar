import { NextResponse } from "next/server";
import axios from "axios";

// Webhook de producción de n8n para leads de hipotecas.
// Se puede sobreescribir con la env var N8N_HIPOTECAS_WEBHOOK_URL.
const N8N_HIPOTECAS_WEBHOOK_URL =
  process.env.N8N_HIPOTECAS_WEBHOOK_URL ??
  "https://n8n.srv954356.hstgr.cloud/webhook/hipotecas";

// Lista HIPOTECAS del espacio FORMULA HOGAR en ClickUp.
// Se puede sobreescribir con la env var CLICKUP_HIPOTECAS_LIST_ID.
const CLICKUP_HIPOTECAS_LIST_ID =
  process.env.CLICKUP_HIPOTECAS_LIST_ID ?? "901523702027";
const CLICKUP_API_BASE = "https://api.clickup.com/api/v2";

// IDs de los campos personalizados de la lista HIPOTECAS.
const CF = {
  telefono: "311982b6-2fb3-4da6-a439-466cf30b184e", // TELEFONO - FH
  mail: "31ff7931-17cc-429d-83cb-f617181f36cc", // MAIL - FH
  precioVivienda: "eea5e488-436b-49f4-8c5b-f4d78a4d796f", // PRECIO VIVIENDA - FH
  ingresos: "cd003ced-6f72-4e71-b2fd-66b4798573fe", // INGRESOS - FH
  situacionLaboral: "26e739a1-de77-4878-bb6f-d0ce4bb42011", // SITUACION LABORAL - FH
  fase: "c9e9e62f-5cef-49ca-ab0a-5a0eabe8f1c7", // ¿EN QUE FASE ESTAS? - FH
  estado: "96b74523-a17c-4ef1-9ca3-45cf222ebe02", // ESTADO - FH
  fechaFormulario: "d946f796-31c9-4c87-9497-25d1297d8a7b", // FECHA DE FORMULARIO
} as const;

// Opción "NUEVO LEAD" del dropdown ESTADO - FH.
const ESTADO_NUEVO_LEAD = "231ad014-ef11-4b91-8f76-967c2d109ee6";

// Valor del formulario -> opción del dropdown ¿EN QUE FASE ESTAS? - FH.
// "mejorar_hipoteca" no tiene opción equivalente; queda solo en la descripción.
const FASE_OPTION: Record<string, string> = {
  buscando: "ff16d626-0bfc-4b6c-8710-a2720b198eb0", // ESTOY BUSCANDO
  casa_elegida: "9a35e1f7-2536-4bb8-8c69-de7ae7367da1", // TENGO LA VIVIENDA RESERVADA
  arras_firmadas: "509f853e-8a63-4d00-a7f6-2d7810b497e1", // HE FIRMADO ARRAS
};

const FASE_LABEL: Record<string, string> = {
  buscando: "Buscando casa",
  casa_elegida: "Casa elegida",
  arras_firmadas: "Arras firmadas",
  mejorar_hipoteca: "Mejorar hipoteca actual",
};

const SITUACION_LABEL: Record<string, string> = {
  empleado: "Empleado",
  autonomo: "Autónomo",
  funcionario: "Funcionario",
  mixto: "Mixto",
  otros: "Otros",
};

interface LeadPayload {
  // Paso 1
  precio_vivienda?: number;
  fase?: string;
  // Paso 2
  ahorro_disponible?: number;
  ingresos_mensuales?: number;
  situacion_laboral?: string;
  // Paso 3
  nombre?: string;
  email?: string;
  telefono?: string;
  consentimiento?: boolean;
  // UTMs
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeSpanishPhone(raw: string) {
  const cleaned = raw.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (/^[679]\d{8}$/.test(cleaned)) return `+34${cleaned}`;
  return cleaned;
}

const formatEUR = (value?: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(value)
    : "—";

function buildDescription(lead: LeadPayload, phone: string, submittedAt: string) {
  const utms = (
    [
      ["utm_source", lead.utm_source],
      ["utm_medium", lead.utm_medium],
      ["utm_campaign", lead.utm_campaign],
      ["utm_term", lead.utm_term],
      ["utm_content", lead.utm_content],
      ["gclid", lead.gclid],
      ["fbclid", lead.fbclid],
    ] as const
  ).filter(([, v]) => !!v);

  const lines = [
    "Lead recibido desde el formulario de hipotecas de formulahogar.com",
    "",
    `Nombre: ${lead.nombre ?? "—"}`,
    `Teléfono: ${phone}`,
    `Email: ${lead.email ?? "—"}`,
    "",
    `Fase: ${lead.fase ? FASE_LABEL[lead.fase] ?? lead.fase : "—"}`,
    `Precio vivienda: ${formatEUR(lead.precio_vivienda)}`,
    `Ahorro disponible: ${formatEUR(lead.ahorro_disponible)}`,
    `Ingresos mensuales: ${formatEUR(lead.ingresos_mensuales)}`,
    `Situación laboral: ${
      lead.situacion_laboral
        ? SITUACION_LABEL[lead.situacion_laboral] ?? lead.situacion_laboral
        : "—"
    }`,
    "",
    `Fecha de envío: ${submittedAt}`,
  ];

  if (utms.length > 0) {
    lines.push("", "Origen:");
    for (const [k, v] of utms) lines.push(`${k}: ${v}`);
  }

  return lines.join("\n");
}

async function createClickUpTask(
  lead: LeadPayload,
  phone: string,
  submittedAt: string,
): Promise<{ id: string; url: string }> {
  const apiKey = process.env.CLICKUP_API_KEY;
  if (!apiKey) throw new Error("CLICKUP_API_KEY no configurada");

  const customFields: { id: string; value: unknown }[] = [
    { id: CF.telefono, value: phone },
    { id: CF.estado, value: ESTADO_NUEVO_LEAD },
    { id: CF.fechaFormulario, value: submittedAt },
  ];
  if (lead.email) customFields.push({ id: CF.mail, value: lead.email });
  if (typeof lead.precio_vivienda === "number") {
    customFields.push({ id: CF.precioVivienda, value: String(lead.precio_vivienda) });
  }
  if (typeof lead.ingresos_mensuales === "number") {
    customFields.push({ id: CF.ingresos, value: String(lead.ingresos_mensuales) });
  }
  if (lead.situacion_laboral) {
    customFields.push({
      id: CF.situacionLaboral,
      value: SITUACION_LABEL[lead.situacion_laboral] ?? lead.situacion_laboral,
    });
  }
  if (lead.fase && FASE_OPTION[lead.fase]) {
    customFields.push({ id: CF.fase, value: FASE_OPTION[lead.fase] });
  }

  const resp = await axios.post(
    `${CLICKUP_API_BASE}/list/${CLICKUP_HIPOTECAS_LIST_ID}/task`,
    {
      name: `${(lead.nombre ?? "").trim()} · ${phone}`,
      description: buildDescription(lead, phone, submittedAt),
      status: "pendiente",
      custom_fields: customFields,
    },
    { headers: { Authorization: apiKey, "Content-Type": "application/json" } },
  );

  return { id: resp.data.id, url: resp.data.url };
}

async function sendWebhook(payload: Record<string, unknown>) {
  const resp = await fetch(N8N_HIPOTECAS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`webhook n8n respondió ${resp.status} ${text}`);
  }
}

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { nombre, email, telefono, consentimiento } = body;

  if (!nombre || !nombre.trim()) {
    return NextResponse.json({ error: "missing_nombre" }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!telefono) {
    return NextResponse.json({ error: "missing_telefono" }, { status: 400 });
  }
  if (!consentimiento) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  const normalizedPhone = normalizeSpanishPhone(telefono);
  if (!/^\+\d{9,15}$/.test(normalizedPhone)) {
    return NextResponse.json({ error: "invalid_telefono" }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();

  // 1) Crear la tarea en la lista HIPOTECAS de ClickUp.
  let clickupTask: { id: string; url: string } | null = null;
  let clickupError: string | null = null;
  try {
    clickupTask = await createClickUpTask(body, normalizedPhone, submittedAt);
    console.log(`[hipotecas-lead] ✓ Tarea ClickUp creada ${clickupTask.id}`);
  } catch (err) {
    clickupError =
      axios.isAxiosError(err)
        ? JSON.stringify(err.response?.data ?? err.message)
        : err instanceof Error
          ? err.message
          : String(err);
    console.error("[hipotecas-lead] ✗ Error creando tarea en ClickUp:", clickupError);
  }

  // 2) Avisar a n8n con el lead y el resultado de ClickUp.
  const payload = {
    source: "landing_hipotecas",
    submitted_at: submittedAt,
    ...body,
    telefono: normalizedPhone,
    clickup_status: clickupTask ? "success" : "error",
    clickup_task_id: clickupTask?.id ?? null,
    clickup_task_url: clickupTask?.url ?? null,
    clickup_error: clickupError,
  };

  let webhookOk = false;
  try {
    await sendWebhook(payload);
    webhookOk = true;
  } catch (err) {
    console.error("[hipotecas-lead] ✗ Error enviando webhook:", err);
  }

  // Si el lead no ha llegado a ningún sitio, avisamos al usuario.
  if (!clickupTask && !webhookOk) {
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    clickup_task_id: clickupTask?.id ?? null,
  });
}
