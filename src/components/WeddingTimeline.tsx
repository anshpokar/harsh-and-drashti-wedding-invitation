import { useRef, useState } from 'react';
import { wedding, type WeddingEvent } from '../config/wedding';
import { coupleTitle, eventMapsLink } from '../lib/content';
import { buildIcs, dateParts, downloadFile, timeRange } from '../lib/format';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';
import { EventArt } from './EventArt';
import { SectionTitle } from './Ornaments';

const TBA = 'To be announced';

function EventCard({ event }: { event: WeddingEvent }) {
  // Fall back to the line-art motif if the illustration file is missing or fails to load.
  const [imageFailed, setImageFailed] = useState(false);
  const parts = event.date ? dateParts(event.date) : null;
  const time = timeRange(event.startTime, event.endTime);
  const maps = eventMapsLink(event);
  const place = event.venueName ?? event.city;
  const placeDetail = event.address ?? (event.venueName ? event.city : null);

  const addToCalendar = () =>
    downloadFile(
      `${event.id}.ics`,
      buildIcs({
        id: event.id,
        title: `${event.name} · ${coupleTitle}`,
        date: event.date!,
        start: event.startTime,
        end: event.endTime,
        location: [event.venueName, event.address, event.city].filter(Boolean).join(', ') || null,
        description: event.description,
      }),
      'text/calendar',
    );

  return (
    <li className="event-card">
      <h3 className="event-name">{event.name}</h3>
      <p className="event-date">
        {parts ? `${Number(parts.day)} ${parts.month} ${parts.year}` : 'Date to be announced'}
      </p>
      <p className="event-when">
        {parts && <span>{parts.weekday}</span>}
        {parts && <span aria-hidden="true"> • </span>}
        <span>{time ?? 'Time to be announced'}</span>
      </p>
      <div className="event-visual">
        {event.image && !imageFailed ? (
          <img src={event.image.src} alt={event.image.alt} loading="lazy" decoding="async" onError={() => setImageFailed(true)} />
        ) : (
          <EventArt id={event.id} name={event.name} />
        )}
      </div>
      <div className="event-venue">
        <p className="eyebrow">Venue</p>
        <p className="event-place">{place || TBA}</p>
        {placeDetail && <p className="event-address">{placeDetail}</p>}
        {event.dressCode && (
          <p className="event-dress">
            <span className="eyebrow">Dress code</span> {event.dressCode}
          </p>
        )}
        {event.description && <p className="event-desc">{event.description}</p>}
      </div>
      <div className="event-actions">
        {maps && (
          <a className="btn btn--pill" href={maps} target="_blank" rel="noopener noreferrer">
            <PinIcon /> View on Maps
          </a>
        )}
        {event.date && (
          <button className="btn btn--pill" onClick={addToCalendar}>
            Add to Calendar
          </button>
        )}
      </div>
    </li>
  );
}

export function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" fill="currentColor" />
    </svg>
  );
}

/** Scene 8: "Wedding Events" — one illustrated card per confirmed function. */
export function WeddingTimeline() {
  const { events } = wedding;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.utils.toArray<HTMLElement>('.event-card', ref.current).forEach((card) => {
        const q = gsap.utils.selector(card);
        gsap
          .timeline({ scrollTrigger: onEnter(card, 'top 85%') })
          .from(card, { autoAlpha: 0, y: 60, duration: 1.1 })
          .from(q('.event-name'), { autoAlpha: 0, scale: 0.85, y: 10, duration: 1, ease: 'back.out(1.7)' }, 0.25)
          .from(q('.event-date, .event-when'), { autoAlpha: 0, letterSpacing: '0.5em', stagger: 0.12, duration: 1 }, 0.4)
          .fromTo(q('.event-visual'), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut' }, 0.6)
          .from(q('.art-strand'), { scaleY: 0, transformOrigin: '50% 0%', stagger: 0.06, duration: 0.8, ease: 'bounce.out' }, 1.1)
          .from(q('.event-venue > *, .event-actions > *'), { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.6 }, 1.2);

        // gentle Ken Burns while the card passes through the viewport
        gsap.fromTo(
          q('.event-visual > *'),
          { scale: 1.12 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });

      // idle life in the illustrations
      const q = gsap.utils.selector(ref);
      gsap.to(q('.art-strand'), { rotation: 3, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: { each: 0.3, from: 'random' } });
      gsap.to(q('.art-flame'), { scaleY: 1.12, scaleX: 0.92, duration: 0.35, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(q('.art-stick--l'), { rotation: -8, duration: 0.6, yoyo: true, repeat: -1, ease: 'power1.inOut' });
      gsap.to(q('.art-stick--r'), { rotation: 8, duration: 0.6, yoyo: true, repeat: -1, ease: 'power1.inOut' });
      gsap.to(q('.art-chandelier'), { rotation: 2, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(q('.art-twinkle'), { autoAlpha: 0.3, duration: 0.9, yoyo: true, repeat: -1, stagger: { each: 0.2, from: 'random' } });
    },
    { scope: ref },
  );

  if (!events.length) return null;
  return (
    <section ref={ref} id="events" className="scene paper paper--alt events">
      <SectionTitle eyebrow="The Celebrations" title="Wedding Events" />
      <ol className="event-list">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </ol>
    </section>
  );
}
