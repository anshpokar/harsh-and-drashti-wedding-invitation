/**
 * Authentic hand-carved Indian royal palace double doors.
 * Left and right carved teakwood leaves with brass elephant knockers,
 * opening in 3D perspective onto the grand illuminated Durbar Hall.
 */
function DoorLeaf({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`door-leaf door-leaf--${side}`} aria-hidden="true">
      <img
        src="/media/royal-door-leaf.jpg"
        alt=""
        className="door-leaf-img"
        style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}
      />
      <div className="door-leaf-overlay" />
      <div className="door-leaf-edge-bevel" />
    </div>
  );
}

/** Carved palace doorway. Opening is animated by RoyalIntro's GSAP timeline. */
export function PalaceDoors() {
  return (
    <div className="palace" aria-hidden="true">
      {/* Ornate Rajasthani Scalloped Archway Frame */}
      <div className="palace-arch-frame">
        <svg className="palace-arch-svg" viewBox="0 0 100 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="goldStone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="30%" stopColor="#f7e199" />
              <stop offset="70%" stopColor="#c59835" />
              <stop offset="100%" stopColor="#8a6323" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Multi-scalloped Royal Arch */}
          <path
            d="M 5 160 V 50 C 5 24 22 8 50 2 C 78 8 95 24 95 50 V 160"
            fill="none"
            stroke="url(#goldStone)"
            strokeWidth="3"
            filter="url(#goldGlow)"
          />
          <path
            d="M 9 160 V 52 C 9 28 26 13 50 7 C 74 13 91 28 91 52 V 160"
            fill="none"
            stroke="rgba(247, 225, 153, 0.45)"
            strokeWidth="1.2"
          />
        </svg>

        {/* Decorative corner florals on the arch */}
        <div className="arch-crest">
          <svg viewBox="0 0 60 40" className="arch-crest-svg">
            <path
              d="M 30 5 C 20 18 10 24 0 28 C 12 28 24 24 30 35 C 36 24 48 28 60 28 C 50 24 40 18 30 5 Z"
              fill="url(#goldStone)"
            />
            <circle cx="30" cy="18" r="3.5" fill="#fbe7a6" />
          </svg>
        </div>
      </div>

      {/* The 3D doorway opening */}
      <div className="doorway">
        {/* The grand illuminated Durbar hall inside */}
        <div className="doorway-durbar">
          <img
            src="/media/royal-palace-durbar.jpg"
            alt="Royal Palace Durbar"
            className="doorway-durbar-img"
          />
          <div className="doorway-durbar-glow" />
        </div>

        {/* Radiant golden threshold flare */}
        <div className="doorway-light" />

        {/* Left and right 3D swinging door leaves */}
        <div className="door door--left">
          <DoorLeaf side="left" />
        </div>
        <div className="door door--right">
          <DoorLeaf side="right" />
        </div>

        {/* Center door seam shadow */}
        <div className="doorway-seam" />
      </div>
    </div>
  );
}
