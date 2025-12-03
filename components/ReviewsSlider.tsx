"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const originalReviews = [
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

// Duplicate reviews to create an "effectively infinite" list
// 20 copies = 60 items. Enough for most sessions.
const reviews = Array(20).fill(originalReviews).flat();

const ReviewsSlider = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Start in the middle to allow scrolling left
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.clientWidth / (window.innerWidth < 768 ? 1 : 3);
      // Center roughly in the middle of the array
      const startItemIndex = Math.floor(reviews.length / 2) - (Math.floor(reviews.length / 2) % 3);
      
      // Immediate jump to middle, no smooth behavior yet
      container.scrollTo({ left: startItemIndex * itemWidth });
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isMobile = window.innerWidth < 768;
      const itemsVisible = isMobile ? 1 : 3;
      const itemWidth = container.clientWidth / itemsVisible;
      
      const scrollAmount = itemWidth; 
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const isMobile = window.innerWidth < 768;
    const itemsVisible = isMobile ? 1 : 3;
    const itemWidth = container.clientWidth / itemsVisible;
    
    // Calculate which "original" index is currently active
    const currentScroll = container.scrollLeft;
    const rawIndex = Math.round(currentScroll / itemWidth);
    const normalizedIndex = rawIndex % originalReviews.length;
    
    setActiveIndex(normalizedIndex);
  };

  return (
    <div className="relative w-full max-w-[1400px] mx-auto">
      {/* Arrows - Desktop Only - Always Visible */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl items-center justify-center text-[#163C2E] hover:bg-[#163C2E] hover:text-white transition-all duration-300 border border-slate-100"
        aria-label="Anterior testimonio"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl items-center justify-center text-[#163C2E] hover:bg-[#163C2E] hover:text-white transition-all duration-300 border border-slate-100"
        aria-label="Siguiente testimonio"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Gradient Masks for Desktop (Blur effect on edges) - Using #F8FAFC to match parent background */}
      <div className="hidden md:block absolute top-0 -left-8 w-40 h-full bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-10 pointer-events-none"></div>
      <div className="hidden md:block absolute top-0 -right-8 w-40 h-full bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-10 pointer-events-none"></div>

      {/* Slider Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x pb-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review, idx) => (
          <div 
            key={idx} 
            className="flex-none w-full md:w-1/3 snap-center p-4"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-yellow-400">
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                </div>
                <p className="text-slate-600 mb-6 italic text-lg">"{review.text}"</p>
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t border-slate-50 mt-auto">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-lg shadow-green-900/10 relative">
                  {review.image ? (
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-400 font-bold text-xl">{review.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#163C2E] text-lg">{review.name}</p>
                  <p className="text-xs text-[#28A77D] font-bold uppercase tracking-wide">{review.tag}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Dots Pagination */}
      <div className="flex md:hidden justify-center gap-2 mt-4">
        {originalReviews.map((_, idx) => (
          <div 
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex ? 'w-8 bg-[#28A77D]' : 'w-2 bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsSlider;
