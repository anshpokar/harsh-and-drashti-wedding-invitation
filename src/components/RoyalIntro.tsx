import { useCallback, useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
import { useReducedMotion } from '../lib/hooks';
import { CoupleNameReveal } from './CoupleNameReveal';
import { GoldDust } from './GoldDust';
import { Toran } from './Ornaments';
import { PalaceDoors, type DoorState } from './PalaceDoors';
import { RibbonReveal } from './RibbonReveal';

type Phase = 'closed' | 'releasing' | 'opening' | 'revealed' | 'leaving';

// Timeline for the CSS/SVG opening (ms after the guest taps).
const T = { ribbon: 0, doors: 900, names: 2500, autoEnter: 9500, fade: 900 };

/**
 * Scene 1 + 2: royal entrance → ribbon release → doors open → name reveal.
 * Works with or without the separately produced intro video.
 */
export function RoyalIntro({ onDone }: { onDone: () => void }) {
  const { intro } = wedding;
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('closed');
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);
  const useVideo = Boolean(intro.videoSrc) && !videoFailed && !reduced;
  const showRibbon = !(useVideo && intro.videoIncludesRibbon);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const finished = useRef(false);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setPhase('leaving');
    later(onDone, reduced ? 200 : T.fade);
  }, [onDone, reduced]);

  const open = () => {
    if (phase !== 'closed') return;
    if (reduced) {
      setPhase('revealed');
      later(finish, 2500);
      return;
    }
    setPhase('releasing');
    if (useVideo && videoRef.current) {
      videoRef.current.play().catch(() => setVideoFailed(true));
      return; // video timeupdate / ended drive the rest
    }
    later(() => setPhase('opening'), T.doors);
    later(() => setPhase('revealed'), T.names);
    later(finish, T.autoEnter);
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.currentTime >= intro.nameRevealAt) setPhase((p) => (p === 'leaving' ? p : 'revealed'));
    else if (v.currentTime >= 0.9) setPhase((p) => (p === 'releasing' ? 'opening' : p));
  };

  // If the video can't play after tapping, continue with the CSS doors.
  useEffect(() => {
    if (videoFailed && phase === 'releasing') {
      later(() => setPhase('opening'), T.doors);
      later(() => setPhase('revealed'), T.names);
      later(finish, T.autoEnter);
    }
  }, [videoFailed, phase, finish]);

  const doorState: DoorState = phase === 'closed' || phase === 'releasing' ? 'closed' : phase === 'opening' ? 'opening' : 'open';
  const ribbonReleased = phase !== 'closed';
  const namesVisible = phase === 'revealed' || phase === 'leaving';

  return (
    <div className={`intro intro--${phase} ${useVideo ? 'intro--video' : ''}`} role="dialog" aria-label="Wedding invitation opening">
      <div className="intro-vignette" />
      {useVideo ? (
        <video
          ref={videoRef}
          className="intro-video"
          muted
          playsInline
          preload="auto"
          poster={intro.posterSrc ?? undefined}
          onTimeUpdate={onTimeUpdate}
          onEnded={finish}
          onError={() => setVideoFailed(true)}
        >
          {intro.videoWebmSrc && <source src={intro.videoWebmSrc} type="video/webm" />}
          <source src={intro.videoSrc!} type="video/mp4" />
        </video>
      ) : (
        <>
          <Toran swags={4} className="intro-toran" />
          <div className="lantern lantern--left" />
          <div className="lantern lantern--right" />
        </>
      )}
      <GoldDust density={55} className="intro-dust" />

      <button className="intro-stage" onClick={open} aria-label="Tap to open the invitation" disabled={phase !== 'closed'}>
        {useVideo ? <div className="palace palace--video" /> : <PalaceDoors state={doorState} />}
        {showRibbon && <RibbonReveal released={ribbonReleased} />}
      </button>

      <div className="intro-copy">
        <p className="intro-eyebrow">A Royal Celebration of Love</p>
      </div>

      <div className="intro-names" aria-live="polite">
        {namesVisible && <CoupleNameReveal play />}
        {namesVisible && (
          <button className="btn btn--gold intro-enter" onClick={finish}>
            Enter the Celebration
          </button>
        )}
      </div>

      {phase === 'closed' && (
        <p className="intro-prompt">
          <span className="tap-ring" aria-hidden="true" />
          Tap to Open the Invitation
        </p>
      )}

      <button className="intro-skip" onClick={finish}>
        Skip intro
      </button>
    </div>
  );
}
