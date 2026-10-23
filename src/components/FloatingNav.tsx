import { useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';

/** Always-available shortcuts so guests never have to hunt for key details. */
export function FloatingNav() {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const { music } = wedding;

  useEffect(() => () => audio.current?.pause(), []);

  const toggle = () => {
    if (!music.src) return;
    audio.current ??= Object.assign(new Audio(music.src), { loop: true, volume: 0.6 });
    if (playing) audio.current.pause();
    else audio.current.play().catch(() => setPlaying(false));
    setPlaying(!playing);
  };

  const links = [
    ['#date', 'Date'],
    ['#events', 'Events'],
    ['#venue', 'Venue'],
    ['#rsvp', 'RSVP'],
  ];

  return (
    <>
      <nav className="floating-nav" aria-label="Quick links">
        {links.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      {music.src && (
        <button className={`vinyl ${playing ? 'is-playing' : ''}`} onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause music' : 'Play music'}>
          <span className="vinyl-label" />
        </button>
      )}
    </>
  );
}

export function PreviewBanner() {
  if (!wedding.previewMode) return null;
  return (
    <div className="preview-banner" role="note">
      Preview mode — dashed labels mark details still to be provided. Set <code>previewMode: false</code> before sharing.
    </div>
  );
}
