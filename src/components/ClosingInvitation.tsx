import { useRef } from 'react';
import { wedding } from '../config/wedding';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';
import { Divider } from './Ornaments';

/** Circular postmark: city on top, INDIA below, the date across the middle. */
function Postmark({ city, date }: { city: string; date: string | null }) {
  return (
    <svg className="postmark" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="pm-top" d="M20 60 a40 40 0 0 1 80 0" />
        <path id="pm-bottom" d="M16 60 a44 44 0 0 0 88 0" />
      </defs>
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="1" />
      <text className="pm-ring">
        <textPath href="#pm-top" startOffset="50%" textAnchor="middle">
          {city.toUpperCase()}
        </textPath>
      </text>
      <text className="pm-ring">
        <textPath href="#pm-bottom" startOffset="50%" textAnchor="middle">
          INDIA
        </textPath>
      </text>
      {date && (
        <text x="60" y="65" textAnchor="middle" className="pm-date">
          {date}
        </text>
      )}
    </svg>
  );
}

/** Red wax seal with the couple's initials. */
function WaxSeal({ a, b }: { a: string; b: string }) {
  const blob = Array.from({ length: 16 }, (_, i) => {
    const ang = (i / 16) * Math.PI * 2;
    const r = i % 2 ? 44 : 48;
    return `${50 + Math.cos(ang) * r},${50 + Math.sin(ang) * r}`;
  }).join(' ');
  return (
    <svg className="wax-seal" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="wax" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#c0392b" />
          <stop offset="0.6" stopColor="#8e1b22" />
          <stop offset="1" stopColor="#5a0f16" />
        </radialGradient>
      </defs>
      <polygon points={blob} fill="url(#wax)" strokeLinejoin="round" stroke="#6e1218" strokeWidth="3" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#e6a19a" strokeOpacity="0.55" strokeWidth="1.6" />
      <text x="50" y="58" textAnchor="middle" className="seal-initials">
        {a}&amp;{b}
      </text>
    </svg>
  );
}

/** Final scene: invitation lines, then the "Thank You" airmail letter. */
export function ClosingInvitation({ onReplay }: { onReplay: () => void }) {
  const { closing, couple, origin, destination, weddingDate } = wedding;
  const ref = useRef<HTMLElement>(null);
  const stampDate = weddingDate ? weddingDate.slice(2).split('-').reverse().join(' · ') : null;

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ scrollTrigger: onEnter(ref.current, 'top 70%') })
        .from(q('.closing-invitation, .closing-blessing'), { autoAlpha: 0, y: 20, stagger: 0.2, duration: 1 })
        .from(q('.closing-lead .divider'), { scaleX: 0, duration: 1 }, 0.4);

      gsap
        .timeline({ scrollTrigger: onEnter(q('.letter')[0], 'top 75%') })
        .from(q('.letter'), { autoAlpha: 0, y: 120, rotation: -6, duration: 1.4, ease: 'power3.out' })
        .fromTo(q('.letter-thanks'), { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.6, ease: 'power2.inOut' }, 0.6)
        .from(q('.letter-body, .letter-sign-label'), { autoAlpha: 0, y: 10, stagger: 0.2, duration: 0.8 }, 1.2)
        .fromTo(q('.letter-sign'), { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.4, ease: 'power2.inOut' }, 1.6)
        // stamp hits the paper…
        .from(q('.postmark'), { scale: 2.2, rotation: 40, autoAlpha: 0, duration: 0.45, ease: 'power4.in' }, 2.4)
        .to(q('.letter'), { keyframes: { y: [0, 4, 0] }, duration: 0.25 }, 2.85)
        // …then the wax seal presses down
        .from(q('.seal-wrap'), { scale: 2.6, y: -60, autoAlpha: 0, duration: 0.55, ease: 'power4.in' }, 3)
        .to(q('.seal-wrap'), { keyframes: { scale: [1, 0.92, 1] }, duration: 0.3, ease: 'power1.out' }, 3.55)
        .from(q('.letter-to-line'), { autoAlpha: 0, x: -20, stagger: 0.25, duration: 0.8 }, 3.6)
        .from(q('.closing-tagline, .closing-replay'), { autoAlpha: 0, y: 14, stagger: 0.2, duration: 0.8 }, 4.4);

      // marigold petals drifting down while the closing is on screen
      const petals = q('.petal');
      const fall = gsap.timeline({ paused: true });
      petals.forEach((p) => {
        fall.fromTo(
          p,
          { x: gsap.utils.random(0, window.innerWidth), y: -40, rotation: gsap.utils.random(0, 360) },
          {
            y: () => (ref.current?.offsetHeight ?? 900) + 40,
            x: '+=' + gsap.utils.random(-80, 80),
            rotation: '+=' + gsap.utils.random(180, 540),
            duration: gsap.utils.random(6, 11),
            ease: 'none',
            repeat: -1,
            delay: gsap.utils.random(0, 6),
          },
          0,
        );
      });
      gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? fall.play() : fall.pause()) },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="closing" className="scene closing">
      <div className="petals" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <i key={i} className={`petal petal--${i % 3}`} />
        ))}
      </div>

      <div className="closing-lead">
        <p className="closing-invitation">{closing.invitation}</p>
        <p className="closing-blessing">{closing.blessing}</p>
        <Divider />
      </div>

      <article className="letter">
        <div className="letter-paper">
          <h2 className="letter-thanks">Thank You</h2>
          <p className="letter-body">
            for being part of our journey, from {origin.city} to {destination.city}. Your love and blessings mean the world to us.
          </p>
          <p className="letter-sign-label">With love,</p>
          <p className="letter-sign">
            {couple.groomName} &amp; {couple.brideName}
          </p>
          <hr />
          <div className="letter-stamps">
            <Postmark city={destination.city} date={stampDate} />
            <div className="stamp">
              <div className="seal-wrap">
                <WaxSeal a={couple.groomName[0]} b={couple.brideName[0]} />
              </div>
            </div>
          </div>
          <p className="letter-to-label">To</p>
          <p className="letter-to-line">Our dear family</p>
          <p className="letter-to-line">&amp; friends,</p>
          <p className="letter-to-line">with all our love</p>
        </div>
      </article>

      <p className="closing-tagline">{closing.tagline}</p>
      <button className="btn btn--ghost closing-replay" onClick={onReplay}>
        Replay the Royal Entrance
      </button>
    </section>
  );
}
