import { useRef } from 'react';
import { gsap, nameRevealTimeline, reducedMotion, useGSAP } from '../lib/gsap';
import { CoupleNameReveal } from './CoupleNameReveal';
import { FallingPetals } from './FallingPetals';
import { GoldDust } from './GoldDust';
import { Divider, Toran } from './Ornaments';

/**
 * Royal Hero Scene: The couple names set against a grand illuminated Rajasthani Palace (Mahal) at night,
 * framed within an ornate scalloped Jharokha arch with romantic royal quotes, falling rose petals and floating gold dust.
 */
export function HeroNames({ entered }: { entered: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!entered || reducedMotion()) return;
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ delay: 0.15 })
        .from(q('.hero-mahal-bg'), { scale: 1.08, duration: 2.2, ease: 'power2.out' }, 0)
        .from(q('.hero-arch'), { autoAlpha: 0, scale: 0.92, y: 24, duration: 1.4, ease: 'power3.out' }, 0.2)
        .from(q('.hero-toran'), { yPercent: -100, duration: 1 }, 0.1)
        .from(q('.hero-ganesh-emblem'), { autoAlpha: 0, scale: 0.6, rotation: -10, duration: 1, ease: 'back.out(1.8)' }, 0.3)
        .from(q('.hero-eyebrow'), { autoAlpha: 0, y: 10, letterSpacing: '0.4em', duration: 0.9 }, 0.5)
        .add(nameRevealTimeline(q('.name-reveal')[0]), 0.6)
        .from(q('.hero-divider'), { scaleX: 0, duration: 0.9, ease: 'expo.out' }, '-=0.5')
        .from(q('.hero-quote-card'), { autoAlpha: 0, y: 16, duration: 0.8 }, '-=0.5')
        .from(q('.hero-quote-sub'), { autoAlpha: 0, y: 12, duration: 0.8 }, '-=0.4')
        .from(q('.scroll-cue'), { autoAlpha: 0, y: -10, duration: 0.8 }, '-=0.2');

      // Parallax as the hero scrolls away: mahal background gently floats, arch lifts gracefully.
      const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(q('.hero-mahal-bg'), { yPercent: 12, scale: 1.05, ease: 'none', scrollTrigger: st });
      gsap.to(q('.hero-arch'), { yPercent: -18, scale: 0.95, ease: 'none', scrollTrigger: st });
      gsap.to(q('.hero-toran'), { yPercent: -60, ease: 'none', scrollTrigger: st });
      gsap.to(q('.hero-mahal-overlay'), { autoAlpha: 0.85, ease: 'none', scrollTrigger: st });
    },
    { scope: ref, dependencies: [entered] },
  );

  return (
    <section ref={ref} id="top" className="scene hero hero--royal-mahal">
      {/* Grand Illuminated Royal Mahal Backdrop */}
      <div className="hero-mahal-wrap" aria-hidden="true">
        <img
          src="/media/royal-mahal-bg.jpg"
          alt="Royal Indian Palace Mahal at Night"
          className="hero-mahal-bg"
        />
        <div className="hero-mahal-overlay" />
        <div className="hero-glow" />
      </div>

      <Toran swags={5} className="hero-toran" />
      <GoldDust density={45} />
      <FallingPetals count={26} className="hero-petals" />

      {/* Ornate Royal Jharokha Pavilion Framing the Couple */}
      <div className="hero-arch">
        {/* Auspicious Golden Emblem */}
        <div className="hero-ganesh-emblem" aria-hidden="true">
          <svg viewBox="0 0 80 80" className="hero-crest-svg">
            <defs>
              <linearGradient id="crestGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffe699" />
                <stop offset="40%" stopColor="#d4af37" />
                <stop offset="80%" stopColor="#f3d489" />
                <stop offset="100%" stopColor="#8a6323" />
              </linearGradient>
            </defs>
            {/* Scalloped halo */}
            <circle cx="40" cy="40" r="36" fill="none" stroke="url(#crestGold)" strokeWidth="1.2" strokeDasharray="3, 2" />
            <circle cx="40" cy="40" r="31" fill="rgba(42, 8, 18, 0.65)" stroke="url(#crestGold)" strokeWidth="1.6" />
            {/* Kalash & Lotus motif */}
            <path
              d="M 40 18 C 34 26 32 30 40 38 C 48 30 46 26 40 18 Z"
              fill="url(#crestGold)"
            />
            <path
              d="M 28 35 C 33 34 38 35 40 38 C 42 35 47 34 52 35 C 50 42 45 45 40 45 C 35 45 30 42 28 35 Z"
              fill="url(#crestGold)"
            />
            <path
              d="M 33 46 H 47 L 49 57 C 49 61 31 61 31 57 Z"
              fill="url(#crestGold)"
            />
            <circle cx="40" cy="27" r="2.5" fill="#fff5cc" />
          </svg>
          <p className="hero-invocation">॥ श्री गणेशाय नमः ॥</p>
        </div>

        <p className="eyebrow hero-eyebrow">A Royal Celebration of Love</p>

        {/* The Couple Names */}
        <CoupleNameReveal compact />

        <div className="hero-divider">
          <Divider />
        </div>

        {/* Romantic Royal Quotes (Replacing date and city references) */}
        <div className="hero-quote-card">
          <p className="hero-quote-main">
            “Two hearts, two souls, one eternal promise.”
          </p>
        </div>

        <p className="hero-quote-sub">
          <span>Together Begins Forever</span>
          <span className="hero-diamond" aria-hidden="true">✦</span>
          <span>Blessed by Our Elders</span>
        </p>
      </div>

      {/* Royal Scroll Prompt */}
      <a className="scroll-cue" href="#blessings" aria-label="Scroll to enter the celebration">
        <span className="scroll-cue-ring" />
        <span className="scroll-cue-label">Explore the Celebration</span>
      </a>
    </section>
  );
}
