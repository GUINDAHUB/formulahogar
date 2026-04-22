"use client";

import React from 'react';
import { Star } from '@phosphor-icons/react';

const reviews = [
  {
    name: "Carlos y María",
    age: "28 y 30 años",
    text: "Llevábamos años pagando un alquiler altísimo y no podíamos ahorrar para la entrada. Fórmula Hogar nos permitió comprar nuestro piso. Ahora pagamos nuestra propia hipoteca.",
    tag: "Compraron en Madrid",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Laura D.",
    age: "26 años",
    text: "Pensaba que comprar sola era imposible. Con mis ahorros solo cubría el 7%. Gracias al adelanto de rentas, firmé la semana pasada. ¡Increíble!",
    tag: "Compró en Valencia",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
  },
  {
    name: "Javier M.",
    age: "34 años",
    text: "La transparencia es total. Te explican que cedes el uso unos años, pero la casa ES TUYA desde el notario. Es la decisión financiera más inteligente que he tomado.",
    tag: "Compró en Málaga",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
  }
];

// Duplicate enough times for seamless infinite scroll
const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];

const ReviewsSlider = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused]"
      >
        {duplicatedReviews.map((review, idx) => (
          <div
            key={idx}
            className="flex-none w-[340px] md:w-[400px] p-3"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#D6D6D6] hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-yellow-400">
                  <Star size={18} weight="fill" />
                  <Star size={18} weight="fill" />
                  <Star size={18} weight="fill" />
                  <Star size={18} weight="fill" />
                  <Star size={18} weight="fill" />
                </div>
                <p className="text-[#545454] mb-6 italic text-lg">&ldquo;{review.text}&rdquo;</p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#EBEBEB] mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#D6D6D6] overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#9D9D9D] font-bold text-xl">{review.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#141313] text-lg">{review.name}</p>
                  <p className="text-xs text-[#545454] font-bold uppercase tracking-wide">{review.tag}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSlider;
