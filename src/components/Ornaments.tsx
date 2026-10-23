import { useRef, type CSSProperties, type ReactNode } from 'react';
import type { Photo } from '../config/wedding';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';

export function Divider({ className = '' }: { className?: string }) {
  return (
    <svg className={`divider ${className}`} viewBox="0 0 320 24" aria-hidden="true">
      <path d="M0 12 H120" />
      <path d="M200 12 H320" />
      <path d="M126 12 C140 2 150 2 160 12 C170 2 180 2 194 12 C180 22 170 22 160 12 C150 22 140 22 126 12 Z" />
      <circle cx="160" cy="12" r="3" />
      <circle cx="112" cy="12" r="1.8" />
      <circle cx="208" cy="12" r="1.8" />
    </svg>
  );
}

/** Lotus emblem used as the auspicious motif (and Ganesh fallback). */
export function LotusEmblem({ className = '' }: { className?: string }) {
  const petals = [-60, -30, 0, 30, 60];
  return (
    <svg className={`lotus ${className}`} viewBox="0 0 120 100" aria-hidden="true">
      <defs>
        <linearGradient id="lotusGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dc95" />
          <stop offset="1" stopColor="#a87b2c" />
        </linearGradient>
      </defs>
      {petals.map((r) => (
        <path
          key={r}
          d="M60 78 C44 58 46 30 60 12 C74 30 76 58 60 78 Z"
          transform={`rotate(${r} 60 78)`}
          fill="url(#lotusGold)"
          fillOpacity={r === 0 ? 1 : 0.75}
          stroke="#7a5418"
          strokeWidth="0.8"
        />
      ))}
      <path d="M24 82 Q60 96 96 82" fill="none" stroke="url(#lotusGold)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="60" cy="40" r="4" fill="#fff4d0" />
    </svg>
  );
}

/** Marigold & mango-leaf toran garland strung across the top of a scene. */
export function Toran({ swags = 5, className = '' }: { swags?: number; className?: string }) {
  const w = 100 / swags;
  const flowers: JSX.Element[] = [];
  for (let s = 0; s < swags; s++) {
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = s * w + t * w;
      const y = 2 + Math.sin(Math.PI * t) * 9;
      flowers.push(
        <circle key={`${s}-${i}`} cx={x} cy={y} r={1.55} fill={i % 2 ? '#f39c12' : '#e8590c'} />,
      );
    }
    flowers.push(
      <g key={`drop-${s}`}>
        <line x1={s * w} y1={2} x2={s * w} y2={16} stroke="#e8590c" strokeWidth="0.5" />
        <circle cx={s * w} cy={12} r={1.5} fill="#f39c12" />
        <circle cx={s * w} cy={15.5} r={1.3} fill="#e8590c" />
        <path d={`M${s * w} 17 q-1.4 2.4 0 4.6 q1.4 -2.2 0 -4.6`} fill="#3f7d3a" />
      </g>,
    );
  }
  return (
    <svg className={`toran ${className}`} viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="1.2" x2="100" y2="1.2" stroke="#c9a24a" strokeWidth="0.6" />
      {flowers}
    </svg>
  );
}

/**
 * Section heading in the reference style: small spaced eyebrow, a large
 * script title that "writes" itself in left-to-right, and a divider that
 * draws outward from the centre.
 */
export function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ scrollTrigger: onEnter(ref.current, 'top 85%') })
        .from(q('.eyebrow'), { autoAlpha: 0, y: 12, letterSpacing: '0.6em', duration: 1 })
        .fromTo(
          q('h2'),
          { clipPath: 'inset(-20% 100% -20% 0%)' },
          { clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.6, ease: 'power2.inOut' },
          0.15,
        )
        .from(q('.divider'), { scaleX: 0, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.8)
        .from(q('.section-lead'), { autoAlpha: 0, y: 10, duration: 0.9 }, 1);
    },
    { scope: ref },
  );
  return (
    <header ref={ref} className="section-title">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="script-title">{title}</h2>
      <Divider />
      {children && <p className="section-lead">{children}</p>}
    </header>
  );
}

/** A gold-framed photograph; renders nothing until a photo is supplied. */
export function PhotoFrame({
  photo,
  shape = 'arch',
  label,
  className = '',
  style,
  onClick,
}: {
  photo: Photo | null;
  shape?: 'arch' | 'rect' | 'circle';
  label: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  if (!photo) return null;
  const inner = <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />;
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      className={`photo-frame photo-frame--${shape} ${className}`}
      style={style}
      onClick={onClick}
      {...(onClick ? { type: 'button' as const, 'aria-label': `View ${photo.alt || label}` } : {})}
    >
      {inner}
    </Tag>
  );
}
