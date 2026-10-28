import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fusión — FórmulaHogar | Todas tus deudas, en una sola cuota más baja (v2)",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://formulahogar.com/fusion" },
};

export default function V2FusionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
