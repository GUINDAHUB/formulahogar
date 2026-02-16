import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
    title: 'Formulario de Viabilidad - Fórmula Hogar',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
