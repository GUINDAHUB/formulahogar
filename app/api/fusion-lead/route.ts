import { NextResponse } from "next/server";
import axios from "axios";

// Webhook de n8n para leads de Fusión. Mientras no exista uno propio, cae en
// el de hipotecas; el payload lleva source "landing_fusion" para distinguirlo.
const N8N_FUSION_WEBHOOK_URL =
  process.env.N8N_FUSION_WEBHOOK_URL ??
  process.env.N8N_HIPOTECAS_WEBHOOK_URL ??
  "https://n8n.srv954356.hstgr.cloud/webhook/hipotecas";

// Fusión entra en el mismo tablero que las hipotecas (lista HIPOTECAS).
const CLICKUP_FUSION_LIST_ID =
  process.env.CLICKUP_FUSION_LIST_ID ??
  process.env.CLICKUP_HIPOTECAS_LIST_ID ??
  "901523702027";
const CLICKUP_API_BASE = "https://api.clickup.com/api/v2";

// Campos personalizados de la lista HIPOTECAS.
const CF = {
  telefono: "311982b6-2fb3-4da6-a439-466cf30b184e", // TELEFONO - FH
  mail: "31ff7931-17cc-429d-83cb-f617181f36cc", // MAIL - FH
  situacionLaboral: "26e739a1-de77-4878-bb6f-d0ce4bb42011", // SITUACION LABORAL - FH
  estado: "96b74523-a17c-4ef1-9ca3-45cf222ebe02", // ESTADO - FH
  fechaFormulario: "d946f796-31c9-4c87-9497-25d1297d8a7b", // FECHA DE FORMULARIO
} as const;

const ESTADO_NUEVO_LEAD = "231ad014-ef11-4b91-8f76-967c2d109ee6";

const SITUACION_LABEL: Record<string, string> = {
  empleado: "Empleado",
  funcionario: "Funcionario",
  autonomo: "Autónomo",
  otros: "Otros",
};

interface LeadPayload {
  tiene_hipoteca?: "si" | "no";
  hipoteca_pendiente?: number;
  deudas_consumo?: number;
  cuota_mensual_total?: number;
  situacion_laboral?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  consentimiento?: boolean;
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
    "Lead de FUSIÓN recibido desde formulahogar.com/fusion",
    "",
    `Nombre: ${lead.nombre ?? "—"}`,
    `Teléfono: ${phone}`,
    `Email: ${lead.email ?? "—"}`,
    "",
    `Tiene hipoteca: ${lead.tiene_hipoteca === "si" ? "Sí" : lead.tiene_hipoteca === "no" ? "No" : "—"}`,
    `Hipoteca pendiente: ${formatEUR(lead.hipoteca_pendiente)}`,
    `Deudas de consumo: ${formatEUR(lead.deudas_consumo)}`,
    `Paga al mes entre todo: ${formatEUR(lead.cuota_mensual_total)}`,
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
  if (lead.situacion_laboral) {
    customFields.push({
      id: CF.situacionLaboral,
      value: SITUACION_LABEL[lead.situacion_laboral] ?? lead.situacion_laboral,
    });
  }

  const resp = await axios.post(
    `${CLICKUP_API_BASE}/list/${CLICKUP_FUSION_LIST_ID}/task`,
    {
      name: `FUSIÓN · ${(lead.nombre ?? "").trim()} · ${phone}`,
      description: buildDescription(lead, phone, submittedAt),
      status: "pendiente",
      start_date: new Date(submittedAt).getTime(),
      start_date_time: true,
      custom_fields: customFields,
    },
    { headers: { Authorization: apiKey, "Content-Type": "application/json" } },
  );

  return { id: resp.data.id, url: resp.data.url };
}

async function sendWebhook(payload: Record<string, unknown>) {
  const resp = await fetch(N8N_FUSION_WEBHOOK_URL, {
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

  let clickupTask: { id: string; url: string } | null = null;
  let clickupError: string | null = null;
  try {
    clickupTask = await createClickUpTask(body, normalizedPhone, submittedAt);
    console.log(`[fusion-lead] ✓ Tarea ClickUp creada ${clickupTask.id}`);
  } catch (err) {
    clickupError = axios.isAxiosError(err)
      ? JSON.stringify(err.response?.data ?? err.message)
      : err instanceof Error
        ? err.message
        : String(err);
    console.error("[fusion-lead] ✗ Error creando tarea en ClickUp:", clickupError);
  }

  const payload = {
    source: "landing_fusion",
    producto: "fusion",
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
    console.error("[fusion-lead] ✗ Error enviando webhook:", err);
  }

  if (!clickupTask && !webhookOk) {
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true, clickup_task_id: clickupTask?.id ?? null });
}
