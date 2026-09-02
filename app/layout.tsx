import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

const BASE_URL = "https://formulahogar.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "FórmulaHogar — Tu hipoteca, en las mejores manos",
  description: "Negociamos con más de 20 bancos para conseguirte la mejor hipoteca del mercado. Precio fijo, sin sorpresas. Análisis gratuito en 48h.",
  applicationName: "FórmulaHogar",
  category: "finance",
  // Canonical de la home; cada página indexable lo sobrescribe en su layout.
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "FórmulaHogar — Tu hipoteca, en las mejores manos",
    description: "Tu mejor hipoteca, negociada por nosotros. Precio fijo, sin sorpresas. Respuesta en 48h.",
    url: "https://formulahogar.com/",
    siteName: "FórmulaHogar",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-documentacion.jpg",
        width: 1200,
        height: 675,
        alt: "FórmulaHogar — Tu propio hogar, es posible",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FórmulaHogar — Tu hipoteca, en las mejores manos",
    description: "Tu mejor hipoteca, negociada por nosotros. Precio fijo, sin sorpresas. Respuesta en 48h.",
    images: ["/og-documentacion.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon-apple-touch-icon.png',
  },
};

// Entidad de marca para buscadores y motores generativos (SEO/GEO).
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "FinancialService"],
  "@id": `${BASE_URL}/#organization`,
  name: "FórmulaHogar",
  alternateName: "Fórmula Hogar",
  url: `${BASE_URL}/`,
  logo: `${BASE_URL}/brand/icon-social.png`,
  image: `${BASE_URL}/og-documentacion.jpg`,
  slogan: "Tu propio hogar, es posible",
  description:
    "Intermediaria de Crédito Inmobiliario certificada por el Banco de España (registro E783). Negocia hipotecas con más de 20 bancos a precio fijo y ofrece fórmulas alternativas de acceso a la vivienda como el alquiler con opción a compra y la cesión de uso.",
  areaServed: {
    "@type": "Country",
    name: "España",
  },
  knowsAbout: [
    "Hipotecas",
    "Intermediación de crédito inmobiliario",
    "Alquiler con opción a compra",
    "Cesión de uso",
    "Acceso a la primera vivienda",
  ],
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "Registro oficial",
    name: "Intermediaria de Crédito Inmobiliario — Banco de España, registro E783",
    recognizedBy: {
      "@type": "GovernmentOrganization",
      name: "Banco de España",
      url: "https://www.bde.es/",
    },
  },
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "FórmulaHogar",
  url: `${BASE_URL}/`,
  inLanguage: "es-ES",
  publisher: { "@id": `${BASE_URL}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-PT7S8BNB" />
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        {children}
        <GoogleAnalytics gaId="G-515250967" />
      </body>
    </html>
  );
}
