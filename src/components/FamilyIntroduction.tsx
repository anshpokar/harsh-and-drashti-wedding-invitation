import { useRef } from 'react';
import { wedding, type FamilySide } from '../config/wedding';
import { resolveName } from '../lib/content';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';
import { Divider, SectionTitle } from './Ornaments';

function hasContent(f: FamilySide) {
  return Boolean(
    f.familyName ||
      resolveName(f.father) ||
      resolveName(f.mother) ||
      f.blessings.some((b) => resolveName(b.names)) ||
      f.message,
  );
}

function HalfRangoliVector() {
  const cx = 120;
  const cy = 96;

  // Concentric bead dots ring
  const beadAngles = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168];
  const innerPetalAngles = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165];
  const mainPetalAngles = [18, 36, 54, 72, 90, 108, 126, 144, 162];
  const outerSpikeAngles = [12, 28, 44, 60, 76, 90, 104, 120, 136, 152, 168];

  const getPt = (r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: +(cx + r * Math.cos(rad)).toFixed(1),
      y: +(cy - r * Math.sin(rad)).toFixed(1),
    };
  };

  return (
    <svg viewBox="0 0 240 102" className="family-art-svg half-rangoli-svg" aria-hidden="true">
      <defs>
        <linearGradient id="rgGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9a7126" />
          <stop offset="35%" stopColor="#e5bf65" />
          <stop offset="60%" stopColor="#fff1b8" />
          <stop offset="85%" stopColor="#d8ab48" />
          <stop offset="100%" stopColor="#8a6120" />
        </linearGradient>
        <linearGradient id="rgCrimson" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(180, 20, 40, 0.28)" />
          <stop offset="100%" stopColor="rgba(100, 10, 25, 0.05)" />
        </linearGradient>
        <radialGradient id="rgCenterGlow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="rgba(246, 220, 149, 0.45)" />
          <stop offset="100%" stopColor="rgba(246, 220, 149, 0)" />
        </radialGradient>
      </defs>

      {/* Radiant glow under half rangoli */}
      <path
        d="M 20 96 A 100 100 0 0 1 220 96 Z"
        fill="url(#rgCenterGlow)"
        opacity="0.6"
      />

      {/* Layer 1: Core Semicircle */}
      <path
        d="M 104 96 A 16 16 0 0 1 136 96 Z"
        fill="url(#rgCrimson)"
        stroke="url(#rgGold)"
        strokeWidth="1.2"
      />

      {/* Radiating Inner Petals */}
      {innerPetalAngles.map((ang) => {
        const p1 = getPt(16, ang);
        const p2 = getPt(28, ang);
        return (
          <line
            key={`in-${ang}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="url(#rgGold)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        );
      })}

      {/* Layer 2: Intermediate ring */}
      <path
        d="M 92 96 A 28 28 0 0 1 148 96"
        fill="none"
        stroke="url(#rgGold)"
        strokeWidth="1"
        strokeDasharray="2, 2"
      />

      {/* Layer 3: Pearl Bindu Row */}
      {beadAngles.map((ang) => {
        const pt = getPt(36, ang);
        return (
          <circle
            key={`bead-${ang}`}
            cx={pt.x}
            cy={pt.y}
            r="1.4"
            fill="url(#rgGold)"
          />
        );
      })}

      {/* Layer 4: Middle Scallop Petals (pointed lotus leaves) */}
      <path
        d="M 80 96 A 40 40 0 0 1 160 96"
        fill="none"
        stroke="url(#rgGold)"
        strokeWidth="1.2"
      />
      {mainPetalAngles.map((ang) => {
        const tip = getPt(58, ang);
        const left = getPt(42, ang - 9);
        const right = getPt(42, ang + 9);
        const mid = getPt(50, ang);
        return (
          <g key={`petal-${ang}`}>
            <path
              d={`M ${left.x} ${left.y} Q ${tip.x - (tip.x - left.x) * 0.15} ${tip.y + 5} ${tip.x} ${tip.y} Q ${right.x + (right.x - tip.x) * 0.15} ${tip.y + 5} ${right.x} ${right.y} Z`}
              fill="rgba(165, 15, 36, 0.12)"
              stroke="url(#rgGold)"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {/* Inner vein */}
            <line
              x1={(left.x + right.x) / 2}
              y1={(left.y + right.y) / 2}
              x2={mid.x}
              y2={mid.y}
              stroke="url(#rgGold)"
              strokeWidth="0.9"
            />
            <circle cx={tip.x} cy={tip.y} r="1.3" fill="url(#rgGold)" />
          </g>
        );
      })}

      {/* Layer 5: Ornate Outer Rangoli Crown Petals */}
      <path
        d="M 54 96 A 66 66 0 0 1 186 96"
        fill="none"
        stroke="url(#rgGold)"
        strokeWidth="1"
      />
      {outerSpikeAngles.map((ang) => {
        const tip = getPt(84, ang);
        const pearl = getPt(90, ang);
        const left = getPt(68, ang - 7);
        const right = getPt(68, ang + 7);
        return (
          <g key={`crown-${ang}`}>
            <path
              d={`M ${left.x} ${left.y} C ${left.x} ${tip.y + 10} ${tip.x - 3} ${tip.y + 2} ${tip.x} ${tip.y} C ${tip.x + 3} ${tip.y + 2} ${right.x} ${tip.y + 10} ${right.x} ${right.y}`}
              fill="none"
              stroke="url(#rgGold)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Crowning Pearl Drop */}
            <circle cx={pearl.x} cy={pearl.y} r="1.8" fill="url(#rgGold)" />
            <circle cx={pearl.x} cy={pearl.y} r="0.8" fill="#fff" />
          </g>
        );
      })}

      {/* Layer 6: Auspicious Baseline Rangoli Scrolls */}
      <g stroke="url(#rgGold)" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <path d="M 104 96 C 75 96 48 93 25 96 C 14 97 6 93 9 88 C 12 83 22 85 24 91" />
        <path d="M 136 96 C 165 96 192 93 215 96 C 226 97 234 93 231 88 C 228 83 218 85 216 91" />
        <line x1="12" y1="96" x2="228" y2="96" strokeWidth="0.8" strokeDasharray="3, 2" />
      </g>
      <circle cx="24" cy="91" r="1.5" fill="url(#rgGold)" />
      <circle cx="216" cy="91" r="1.5" fill="url(#rgGold)" />
    </svg>
  );
}

function FamilyCard({ family }: { family: FamilySide }) {
  const parents = [resolveName(family.mother), resolveName(family.father)].filter((p) => p !== null);
  const blessings = family.blessings
    .map((b) => ({ relation: b.relation, name: resolveName(b.names) }))
    .filter((b) => b.name !== null);

  return (
    <article className={`family-card family-card--${family.side}`}>
      <p className="eyebrow">{family.heading}</p>
      {family.familyName && <h3 className="family-name">{family.familyName}</h3>}
      {family.city && <p className="family-city">{family.city}</p>}
      <Divider />
      <dl className="blessing-list">
        {parents.length > 0 && (
          <div className="blessing-group">
            <dt>{family.side === 'groom' ? 'Son of' : 'Daughter of'}</dt>
            <dd>{parents.map((p) => p!.text).join(' & ')}</dd>
          </div>
        )}
        {blessings.map((b) => (
          <div key={b.relation} className="blessing-group">
            <dt>{b.relation}</dt>
            <dd>{b.name!.text}</dd>
          </div>
        ))}
      </dl>
      {family.message && <p className="family-message">{family.message}</p>}

      {/* Decorative Royal Half Rangoli Vector Art at bottom of the card */}
      <div className="family-vector-art">
        <HalfRangoliVector />
      </div>
    </article>
  );
}

/** Scene 7: "With Blessings From" — both families with parents and siblings. */
export function FamilyIntroduction() {
  const families = wedding.families.filter(hasContent);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.utils.toArray<HTMLElement>('.family-card', ref.current).forEach((card, i) => {
        const q = gsap.utils.selector(card);
        gsap
          .timeline({ scrollTrigger: onEnter(card, 'top 82%') })
          .from(card, { autoAlpha: 0, x: i % 2 ? 60 : -60, rotation: i % 2 ? 2 : -2, duration: 1.2 })
          .from(q('.family-name'), { autoAlpha: 0, letterSpacing: '0.5em', duration: 1.2 }, 0.3)
          .from(q('.blessing-group'), { autoAlpha: 0, y: 14, stagger: 0.12, duration: 0.7 }, 0.6)
          .from(q('.family-vector-art'), { autoAlpha: 0, scale: 0.8, duration: 0.9, ease: 'back.out(1.6)' }, 0.8);
      });
    },
    { scope: ref },
  );

  if (!families.length) return null;
  return (
    <section ref={ref} id="families" className="scene paper families">
      <SectionTitle eyebrow="With love" title="With Blessings From" />
      <div className="family-grid">
        {families.map((f) => (
          <FamilyCard key={f.side} family={f} />
        ))}
      </div>
    </section>
  );
}
