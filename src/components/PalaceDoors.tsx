/** One carved door leaf. The right leaf is the same artwork mirrored. */
function DoorLeaf({ side }: { side: 'left' | 'right' }) {
  const studs: JSX.Element[] = [];
  for (let i = 0; i < 13; i++) {
    const y = 40 + i * 44;
    studs.push(<circle key={`a${i}`} cx={12} cy={y} r={3.2} />, <circle key={`b${i}`} cx={188} cy={y} r={3.2} />);
  }
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      className="door-art"
      viewBox="0 0 200 600"
      preserveAspectRatio="none"
      style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`wood-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a0b14" />
          <stop offset="0.55" stopColor="#5e1322" />
          <stop offset="1" stopColor="#2a0710" />
        </linearGradient>
        <linearGradient id={`gilt-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dc95" />
          <stop offset="0.5" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#8a6323" />
        </linearGradient>
        <pattern id={`jali-${side}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="none" stroke="#c9a24a" strokeOpacity="0.35" strokeWidth="0.8" />
          <circle cx="8" cy="8" r="1.2" fill="#c9a24a" fillOpacity="0.5" />
        </pattern>
      </defs>
      <rect width="200" height="600" fill={`url(#wood-${side})`} />
      <rect x="4" y="4" width="192" height="592" fill="none" stroke={`url(#gilt-${side})`} strokeWidth="3" />
      <g fill={`url(#gilt-${side})`}>{studs}</g>

      {/* Upper ogee-arched panel with jali lattice */}
      <path
        d="M30 270 V110 C30 70 60 52 100 34 C140 52 170 70 170 110 V270 Z"
        fill={`url(#jali-${side})`}
        stroke={`url(#gilt-${side})`}
        strokeWidth="3"
      />
      <path
        d="M42 258 V114 C42 82 66 66 100 50 C134 66 158 82 158 114 V258 Z"
        fill="none"
        stroke="#c9a24a"
        strokeOpacity="0.6"
        strokeWidth="1.2"
      />

      {/* Central rosette */}
      <g transform="translate(100 320)">
        {petals.map((r) => (
          <ellipse key={r} rx="6" ry="20" cy="-18" transform={`rotate(${r})`} fill={`url(#gilt-${side})`} fillOpacity="0.85" />
        ))}
        <circle r="13" fill="#5e1322" stroke={`url(#gilt-${side})`} strokeWidth="3" />
        <circle r="5" fill="#f6dc95" />
      </g>

      {/* Lower panel */}
      <rect x="30" y="368" width="140" height="196" rx="4" fill="none" stroke={`url(#gilt-${side})`} strokeWidth="3" />
      <path d="M100 384 L154 466 L100 548 L46 466 Z" fill="none" stroke="#c9a24a" strokeOpacity="0.7" strokeWidth="1.5" />
      <circle cx="100" cy="466" r="8" fill={`url(#gilt-${side})`} />

      {/* Door-pull ring near the meeting edge */}
      <g transform="translate(184 330)" fill="none" stroke={`url(#gilt-${side})`}>
        <circle r="6" strokeWidth="4" />
        <circle cy="16" r="12" strokeWidth="3" />
      </g>
    </svg>
  );
}

/** Carved palace doorway. Opening is animated by RoyalIntro's GSAP timeline. */
export function PalaceDoors() {
  return (
    <div className="palace">
      {/* Carved archway frame */}
      <svg className="palace-frame" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M-6 166 V46 C-6 16 30 4 50 -8 C70 4 106 16 106 46 V166"
          fill="none"
          stroke="#c9a24a"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-2 162 V48 C-2 22 30 9 50 -2 C70 9 102 22 102 48 V162"
          fill="none"
          stroke="#f6dc95"
          strokeOpacity="0.55"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="doorway">
        <div className="doorway-light" />
        <div className="door door--left">
          <DoorLeaf side="left" />
        </div>
        <div className="door door--right">
          <DoorLeaf side="right" />
        </div>
      </div>
    </div>
  );
}
