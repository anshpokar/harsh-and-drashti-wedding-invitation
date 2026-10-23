import { useRef } from 'react';
import { wedding } from '../config/wedding';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';
import { Divider, LotusEmblem } from './Ornaments';

/** Scene 3: sacred welcome — Ganesh invocation and the shloka written in, line by line. */
export function ShlokaSection() {
  const { shloka, ganeshImage } = wedding;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ scrollTrigger: onEnter(q('.paper-card')[0], 'top 75%') })
        .from(q('.paper-card'), { autoAlpha: 0, y: 40, duration: 1.2 })
        .from(q('.ganesh'), { autoAlpha: 0, scale: 0.3, rotation: -120, duration: 1.6, ease: 'back.out(1.4)' }, 0.3)
        .from(q('.invocation'), { autoAlpha: 0, y: 14, duration: 1 }, 0.9)
        .from(q('.divider'), { scaleX: 0, duration: 1, ease: 'expo.out' }, 1.1)
        // each Devanagari line is "inked" left to right
        .fromTo(
          q('.shloka-text'),
          { clipPath: 'inset(-30% 100% -30% 0%)' },
          { clipPath: 'inset(-30% 0% -30% 0%)', duration: 1.8, ease: 'power1.inOut', stagger: 1.4 },
          1.4,
        )
        .from(q('.shloka-translit p'), { autoAlpha: 0, y: 10, stagger: 0.25, duration: 0.9 }, '-=0.6')
        .from(q('.shloka-meaning'), { autoAlpha: 0, y: 12, duration: 1 }, '-=0.4');

      // the lotus keeps breathing gently
      gsap.to(q('.ganesh'), { scale: 1.06, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="blessings" className="scene paper shloka">
      <div className="paper-card paper-card--framed">
        <div className="ganesh">{ganeshImage ? <img src={ganeshImage} alt="Lord Ganesha" /> : <LotusEmblem />}</div>
        <p className="invocation devanagari">॥ श्री गणेशाय नमः ॥</p>
        <Divider />
        <div className="shloka-lines" lang="sa">
          {shloka.devanagari.map((line, i) => (
            <p key={i} className="devanagari shloka-text">
              {line}
            </p>
          ))}
        </div>
        <div className="shloka-translit">
          {shloka.transliteration.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <p className="shloka-meaning">{shloka.meaning}</p>
      </div>
    </section>
  );
}
