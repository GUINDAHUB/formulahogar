import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tu vivienda accesible",
  description: "Conviértete en propietario con solo un 5% de entrada. Fórmula Hogar hace realidad tu primera vivienda sin la barrera del 30%.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-PT7S8BNB" />
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId="G-515250967" />
      </body>
    </html>
  );
}
