"use client";

import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import "@mux/mux-player/themes/minimal";
import { Users, Wallet, Key, House } from '@phosphor-icons/react';
import GrainOverlay from '@/components/GrainOverlay';

interface Step {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface VideoSectionProps {
  playbackId?: string;
  steps?: Step[];
}

const VideoSection = ({
  playbackId = '02LkyVlxls01u2OFEyVqk00ZLuMVNM9FxaBtAfSNQcVr02g',
  steps = [
    {
      icon: <Users size={24} weight="fill" />,
      title: "1. Análisis",
      desc: "Analizamos tu perfil con un broker aliado para confirmar tu capacidad de hipoteca futura."
    },
    {
      icon: <Wallet size={24} weight="fill" />,
      title: "2. Financiación",
      desc: "Adelantamos las rentas futuras (2-3 años) para cubrir el 20-25% de la entrada que te falta."
    },
    {
      icon: <Key size={24} weight="fill" />,
      title: "3. Firma y Compra",
      desc: "Firmas en notaría. Eres propietario legal al 100% desde este mismo instante."
    },
    {
      icon: <House size={24} weight="fill" />,
      title: "4. Tu Hogar",
      desc: "Tras el periodo de cesión (donde se amortiza la entrada), entras a vivir en tu casa."
    }
  ]
}: VideoSectionProps) => {

  return (
    <section id="cómo-funciona" className="py-28 relative overflow-hidden bg-white">
      <GrainOverlay />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9D9D9D] mb-4">Descubre el proceso</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#141313] mb-6 tracking-tight">
            Así funciona tu camino <br className="hidden sm:block" />
            hacia la <span className="underline decoration-[#BFFF00] decoration-[5px] underline-offset-4">propiedad real</span>
          </h2>
          <p className="text-[#545454] text-lg leading-relaxed">
            En menos de 2 minutos te explicamos cómo convertimos tu alquiler en ahorro para la entrada. Sin letra pequeña.
          </p>
        </div>

        {/* Player Wrapper */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative group rounded-2xl p-2 bg-[#EBEBEB]/50 border border-[#D6D6D6]/60 shadow-2xl shadow-black/5">
            <div className="rounded-xl overflow-hidden bg-[#141313] relative aspect-video w-full">
              <style dangerouslySetInnerHTML={{
                __html: `
                .instaplay-theme::part(bottom-play-button),
                .instaplay-theme::part(fullscreen-button),
                .instaplay-theme::part(time-display) {
                  display: none !important;
                }
                .instaplay-theme::part(time-range) {
                  position: absolute !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100% !important;
                  height: 4px !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  z-index: 100 !important;
                  --media-range-track-height: 4px;
                  --media-range-thumb-width: 0;
                }
                mux-player::part(center-play-button) {
                  display: flex !important;
                  opacity: 1 !important;
                  visibility: visible !important;
                  --media-button-icon-width: 60px;
                  --media-button-icon-height: 60px;
                  background: rgba(0,0,0,0.3);
                  border-radius: 50%;
                  backdrop-filter: blur(4px);
                }
              `}} />

              <MuxPlayer
                className="instaplay-theme"
                streamType="on-demand"
                playbackId={playbackId}
                metadata={{
                  video_title: 'Cómo funciona Fórmula Hogar',
                }}
                primaryColor="#FFFFFF"
                secondaryColor="#000000"
                accentColor="#BFFF00"
                style={{ height: '100%', width: '100%' }}
                thumbnailTime={0}
              />
            </div>
          </div>
        </div>

        {/* Integrated Roadmap Blocks */}
        <div className="relative max-w-6xl mx-auto">
          {/* Line connector for desktop */}
          <div className="hidden md:block absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D6D6D6] to-transparent -z-10"></div>

          <div className="grid md:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-[#D6D6D6] shadow-sm text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 mx-auto bg-[#141313] rounded-full flex items-center justify-center text-white mb-5 shadow-lg group-hover:bg-[#BFFF00] group-hover:text-[#141313] group-hover:scale-110 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-[#141313] mb-2">{step.title}</h3>
                <p className="text-sm text-[#545454] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default VideoSection;
