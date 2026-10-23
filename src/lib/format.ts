const IST = 'Asia/Kolkata';

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return parseDate(iso).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: IST,
    ...opts,
  });
}

export function dateParts(iso: string) {
  const d = parseDate(iso);
  const get = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-IN', { timeZone: IST, ...o });
  return {
    weekday: get({ weekday: 'long' }),
    day: get({ day: '2-digit' }),
    month: get({ month: 'long' }),
    year: get({ year: 'numeric' }),
  };
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function timeRange(start: string | null, end: string | null): string | null {
  if (!start) return null;
  return end ? `${formatTime(start)} – ${formatTime(end)}` : `${formatTime(start)} onwards`;
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Builds an .ics calendar file for a single event (India time; all-day when no start time). */
export function buildIcs(e: {
  id: string;
  title: string;
  date: string;
  start: string | null;
  end: string | null;
  location: string | null;
  description: string | null;
}): string {
  const day = e.date.replace(/-/g, '');
  const stamp = (time: string) => `${day}T${time.replace(':', '')}00`;
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  let when: string[];
  if (e.start) {
    const end = e.end ?? `${String(Math.min(23, Number(e.start.slice(0, 2)) + 2)).padStart(2, '0')}${e.start.slice(2)}`;
    when = [`DTSTART;TZID=${IST}:${stamp(e.start)}`, `DTEND;TZID=${IST}:${stamp(end)}`];
  } else {
    const next = new Date(Date.UTC(+day.slice(0, 4), +day.slice(4, 6) - 1, +day.slice(6) + 1));
    when = [`DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replace(/-/g, '')}`];
  }
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Harsh Weds Drashti//Invitation//EN',
    'BEGIN:VEVENT',
    `UID:${e.id}@harsh-weds-drashti`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    ...when,
    `SUMMARY:${esc(e.title)}`,
    e.location ? `LOCATION:${esc(e.location)}` : '',
    e.description ? `DESCRIPTION:${esc(e.description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
