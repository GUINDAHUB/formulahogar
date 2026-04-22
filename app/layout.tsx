import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: "FórmulaHogar — Tu propio hogar, es posible",
  description: "Conviértete en propietario con solo un 5% de entrada. Fórmula Hogar hace realidad tu primera vivienda sin la barrera del 30%.",
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
