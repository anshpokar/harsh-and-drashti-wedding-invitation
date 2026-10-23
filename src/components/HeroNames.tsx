import { useRef } from 'react';
import { wedding } from '../config/wedding';
import { dateParts } from '../lib/format';
import { gsap, nameRevealTimeline, reducedMotion, useGSAP } from '../lib/gsap';
import { CoupleNameReveal } from './CoupleNameReveal';
import { GoldDust } from './GoldDust';
import { Divider, Toran } from './Ornaments';

/** First scene after the doors: the names under a palace arch, continuing from the intro. */
export function HeroNames({ entered }: { entered: boolean }) {
  const { origin, destination, weddingDate } = wedding;
  const ref = useRef<HTMLElement>(null);
  const parts = weddingDate ? dateParts(weddingDate) : null;

  useGSAP(
    () => {
      if (!entered || reducedMotion()) return;
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ delay: 0.2 })
        .from(q('.hero-arch'), { autoAlpha: 0, scaleY: 0.85, transformOrigin: '50% 100%', duration: 1.4, ease: 'expo.out' })
        .from(q('.hero-toran'), { yPercent: -100, duration: 1 }, 0)
        .from(q('.hero-arch .eyebrow'), { autoAlpha: 0, y: 10, duration: 0.9 }, 0.4)
        .add(nameRevealTimeline(q('.name-reveal')[0]), 0.5)
        .from(q('.hero-arch .divider'), { scaleX: 0, duration: 1, ease: 'expo.out' }, '-=0.6')
        .from(q('.hero-places > *'), { autoAlpha: 0, y: 12, stagger: 0.15, duration: 0.8 }, '-=0.6')
        .from(q('.hero-date'), { autoAlpha: 0, y: 10, duration: 0.8 }, '-=0.4')
        .from(q('.scroll-cue'), { autoAlpha: 0, y: -10, duration: 0.8 }, '-=0.2');

      // Parallax as the hero scrolls away: arch drifts up, garland lifts, glow fades.
      const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(q('.hero-arch'), { yPercent: -18, scale: 0.94, ease: 'none', scrollTrigger: st });
      gsap.to(q('.hero-toran'), { yPercent: -60, ease: 'none', scrollTrigger: st });
      gsap.to(q('.hero-glow'), { autoAlpha: 0, ease: 'none', scrollTrigger: st });
    },
    { scope: ref, dependencies: [entered] },
  );

  return (
    <section ref={ref} id="top" className="scene hero">
      <div className="hero-glow" />
      <Toran swags={5} className="hero-toran" />
      <GoldDust density={40} />
      <div className="hero-arch">
        <p className="eyebrow">A Royal Celebration of Love</p>
        <CoupleNameReveal compact />
        <Divider />
        <p className="hero-places">
          <span>{origin.city}</span>
          <span aria-hidden="true">✦</span>
          <span>{destination.city}</span>
        </p>
        {parts && (
          <p className="hero-date">
            {parts.day} · {parts.month} · {parts.year}
          </p>
        )}
      </div>
      <a className="scroll-cue" href="#blessings" aria-label="Scroll to continue">
        <span />
      </a>
    </section>
  );
}
