import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import "@mux/mux-player/themes/minimal";
import { Users, Wallet, Key, Home } from 'lucide-react';

const VideoSection = () => {
  const PLAYBACK_ID = 'czeaHqPGSfWr8YI5GlkdkyGrtCfOGyPDIR28C27q9Ds';

  const steps = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "1. Análisis",
      desc: "Analizamos tu perfil con un broker aliado para confirmar tu capacidad de hipoteca futura."
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "2. Financiación",
      desc: "Adelantamos las rentas futuras (2-3 años) para cubrir el 20-25% de la entrada que te falta."
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "3. Firma y Compra",
      desc: "Firmas en notaría. Eres propietario legal al 100% desde este mismo instante."
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "4. Tu Hogar",
      desc: "Tras el periodo de cesión (donde se amortiza la entrada), entras a vivir en tu casa."
    }
  ];

  return (
    <section id="cómo-funciona" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#163C2E]/5 to-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#28A77D]/30 to-transparent" />
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-[#28A77D]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 -left-20 w-64 h-64 bg-[#163C2E]/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#28A77D]/10 text-[#163C2E] text-xs font-bold mb-6 uppercase tracking-wider border border-[#28A77D]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28A77D] animate-pulse"></span>
            Descubre el proceso
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#163C2E] mb-6 tracking-tight">
            Así funciona tu camino hacia <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#163C2E] to-[#28A77D]">
              la propiedad real
            </span>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            En menos de 2 minutos te explicamos cómo convertimos tu alquiler en ahorro para la entrada. Sin letra pequeña.
          </p>
        </div>

        {/* Player Wrapper */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative group rounded-2xl p-2 bg-white/50 border border-white/60 shadow-2xl shadow-[#163C2E]/10 backdrop-blur-sm">
            <div className="rounded-xl overflow-hidden bg-slate-900 relative aspect-video w-full">
              <style dangerouslySetInnerHTML={{__html: `
                /* Ocultar elementos de la interfaz estándar que no queremos */
                .instaplay-theme::part(bottom-play-button),
                .instaplay-theme::part(fullscreen-button),
                .instaplay-theme::part(time-display) {
                  display: none !important;
                }

                /* Barra de tiempo estilo Instagram (arriba y fina) */
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
                  --media-range-thumb-width: 0; /* Ocultar la bolita del slider */
                }

                /* FORZAR VISIBILIDAD DEL BOTÓN DE PLAY CENTRAL EN TEMA MINIMAL */
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
                /*theme="minimal"*/
                streamType="on-demand"
                playbackId={PLAYBACK_ID}
                metadata={{
                  video_title: 'Cómo funciona Fórmula Hogar',
                }}
                primaryColor="#FFFFFF"
                secondaryColor="#000000"
                accentColor="#28A77D"
                style={{ height: '100%', width: '100%' }}
                thumbnailTime={0}
              />
            </div>
            
            {/* Decorative corner accents - Pointer events none es CRUCIAL aquí */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-[#28A77D]/30 rounded-tl-2xl pointer-events-none"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-[#28A77D]/30 rounded-br-2xl pointer-events-none"></div>
          </div>
        </div>

        {/* Integrated Roadmap Blocks */}
        <div className="relative max-w-6xl mx-auto">
            {/* Line connector for desktop */}
            <div className="hidden md:block absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#28A77D]/30 to-transparent -z-10"></div>

            <div className="grid md:grid-cols-4 gap-6 relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-white/80 shadow-lg shadow-emerald-900/5 text-center group hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#163C2E] to-[#0f291e] rounded-full flex items-center justify-center text-white mb-5 shadow-lg shadow-green-900/20 group-hover:shadow-[#28A77D]/40 group-hover:scale-110 transition-all duration-300 border border-[#28A77D]/20">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#163C2E] mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default VideoSection;
