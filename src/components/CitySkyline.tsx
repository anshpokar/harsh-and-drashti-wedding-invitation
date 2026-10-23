/**
 * Watercolour-style Ahmedabad skyline reflected in the Sabarmati —
 * echoes the reference's city illustration. Pieces carry classes that
 * VenueDetails animates with GSAP (rise from the water, kite, shimmer).
 */
export function CitySkyline({ city }: { city: string }) {
  const towers = [
    [14, 70], [32, 54], [48, 80], [62, 62], [76, 88],
    [300, 76], [316, 50], [334, 66], [350, 40], [368, 72], [384, 58],
  ];
  return (
    <figure className="skyline">
      <svg viewBox="0 0 400 220" role="img" aria-label={`Illustrated skyline of ${city}`}>
        <defs>
          <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdf3ef" stopOpacity="0" />
            <stop offset="1" stopColor="#f6dcd4" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dfe8ee" />
            <stop offset="1" stopColor="#fbefeb" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="reflFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="reflMask">
            <rect x="0" y="120" width="400" height="100" fill="url(#reflFade)" />
          </mask>
          <filter id="wash">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        <circle className="sky-sun" cx="250" cy="62" r="34" fill="#f8d9a8" opacity="0.55" />
        <rect x="0" y="40" width="400" height="80" fill="url(#skyFade)" />

        <g id="ahm-city">
          {towers.map(([x, h], i) => (
            <g key={x} className="sky-bld">
              <rect x={x} y={120 - h} width={14} height={h} fill={i % 3 === 0 ? '#e7c6b8' : i % 3 === 1 ? '#c9d6df' : '#ecd2a9'} opacity="0.9" />
              {Array.from({ length: Math.floor(h / 12) }, (_, k) => (
                <line key={k} x1={x + 3} x2={x + 11} y1={124 - h + k * 12} y2={124 - h + k * 12} stroke="#fff" strokeOpacity="0.6" strokeWidth="1" />
              ))}
            </g>
          ))}

          {/* Jama Masjid: domes and twin minarets */}
          <g className="sky-bld" fill="#e3b98c">
            <rect x="112" y="92" width="90" height="28" />
            <path d="M126 92 a14 14 0 0 1 28 0 Z M160 92 a18 18 0 0 1 36 0 Z" transform="translate(-6 0)" />
            <path d="M144 92 a13 15 0 0 1 26 0 Z" fill="#d9a87c" />
            {[110, 204].map((x) => (
              <g key={x}>
                <rect x={x - 3} y="46" width="6" height="74" />
                <rect x={x - 5} y="66" width="10" height="3" fill="#c48f5e" />
                <rect x={x - 5} y="86" width="10" height="3" fill="#c48f5e" />
                <path d={`M${x - 4} 46 q4 -10 8 0 Z`} fill="#c48f5e" />
              </g>
            ))}
            {[124, 140, 156, 172, 188].map((x) => (
              <path key={x} d={`M${x} 120 v-12 a5 5 0 0 1 10 0 v12`} fill="#f8ead8" />
            ))}
          </g>

          {/* Sidi Saiyyed jali window */}
          <g className="sky-bld">
            <path d="M222 120 V86 Q236 62 250 86 V120 Z" fill="#ecd8c4" stroke="#c48f5e" strokeWidth="1.2" />
            <g stroke="#b97f50" strokeWidth="0.9" fill="none">
              <path d="M236 118 V92 M236 104 q-8 -6 -10 -14 M236 104 q8 -6 10 -14 M236 96 q-5 -4 -6 -10 M236 96 q5 -4 6 -10" />
              <path d="M230 110 q-4 -3 -5 -8 M242 110 q4 -3 5 -8" />
            </g>
          </g>

          {/* Atal Bridge over the river */}
          <g className="sky-bld sky-bridge" fill="none" strokeWidth="2.4">
            <path d="M200 118 Q228 104 256 118 Q284 104 312 118" stroke="#d98c5f" />
            <path d="M200 118 Q228 108 256 118 Q284 108 312 118" stroke="#6fa6b6" strokeWidth="1.6" />
            <line x1="196" y1="118" x2="316" y2="118" stroke="#b08a3e" strokeWidth="1.2" />
          </g>
        </g>

        <rect x="0" y="120" width="400" height="100" fill="url(#water)" />
        <g mask="url(#reflMask)" className="sky-reflection">
          <use href="#ahm-city" transform="matrix(1 0 0 -1 0 240)" filter="url(#wash)" />
        </g>
        {[132, 146, 160].map((y, i) => (
          <line key={y} className="sky-ripple" x1={40 + i * 60} x2={150 + i * 70} y1={y} y2={y} stroke="#fff" strokeWidth="1.2" strokeOpacity="0.8" />
        ))}

        {/* Uttarayan kite */}
        <g className="sky-kite">
          <path d="M342 14 L354 28 L342 46 L330 28 Z" fill="#e8590c" opacity="0.85" />
          <path d="M342 14 V46 M330 28 H354" stroke="#fff" strokeWidth="0.8" />
          <path d="M342 46 q-6 8 0 14 q6 6 0 12" stroke="#c0392b" fill="none" strokeWidth="1" />
          <path d="M342 46 Q300 90 270 118" stroke="#b08a3e" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
        </g>
      </svg>
      <figcaption className="skyline-name">{city}</figcaption>
    </figure>
  );
}
