import { useCallback, useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
import { daysToWedding } from '../lib/content';
import { dateParts } from '../lib/format';
import { gsap, reducedMotion, useGSAP } from '../lib/gsap';
import { SectionTitle } from './Ornaments';
import { Reveal } from './Reveal';

const BRUSH = 22;
const REVEAL_AT = 0.5;

function paintCoating(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#8a6323');
  g.addColorStop(0.3, '#e9c873');
  g.addColorStop(0.5, '#fbe7a6');
  g.addColorStop(0.7, '#d4ab52');
  g.addColorStop(1, '#8a6323');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Embossed paisley-dot lattice
  ctx.fillStyle = 'rgba(110, 70, 20, 0.22)';
  for (let y = 10; y < h; y += 22) {
    for (let x = (y / 22) % 2 ? 10 : 21; x < w; x += 22) {
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.strokeStyle = 'rgba(90, 15, 30, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  ctx.fillStyle = '#5a0f1e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${Math.round(w / 14)}px Cinzel, serif`;
  ctx.fillText('SCRATCH HERE', w / 2, h / 2 - 8);
  ctx.font = `italic ${Math.round(w / 20)}px "Cormorant Garamond", serif`;
  ctx.fillText('to reveal the date', w / 2, h / 2 + w / 14);
}

/** Scene 5: functional canvas scratch-to-reveal for the wedding date. */
export function ScratchDateCard() {
  const { weddingDate, muhurat, dateMessage } = wedding;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const started = useRef(false);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const days = daysToWedding();

  // The reveal moment: foil dissolves, date pops, sparks burst, countdown ticks up.
  useGSAP(
    () => {
      if (!revealed) return;
      const q = gsap.utils.selector(cardRef);
      if (reducedMotion()) {
        gsap.set(q('.scratch-canvas'), { autoAlpha: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.to(q('.scratch-canvas'), { autoAlpha: 0, scale: 1.08, duration: 0.7, ease: 'power2.in' })
        .from(q('.scratch-day'), { scale: 0.3, rotation: -12, duration: 1.2, ease: 'elastic.out(1, 0.45)' }, 0.3)
        .from(q('.scratch-weekday, .scratch-month, .scratch-muhurat, .scratch-message'), { autoAlpha: 0, y: 10, stagger: 0.1, duration: 0.7 }, 0.5)
        .to(cardRef.current, { keyframes: { rotation: [0, -1.5, 1.5, -0.8, 0] }, duration: 0.6, ease: 'none' }, 0.3);
      q('.spark').forEach((el, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const dist = gsap.utils.random(90, 170);
        tl.fromTo(
          el,
          { x: 0, y: 0, scale: 0, autoAlpha: 1 },
          { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: gsap.utils.random(0.8, 1.8), rotation: 180, autoAlpha: 0, duration: 1.4, ease: 'expo.out' },
          0.35,
        );
      });
      const counter = q('.countdown-num')[0];
      if (counter && days !== null) {
        const obj = { n: 0 };
        tl.fromTo(q('.countdown'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1)
          .to(obj, { n: days, duration: 1.6, ease: 'power2.out', onUpdate: () => {
            counter.textContent = String(Math.round(obj.n));
          } }, 1);
      }
    },
    { scope: cardRef, dependencies: [revealed] },
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
    // Repaint on resize and once web fonts load (for Cinzel), until scratching begins.
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
    ctx.strokeStyle = '#000'; // must be fully opaque to erase completely
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BRUSH * 2;
    ctx.beginPath();
    const from = last.current ?? to;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x + 0.01, to.y);
    ctx.stroke();
    last.current = to;
    if (++strokes.current % 12 === 0 && clearedRatio() > REVEAL_AT) setRevealed(true);
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
      <SectionTitle eyebrow="A Special Date Awaits" title="Save the Date">
        Scratch to reveal our wedding date
      </SectionTitle>

      <Reveal>
        <div ref={cardRef} className={`scratch-card ${revealed ? 'is-revealed' : ''}`}>
        <div className="scratch-content" aria-live="polite">
          {parts ? (
            <>
              <p className="scratch-weekday">{parts.weekday}</p>
              <p className="scratch-day gold-text">{parts.day}</p>
              <p className="scratch-month">
                {parts.month} {parts.year}
              </p>
            </>
          ) : (
            <>
              <p className="scratch-day gold-text">♥</p>
              <p className="scratch-month">Date to be announced soon</p>
            </>
          )}
          {muhurat && <p className="scratch-muhurat">{muhurat}</p>}
          <p className="scratch-message">{dateMessage}</p>
          {days !== null && days > 0 && (
            <p className="countdown">
              <span className="countdown-num">{days}</span> {days === 1 ? 'day' : 'days'} to go
            </p>
          )}
          <div className="sparkles" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <i key={i} className="spark" />
            ))}
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          aria-hidden="true"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
        </div>
      </Reveal>

      {!revealed && (
        <button className="btn btn--ghost" onClick={() => setRevealed(true)}>
          Tap to reveal instead
        </button>
      )}
    </section>
  );
}
