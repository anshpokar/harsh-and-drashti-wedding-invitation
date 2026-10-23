import { wedding } from '../config/wedding';
import { Divider, Pending, PhotoFrame } from './Ornaments';
import { Reveal } from './Reveal';

/** Scene 4: "Together with the blessings of our families" + portrait. */
export function CoupleIntroduction() {
  const { couple } = wedding;
  return (
    <section id="couple" className="scene royal couple">
      <Reveal>
        <p className="eyebrow">Together with the blessings of our families</p>
      </Reveal>
      <Reveal className="couple-portrait" delay={150}>
        <PhotoFrame photo={couple.portrait} label="Couple portrait" monogram="H & D" />
      </Reveal>
      <Reveal delay={300}>
        <h2 className="couple-names gold-text">
          {couple.groomName} <span className="amp">&amp;</span> {couple.brideName}
        </h2>
      </Reveal>
      <Reveal delay={400} className="couple-fullnames">
        {couple.groomFullName ? <p>{couple.groomFullName}</p> : <Pending label="Groom's full name" />}
        {couple.brideFullName ? <p>{couple.brideFullName}</p> : <Pending label="Bride's full name" />}
      </Reveal>
      <Divider />
      <Reveal delay={500}>
        <p className="couple-message">{couple.message}</p>
      </Reveal>
    </section>
  );
}
