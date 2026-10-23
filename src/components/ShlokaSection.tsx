import { wedding } from '../config/wedding';
import { showPlaceholders } from '../lib/content';
import { GoldDust } from './GoldDust';
import { Divider, LotusEmblem } from './Ornaments';
import { Reveal } from './Reveal';

/** Scene 3: sacred welcome — Ganesh invocation and the shloka written in line by line. */
export function ShlokaSection() {
  const { shloka, ganeshImage } = wedding;
  return (
    <section id="blessings" className="scene parchment shloka">
      <GoldDust density={18} className="dust-soft" />
      <div className="parchment-border">
        <Reveal className="ganesh">
          {ganeshImage ? <img src={ganeshImage} alt="Lord Ganesha" /> : <LotusEmblem />}
        </Reveal>
        <Reveal delay={150}>
          <p className="invocation devanagari">॥ श्री गणेशाय नमः ॥</p>
        </Reveal>
        <Divider className="divider--dark" />
        <div className="shloka-lines" lang="sa">
          {shloka.devanagari.map((line, i) => (
            <Reveal key={i} className="ink-line" delay={300 + i * 900}>
              <p className="devanagari shloka-text">{line}</p>
            </Reveal>
          ))}
        </div>
        <div className="shloka-translit">
          {shloka.transliteration.map((line, i) => (
            <Reveal key={i} delay={1900 + i * 200}>
              <p>{line}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={2400}>
          <p className="shloka-meaning">{shloka.meaning}</p>
        </Reveal>
        {showPlaceholders && !shloka.verified && (
          <p className="pending pending--block">Preview: shloka text awaiting family / pandit verification</p>
        )}
      </div>
    </section>
  );
}
