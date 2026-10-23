import { useRef } from 'react';
import { wedding } from '../config/wedding';
import { homecomingEvent, venueMapsLink } from '../lib/content';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';
import { SectionTitle } from './Ornaments';
import { Reveal } from './Reveal';

/*
 * Equirectangular projection of western India, lon 67.8–76.2°E, lat 17.2–25°N,
 * into a 400×400 viewBox (x scaled by cos 21° so shapes aren't stretched).
 */
const project = (lon: number, lat: number): [number, number] => [
  +((lon - 67.8) * 47.62).toFixed(1),
  +((25 - lat) * 51.28).toFixed(1),
];

// Simplified Gujarat–Konkan coastline, north to south (real lon/lat).
const COAST: [number, number][] = [
  [67.8, 23.8], [68.2, 23.7], [68.6, 23.2], [69.35, 22.83], [69.72, 22.84], [70.2, 23.0],
  [70.45, 22.95], [70.06, 22.47], [69.08, 22.47], [68.97, 22.24], [69.61, 21.64], [70.36, 20.91],
  [70.98, 20.71], [71.37, 20.87], [72.15, 21.77], [72.62, 22.3], [72.58, 21.7], [72.65, 21.1],
  [72.9, 20.6], [72.83, 20.41], [72.72, 19.97], [72.82, 18.94], [72.87, 18.64], [72.96, 18.33],
  [73.02, 18.03], [73.3, 16.99],
];

const coastPath = COAST.map(([lon, lat], i) => `${i ? 'L' : 'M'}${project(lon, lat).join(' ')}`).join(' ');
const landPath = `${coastPath} L400 420 L400 -10 L-10 -10 L-10 ${project(67.8, 23.8)[1]} Z`;

const BADLAPUR = project(73.265, 19.155);
const AHMEDABAD = project(72.571, 23.023);
const SURAT = project(72.831, 21.17);
const VADODARA = project(73.181, 22.307);
const MUMBAI = project(72.878, 19.076);

// Route drawn through Surat and Vadodara, the way the journey actually runs north.
const ROUTE = `M${BADLAPUR} C${BADLAPUR[0] - 6} ${BADLAPUR[1] - 50} ${SURAT[0] - 6} ${SURAT[1] + 34} ${SURAT}
  S${VADODARA[0] + 2} ${VADODARA[1] + 22} ${VADODARA} S${AHMEDABAD[0] + 8} ${AHMEDABAD[1] + 12} ${AHMEDABAD}`;

// Homecoming arc (Ahmedabad → Badlapur) bowing inland, for a function held back home.
const RETURN = `M${AHMEDABAD} C${AHMEDABAD[0] + 95} ${AHMEDABAD[1] + 50} ${BADLAPUR[0] + 85} ${BADLAPUR[1] - 90} ${BADLAPUR}`;

/** Scene 6: the royal journey from Badlapur to Ahmedabad (and home again for the reception). */
export function JourneyMap() {
  const { origin, destination } = wedding;
  const ref = useRef<HTMLElement>(null);
  const directionsUrl = venueMapsLink();
  const homecoming = homecomingEvent;

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const route = q('.map-route')[0] as unknown as SVGPathElement;
      if (reducedMotion()) {
        gsap.set(q('.map-traveller'), { autoAlpha: 0 });
        return;
      }
      gsap.set(q('.map-traveller'), { autoAlpha: 0 });
      gsap.set([route, ...q('.map-return-reveal')], { strokeDasharray: 1, strokeDashoffset: 1 });
      const tl = gsap.timeline({ scrollTrigger: onEnter(q('.journey-map')[0], 'top 70%') });
      tl.from(q('.journey-map'), { autoAlpha: 0, scale: 0.94, duration: 1 })
        .from(q('.map-land'), { autoAlpha: 0, duration: 1.2 }, 0)
        .from(q('.map-coast'), { strokeDasharray: 1200, strokeDashoffset: 1200, duration: 2, ease: 'power1.inOut' }, 0.1)
        .from(q('.map-state, .map-sea, .map-city'), { autoAlpha: 0, stagger: 0.1, duration: 0.6 }, 0.6)
        .from(q('.map-pin--origin'), { scale: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2.5)' }, 0.9)
        .to(route, { strokeDashoffset: 0, duration: 3.2, ease: 'power1.inOut' }, 1.3)
        .fromTo(
          q('.map-traveller'),
          { autoAlpha: 1 },
          { motionPath: { path: route }, duration: 3.2, ease: 'power1.inOut' },
          1.3,
        )
        .from(q('.map-pin--dest'), { scale: 0, transformOrigin: '50% 50%', duration: 0.9, ease: 'elastic.out(1, 0.4)' }, 4.3)
        .from(q('.journey-leg'), { autoAlpha: 0, y: 20, stagger: 0.2, duration: 0.8 }, 4.4)
        .from(q('.journey-arrow'), { autoAlpha: 0, x: -20, duration: 0.8 }, 4.6);
      if (q('.map-return').length) {
        tl.to(q('.map-return-reveal'), { strokeDashoffset: 0, duration: 2.4, ease: 'power1.inOut' }, 5)
          .from(q('.map-return-label'), { autoAlpha: 0, y: 8, duration: 0.8 }, 6.6);
      }
      gsap.to(q('.pin-pulse'), { scale: 3, autoAlpha: 0, transformOrigin: '50% 50%', duration: 2, repeat: -1, ease: 'power1.out' });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="journey" className="scene paper journey">
      <SectionTitle eyebrow="The Royal Journey" title={`From ${origin.city}, With Love`} />

      <div className="journey-map">
        <svg viewBox="0 0 400 400" role="img" aria-label={`Map showing the journey from ${origin.city}, ${origin.state} to ${destination.city}, ${destination.state}`}>
          <defs>
            <pattern id="sea" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M0 7 q3.5 -4 7 0 t7 0" fill="none" stroke="#b9848a" strokeOpacity="0.28" strokeWidth="0.8" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {homecoming && (
              <mask id="return-mask">
                <path className="map-return-reveal" d={RETURN} pathLength={1} fill="none" stroke="#fff" strokeWidth="6" />
              </mask>
            )}
          </defs>
          <rect width="400" height="400" fill="url(#sea)" />
          <path d={landPath} className="map-land" />
          <path d={coastPath} className="map-coast" />
          <text x="70" y="300" className="map-sea">ARABIAN SEA</text>
          <text x="300" y="70" className="map-state">GUJARAT</text>
          <text x="300" y="340" className="map-state">MAHARASHTRA</text>

          {[
            { p: SURAT, name: 'Surat' },
            { p: VADODARA, name: 'Vadodara' },
            { p: MUMBAI, name: 'Mumbai', left: true },
          ].map(({ p, name, left }) => (
            <g key={name} className="map-city">
              <circle cx={p[0]} cy={p[1]} r="2.2" />
              <text x={left ? p[0] - 6 : p[0] + 8} y={p[1] + 3} textAnchor={left ? 'end' : 'start'}>
                {name}
              </text>
            </g>
          ))}

          {homecoming && (
            <g className="map-return">
              <path d={RETURN} mask="url(#return-mask)" />
              <text x={BADLAPUR[0] + 40} y={(AHMEDABAD[1] + BADLAPUR[1]) / 2 + 20} className="map-return-label" textAnchor="middle">
                {homecoming.name}
              </text>
            </g>
          )}

          <path d={ROUTE} className="map-route-shadow" />
          <path d={ROUTE} pathLength={1} className="map-route" />

          <g className="map-pin map-pin--origin">
            <circle cx={BADLAPUR[0]} cy={BADLAPUR[1]} r="5" />
            <text x={BADLAPUR[0] + 10} y={BADLAPUR[1] + 5}>{origin.city}</text>
          </g>
          <g className="map-pin map-pin--dest">
            <circle cx={AHMEDABAD[0]} cy={AHMEDABAD[1]} r="6" className="pin-pulse" />
            <circle cx={AHMEDABAD[0]} cy={AHMEDABAD[1]} r="5" />
            <text x={AHMEDABAD[0] + 11} y={AHMEDABAD[1] - 6}>{destination.city}</text>
          </g>
          {/* positioned entirely by GSAP MotionPath */}
          <circle cx={0} cy={0} r="4.5" className="map-traveller" filter="url(#glow)" />
        </svg>
      </div>

      <div className="journey-legs">
        <div className="journey-leg">
          <p className="eyebrow">From</p>
          <p className="journey-city">{origin.city}</p>
          <p className="journey-state">{origin.state}</p>
        </div>
        <span className="journey-arrow" aria-hidden="true">
          ⟶
        </span>
        <div className="journey-leg">
          <p className="eyebrow">To</p>
          <p className="journey-city">{destination.city}</p>
          <p className="journey-state">{destination.state}</p>
        </div>
      </div>

      <Reveal>
        <p className="journey-copy">
          To {destination.city}, where our forever begins
          {homecoming ? <>, and home to {origin.city} for the {homecoming.name.toLowerCase()}.</> : '.'}
          <br />
          <em>The celebration of two families, two journeys, and one beautiful beginning.</em>
        </p>
      </Reveal>
      {directionsUrl && (
        <a className="btn btn--gold" href={directionsUrl} target="_blank" rel="noopener noreferrer">
          Directions to the Venue
        </a>
      )}
    </section>
  );
}
