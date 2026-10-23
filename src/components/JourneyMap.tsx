import { useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
import { useInView, useReducedMotion } from '../lib/hooks';
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

/** Scene 6: the royal journey from Badlapur to Ahmedabad. */
export function JourneyMap() {
  const { origin, destination, venue } = wedding;
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const reduced = useReducedMotion();
  const routeRef = useRef<SVGPathElement>(null);
  const [traveller, setTraveller] = useState<[number, number]>(BADLAPUR);

  useEffect(() => {
    const path = routeRef.current;
    if (!inView || !path) return;
    const len = path.getTotalLength();
    if (reduced) {
      const p = path.getPointAtLength(len);
      setTraveller([p.x, p.y]);
      return;
    }
    const duration = 3200;
    const t0 = performance.now() + 400;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / duration));
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const p = path.getPointAtLength(eased * len);
      setTraveller([p.x, p.y]);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);

  const directionsUrl = venue.mapsUrl;

  return (
    <section id="journey" className="scene royal journey">
      <SectionTitle eyebrow="The Royal Journey" title={`From ${origin.city}, With Love`} />

      <div ref={ref} className={`journey-map ${inView ? 'is-drawn' : ''}`}>
        <svg viewBox="0 0 400 400" role="img" aria-label={`Map showing the journey from ${origin.city}, ${origin.state} to ${destination.city}, ${destination.state}`}>
          <defs>
            <pattern id="sea" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M0 7 q3.5 -4 7 0 t7 0" fill="none" stroke="#c9a24a" strokeOpacity="0.14" strokeWidth="0.8" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
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

          <path d={ROUTE} className="map-route-shadow" />
          <path ref={routeRef} d={ROUTE} pathLength={1} className="map-route" />

          <g className="map-pin map-pin--origin">
            <circle cx={BADLAPUR[0]} cy={BADLAPUR[1]} r="5" />
            <text x={BADLAPUR[0] + 10} y={BADLAPUR[1] + 5}>{origin.city}</text>
          </g>
          <g className="map-pin map-pin--dest">
            <circle cx={AHMEDABAD[0]} cy={AHMEDABAD[1]} r="7" className="pin-pulse" />
            <circle cx={AHMEDABAD[0]} cy={AHMEDABAD[1]} r="5" />
            <text x={AHMEDABAD[0] + 11} y={AHMEDABAD[1] - 6}>{destination.city}</text>
          </g>
          <circle cx={traveller[0]} cy={traveller[1]} r="4.5" className="map-traveller" filter="url(#glow)" />
        </svg>
      </div>

      <div className="journey-legs">
        <Reveal className="journey-leg">
          <p className="eyebrow">From</p>
          <p className="journey-city gold-text">{origin.city}</p>
          <p className="journey-state">{origin.state}</p>
        </Reveal>
        <span className="journey-arrow" aria-hidden="true">
          ⟶
        </span>
        <Reveal className="journey-leg" delay={200}>
          <p className="eyebrow">To</p>
          <p className="journey-city gold-text">{destination.city}</p>
          <p className="journey-state">{destination.state}</p>
        </Reveal>
      </div>

      <Reveal delay={300}>
        <p className="journey-copy">
          To {destination.city}, where our forever begins.
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
