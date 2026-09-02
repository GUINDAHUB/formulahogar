import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tus resultados — FórmulaHogar",
  alternates: {
    canonical: "https://formulahogar.com/gracias",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function GraciasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
