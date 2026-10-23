import { sampleEvents, wedding, type WeddingEvent } from '../config/wedding';
import { coupleTitle, showPlaceholders } from '../lib/content';
import { buildIcs, downloadFile, formatDate, mapsSearchUrl, timeRange } from '../lib/format';
import { Pending, SectionTitle } from './Ornaments';
import { Reveal } from './Reveal';

function mapLink(e: WeddingEvent) {
  if (e.mapsUrl) return e.mapsUrl;
  if (e.address) return mapsSearchUrl(`${e.venueName ?? ''} ${e.address}`);
  return null;
}

function EventScroll({ event, index, sample }: { event: WeddingEvent; index: number; sample: boolean }) {
  const time = timeRange(event.startTime, event.endTime);
  const maps = mapLink(event);
  const addToCalendar = () =>
    downloadFile(
      `${event.id}.ics`,
      buildIcs({
        id: event.id,
        title: `${event.name} · ${coupleTitle}`,
        date: event.date!,
        start: event.startTime!,
        end: event.endTime,
        location: [event.venueName, event.address].filter(Boolean).join(', ') || null,
        description: event.description,
      }),
      'text/calendar',
    );

  return (
    <Reveal as="li" className="event" delay={80}>
      <div className="event-marker" aria-hidden="true">
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <article className="event-scroll">
        <div className="scroll-rod" aria-hidden="true" />
        <div className="event-body">
          {sample && <span className="pending">Sample card — design preview only</span>}
          {event.image && <img className="event-image" src={event.image.src} alt={event.image.alt} loading="lazy" />}
          <h3 className="event-name">{event.name}</h3>
          <dl className="event-meta">
            <div>
              <dt>Date</dt>
              <dd>{event.date ? formatDate(event.date) : <Pending label="Date" />}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{time ?? <Pending label="Time" />}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>
                {event.venueName ?? <Pending label="Venue" />}
                {event.address && <span className="event-address">{event.address}</span>}
              </dd>
            </div>
            {event.dressCode && (
              <div>
                <dt>Dress code</dt>
                <dd>{event.dressCode}</dd>
              </div>
            )}
          </dl>
          {event.description && <p className="event-desc">{event.description}</p>}
          <div className="event-actions">
            {maps && (
              <a className="btn btn--small btn--gold" href={maps} target="_blank" rel="noopener noreferrer">
                Open in Maps
              </a>
            )}
            {event.date && event.startTime && (
              <button className="btn btn--small btn--ghost" onClick={addToCalendar}>
                Add to Calendar
              </button>
            )}
          </div>
        </div>
        <div className="scroll-rod" aria-hidden="true" />
      </article>
    </Reveal>
  );
}

/** Scene 8: the itinerary as royal scrolls — readable at a glance on mobile. */
export function WeddingTimeline() {
  const useSamples = !wedding.events.length && showPlaceholders;
  const events = useSamples ? sampleEvents : wedding.events;
  if (!events.length) return null;
  return (
    <section id="events" className="scene royal events">
      <SectionTitle eyebrow="The Celebrations" title="Wedding Festivities">
        Join us for every moment of joy
      </SectionTitle>
      <ol className="event-list">
        {events.map((e, i) => (
          <EventScroll key={e.id} event={e} index={i} sample={useSamples} />
        ))}
      </ol>
    </section>
  );
}
