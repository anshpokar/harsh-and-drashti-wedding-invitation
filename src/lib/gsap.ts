import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);
gsap.defaults({ ease: 'power3.out', duration: 1 });

export { gsap, ScrollTrigger, useGSAP };

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Standard "play once when scrolled into view" trigger. */
export const onEnter = (trigger: Element | null, start = 'top 80%'): ScrollTrigger.Vars => ({
  trigger,
  start,
  once: true,
});

/**
 * The signature gold name reveal used by the intro, hero and closing:
 * letters condense out of a blur, then "weds" blooms in between.
 */
export function nameRevealTimeline(scope: Element): gsap.core.Timeline {
  const q = gsap.utils.selector(scope);
  const lines = q('.name-line');
  const tl = gsap.timeline();
  lines.forEach((line, i) => {
    tl.from(
      line.querySelectorAll('.name-letter'),
      {
        autoAlpha: 0,
        yPercent: 45,
        scale: 1.5,
        filter: 'blur(14px)',
        duration: 1.1,
        stagger: 0.07,
        ease: 'expo.out',
      },
      i === 0 ? 0 : '-=0.45',
    );
    if (i === 0)
      tl.from(q('.name-weds'), { autoAlpha: 0, scale: 0.5, letterSpacing: '0.5em', duration: 1.2, ease: 'back.out(1.6)' }, '-=0.5');
  });
  return tl;
}
