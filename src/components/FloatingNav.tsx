import { useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';

/** Clean circular music toggle button without text badges or indicators. */
export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const { music } = wedding;

  useEffect(() => {
    if (!music.src) return;
    const a = Object.assign(new Audio(music.src), { loop: true, volume: 0.55 });
    audio.current = a;

    // Autoplay attempt once guest has entered celebration
    const playPromise = a.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setPlaying(true))
        .catch(() => {
          setPlaying(false);
        });
    }

    return () => {
      a.pause();
    };
  }, [music.src]);

  const toggle = () => {
    if (!audio.current) return;
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      audio.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  if (!music.src) return null;

  return (
    <button
      className={`royal-music-btn ${playing ? 'is-playing' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause music' : 'Play music'}
      title={playing ? 'Pause music' : 'Play music'}
    >
      <span className="music-icon" aria-hidden="true">{playing ? '♫' : '♪'}</span>
    </button>
  );
}
