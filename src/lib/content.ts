import { wedding, type WeddingEvent } from '../config/wedding';
import { mapsSearchUrl } from './format';

/** Whether to render a labelled placeholder for a missing value. */
export const showPlaceholders = wedding.previewMode;

export const coupleTitle = `${wedding.couple.groomName} Weds ${wedding.couple.brideName}`;

/**
 * Exact pin link if supplied; otherwise a Maps *search* built from the
 * confirmed venue name/address and city. Replace with a pin link when known.
 */
export function venueMapsLink(): string | null {
  const { venue, destination } = wedding;
  if (venue.mapsUrl) return venue.mapsUrl;
  if (venue.address) return mapsSearchUrl(`${venue.name ?? ''} ${venue.address}`);
  if (venue.name) return mapsSearchUrl(`${venue.name}, ${destination.city}`);
  return null;
}

export function eventMapsLink(e: WeddingEvent): string | null {
  if (e.mapsUrl) return e.mapsUrl;
  if (e.address) return mapsSearchUrl(`${e.venueName ?? ''} ${e.address}`);
  if (e.venueName && e.city) return mapsSearchUrl(`${e.venueName}, ${e.city}`);
  return null;
}

/** A function held back in the origin city (e.g. reception in Badlapur), if any. */
export const homecomingEvent = wedding.events.find((e) => e.city === wedding.origin.city) ?? null;

/** Days from today (India time) until the wedding, or null. */
export function daysToWedding(): number | null {
  if (!wedding.weddingDate) return null;
  const today = new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }));
  const diff = (new Date(wedding.weddingDate).getTime() - today.getTime()) / 86_400_000;
  return Math.round(diff);
}
