import { useRef } from 'react';
import { wedding } from '../config/wedding';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';
import { Divider, Pending, PhotoFrame } from './Ornaments';

/** Scene 4: "Together with the blessings of our families" + portrait. */
export function CoupleIntroduction() {
  const { couple } = wedding;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ scrollTrigger: onEnter(ref.current, 'top 70%') })
        .from(q('.eyebrow'), { autoAlpha: 0, y: 10, duration: 0.9 })
        // portrait rises out of its arch like a curtain lifting
        .fromTo(q('.couple-portrait'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power3.inOut' }, 0.2)
        .from(q('.couple-names .cn-part'), { autoAlpha: 0, y: 30, stagger: 0.18, duration: 1, ease: 'back.out(1.6)' }, 1)
        .from(q('.couple-fullnames > *'), { autoAlpha: 0, x: (i) => (i ? 24 : -24), duration: 0.9 }, 1.4)
        .from(q('.divider'), { scaleX: 0, duration: 1 }, 1.6)
        .from(q('.couple-message'), { autoAlpha: 0, y: 12, duration: 1 }, 1.8);

      // slow parallax drift on the photo while scrolling
      gsap.fromTo(
        q('.couple-portrait img, .couple-portrait .photo-placeholder'),
        { scale: 1.15, yPercent: -6 },
        { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="couple" className="scene paper paper--alt couple">
      <p className="eyebrow">Together with the blessings of our families</p>
      <div className="couple-portrait">
        <PhotoFrame photo={couple.portrait} label="Couple portrait" monogram="H & D" />
      </div>
      <h2 className="couple-names script-title">
        <span className="cn-part">{couple.groomName}</span> <span className="cn-part amp">&amp;</span>{' '}
        <span className="cn-part">{couple.brideName}</span>
      </h2>
      <div className="couple-fullnames">
        {couple.groomFullName ? <p>{couple.groomFullName}</p> : <Pending label="Groom's full name" />}
        {couple.brideFullName ? <p>{couple.brideFullName}</p> : <Pending label="Bride's full name" />}
      </div>
      <Divider />
      <p className="couple-message">{couple.message}</p>
    </section>
  );
}
