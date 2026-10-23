import { wedding } from '../config/wedding';

function Letters({ text, start }: { text: string; start: number }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} className="name-letter" style={{ animationDelay: `${start + i * 70}ms` }}>
          {ch}
        </span>
      ))}
    </>
  );
}

/** The emotional highlight: HARSH weds DRASTI in metallic gold. */
export function CoupleNameReveal({ play, compact = false }: { play: boolean; compact?: boolean }) {
  const { groomName, brideName } = wedding.couple;
  const brideStart = 200 + groomName.length * 70 + 500;
  return (
    <h1 className={`name-reveal ${play ? 'is-playing' : ''} ${compact ? 'name-reveal--compact' : ''}`}>
      <span className="name-line gold-text">
        <Letters text={groomName} start={200} />
      </span>
      <span className="name-weds" style={{ animationDelay: `${brideStart - 300}ms` }}>
        weds
      </span>
      <span className="name-line gold-text">
        <Letters text={brideName} start={brideStart} />
      </span>
    </h1>
  );
}
