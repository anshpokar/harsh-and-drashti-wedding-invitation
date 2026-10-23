import { useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';

/** Music toggle (vinyl), shown only when a track is configured. */
export function MusicToggle() {
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

  return (
    <>
      {music.src && (
        <button className={`vinyl ${playing ? 'is-playing' : ''}`} onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause music' : 'Play music'}>
          <span className="vinyl-label" />
        </button>
      )}
    </>
  );
}
