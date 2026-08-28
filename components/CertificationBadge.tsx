import React from 'react';
import Image from 'next/image';

interface CertificationBadgeProps {
    /** 'dark' para fondos oscuros (logo en blanco, texto claro) */
    variant?: 'light' | 'dark';
    /** Píldora con borde y blur para colocarlo sobre heros con imagen */
    framed?: boolean;
    className?: string;
}

const CertificationBadge = ({
    variant = 'light',
    framed = false,
    className = '',
}: CertificationBadgeProps) => {
    const isDark = variant === 'dark';

    return (
        <div
            className={[
                'inline-flex items-center gap-3',
                framed &&
                    'rounded-xl border border-[#141313]/10 bg-white/70 px-4 py-2.5 backdrop-blur-sm shadow-sm',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <Image
                src="/brand/banco-de-espana.webp"
                alt="Banco de España"
                width={3840}
                height={838}
                className={`h-6 w-auto ${isDark ? 'brightness-0 invert' : ''}`}
            />
            <span
                aria-hidden
                className={`h-8 w-px ${isDark ? 'bg-white/20' : 'bg-[#141313]/15'}`}
            />
            <p
                className={`text-left text-xs leading-snug ${
                    isDark ? 'text-[#9D9D9D]' : 'text-[#545454]'
                }`}
            >
                Certificada como Intermediaria
                <br />
                de Crédito Inmobiliario{' '}
                <span className={`font-bold ${isDark ? 'text-white' : 'text-[#141313]'}`}>
                    E783
                </span>
            </p>
        </div>
    );
};

export default CertificationBadge;
