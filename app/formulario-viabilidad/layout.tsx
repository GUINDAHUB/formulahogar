import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
    title: 'Formulario de Viabilidad - Fórmula Hogar',
    alternates: {
        canonical: 'https://formulahogar.com/formulario-viabilidad',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
