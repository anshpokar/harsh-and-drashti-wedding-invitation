/**
 * Line-art motifs for each function, in the spirit of the reference's
 * illustrated event cards (no generated people). Picked by event id/name.
 */
function HangingMarigolds() {
  return (
    <g className="art-marigolds">
      {[18, 46, 74, 126, 154, 182].map((x, i) => (
        <g key={x} className="art-strand" style={{ transformOrigin: `${x}px 0px` }}>
          <line x1={x} y1={0} x2={x} y2={22 + (i % 3) * 8} stroke="#c9a24a" strokeWidth="0.6" />
          {Array.from({ length: 3 + (i % 3) }, (_, k) => (
            <circle key={k} cx={x} cy={6 + k * 7} r={2.8} fill={k % 2 ? '#f39c12' : '#e8590c'} />
          ))}
        </g>
      ))}
    </g>
  );
}

function Mandap() {
  return (
    <g fill="none" stroke="#b08a3e" strokeWidth="1.6">
      <path d="M50 64 Q100 30 150 64" />
      <path d="M58 64 Q100 40 142 64" strokeOpacity="0.6" />
      {[56, 82, 118, 144].map((x) => (
        <g key={x}>
          <line x1={x} y1={64} x2={x} y2={122} />
          <rect x={x - 4} y={120} width={8} height={4} fill="#f3d9c4" />
        </g>
      ))}
      <path d="M50 64 H150" />
      <path d="M60 66 q10 10 20 0 q10 10 20 0 q10 10 20 0 q10 10 20 0" stroke="#e8590c" strokeWidth="1.4" className="art-sway" />
      <path d="M100 30 v-8" />
      <circle cx="100" cy="19" r="3" fill="#c9a24a" stroke="none" />
      <path d="M92 122 q0 -14 8 -16 q8 2 8 16 Z" fill="#f6dc95" />
      <path d="M96 106 q4 -6 8 0" />
    </g>
  );
}

/** Mameru: the maternal uncle's thali of folded sarees, coconut and diya. */
function GiftThali() {
  return (
    <g>
      <ellipse cx="100" cy="112" rx="58" ry="11" fill="#f6dc95" stroke="#b08a3e" strokeWidth="1.6" />
      <ellipse cx="100" cy="110" rx="48" ry="7" fill="none" stroke="#b08a3e" strokeWidth="0.8" strokeDasharray="2 3" />
      <g className="art-gifts">
        <rect x="70" y="92" width="44" height="12" rx="2" fill="#c0392b" />
        <rect x="74" y="80" width="38" height="12" rx="2" fill="#16a085" />
        <rect x="78" y="68" width="32" height="12" rx="2" fill="#e8590c" />
        {[98, 86, 74].map((y) => (
          <line key={y} x1="70" x2="114" y1={y} y2={y} stroke="#f6dc95" strokeWidth="1.4" />
        ))}
      </g>
      <g transform="translate(130 92)">
        <ellipse cx="0" cy="6" rx="10" ry="9" fill="#8b5a2b" />
        <path d="M-2 -2 q-8 -14 -2 -20 M2 -2 q8 -14 2 -20 M0 -2 q0 -16 0 -22" stroke="#3f7d3a" strokeWidth="2.4" fill="none" />
      </g>
      <g transform="translate(62 104)">
        <path d="M-8 0 q8 6 16 0 Z" fill="#b08a3e" />
        <path className="art-flame" style={{ transformOrigin: '0px 0px' }} d="M0 0 C-4 -4 -2 -9 0 -13 C2 -9 4 -4 0 0 Z" fill="#f39c12" />
      </g>
      <circle cx="100" cy="52" r="2.5" fill="#f6dc95" className="art-twinkle" />
      <circle cx="84" cy="58" r="1.8" fill="#f6dc95" className="art-twinkle" />
      <circle cx="118" cy="56" r="1.8" fill="#f6dc95" className="art-twinkle" />
    </g>
  );
}

function Dandiya() {
  return (
    <g strokeLinecap="round">
      <g className="art-stick art-stick--l" style={{ transformOrigin: '100px 92px' }}>
        <line x1="64" y1="56" x2="122" y2="118" stroke="#b08a3e" strokeWidth="5" />
        <line x1="64" y1="56" x2="122" y2="118" stroke="#e8590c" strokeWidth="5" strokeDasharray="6 8" />
        <path d="M64 56 q-10 -4 -14 6 M64 56 q-2 -10 -12 -10" stroke="#c0392b" strokeWidth="1.4" fill="none" />
      </g>
      <g className="art-stick art-stick--r" style={{ transformOrigin: '100px 92px' }}>
        <line x1="136" y1="56" x2="78" y2="118" stroke="#b08a3e" strokeWidth="5" />
        <line x1="136" y1="56" x2="78" y2="118" stroke="#16a085" strokeWidth="5" strokeDasharray="6 8" />
        <path d="M136 56 q10 -4 14 6 M136 56 q2 -10 12 -10" stroke="#c0392b" strokeWidth="1.4" fill="none" />
      </g>
      <circle cx="100" cy="74" r="3" fill="#f6dc95" className="art-twinkle" />
      <circle cx="78" cy="96" r="2" fill="#f6dc95" className="art-twinkle" />
      <circle cx="122" cy="96" r="2" fill="#f6dc95" className="art-twinkle" />
    </g>
  );
}

function SacredFire() {
  return (
    <g>
      <path d="M62 52 Q100 26 138 52" fill="none" stroke="#b08a3e" strokeWidth="1.6" />
      <path d="M66 54 q8 8 17 0 q8 8 17 0 q8 8 17 0 q8 8 17 0" fill="none" stroke="#e8590c" strokeWidth="1.4" className="art-sway" />
      <path d="M70 118 H130 L122 102 H78 Z" fill="#f3d9c4" stroke="#b08a3e" strokeWidth="1.6" />
      <path d="M74 102 h52" stroke="#b08a3e" strokeWidth="1.2" />
      <g className="art-flame" style={{ transformOrigin: '100px 100px' }}>
        <path d="M100 100 C84 92 90 74 100 60 C104 72 116 80 108 96 C106 90 102 88 100 100 Z" fill="#f39c12" />
        <path d="M100 100 C94 94 96 84 100 76 C103 84 108 90 100 100 Z" fill="#fde29a" />
      </g>
      {[44, 156].map((x) => (
        <g key={x} stroke="#b08a3e" strokeWidth="1.4" fill="#f6dc95">
          <path d={`M${x - 9} 118 q0 -18 9 -20 q9 2 9 20 Z`} />
          <path d={`M${x - 6} 98 h12`} />
          <path d={`M${x} 96 q-6 -8 0 -14 q6 6 0 14`} fill="#3f7d3a" stroke="none" />
        </g>
      ))}
    </g>
  );
}

function Chandelier() {
  return (
    <g className="art-chandelier" style={{ transformOrigin: '100px 20px' }} stroke="#b08a3e" strokeWidth="1.4" fill="none">
      <line x1="100" y1="20" x2="100" y2="44" />
      <path d="M60 60 Q100 90 140 60" />
      <path d="M72 58 Q100 76 128 58" strokeOpacity="0.6" />
      <path d="M100 44 L60 60 M100 44 L140 60 M100 44 L100 74" />
      {[60, 80, 100, 120, 140].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={i === 2 ? 74 : 62 + Math.abs(2 - i) * -2} x2={x} y2={92 - Math.abs(2 - i) * 6} strokeOpacity="0.5" />
          <path d={`M${x} ${92 - Math.abs(2 - i) * 6} l-3 6 l3 6 l3 -6 Z`} fill="#fde7c0" />
          <circle cx={x} cy={56 + Math.abs(2 - i) * 2} r="5" fill="#fff3cf" stroke="none" className="art-twinkle" opacity="0.8" />
        </g>
      ))}
    </g>
  );
}

export function EventArt({ id, name }: { id: string; name: string }) {
  const key = `${id} ${name}`.toLowerCase();
  const art = /sangeet|dandiya|garba/.test(key) ? (
    <Dandiya />
  ) : /mameru|mosalu/.test(key) ? (
    <GiftThali />
  ) : /reception/.test(key) ? (
    <Chandelier />
  ) : /wedding|vivah|marriage|lagna/.test(key) ? (
    <SacredFire />
  ) : (
    <Mandap />
  );
  return (
    <svg className="event-art" viewBox="0 0 200 130" aria-hidden="true">
      <defs>
        <radialGradient id="artGlow" cx="50%" cy="60%" r="60%">
          <stop offset="0" stopColor="#fff6ea" />
          <stop offset="1" stopColor="#f6e2dc" />
        </radialGradient>
      </defs>
      <rect width="200" height="130" fill="url(#artGlow)" />
      <HangingMarigolds />
      {art}
    </svg>
  );
}
