import { useRef } from 'react';
import { wedding, type FamilySide } from '../config/wedding';
import { resolveName } from '../lib/content';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';
import { Divider, SectionTitle } from './Ornaments';

function hasContent(f: FamilySide) {
  return Boolean(f.familyName || resolveName(f.father) || resolveName(f.mother) || f.blessings.some((b) => resolveName(b.names)) || f.message);
}

function FamilyCard({ family }: { family: FamilySide }) {
  const parents = [resolveName(family.mother), resolveName(family.father)].filter((p) => p !== null);
  const blessings = family.blessings.map((b) => ({ relation: b.relation, name: resolveName(b.names) })).filter((b) => b.name !== null);
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
    </article>
  );
}

/** Scene 7: "With Blessings From" — both families, relation by relation. */
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
          .from(q('.blessing-group'), { autoAlpha: 0, y: 14, stagger: 0.12, duration: 0.7 }, 0.6);
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
