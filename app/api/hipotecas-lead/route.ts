import { NextResponse } from "next/server";

// TODO: mover a una env var (N8N_HIPOTECAS_WEBHOOK_URL) cuando esté
// el workflow n8n específico de hipotecas. Por ahora reutilizamos
// el mismo host de n8n que ya usa /api/viability.
const N8N_HIPOTECAS_WEBHOOK_URL =
  process.env.N8N_HIPOTECAS_WEBHOOK_URL ??
  "https://n8n.srv954356.hstgr.cloud/webhook-test/hipotecas";

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

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const {
    nombre,
    email,
    telefono,
    consentimiento,
  } = body;

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

  const payload = {
    source: "landing_hipotecas",
    submitted_at: new Date().toISOString(),
    ...body,
    telefono: normalizedPhone,
  };

  try {
    const resp = await fetch(N8N_HIPOTECAS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      console.warn(
        `[hipotecas-lead] webhook n8n respondió ${resp.status}`,
        await resp.text().catch(() => ""),
      );
      // No bloqueamos el lead por un fallo del webhook.
    }
  } catch (err) {
    console.error("[hipotecas-lead] error enviando webhook:", err);
    // No bloqueamos el lead por un error de red al webhook.
  }

  return NextResponse.json({ success: true });
}
