import { wedding } from '../config/wedding';
import { GoldDust } from './GoldDust';
import { Divider, LotusEmblem, Toran } from './Ornaments';
import { Reveal } from './Reveal';

/** Final scene: the formal invitation and a graceful close. */
export function ClosingInvitation({ onReplay }: { onReplay: () => void }) {
  const { closing, couple } = wedding;
  return (
    <section id="closing" className="scene closing">
      <Toran swags={5} className="closing-toran" />
      <GoldDust density={50} />
      <Reveal>
        <p className="closing-invitation">{closing.invitation}</p>
      </Reveal>
      <Reveal delay={200}>
        <p className="closing-blessing">{closing.blessing}</p>
      </Reveal>
      <Divider />
      <Reveal className="closing-title" delay={400}>
        <h2 className="gold-text">
          {couple.groomName} <span className="name-weds">weds</span> {couple.brideName}
        </h2>
        <p className="closing-tagline">{closing.tagline}</p>
      </Reveal>
      <Reveal delay={700}>
        <LotusEmblem className="closing-lotus" />
      </Reveal>
      <button className="btn btn--ghost" onClick={onReplay}>
        Replay the Royal Entrance
      </button>
    </section>
  );
}
