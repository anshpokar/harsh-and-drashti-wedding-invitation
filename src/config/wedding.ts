/**
 * ─────────────────────────────────────────────────────────────
 *  ALL WEDDING CONTENT LIVES HERE.
 *  Edit this file only — the UI reads everything from it.
 *
 *  `null` means "to be provided". Anything null is hidden from guests
 *  once `previewMode` is false. In preview mode it shows as a clearly
 *  labelled dashed placeholder so nobody mistakes it for real info.
 *
 *  Dates: 'YYYY-MM-DD'   Times: 'HH:MM' (24h, India time)
 *  Images: put files in /public/media and reference as '/media/name.jpg'
 * ─────────────────────────────────────────────────────────────
 */

export interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

export interface Person {
  name: string;
  relation?: string;
}

export interface FamilySide {
  side: 'groom' | 'bride';
  heading: string;
  familyName: string | null;
  city: string | null;
  parents: string | null;
  grandparents: string | null;
  members: Person[];
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
  address: string | null;
  mapsUrl: string | null;
  dressCode: string | null;
  description: string | null;
  image: Photo | null;
}

export interface Contact {
  label: string;
  name: string;
  phone: string; // with country code, e.g. '+919800000000'
}

export interface WeddingConfig {
  /** true = show labelled placeholders for missing details. Set false before sending to guests. */
  previewMode: boolean;

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

export const wedding: WeddingConfig = {
  previewMode: true,

  couple: {
    groomName: 'Harsh',
    brideName: 'Drasti', // NOTE: brief also spells it "Drashti" — confirm spelling.
    groomFullName: null,
    brideFullName: null,
    message:
      'Two hearts, two families and two cities — brought together by love, blessed by our elders, and ready to begin forever.',
    portrait: null, // { src: '/media/couple-portrait.jpg', alt: 'Harsh and Drasti' }
  },

  origin: { city: 'Badlapur', state: 'Maharashtra' },
  destination: { city: 'Ahmedabad', state: 'Gujarat' },

  weddingDate: null, // e.g. '2027-02-14'
  muhurat: null, // e.g. 'Shubh Muhurat · 7:42 PM'
  dateMessage: 'The day our forever begins.',

  // Widely recited Ganesh Vandana. Confirm with your family pandit before publishing.
  shloka: {
    devanagari: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'],
    transliteration: [
      'Vakratuṇḍa Mahākāya Sūryakoṭi Samaprabha',
      'Nirvighnaṁ Kuru Me Deva Sarvakāryeṣu Sarvadā',
    ],
    meaning:
      'O Lord Ganesha of the curved trunk and mighty form, radiant as a million suns — remove all obstacles from every undertaking, always.',
    verified: false,
  },

  ganeshImage: null,

  families: [
    {
      side: 'groom',
      heading: "The Groom's Family",
      familyName: null,
      city: null,
      parents: null,
      grandparents: null,
      members: [],
      message: null,
      photo: null,
    },
    {
      side: 'bride',
      heading: "The Bride's Family",
      familyName: null,
      city: null,
      parents: null,
      grandparents: null,
      members: [],
      message: null,
      photo: null,
    },
  ],

  /**
   * Add ONLY confirmed functions. Example:
   * {
   *   id: 'haldi', name: 'Haldi', date: '2027-02-13', startTime: '10:00', endTime: '13:00',
   *   venueName: '...', address: '...', mapsUrl: 'https://maps.app.goo.gl/...',
   *   dressCode: 'Shades of yellow', description: '...', image: null,
   * }
   */
  events: [],

  venue: {
    name: null,
    address: null,
    mapsUrl: null,
    image: null,
    travelNotes: [],
    accommodation: null,
  },

  contacts: [],

  gallery: [],

  intro: {
    videoSrc: null, // '/media/intro.mp4'
    videoWebmSrc: null, // '/media/intro.webm'
    posterSrc: null, // '/media/intro-poster.jpg'
    videoIncludesRibbon: false,
    nameRevealAt: 4.5,
  },

  music: { src: null, title: null },

  rsvp: {
    enabled: true,
    endpoint: '/api/rsvp',
    deadline: null,
    askPhone: true,
    askDietary: true,
    askAccommodation: true,
    maxGuests: 10,
  },

  closing: {
    invitation:
      'With the blessings of our elders and the love of our families, we invite you to celebrate the wedding of Harsh and Drasti.',
    blessing: 'Your presence and blessings will make our celebration even more special.',
    tagline: 'Together Begins Forever',
  },
};

/**
 * Preview-only sample cards so the itinerary design can be reviewed before
 * real events are confirmed. Never shown when previewMode is false or when
 * `events` has entries.
 */
export const sampleEvents: WeddingEvent[] = ['Function One', 'Function Two', 'Wedding Ceremony'].map(
  (name, i) => ({
    id: `sample-${i}`,
    name,
    date: null,
    startTime: null,
    endTime: null,
    venueName: null,
    address: null,
    mapsUrl: null,
    dressCode: null,
    description: null,
    image: null,
  }),
);
