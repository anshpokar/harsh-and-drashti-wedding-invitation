/**
 * Shapes of the wedding data. You don't need to edit this file:
 * all names, dates and places live in src/data.ts.
 */

export interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

/** Stand-in text from `sample('…')`: displays like any name; marks it as one to replace. */
export interface SampleName {
  sample: string;
}

/** A real name (plain text) or a stand-in wrapped in `sample('…')`. */
export type Name = string | SampleName;

/** Marks a name as a stand-in until the real one is known. */
export const sample = (text: string): SampleName => ({ sample: text });

/** One line of the "With Blessings From" card. */
export interface BlessingGroup {
  relation: string;
  names: Name;
}

export interface FamilySide {
  side: 'groom' | 'bride';
  heading: string;
  familyName: string | null;
  city: string | null;
  father: Name | null;
  mother: Name | null;
  /** Grandparents, siblings, nieces & nephews… in display order. */
  blessings: BlessingGroup[];
  message: string | null;
  photo: Photo | null;
}

export interface WeddingEvent {
  id: string;
  name: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  venueName: string | null;
  /** City the function takes place in (used for maps search and the journey). */
  city: string | null;
  address: string | null;
  mapsUrl: string | null;
  dressCode: string | null;
  description: string | null;
  image: Photo | null;
}

/** Builds an event, leaving anything not given as `null` ("to be announced"). */
export function defineEvent(e: Pick<WeddingEvent, 'id' | 'name'> & Partial<WeddingEvent>): WeddingEvent {
  return {
    date: null,
    startTime: null,
    endTime: null,
    venueName: null,
    city: null,
    address: null,
    mapsUrl: null,
    dressCode: null,
    description: null,
    image: null,
    ...e,
  };
}

export interface Contact {
  name: string;
  label: string | null;
  /** With country code, e.g. '+919800000000'. Without it, no Call / WhatsApp buttons. */
  phone: string | null;
}

export interface WeddingConfig {
  couple: {
    groomName: string;
    brideName: string;
    groomFullName: string | null;
    brideFullName: string | null;
    message: string;
    portrait: Photo | null;
  };

  origin: { city: string; state: string };
  destination: { city: string; state: string };

  weddingDate: string | null;
  muhurat: string | null;
  dateMessage: string;

  shloka: {
    devanagari: string[];
    transliteration: string[];
    meaning: string;
    /** Set true once a family elder / pandit-ji has checked the text. */
    verified: boolean;
  };

  /** Optional Ganesh artwork (transparent PNG/SVG). Without it a lotus emblem is shown. */
  ganeshImage: string | null;

  families: FamilySide[];
  events: WeddingEvent[];

  venue: {
    name: string | null;
    address: string | null;
    mapsUrl: string | null;
    image: Photo | null;
    travelNotes: string[];
    accommodation: string | null;
  };

  contacts: Contact[];
  gallery: Photo[];

  intro: {
    /** Cinematic entry video (MP4/WebM, portrait 9:16 recommended). null = pure CSS/SVG doors. */
    videoSrc: string | null;
    videoWebmSrc: string | null;
    posterSrc: string | null;
    /** If the video already shows the ribbon untying, the web ribbon layer is not drawn. */
    videoIncludesRibbon: boolean;
    /** Seconds into the video when the HTML name title should appear. */
    nameRevealAt: number;
  };

  music: { src: string | null; title: string | null };

  rsvp: {
    enabled: boolean;
    /** '/api/rsvp' uses server.mjs. Can be a Google Apps Script URL instead (see README). */
    endpoint: string;
    deadline: string | null;
    askPhone: boolean;
    askDietary: boolean;
    askAccommodation: boolean;
    maxGuests: number;
  };

  closing: { invitation: string; blessing: string; tagline: string };
}
