import type { Metadata } from "next";

// Rediseño en paralelo para revisión: fuera de buscadores hasta el OK.
export const metadata: Metadata = {
  title: "FórmulaHogar — Tu hipoteca, en las mejores manos (v2)",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
