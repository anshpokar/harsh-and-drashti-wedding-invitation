import { useRef } from 'react';
import { wedding } from '../config/wedding';
import { eventMapsLink, homecomingEvent, venueMapsLink } from '../lib/content';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';
import { CitySkyline } from './CitySkyline';
import { Divider, PhotoFrame } from './Ornaments';
import { Reveal } from './Reveal';
import { PinIcon } from './WeddingTimeline';

/** Scene 9: venue block in the reference style, the Ahmedabad skyline, travel and contacts. */
export function VenueDetails() {
  const { venue, destination, origin, contacts } = wedding;
  const ref = useRef<HTMLElement>(null);
  const maps = venueMapsLink();
  const reception = homecomingEvent;

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ scrollTrigger: onEnter(q('.venue-block')[0], 'top 78%') })
        .from(q('.venue-block .photo-frame'), { autoAlpha: 0, y: 30, duration: 1 })
        .from(q('.venue-block .eyebrow'), { autoAlpha: 0, y: 8, duration: 0.6 }, 0.3)
        .from(q('.venue-name'), { autoAlpha: 0, letterSpacing: '0.6em', duration: 1.4, ease: 'expo.out' }, 0.4)
        .from(q('.venue-lines > *'), { autoAlpha: 0, y: 10, stagger: 0.12, duration: 0.7 }, 0.8)
        .from(q('.venue-block .btn'), { autoAlpha: 0, scale: 0.8, duration: 0.7, ease: 'back.out(2)' }, 1.1);

      // Skyline: the city rises out of the river, then its reflection settles.
      gsap
        .timeline({ scrollTrigger: onEnter(q('.skyline')[0], 'top 80%') })
        .from(q('.sky-sun'), { scale: 0, transformOrigin: '50% 50%', duration: 1.4, ease: 'expo.out' })
        .from(q('.sky-bld'), { scaleY: 0, transformOrigin: '50% 100%', stagger: { each: 0.06, from: 'center' }, duration: 1, ease: 'back.out(1.2)' }, 0.2)
        .from(q('.sky-reflection'), { autoAlpha: 0, duration: 1.2 }, 0.9)
        .from(q('.sky-kite'), { x: 60, y: 40, rotation: 30, autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 1)
        .from(q('.skyline-name'), { autoAlpha: 0, letterSpacing: '1em', duration: 1.4, ease: 'expo.out' }, 1.1);
      gsap.to(q('.sky-kite'), { x: -8, y: 6, rotation: -6, transformOrigin: '50% 100%', duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(q('.sky-ripple'), { x: 18, autoAlpha: 0.2, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.5 });
    },
    { scope: ref },
  );

  const hasVenue = Boolean(venue.name || venue.address);
  if (!hasVenue && !contacts.length) return null;
  const receptionMaps = reception ? eventMapsLink(reception) : null;

  return (
    <section ref={ref} id="venue" className="scene paper venue">
      <div className="venue-block">
        <PhotoFrame photo={venue.image} shape="rect" label="Venue photograph" className="venue-photo" />
        <p className="eyebrow">Venue</p>
        {venue.name ? (
          <h2 className="venue-name">
            {/* "Shree Kalki Tirthdham, Prernapith" → name with a smaller second line */}
            {venue.name.split(', ')[0]}
            {venue.name.includes(', ') && <span className="venue-name-sub">{venue.name.split(', ').slice(1).join(', ')}</span>}
          </h2>
        ) : null}
        <div className="venue-lines">
          {venue.address && <address>{venue.address}</address>}
          {!venue.address && <p className="venue-city">{destination.city}</p>}
          <p className="venue-region">
            {destination.state}, India
          </p>
        </div>
        {maps && (
          <a className="btn btn--pill" href={maps} target="_blank" rel="noopener noreferrer">
            <PinIcon /> View on Maps
          </a>
        )}
      </div>

      <CitySkyline city={destination.city} />

      {reception && (
        <Reveal className="venue-also">
          <p className="eyebrow">{reception.name} venue</p>
          <p className="venue-also-name">{reception.venueName ?? 'To be announced'}</p>
          {reception.address && <address>{reception.address}</address>}
          <p className="venue-region">
            {origin.city}, {origin.state}
          </p>
          {receptionMaps && (
            <a className="btn btn--pill" href={receptionMaps} target="_blank" rel="noopener noreferrer">
              <PinIcon /> View on Maps
            </a>
          )}
        </Reveal>
      )}

      {venue.travelNotes.length > 0 && (
        <Reveal className="info-block">
          <h3>Travelling to {destination.city}</h3>
          <Divider />
          <ul>
            {venue.travelNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Reveal>
      )}

      {venue.accommodation && (
        <Reveal className="info-block">
          <h3>Stay</h3>
          <Divider />
          <p>{venue.accommodation}</p>
        </Reveal>
      )}

      {contacts.length > 0 && (
        <Reveal className="info-block">
          <h3 id="contacts">For Any Assistance</h3>
          <Divider />
          <ul className="contact-list">
              {contacts.map((c) => (
                <li key={c.name}>
                  <span>
                    <strong>{c.name}</strong>
                    {c.label && <> · {c.label}</>}
                  </span>
                  {c.phone && (
                    <span className="contact-actions">
                      <a href={`tel:${c.phone}`}>Call</a>
                      <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </span>
                  )}
                </li>
              ))}
            </ul>
        </Reveal>
      )}
    </section>
  );
}
