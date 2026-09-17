import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Reserva tu llamada con Fórmula Hogar — 10 minutos, sin compromiso";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tarjeta que se ve al compartir formulahogar.com/reservar en redes y WhatsApp.
export default async function Image() {
  const pub = (file: string) => readFile(join(process.cwd(), "public", file));
  // Satori no soporta fuentes variables: usamos instancias estáticas.
  const [display, body, bodySemi, logo, icon] = await Promise.all([
    pub("fonts/og/LibreBaskerville-Bold.woff"),
    pub("fonts/og/Manrope-Regular.woff"),
    pub("fonts/og/Manrope-SemiBold.woff"),
    pub("brand/logo-negative.png"),
    pub("brand/icon-color.png"),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#141313",
          color: "#FFFFFF",
          fontFamily: "Manrope",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Columna de texto */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 760,
            height: "100%",
          }}
        >
          <img src={logoSrc} width={288} height={54} alt="" />

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 22,
                fontWeight: 600,
                color: "#141313",
                background: "#BFFF00",
                padding: "10px 20px",
                borderRadius: 999,
                alignSelf: "flex-start",
                letterSpacing: "-0.01em",
              }}
            >
              Llamada de 10 minutos · Sin compromiso
            </div>
            <div
              style={{
                fontFamily: "Libre Baskerville",
                fontWeight: 700,
                fontSize: 78,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Reserva</span>
              <span>tu llamada</span>
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.4,
                color: "#D6D6D6",
                maxWidth: 640,
              }}
            >
              Elige el hueco que mejor te venga y vemos cómo conseguirte tu casa.
            </div>
          </div>

          <div style={{ fontSize: 22, color: "#9D9D9D" }}>formulahogar.com/reservar</div>
        </div>

        {/* Icono de marca a la derecha */}
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 135,
            display: "flex",
            width: 360,
            height: 360,
            borderRadius: 64,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(191,255,0,0.18)",
          }}
        >
          <img src={iconSrc} width={360} height={360} alt="" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Libre Baskerville", data: display, style: "normal", weight: 700 },
        { name: "Manrope", data: body, style: "normal", weight: 400 },
        { name: "Manrope", data: bodySemi, style: "normal", weight: 600 },
      ],
    },
  );
}
