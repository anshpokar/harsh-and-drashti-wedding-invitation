import { wedding } from '../config/wedding';
import { dateParts } from '../lib/format';
import { CoupleNameReveal } from './CoupleNameReveal';
import { GoldDust } from './GoldDust';
import { Divider, Toran } from './Ornaments';

/** First scene after the doors: the names under a palace arch, continuing from the intro. */
export function HeroNames() {
  const { origin, destination, weddingDate } = wedding;
  return (
    <section id="top" className="scene hero">
      <Toran swags={5} className="hero-toran" />
      <GoldDust density={40} />
      <div className="hero-arch">
        <p className="eyebrow">A Royal Celebration of Love</p>
        <CoupleNameReveal play compact />
        <Divider />
        <p className="hero-places">
          {origin.city} <span aria-hidden="true">✦</span> {destination.city}
        </p>
        {weddingDate && <p className="hero-date">{Object.values(dateParts(weddingDate)).slice(1).join(' ')}</p>}
      </div>
      <a className="scroll-cue" href="#blessings" aria-label="Scroll to continue">
        <span />
      </a>
    </section>
  );
}
