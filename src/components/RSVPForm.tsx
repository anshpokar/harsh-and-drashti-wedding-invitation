import { useState, type FormEvent } from 'react';
import { wedding } from '../config/wedding';
import { formatDate } from '../lib/format';
import { SectionTitle } from './Ornaments';
import { Reveal } from './Reveal';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; attending: string } | { kind: 'error'; message: string };

/** Scene 11: RSVP — posts to a real endpoint and only confirms on a successful save. */
export function RSVPForm() {
  const { rsvp, events } = wedding;
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [attending, setAttending] = useState('yes');

  if (!rsvp.enabled) return null;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      attending: String(fd.get('attending')),
      guests: Number(fd.get('guests') ?? 0),
      phone: String(fd.get('phone') ?? '').trim(),
      events: fd.getAll('events').map(String),
      dietary: String(fd.get('dietary') ?? '').trim(),
      accommodation: fd.get('accommodation') === 'on',
      message: String(fd.get('message') ?? '').trim(),
      website: String(fd.get('website') ?? ''), // honeypot
    };
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(rsvp.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error(body.error || `Could not save your response (${res.status}).`);
      setStatus({ kind: 'done', attending: payload.attending });
      form.reset();
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'We could not reach the server. Please try again in a moment.',
      });
    }
  };

  return (
    <section id="rsvp" className="scene paper paper--alt rsvp">
      <div className="paper-card">
        <SectionTitle eyebrow="RSVP" title="Kindly Respond">
          {rsvp.deadline ? `Please let us know by ${formatDate(rsvp.deadline, { weekday: undefined })}` : 'Please let us know if you can join us'}
        </SectionTitle>

        {status.kind === 'done' ? (
          <Reveal className="rsvp-thanks">
            <p className="gold-text-dark rsvp-thanks-title">Thank you!</p>
            <p>
              {status.attending === 'no'
                ? 'We will miss you, and we are grateful for your blessings.'
                : 'Your response has been received. We look forward to celebrating with you.'}
            </p>
            <button className="btn btn--ghost-dark" onClick={() => setStatus({ kind: 'idle' })}>
              Send another response
            </button>
          </Reveal>
        ) : (
          <form className="rsvp-form" onSubmit={submit} noValidate={false}>
            <label>
              <span>Your name *</span>
              <input name="name" required maxLength={80} autoComplete="name" />
            </label>

            <fieldset className="rsvp-choice">
              <legend>Will you attend? *</legend>
              {[
                ['yes', 'Joyfully accept'],
                ['maybe', 'Not sure yet'],
                ['no', 'Regretfully decline'],
              ].map(([v, label]) => (
                <label key={v} className={attending === v ? 'is-checked' : ''}>
                  <input type="radio" name="attending" value={v} checked={attending === v} onChange={() => setAttending(v)} />
                  {label}
                </label>
              ))}
            </fieldset>

            {attending !== 'no' && (
              <>
                <label>
                  <span>Number of guests (including you) *</span>
                  <input name="guests" type="number" min={1} max={rsvp.maxGuests} defaultValue={1} required inputMode="numeric" />
                </label>

                {events.length > 0 && (
                  <fieldset className="rsvp-events">
                    <legend>Which functions will you attend?</legend>
                    {events.map((ev) => (
                      <label key={ev.id}>
                        <input type="checkbox" name="events" value={ev.id} defaultChecked />
                        {ev.name}
                      </label>
                    ))}
                  </fieldset>
                )}

                {rsvp.askDietary && (
                  <label>
                    <span>Dietary preferences</span>
                    <input name="dietary" maxLength={200} placeholder="e.g. Jain, no onion-garlic" />
                  </label>
                )}
                {rsvp.askAccommodation && (
                  <label className="rsvp-check">
                    <input type="checkbox" name="accommodation" />
                    <span>I would need help with accommodation</span>
                  </label>
                )}
              </>
            )}

            {rsvp.askPhone && (
              <label>
                <span>Phone / WhatsApp</span>
                <input name="phone" type="tel" maxLength={20} pattern="[0-9+\-\s()]{7,20}" autoComplete="tel" />
              </label>
            )}

            <label>
              <span>Blessings or a message for the couple</span>
              <textarea name="message" rows={3} maxLength={500} />
            </label>

            {/* Honeypot: hidden from people, catches bots */}
            <label className="hp" aria-hidden="true">
              Website <input name="website" tabIndex={-1} autoComplete="off" />
            </label>

            {status.kind === 'error' && (
              <p className="rsvp-error" role="alert">
                {status.message}
              </p>
            )}
            <button className="btn btn--royal" type="submit" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? 'Sending…' : 'Send RSVP'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
