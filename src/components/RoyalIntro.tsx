import { useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
import { gsap, nameRevealTimeline, reducedMotion, useGSAP } from '../lib/gsap';
import { CoupleNameReveal } from './CoupleNameReveal';
import { FallingPetals } from './FallingPetals';
import { GoldDust } from './GoldDust';
import { Toran } from './Ornaments';
import { PalaceDoors } from './PalaceDoors';
import { RibbonReveal } from './RibbonReveal';

type Phase = 'closed' | 'opening' | 'revealed' | 'leaving';
type Q = (selector: string) => Element[];

/**
 * Scene 1 + 2: Royal Palace Entrance → Ribbon Unties → Doors Swing Open in 3D → Grand Durbar Name Reveal.
 * Masterfully synchronized GSAP timeline with realistic inertia and physical elegance.
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
      gsap.set(q('.doorway'), { perspective: 1400 });
      gsap.set(q('.door'), { transformPerspective: 1200, transformStyle: 'preserve-3d' });
      gsap.set(q('.ribbon'), { xPercent: -50, yPercent: -50 });
      gsap.set(q('.intro-names, .doorway-light, .intro-bloom, .seal-flare'), { autoAlpha: 0 });
      if (reducedMotion()) return;

      // Entrance: palace emerges with royal glow, garland drops, ribbon appears.
      gsap
        .timeline()
        .from(q('.palace, .palace-video-spacer'), { autoAlpha: 0, scale: 0.94, duration: 1.4, ease: 'power2.out' })
        .from(q('.intro-toran'), { yPercent: -100, duration: 1 }, 0.1)
        .from(q('.lantern'), { y: -120, duration: 1.2, ease: 'bounce.out', stagger: 0.12 }, 0.2)
        .from(q('.intro-eyebrow'), { autoAlpha: 0, y: 14, letterSpacing: '0.45em', duration: 1.2 }, 0.3)
        .from(q('.ribbon-fabric'), { scaleX: 0, duration: 0.9, ease: 'power2.inOut', transformOrigin: '50% 50%' }, 0.6)
        .from(q('.ribbon-center'), { scale: 0, rotation: -45, duration: 0.8, ease: 'back.out(2)' }, 0.9)
        .from(q('.intro-prompt'), { autoAlpha: 0, y: 16, duration: 0.8 }, 1.3);

      // Gentle ambient breathing while waiting for the tap
      gsap.to(q('.ribbon-seal'), { scale: 1.05, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.8 });
      gsap.to(q('.lantern'), { rotation: 3.5, transformOrigin: '50% 0%', duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.6 });
    },
    { scope: root },
  );

  const q: Q = (sel) => gsap.utils.toArray<Element>(root.current!.querySelectorAll(sel));

  const finish = contextSafe(() => {
    if (finished.current) return;
    finished.current = true;
    setPhase('leaving');
    gsap.to(root.current, { autoAlpha: 0, scale: 1.05, duration: reducedMotion() ? 0.2 : 0.9, ease: 'power2.inOut', onComplete: onDone });
  });

  const revealNames = contextSafe(() => {
    if (namesShown.current) return;
    namesShown.current = true;
    const names = q('.intro-names')[0];
    gsap
      .timeline()
      .set(names, { autoAlpha: 1 })
      .add(nameRevealTimeline(names))
      .from(q('.intro-enter'), { autoAlpha: 0, y: 18, scale: 0.92, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.3')
      .call(() => setPhase('revealed'), [], 0.3)
      .call(finish, [], '+=5.5');
  });

  const open = contextSafe(() => {
    if (phase !== 'closed') return;
    setPhase('opening');
    gsap.killTweensOf(q('.ribbon-seal, .lantern, .intro-prompt'));

    if (reducedMotion()) {
      gsap.set(q('.ribbon, .intro-stage'), { autoAlpha: 0.2 });
      gsap.set(q('.intro-names'), { autoAlpha: 1 });
      setPhase('revealed');
      gsap.delayedCall(2.5, finish);
      return;
    }

    if (useVideo && videoRef.current) {
      videoRef.current.play().catch(() => setVideoFailed(true));
      return;
    }

    // Master Synchronized Opening Timeline
    const master = gsap.timeline();

    // Step 1: Prompt fades out, radiant golden burst at seal
    master.to(q('.intro-prompt'), { autoAlpha: 0, duration: 0.25 }, 0);
    master.to(q('.seal-flare'), { scale: 2.6, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0);
    master.to(q('.seal-flare'), { autoAlpha: 0, duration: 0.4 }, 0.32);

    // Step 2: Seal unties and dissolves with gold flash (0.05s - 0.45s)
    master.to(q('.ribbon-seal'), { scale: 1.3, rotation: 12, autoAlpha: 0, duration: 0.38, ease: 'power2.in' }, 0.05);
    master.to(q('.bow-loop--left'), { scale: 0.1, rotation: -30, autoAlpha: 0, duration: 0.32, ease: 'power2.in' }, 0.05);
    master.to(q('.bow-loop--right'), { scale: 0.1, rotation: 30, autoAlpha: 0, duration: 0.32, ease: 'power2.in' }, 0.05);
    master.to(q('.bow-tail'), { scaleY: 0, autoAlpha: 0, duration: 0.28, ease: 'power2.in' }, 0.05);

    // Step 3: Silk ribbon bands part smoothly to left and right (0.12s - 0.7s)
    master.to(
      q('.ribbon-band--left'),
      { xPercent: -110, y: 35, rotation: -16, autoAlpha: 0, duration: 0.65, ease: 'power2.in' },
      0.12,
    );
    master.to(
      q('.ribbon-band--right'),
      { xPercent: 110, y: 35, rotation: 16, autoAlpha: 0, duration: 0.65, ease: 'power2.in' },
      0.12,
    );

    // Step 4: Palace doors unlatch & swing open in 3D (starts at 0.32s - perfectly in sync as ribbon parts!)
    master.to(q('.intro-copy'), { autoAlpha: 0, y: -20, duration: 0.5 }, 0.25);

    master.to(
      q('.door--left'),
      { rotationY: -105, duration: 2.1, ease: 'power2.inOut', filter: 'brightness(0.65)' },
      0.32,
    );
    master.to(
      q('.door--right'),
      { rotationY: 105, duration: 2.1, ease: 'power2.inOut', filter: 'brightness(0.65)' },
      0.32,
    );

    // Golden light rays stream from inside the Durbar hall
    master.to(q('.doorway-light'), { autoAlpha: 1, duration: 1.3, ease: 'power1.out' }, 0.45);
    master.to(q('.doorway-durbar'), { scale: 1.14, duration: 2.4, ease: 'power2.out' }, 0.35);

    // Step 5: Camera glides forward through the portal into the Durbar hall (1.1s - 2.8s)
    master.to(q('.intro-stage'), { scale: 1.45, duration: 2.3, ease: 'power2.inOut' }, 1.1);
    master.to(q('.intro-bloom'), { autoAlpha: 1, duration: 1.6 }, 1.2);
    master.to(q('.palace-arch-frame'), { autoAlpha: 0.2, duration: 1.5 }, 1.3);

    // Step 6: Royal Couple Names reveal inside the illuminated palace
    master.call(revealNames, [], 1.6);
  });

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.currentTime >= intro.nameRevealAt) revealNames();
  };

  const fallbackStarted = useRef(false);
  useEffect(() => {
    if (videoFailed && phase === 'opening' && !fallbackStarted.current) {
      fallbackStarted.current = true;
      open();
    }
  }, [videoFailed, phase, open]);

  return (
    <div ref={root} className={`intro intro--${phase}`} role="dialog" aria-label="Royal Wedding Invitation Opening">
      {/* Royal Palace Gateway Ambience Backdrop */}
      <div className="intro-palace-backdrop" />
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
          <Toran swags={5} className="intro-toran" />
          <div className="lantern lantern--left" />
          <div className="lantern lantern--right" />
        </>
      )}

      {/* Floating particles & falling rose petals */}
      <GoldDust density={50} className="intro-dust" />
      <FallingPetals count={24} className="intro-petals" />
      <div className="intro-bloom" />

      {/* The Central Royal Doorway Stage */}
      <button
        className="intro-stage"
        onClick={open}
        aria-label="Tap to open the royal wedding invitation"
        disabled={phase !== 'closed'}
      >
        {useVideo ? <div className="palace palace-video-spacer" /> : <PalaceDoors />}
        {showRibbon && <RibbonReveal />}
      </button>

      <div className="intro-copy">
        <p className="intro-eyebrow">A Royal Celebration of Love</p>
      </div>

      {/* Names Revealed Inside the Durbar Hall */}
      <div className="intro-names" aria-live="polite">
        <div className="intro-names-backdrop" />
        <CoupleNameReveal />
        <p className="intro-wedding-date">
          “Together Begins Forever”
        </p>
        <button className="btn btn--gold intro-enter" onClick={finish} tabIndex={phase === 'revealed' ? 0 : -1}>
          Enter the Royal Celebration ✦
        </button>
      </div>

      {/* Interactive Tap Prompt */}
      <p className="intro-prompt">
        <span className="tap-ring" aria-hidden="true" />
        Tap to Open the Royal Invitation
      </p>

      <button className="intro-skip" onClick={finish}>
        Skip intro
      </button>
    </div>
  );
}
