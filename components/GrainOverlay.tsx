"use client";

import { useRef, useEffect } from 'react';

const GrainOverlay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastDraw = 0;
    const FPS_INTERVAL = 1000 / 12; // ~12fps is enough for grain

    const drawGrain = (timestamp: number) => {
      animationId = requestAnimationFrame(drawGrain);
      if (timestamp - lastDraw < FPS_INTERVAL) return;
      lastDraw = timestamp;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;

      canvas.width = w;
      canvas.height = h;

      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    animationId = requestAnimationFrame(drawGrain);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] h-full w-full pointer-events-none opacity-[0.07]"
    />
  );
};

export default GrainOverlay;
