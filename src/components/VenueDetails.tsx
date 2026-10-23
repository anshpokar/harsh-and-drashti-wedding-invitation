import { wedding } from '../config/wedding';
import { showPlaceholders } from '../lib/content';
import { mapsSearchUrl } from '../lib/format';
import { Divider, Pending, PhotoFrame, SectionTitle } from './Ornaments';
import { Reveal } from './Reveal';

/** Scene 9: the Ahmedabad venue, travel guidance and contacts. */
export function VenueDetails() {
  const { venue, destination, origin, contacts } = wedding;
  const hasVenue = Boolean(venue.name || venue.address);
  if (!hasVenue && !showPlaceholders && !contacts.length) return null;
  const maps = venue.mapsUrl ?? (venue.address ? mapsSearchUrl(`${venue.name ?? ''} ${venue.address}`) : null);

  return (
    <section id="venue" className="scene royal venue">
      <SectionTitle eyebrow={`${destination.city}, ${destination.state}`} title="The Wedding Venue" />

      <Reveal as="article" className="venue-card">
        <PhotoFrame photo={venue.image} shape="rect" label="Venue photograph" className="venue-photo" />
        <div className="venue-body">
          {venue.name ? <h3 className="gold-text venue-name">{venue.name}</h3> : <Pending label="Venue name" block />}
          {venue.address ? <address>{venue.address}</address> : <Pending label="Full address" block />}
          <div className="venue-actions">
            {maps && (
              <a className="btn btn--gold" href={maps} target="_blank" rel="noopener noreferrer">
                Open in Maps
              </a>
            )}
            <a className="btn btn--ghost" href="#events">
              View All Events
            </a>
            {contacts[0] && (
              <a className="btn btn--ghost" href={`#contacts`}>
                Contact the Family
              </a>
            )}
          </div>
        </div>
      </Reveal>

      {(venue.travelNotes.length > 0 || showPlaceholders) && (
        <Reveal className="info-block" delay={100}>
          <h3>Travelling to {destination.city}</h3>
          <Divider />
          {venue.travelNotes.length ? (
            <ul>
              {venue.travelNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : (
            <Pending label={`Travel guidance from ${origin.city} and elsewhere`} block />
          )}
        </Reveal>
      )}

      {(venue.accommodation || showPlaceholders) && (
        <Reveal className="info-block" delay={150}>
          <h3>Stay</h3>
          <Divider />
          {venue.accommodation ? <p>{venue.accommodation}</p> : <Pending label="Accommodation (optional)" block />}
        </Reveal>
      )}

      {(contacts.length > 0 || showPlaceholders) && (
        <Reveal className="info-block" delay={200}>
          <h3 id="contacts">For Any Assistance</h3>
          <Divider />
          {contacts.length ? (
            <ul className="contact-list">
              {contacts.map((c) => (
                <li key={c.phone}>
                  <span>
                    <strong>{c.name}</strong> · {c.label}
                  </span>
                  <span className="contact-actions">
                    <a href={`tel:${c.phone}`}>Call</a>
                    <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Pending label="Coordination contacts (optional)" block />
          )}
        </Reveal>
      )}
    </section>
  );
}
