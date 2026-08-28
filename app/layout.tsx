import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: "FórmulaHogar — Tu hipoteca, en las mejores manos",
  description: "Negociamos con más de 20 bancos para conseguirte la mejor hipoteca del mercado. Precio fijo, sin sorpresas. Análisis gratuito en 48h.",
  openGraph: {
    title: "FórmulaHogar — Tu hipoteca, en las mejores manos",
    description: "Tu mejor hipoteca, negociada por nosotros. Precio fijo, sin sorpresas. Respuesta en 48h.",
    url: "https://formulahogar.com/",
    siteName: "FórmulaHogar",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FórmulaHogar — Tu hipoteca, en las mejores manos",
    description: "Tu mejor hipoteca, negociada por nosotros. Precio fijo, sin sorpresas. Respuesta en 48h.",
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon-apple-touch-icon.png',
  },
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
        {children}
        <GoogleAnalytics gaId="G-515250967" />
      </body>
    </html>
  );
}
