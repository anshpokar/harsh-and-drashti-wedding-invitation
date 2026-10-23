import { wedding } from '../config/wedding';

function Letters({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} className="name-letter">
          {ch}
        </span>
      ))}
    </>
  );
}

/**
 * HARSH weds DRASHTI in metallic gold. Markup only — the parent animates it
 * with `nameRevealTimeline` so it can sit inside a larger GSAP timeline.
 */
export function CoupleNameReveal({ compact = false, as: Tag = 'h1' }: { compact?: boolean; as?: 'h1' | 'h2' }) {
  const { groomName, brideName } = wedding.couple;
  return (
    <Tag className={`name-reveal ${compact ? 'name-reveal--compact' : ''}`} aria-label={`${groomName} weds ${brideName}`}>
      <span className="name-line gold-text" aria-hidden="true">
        <Letters text={groomName} />
      </span>
      <span className="name-weds" aria-hidden="true">
        weds
      </span>
      <span className="name-line gold-text" aria-hidden="true">
        <Letters text={brideName} />
      </span>
    </Tag>
  );
}
