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
  return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Builds an .ics calendar file for a single event (India time). */
export function buildIcs(e: {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string | null;
  location: string | null;
  description: string | null;
}): string {
  const stamp = (date: string, time: string) => `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const endTime = e.end ?? `${String(Math.min(23, Number(e.start.slice(0, 2)) + 2)).padStart(2, '0')}${e.start.slice(2)}`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Harsh Weds Drasti//Invitation//EN',
    'BEGIN:VEVENT',
    `UID:${e.id}@harsh-weds-drasti`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;TZID=${IST}:${stamp(e.date, e.start)}`,
    `DTEND;TZID=${IST}:${stamp(e.date, endTime)}`,
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
