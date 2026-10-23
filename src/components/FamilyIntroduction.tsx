import { useRef } from 'react';
import { wedding, type FamilySide } from '../config/wedding';
import { showPlaceholders } from '../lib/content';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';
import { Divider, Pending, PhotoFrame, SectionTitle } from './Ornaments';

function hasContent(f: FamilySide) {
  return Boolean(f.familyName || f.father || f.mother || f.blessings.length || f.message || f.photo);
}

function FamilyCard({ family }: { family: FamilySide }) {
  return (
    <article className={`family-card family-card--${family.side}`}>
      <p className="eyebrow">{family.heading}</p>
      {family.familyName ? <h3 className="family-name">{family.familyName}</h3> : <Pending label="Family name" block />}
      {family.city && <p className="family-city">{family.city}</p>}
      <PhotoFrame photo={family.photo} shape="rect" label="Family photograph" className="family-photo" />
      <Divider />
      <dl className="blessing-list">
        {family.father || family.mother ? (
          <div className="blessing-group">
            <dt>{family.side === 'groom' ? 'Son of' : 'Daughter of'}</dt>
            <dd>{[family.mother, family.father].filter(Boolean).join(' & ')}</dd>
          </div>
        ) : null}
        {!family.mother && <Pending label="Mother's name" block />}
        {family.blessings.map((b) => (
          <div key={b.relation} className="blessing-group">
            <dt>{b.relation}</dt>
            <dd>{b.names}</dd>
          </div>
        ))}
        {!family.blessings.length && <Pending label="Grandparents, siblings, nieces & nephews" block />}
      </dl>
      {family.message && <p className="family-message">{family.message}</p>}
    </article>
  );
}

/** Scene 7: "With Blessings From" — both families, relation by relation. */
export function FamilyIntroduction() {
  const families = wedding.families.filter((f) => showPlaceholders || hasContent(f));
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
          .from(q('.blessing-group, .pending'), { autoAlpha: 0, y: 14, stagger: 0.12, duration: 0.7 }, 0.6);
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
