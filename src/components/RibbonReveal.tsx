/**
 * Red silk ribbon with a bow, drawn across the doors as its own SVG layer
 * so it stays interactive and is never baked into the video.
 * `released` unties the bow and lets both halves fall away.
 */
export function RibbonReveal({ released }: { released: boolean }) {
  return (
    <div className={`ribbon ${released ? 'ribbon--released' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="ribbon-band ribbon-band--left">
        <defs>
          <linearGradient id="silk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e2364a" />
            <stop offset="0.45" stopColor="#a50f24" />
            <stop offset="0.55" stopColor="#c11d33" />
            <stop offset="1" stopColor="#6e0716" />
          </linearGradient>
        </defs>
        <path d="M0 30 C100 22 300 38 400 30 V52 C300 60 100 44 0 52 Z" fill="url(#silk)" />
        <path d="M0 33 C100 25 300 41 400 33" stroke="#f1d58a" strokeWidth="1.2" fill="none" />
        <path d="M0 49 C100 41 300 57 400 49" stroke="#f1d58a" strokeWidth="1.2" fill="none" />
      </svg>
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="ribbon-band ribbon-band--right">
        <path d="M0 30 C100 38 300 22 400 30 V52 C300 44 100 60 0 52 Z" fill="url(#silk)" />
        <path d="M0 33 C100 41 300 25 400 33" stroke="#f1d58a" strokeWidth="1.2" fill="none" />
        <path d="M0 49 C100 57 300 41 400 49" stroke="#f1d58a" strokeWidth="1.2" fill="none" />
      </svg>
      <svg viewBox="0 0 120 120" className="ribbon-bow">
        <g className="bow-loop bow-loop--left">
          <path d="M60 50 C30 18 4 26 8 50 C4 74 30 82 60 50 Z" fill="url(#silk)" stroke="#6e0716" strokeWidth="1" />
          <path d="M56 50 C34 30 18 34 18 50" stroke="#f1d58a" strokeWidth="1" fill="none" />
        </g>
        <g className="bow-loop bow-loop--right">
          <path d="M60 50 C90 18 116 26 112 50 C116 74 90 82 60 50 Z" fill="url(#silk)" stroke="#6e0716" strokeWidth="1" />
          <path d="M64 50 C86 30 102 34 102 50" stroke="#f1d58a" strokeWidth="1" fill="none" />
        </g>
        <path className="bow-tail" d="M54 54 L36 108 L46 102 L52 112 L60 58 Z" fill="url(#silk)" />
        <path className="bow-tail" d="M66 54 L84 108 L74 102 L68 112 L60 58 Z" fill="url(#silk)" />
        <circle cx="60" cy="50" r="10" fill="#a50f24" stroke="#f1d58a" strokeWidth="2" />
      </svg>
    </div>
  );
}
