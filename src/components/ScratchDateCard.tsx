import { useCallback, useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
import { daysToWedding } from '../lib/content';
import { dateParts } from '../lib/format';
import { gsap, reducedMotion, useGSAP } from '../lib/gsap';
import { SectionTitle } from './Ornaments';
import { Reveal } from './Reveal';

const BRUSH = 26;
const REVEAL_AT = 0.4;

interface ConfettiPiece {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  color: string;
  shape: 'rect' | 'circle' | 'heart' | 'star';
}

function drawHeartPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  const top = y + h * 0.28;
  ctx.moveTo(x, top);
  ctx.bezierCurveTo(x, y - h * 0.05, x - w * 0.52, y - h * 0.05, x - w * 0.52, top);
  ctx.bezierCurveTo(x - w * 0.52, y + h * 0.58, x - w * 0.1, y + h * 0.78, x, y + h * 0.98);
  ctx.bezierCurveTo(x + w * 0.1, y + h * 0.78, x + w * 0.52, y + h * 0.58, x + w * 0.52, top);
  ctx.bezierCurveTo(x + w * 0.52, y - h * 0.05, x, y - h * 0.05, x, top);
  ctx.closePath();
}

function paintCoating(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, w, h);

  // Clip to heart shape
  ctx.save();
  drawHeartPath(ctx, w / 2, 4, w * 0.94, h * 0.95);
  ctx.clip();

  // Luxurious golden foil gradient
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#7a5418');
  g.addColorStop(0.2, '#fbe7a6');
  g.addColorStop(0.4, '#d4ab52');
  g.addColorStop(0.65, '#fff0be');
  g.addColorStop(0.85, '#e9c873');
  g.addColorStop(1, '#664310');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Royal lattice pattern
  ctx.fillStyle = 'rgba(90, 50, 10, 0.22)';
  for (let y = 14; y < h; y += 22) {
    for (let x = (y / 22) % 2 ? 14 : 25; x < w; x += 22) {
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Inner decorative border
  ctx.strokeStyle = 'rgba(120, 80, 20, 0.7)';
  ctx.lineWidth = 3;
  drawHeartPath(ctx, w / 2, 14, w * 0.86, h * 0.87);
  ctx.stroke();

  // Scratch instructions
  ctx.fillStyle = '#540915';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = `bold ${Math.round(w / 14)}px Cinzel, serif`;
  ctx.fillText('SCRATCH THE HEART', w / 2, h / 2 - 16);

  ctx.font = `bold ${Math.round(w / 16)}px "Great Vibes", cursive`;
  ctx.fillStyle = '#7a0e20';
  ctx.fillText('♥ Save Our Date ♥', w / 2, h / 2 + 14);

  ctx.font = `italic ${Math.round(w / 22)}px "Cormorant Garamond", serif`;
  ctx.fillStyle = '#4a0712';
  ctx.fillText('Scratch with finger or mouse', w / 2, h / 2 + 40);

  ctx.restore();
}

/** Scene 5: Royal Heart-Shaped scratch card with single clean couple name, high contrast, and graffiti confetti burst. */
export function ScratchDateCard() {
  const { weddingDate, muhurat, couple } = wedding;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const started = useRef(false);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const days = daysToWedding();

  // Confetti / festive graffiti burst on reveal
  const runConfetti = useCallback(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.parentElement?.clientWidth || 380);
    const h = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const colors = [
      '#e63946', // vibrant crimson
      '#f4a261', // marigold orange
      '#ffd166', // radiant gold
      '#06d6a0', // emerald green
      '#ff70a6', // celebration pink
      '#f6dc95', // metallic gold
      '#ffffff', // bright white
    ];

    const shapes: ('rect' | 'circle' | 'heart' | 'star')[] = ['rect', 'circle', 'heart', 'star'];

    const pieces: ConfettiPiece[] = Array.from({ length: 90 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      return {
        x: w / 2,
        y: h / 2,
        w: 6 + Math.random() * 8,
        h: 10 + Math.random() * 14,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.22,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
    });

    let frame = 0;
    const anim = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;

      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.24; // gravity
        p.vx *= 0.98; // air resistance
        p.rot += p.vRot;

        if (p.y < h + 20) alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'heart') {
          ctx.scale(0.65, 0.65);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-6, -8, -12, -2, 0, 10);
          ctx.bezierCurveTo(12, -2, 6, -8, 0, 0);
          ctx.fill();
        } else {
          // Star
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * 8, -Math.sin(((18 + i * 72) * Math.PI) / 180) * 8);
            ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * 4, -Math.sin(((54 + i * 72) * Math.PI) / 180) * 4);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      if (alive && frame++ < 160) {
        requestAnimationFrame(anim);
      }
    };

    anim();
  }, []);

  // Reveal moment: foil dissolves, date pops, graffiti confetti bursts!
  useGSAP(
    () => {
      if (!revealed) return;
      const q = gsap.utils.selector(cardRef);
      runConfetti();

      if (reducedMotion()) {
        gsap.set(q('.scratch-canvas'), { autoAlpha: 0 });
        return;
      }

      const tl = gsap.timeline();
      tl.to(q('.scratch-canvas'), { autoAlpha: 0, scale: 1.08, duration: 0.6, ease: 'power2.in' })
        .from(q('.scratch-couple-names'), { scale: 0.8, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.8)' }, 0.2)
        .from(q('.scratch-day'), { scale: 0.4, rotation: -8, duration: 1, ease: 'elastic.out(1, 0.5)' }, 0.3)
        .from(q('.scratch-weekday, .scratch-month, .scratch-muhurat, .countdown'), { autoAlpha: 0, y: 12, stagger: 0.1, duration: 0.6 }, 0.45)
        .to(cardRef.current, { keyframes: { rotation: [0, -2, 2, -1, 0], scale: [1, 1.03, 1] }, duration: 0.6, ease: 'none' }, 0.2);

      const counter = q('.countdown-num')[0];
      if (counter && days !== null) {
        const obj = { n: 0 };
        tl.to(obj, { n: days, duration: 1.5, ease: 'power2.out', onUpdate: () => {
          counter.textContent = String(Math.round(obj.n));
        } }, 0.8);
      }
    },
    { scope: cardRef, dependencies: [revealed, runConfetti] },
  );

  const setup = useCallback(() => {
    const c = canvasRef.current;
    if (!c || revealed) return;
    const rect = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintCoating(ctx, rect.width, rect.height);
  }, [revealed]);

  useEffect(() => {
    const repaint = () => !started.current && setup();
    document.fonts?.ready.then(repaint);
    const ro = new ResizeObserver(repaint);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [setup]);

  const clearedRatio = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++;
      if (data[i] < 40) clear++;
    }
    return clear / total;
  };

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const scratch = (to: { x: number; y: number }) => {
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BRUSH * 2;
    ctx.beginPath();
    const from = last.current ?? to;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x + 0.01, to.y);
    ctx.stroke();
    last.current = to;
    if (++strokes.current % 10 === 0 && clearedRatio() > REVEAL_AT) setRevealed(true);
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    started.current = true;
    last.current = null;
    scratch(point(e));
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (drawing.current && !revealed) scratch(point(e));
  };
  const onUp = () => {
    drawing.current = false;
    last.current = null;
    if (!revealed && started.current && clearedRatio() > REVEAL_AT) setRevealed(true);
  };

  const parts = weddingDate ? dateParts(weddingDate) : null;

  return (
    <section id="date" className="scene paper paper--alt date">
      {/* SVG Clip Path for Heart Shape */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="scratchHeartClip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5, 0.18 C 0.5, 0.08, 0.38, 0, 0.25, 0 C 0.11, 0, 0, 0.11, 0, 0.28 C 0, 0.52, 0.25, 0.72, 0.5, 0.98 C 0.75, 0.72, 1, 0.52, 1, 0.28 C 1, 0.11, 0.89, 0, 0.75, 0 C 0.62, 0, 0.5, 0.08, 0.5, 0.18 Z" />
          </clipPath>
        </defs>
      </svg>

      <SectionTitle eyebrow="A Special Date Awaits" title="Save the Date">
        Scratch the royal heart to reveal our wedding date
      </SectionTitle>

      <Reveal>
        <div className="scratch-wrap">
          <div ref={cardRef} className={`scratch-card scratch-card--heart ${revealed ? 'is-revealed' : ''}`}>
            {/* The Heart Shaped Content: High Contrast Deep Maroon & Gleaming Gold */}
            <div className="scratch-content scratch-content--heart" aria-live="polite">
              {/* Auspicious Eyebrow inside the heart */}
              <p className="scratch-tagline">Save Our Date</p>

              {/* Single, Majestic Couple Name Title */}
              <div className="scratch-couple-names">
                <span className="scratch-name gold-text">{couple.groomName}</span>
                <span className="scratch-heart-icon" aria-hidden="true">♥</span>
                <span className="scratch-name gold-text">{couple.brideName}</span>
              </div>

              {/* Wedding Date */}
              {parts ? (
                <div className="scratch-date-block">
                  <p className="scratch-weekday">{parts.weekday}</p>
                  <p className="scratch-day gold-text">{parts.day}</p>
                  <p className="scratch-month">
                    {parts.month} {parts.year}
                  </p>
                </div>
              ) : (
                <div className="scratch-date-block">
                  <p className="scratch-day gold-text">♥</p>
                  <p className="scratch-month">Date to be announced soon</p>
                </div>
              )}

              {/* Muhurat Badge */}
              {muhurat && (
                <div className="scratch-muhurat-pill">
                  <span>✦ {muhurat} ✦</span>
                </div>
              )}

              {/* Days Countdown */}
              {days !== null && days > 0 && (
                <div className="countdown countdown--heart">
                  <span className="countdown-num">{days}</span> {days === 1 ? 'DAY TO GO' : 'DAYS TO GO'}
                </div>
              )}
            </div>

            {/* Heart Shaped Golden Foil Scratch Canvas */}
            <canvas
              ref={canvasRef}
              className="scratch-canvas scratch-canvas--heart"
              aria-hidden="true"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />

            {/* Ornate Gold Filigree Heart Outline Frame */}
            <svg viewBox="0 0 100 100" className="scratch-heart-frame" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M 50, 18 C 50, 8, 38, 0, 25, 0 C 11, 0, 0, 11, 0, 28 C 0, 52, 25, 72, 50, 98 C 75, 72, 100, 52, 100, 28 C 100, 11, 89, 0, 75, 0 C 62, 0, 50, 8, 50, 18 Z"
                fill="none"
                stroke="url(#goldFrameGrad)"
                strokeWidth="2.8"
                filter="drop-shadow(0 4px 14px rgba(201, 162, 74, 0.55))"
              />
              <defs>
                <linearGradient id="goldFrameGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff2be" />
                  <stop offset="30%" stopColor="#e5b84c" />
                  <stop offset="70%" stopColor="#fbe7a6" />
                  <stop offset="100%" stopColor="#8a6323" />
                </linearGradient>
              </defs>
            </svg>

            {/* Confetti / Festive Graffiti Explosion Canvas */}
            <canvas ref={confettiCanvasRef} className="scratch-confetti-canvas" aria-hidden="true" />
          </div>
        </div>
      </Reveal>

      {!revealed && (
        <button className="btn btn--gold" onClick={() => setRevealed(true)} style={{ marginTop: '22px' }}>
          Tap to Reveal Date ✦
        </button>
      )}
    </section>
  );
}
