import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/hooks';

interface Petal {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  flip: number;
  vFlip: number;
  color: string;
}

/** Lightweight floating royal rose petals on a canvas. */
export function FallingPetals({ count = 28, className = '' }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let petals: Petal[] = [];
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const colors = [
      'rgba(195, 25, 45, 0.75)',
      'rgba(165, 15, 36, 0.7)',
      'rgba(215, 45, 65, 0.65)',
      'rgba(240, 180, 80, 0.55)', // golden marigold petal accent
      'rgba(140, 10, 25, 0.8)',
    ];

    const seed = () => {
      petals = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 9 + Math.random() * 11,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.6 + Math.random() * 0.9,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        flip: Math.random() * Math.PI,
        vFlip: 0.015 + Math.random() * 0.025,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(1, Math.cos(p.flip));

      // Draw curved rose petal shape
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.7, p.size * 0.6, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Delicate petal vein highlight
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.7);
      ctx.lineTo(0, p.size * 0.6);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    };

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        if (move) {
          p.x += p.vx + Math.sin(p.flip) * 0.5;
          p.y += p.vy;
          p.rotation += p.vRot;
          p.flip += p.vFlip;

          if (p.y > h + 20) {
            p.y = -20;
            p.x = Math.random() * w;
          }
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
        }
        drawPetal(p);
      }
    };

    const loop = () => {
      if (visible) draw(true);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    if (reduced) draw(false);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [count, reduced]);

  return <canvas ref={ref} className={`falling-petals ${className}`} aria-hidden="true" />;
}
