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

/** One line of the "With Blessings From" card, e.g. { relation: 'Grandparents', names: 'Smt. … & Shri …' }. */
export interface BlessingGroup {
  relation: string;
  names: string;
  /** Stand-in names: shown only in preview mode, never to guests. Remove once real names are in. */
  sample?: boolean;
}

export interface FamilySide {
  side: 'groom' | 'bride';
  heading: string;
  familyName: string | null;
  city: string | null;
  father: string | null;
  mother: string | null;
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

export interface Contact {
  name: string;
  label: string | null;
  /** With country code, e.g. '+919800000000'. Without it, no Call / WhatsApp buttons. */
  phone: string | null;
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

const VENUE_MAPS_URL =
  'https://www.google.com/maps/place/Shree+Kalki+Tirthdham,+Prernapith/@22.8824021,72.5402187,17z/data=!4m14!1m7!3m6!1s0x395e8f6379907959:0x88d44690f75de31d!2sShree+Kalki+Tirthdham,+Prernapith!8m2!3d22.8823972!4d72.5427936!16s%2Fg%2F11sgnzc5d_!3m5!1s0x395e8f6379907959:0x88d44690f75de31d!8m2!3d22.8823972!4d72.5427936!16s%2Fg%2F11sgnzc5d_?entry=ttu';

export const wedding: WeddingConfig = {
  previewMode: true,

  couple: {
    groomName: 'Harsh',
    brideName: 'Drashti',
    groomFullName: 'Harsh Patel',
    brideFullName: 'Drashti Pokar',
    message:
      'Two hearts, two families and two cities — brought together by love, blessed by our elders, and ready to begin forever.',
    portrait: null, // { src: '/media/couple-portrait.jpg', alt: 'Harsh and Drashti' }
  },

  origin: { city: 'Badlapur', state: 'Maharashtra' },
  destination: { city: 'Ahmedabad', state: 'Gujarat' },

  weddingDate: '2026-11-21',
  // PLACEHOLDER chosen for the design: confirm the real muhurat with your pandit.
  muhurat: 'Shubh Muhurat · 11:30 AM',
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
      familyName: 'Patel Family',
      city: null,
      father: 'Ramesh Patel',
      mother: null,
      blessings: [
        // SAMPLE names (preview only) — replace with the real family and delete `sample: true`.
        { relation: 'Grandparents', names: 'Smt. Shantaben Patel & Shri Maganlal Patel', sample: true },
        { relation: 'Uncle & Aunt', names: 'Shri Suresh Patel & Smt. Geeta Patel', sample: true },
        { relation: 'Brother & Bhabhi', names: 'Rahul Patel & Neha Patel', sample: true },
        { relation: 'Nieces & Nephews', names: 'Diya, Krish & Aarav', sample: true },
      ],
      message: null,
      photo: null,
    },
    {
      side: 'bride',
      heading: "The Bride's Family",
      familyName: 'Pokar Family',
      city: null,
      father: 'Kantilal Pokar',
      mother: null,
      blessings: [
        // SAMPLE names (preview only) — replace with the real family and delete `sample: true`.
        { relation: 'Grandparents', names: 'Smt. Kamlaben Pokar & Shri Jivrajbhai Pokar', sample: true },
        { relation: 'Uncle & Aunt', names: 'Shri Mahesh Pokar & Smt. Rekha Pokar', sample: true },
        { relation: 'Sister & Jiju', names: 'Pooja Desai & Nirav Desai', sample: true },
        { relation: 'Cousins', names: 'Ansh, Riya & Meet', sample: true },
      ],
      message: null,
      photo: null,
    },
  ],

  /**
   * Add ONLY confirmed functions. Example:
   * {
   *   id: 'haldi', name: 'Haldi', date: '2027-02-13', startTime: '10:00', endTime: '13:00',
   *   venueName: '...', city: '...', address: '...', mapsUrl: 'https://maps.app.goo.gl/...',
   *   dressCode: 'Shades of yellow', description: '...', image: null,
   * }
   */
  events: [
    {
      id: 'mandva',
      name: 'Mandva',
      date: '2026-11-20',
      startTime: '08:00',
      endTime: null,
      venueName: 'Shree Kalki Tirthdham, Prernapith',
      city: 'Ahmedabad',
      address: 'Shree Karsandasji Maharaj Marg, Paldi Kankaj, Ahmedabad',
      mapsUrl: VENUE_MAPS_URL,
      dressCode: null,
      description: null,
      image: null,
    },
    {
      id: 'mameru',
      name: 'Mameru',
      date: '2026-11-20',
      startTime: '12:00',
      endTime: null,
      venueName: 'Shree Kalki Tirthdham, Prernapith',
      city: 'Ahmedabad',
      address: 'Shree Karsandasji Maharaj Marg, Paldi Kankaj, Ahmedabad',
      mapsUrl: VENUE_MAPS_URL,
      dressCode: null,
      description: null,
      image: null,
    },
    {
      id: 'sangeet-dandiya',
      name: 'Sangeet & Dandiya Night',
      date: null,
      startTime: null,
      endTime: null,
      venueName: 'Shree Kalki Tirthdham, Prernapith',
      city: 'Ahmedabad',
      address: 'Shree Karsandasji Maharaj Marg, Paldi Kankaj, Ahmedabad',
      mapsUrl: VENUE_MAPS_URL,
      dressCode: null,
      description: null,
      image: null,
    },
    {
      id: 'wedding',
      name: 'Wedding Ceremony',
      date: '2026-11-21',
      startTime: '11:30', // matches the placeholder muhurat above
      endTime: null,
      venueName: 'Shree Kalki Tirthdham, Prernapith',
      city: 'Ahmedabad',
      address: 'Shree Karsandasji Maharaj Marg, Paldi Kankaj, Ahmedabad',
      mapsUrl: VENUE_MAPS_URL,
      dressCode: null,
      description: null,
      image: null,
    },
    {
      id: 'reception',
      name: 'Reception',
      date: null,
      startTime: null,
      endTime: null,
      venueName: 'Gauri Hall',
      city: 'Badlapur',
      address: null,
      mapsUrl: null,
      dressCode: null,
      description: null,
      image: null,
    },
  ],

  venue: {
    name: 'Shree Kalki Tirthdham, Prernapith',
    address: 'Shree Karsandasji Maharaj Marg, Paldi Kankaj, Ahmedabad',
    mapsUrl: VENUE_MAPS_URL,
    image: null,
    travelNotes: [],
    accommodation: null,
  },

  contacts: [
    // Add phone numbers (with +91) to enable Call / WhatsApp buttons.
    { name: 'Deep Patel', label: null, phone: null },
    { name: 'Nainesh Dholu', label: null, phone: null },
    { name: 'Ansh Pokar', label: null, phone: null },
  ],

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
    deadline: '2026-11-15',
    askPhone: true,
    askDietary: true,
    askAccommodation: true,
    maxGuests: 10,
  },

  closing: {
    invitation:
      'With the blessings of our elders and the love of our families, we invite you to celebrate the wedding of Harsh and Drashti.',
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
    city: null,
    address: null,
    mapsUrl: null,
    dressCode: null,
    description: null,
    image: null,
  }),
);
