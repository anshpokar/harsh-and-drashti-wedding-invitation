import { useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
import { gsap, nameRevealTimeline, reducedMotion, useGSAP } from '../lib/gsap';
import { CoupleNameReveal } from './CoupleNameReveal';
import { GoldDust } from './GoldDust';
import { Toran } from './Ornaments';
import { PalaceDoors } from './PalaceDoors';
import { RibbonReveal } from './RibbonReveal';

type Phase = 'closed' | 'opening' | 'revealed' | 'leaving';
type Q = (selector: string) => Element[];

/* ── Timeline pieces (seconds are relative to where each is placed) ── */

function ribbonRelease(q: Q) {
  return gsap
    .timeline()
    .to(q('.bow-loop--left'), { scaleX: 0.15, rotation: -25, transformOrigin: '100% 50%', duration: 0.5, ease: 'power2.in' }, 0)
    .to(q('.bow-loop--right'), { scaleX: 0.15, rotation: 25, transformOrigin: '0% 50%', duration: 0.5, ease: 'power2.in' }, 0)
    .to(q('.ribbon-bow'), { y: 170, rotation: 40, scale: 0.5, autoAlpha: 0, duration: 1, ease: 'power2.in' }, 0.3)
    .to(q('.ribbon-band--left'), { xPercent: -30, y: 140, rotation: -35, autoAlpha: 0, transformOrigin: '0% 50%', duration: 1.3, ease: 'power2.in' }, 0.35)
    .to(q('.ribbon-band--right'), { xPercent: 30, y: 140, rotation: 35, autoAlpha: 0, transformOrigin: '100% 50%', duration: 1.3, ease: 'power2.in' }, 0.35);
}

function doorsOpen(q: Q) {
  return gsap
    .timeline()
    .to(q('.intro-copy'), { autoAlpha: 0, y: -20, duration: 0.6 }, 0)
    .to(q('.door--left'), { rotationY: -108, filter: 'brightness(0.5)', duration: 2.4, ease: 'power3.inOut' }, 0)
    .to(q('.door--right'), { rotationY: 108, filter: 'brightness(0.5)', duration: 2.4, ease: 'power3.inOut' }, 0)
    .to(q('.doorway-light'), { autoAlpha: 1, duration: 1.6, ease: 'power1.out' }, 0.2);
}

function pushThroughAndReveal(q: Q) {
  const names = q('.intro-names')[0];
  return gsap
    .timeline()
    .to(q('.intro-stage'), { scale: 1.4, autoAlpha: 0.3, duration: 2.6, ease: 'power2.inOut' }, 0)
    .to(q('.intro-bloom'), { autoAlpha: 1, duration: 2 }, 0)
    .set(names, { autoAlpha: 1 }, 0.3)
    .add(nameRevealTimeline(names), 0.3)
    .from(q('.intro-enter'), { autoAlpha: 0, y: 16, duration: 1 }, '-=0.4');
}

/**
 * Scene 1 + 2: royal entrance → ribbon release → doors open → name reveal.
 * One GSAP master timeline; works with or without the separate intro video.
 */
export function RoyalIntro({ onDone }: { onDone: () => void }) {
  const { intro } = wedding;
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const namesShown = useRef(false);
  const [phase, setPhase] = useState<Phase>('closed');
  const [videoFailed, setVideoFailed] = useState(false);
  const useVideo = Boolean(intro.videoSrc) && !videoFailed && !reducedMotion();
  const showRibbon = !(useVideo && intro.videoIncludesRibbon);

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q('.door'), { transformPerspective: 1200 });
      gsap.set(q('.ribbon'), { xPercent: -50, yPercent: -50 });
      gsap.set(q('.ribbon-bow'), { xPercent: -50, yPercent: -42 });
      gsap.set(q('.intro-names, .doorway-light, .intro-bloom'), { autoAlpha: 0 });
      if (reducedMotion()) return;

      // Entrance: palace emerges from the dark, garland drops, ribbon stretches across.
      gsap
        .timeline()
        .from(q('.palace, .palace-video-spacer'), { autoAlpha: 0, scale: 0.9, duration: 1.8, ease: 'power2.out' })
        .from(q('.intro-toran'), { yPercent: -100, duration: 1.2 }, 0.2)
        .from(q('.lantern'), { y: -140, duration: 1.4, ease: 'bounce.out', stagger: 0.15 }, 0.3)
        .from(q('.intro-eyebrow'), { autoAlpha: 0, y: 16, letterSpacing: '0.7em', duration: 1.6 }, 0.5)
        .from(q('.ribbon'), { scaleX: 0, duration: 1.2, ease: 'power2.inOut' }, 0.9)
        .from(q('.ribbon-bow'), { scale: 0, rotation: -90, duration: 0.9, ease: 'back.out(2)' }, 1.6)
        .from(q('.intro-prompt'), { autoAlpha: 0, y: 20, duration: 1 }, 1.8);

      // Idle life while waiting for the tap.
      gsap.to(q('.ribbon-bow'), { rotation: 3, scale: 1.05, duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.5 });
      gsap.to(q('.lantern'), { rotation: 4, transformOrigin: '50% 0%', duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.7 });
    },
    { scope: root },
  );

  const q: Q = (sel) => gsap.utils.toArray<Element>(root.current!.querySelectorAll(sel));

  const finish = contextSafe(() => {
    if (finished.current) return;
    finished.current = true;
    setPhase('leaving');
    gsap.to(root.current, { autoAlpha: 0, scale: 1.06, duration: reducedMotion() ? 0.2 : 1, ease: 'power2.inOut', onComplete: onDone });
  });

  const revealNames = contextSafe(() => {
    if (namesShown.current) return;
    namesShown.current = true;
    gsap
      .timeline()
      .add(pushThroughAndReveal(q))
      .call(() => setPhase('revealed'), [], 0.5)
      .call(finish, [], '+=4.5');
  });

  const playDoors = contextSafe((delay: number) => {
    gsap.timeline({ delay }).add(doorsOpen(q)).add(revealNames, 1.5);
  });

  const open = contextSafe(() => {
    if (phase !== 'closed') return;
    setPhase('opening');
    gsap.killTweensOf(q('.ribbon-bow'));
    gsap.to(q('.intro-prompt'), { autoAlpha: 0, duration: 0.4 });

    if (reducedMotion()) {
      gsap.set(q('.ribbon, .intro-stage'), { autoAlpha: 0.2 });
      gsap.set(q('.intro-names'), { autoAlpha: 1 });
      setPhase('revealed');
      gsap.delayedCall(2.5, finish);
      return;
    }
    if (showRibbon) ribbonRelease(q);
    if (useVideo && videoRef.current) {
      videoRef.current.play().catch(() => setVideoFailed(true));
      return; // timeupdate drives the names; `ended` finishes
    }
    playDoors(0.9);
  });

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.currentTime >= intro.nameRevealAt) revealNames();
  };

  // Video couldn't play after the tap → continue with the SVG doors.
  const fallbackStarted = useRef(false);
  useEffect(() => {
    if (videoFailed && phase === 'opening' && !fallbackStarted.current) {
      fallbackStarted.current = true;
      playDoors(0.3);
    }
  }, [videoFailed, phase, playDoors]);

  return (
    <div ref={root} className={`intro intro--${phase}`} role="dialog" aria-label="Wedding invitation opening">
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
      <div className="intro-bloom" />

      <button className="intro-stage" onClick={open} aria-label="Tap to open the invitation" disabled={phase !== 'closed'}>
        {useVideo ? <div className="palace palace-video-spacer" /> : <PalaceDoors />}
        {showRibbon && <RibbonReveal />}
      </button>

      <div className="intro-copy">
        <p className="intro-eyebrow">A Royal Celebration of Love</p>
      </div>

      <div className="intro-names" aria-live="polite">
        <CoupleNameReveal />
        <button className="btn btn--gold intro-enter" onClick={finish} tabIndex={phase === 'revealed' ? 0 : -1}>
          Enter the Celebration
        </button>
      </div>

      <p className="intro-prompt">
        <span className="tap-ring" aria-hidden="true" />
        Tap to Open the Invitation
      </p>

      <button className="intro-skip" onClick={finish}>
        Skip intro
      </button>
    </div>
  );
}
