import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/hooks';

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
}

/** Lightweight floating gold particles on a canvas. Pauses off-screen. */
export function GoldDust({ density = 45, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      const count = Math.round((density * (w * h)) / (390 * 844));
      motes = Array.from({ length: Math.max(12, Math.min(count, 120)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.9,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.12 - Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
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

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (move) {
          m.x += m.vx + Math.sin(m.phase) * 0.12;
          m.y += m.vy;
          m.phase += m.speed;
          if (m.y < -6) {
            m.y = h + 6;
            m.x = Math.random() * w;
          }
        }
        const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(m.phase * 2));
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        g.addColorStop(0, `rgba(255, 228, 150, ${a})`);
        g.addColorStop(1, 'rgba(255, 200, 90, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
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
  }, [density, reduced]);

  return <canvas ref={ref} className={`gold-dust ${className}`} aria-hidden="true" />;
}
