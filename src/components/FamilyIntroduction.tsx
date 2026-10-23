import { wedding, type FamilySide } from '../config/wedding';
import { showPlaceholders } from '../lib/content';
import { Divider, Pending, PhotoFrame, SectionTitle } from './Ornaments';
import { Reveal } from './Reveal';

function hasContent(f: FamilySide) {
  return Boolean(f.familyName || f.parents || f.grandparents || f.members.length || f.message || f.photo);
}

function FamilyCard({ family, delay }: { family: FamilySide; delay: number }) {
  return (
    <Reveal as="article" className="family-card" delay={delay}>
      <p className="eyebrow">{family.heading}</p>
      {family.familyName ? <h3 className="gold-text family-name">{family.familyName}</h3> : <Pending label="Family name" block />}
      {family.city && <p className="family-city">{family.city}</p>}
      <PhotoFrame photo={family.photo} shape="rect" label="Family photograph" className="family-photo" />
      <Divider />
      <dl className="family-details">
        {family.grandparents ? (
          <>
            <dt>With the blessings of</dt>
            <dd>{family.grandparents}</dd>
          </>
        ) : (
          <Pending label="Grandparents (optional)" block />
        )}
        {family.parents ? (
          <>
            <dt>{family.side === 'groom' ? 'Son of' : 'Daughter of'}</dt>
            <dd>{family.parents}</dd>
          </>
        ) : (
          <Pending label="Parents' names" block />
        )}
        {family.members.map((m) => (
          <div key={m.name} className="family-member">
            {m.relation && <dt>{m.relation}</dt>}
            <dd>{m.name}</dd>
          </div>
        ))}
      </dl>
      {family.message && <p className="family-message">{family.message}</p>}
    </Reveal>
  );
}

/** Scene 7: two families, one beautiful beginning. */
export function FamilyIntroduction() {
  const families = wedding.families.filter((f) => showPlaceholders || hasContent(f));
  if (!families.length) return null;
  return (
    <section id="families" className="scene parchment families">
      <div className="parchment-border">
        <SectionTitle eyebrow="With love and blessings" title="Two Families. One Beautiful Beginning." />
        <div className="family-grid">
          {families.map((f, i) => (
            <FamilyCard key={f.side} family={f} delay={i * 200} />
          ))}
        </div>
      </div>
    </section>
  );
}
