/**
 * Opulent royal Indian wedding silk satin ribbon with golden embroidery
 * and an embossed golden royal seal medallion at the center.
 * Perfectly synchronized to untie, split, and glide away as the palace doors swing open.
 */
export function RibbonReveal() {
  return (
    <div className="ribbon" aria-hidden="true">
      {/* Golden flash flare triggered on click */}
      <div className="seal-flare" />

      {/* Left Silk Ribbon Band */}
      <div className="ribbon-band ribbon-band--left">
        <div className="ribbon-fabric">
          <div className="ribbon-gold-trim ribbon-gold-trim--top" />
          <div className="ribbon-sheen" />
          <div className="ribbon-gold-trim ribbon-gold-trim--bottom" />
        </div>
      </div>

      {/* Right Silk Ribbon Band */}
      <div className="ribbon-band ribbon-band--right">
        <div className="ribbon-fabric">
          <div className="ribbon-gold-trim ribbon-gold-trim--top" />
          <div className="ribbon-sheen" />
          <div className="ribbon-gold-trim ribbon-gold-trim--bottom" />
        </div>
      </div>

      {/* Central Royal Wedding Seal & Satin Bow */}
      <div className="ribbon-center">
        {/* Silk Bow Loops */}
        <div className="bow-loop bow-loop--left">
          <svg viewBox="0 0 70 50" className="bow-svg">
            <path
              d="M 68 25 C 40 5 10 10 2 25 C 10 40 40 45 68 25 Z"
              fill="url(#satinRed)"
              stroke="#e2bb5a"
              strokeWidth="1.2"
            />
            <path d="M 60 25 C 40 16 18 18 10 25" stroke="#fce49b" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
        </div>

        <div className="bow-loop bow-loop--right">
          <svg viewBox="0 0 70 50" className="bow-svg">
            <path
              d="M 2 25 C 30 5 60 10 68 25 C 60 40 30 45 2 25 Z"
              fill="url(#satinRed)"
              stroke="#e2bb5a"
              strokeWidth="1.2"
            />
            <path d="M 10 25 C 30 16 52 18 60 25" stroke="#fce49b" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
        </div>

        {/* Satin Ribbon Tails */}
        <svg viewBox="0 0 100 80" className="bow-tails">
          <defs>
            <linearGradient id="satinRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#db1c3a" />
              <stop offset="45%" stopColor="#9a0e23" />
              <stop offset="70%" stopColor="#b5152d" />
              <stop offset="100%" stopColor="#630715" />
            </linearGradient>
            <linearGradient id="goldMedal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe699" />
              <stop offset="35%" stopColor="#d8ab43" />
              <stop offset="70%" stopColor="#f3d489" />
              <stop offset="100%" stopColor="#8d621b" />
            </linearGradient>
          </defs>
          <path className="bow-tail bow-tail--left" d="M 45 10 L 20 72 L 35 64 L 44 76 L 49 14 Z" fill="url(#satinRed)" />
          <path className="bow-tail bow-tail--right" d="M 55 10 L 80 72 L 65 64 L 56 76 L 51 14 Z" fill="url(#satinRed)" />
        </svg>

        {/* Embossed Royal Gold Seal Medallion */}
        <div className="ribbon-seal">
          <svg viewBox="0 0 80 80" className="seal-svg">
            {/* Outer beaded rim */}
            <circle cx="40" cy="40" r="37" fill="url(#goldMedal)" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))" />
            <circle cx="40" cy="40" r="33" fill="#690a18" stroke="url(#goldMedal)" strokeWidth="2" />
            <circle cx="40" cy="40" r="31" fill="none" stroke="#fce49b" strokeWidth="0.8" strokeDasharray="2, 2" />

            {/* Auspicious Royal Lotus / Sunburst */}
            <g transform="translate(40, 40)">
              {Array.from({ length: 8 }, (_, i) => i * 45).map((deg) => (
                <path
                  key={deg}
                  d="M 0 -22 C -4 -12 -5 -4 0 0 C 5 -4 4 -12 0 -22 Z"
                  fill="url(#goldMedal)"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle r="7.5" fill="url(#goldMedal)" />
              <circle r="4" fill="#690a18" />
              <circle r="2" fill="#fff5cc" />
            </g>
          </svg>
          <div className="seal-sparkle" />
        </div>
      </div>
    </div>
  );
}
