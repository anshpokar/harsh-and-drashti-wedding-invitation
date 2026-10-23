/**
 * ═══════════════════════════════════════════════════════════════════
 *   HARSH WEDS DRASHTI: ALL INVITATION DETAILS
 *   Change names, dates, venues and contacts here. Nothing else needs editing.
 * ═══════════════════════════════════════════════════════════════════
 *
 *   How to write things:
 *   • Dates      '2026-11-20'   (year-month-day)
 *   • Times      '19:00'        (24-hour clock, so 7 PM = '19:00')
 *   • Unknown    null           (guests see "To be announced")
 *   • Stand-in   sample('Name') shows like a normal name. It just marks names
 *                to replace: when you know the real one, change sample('…') to '…'.
 *   • Keep the quotes '…' and the comma at the end of each line.
 */
import { defineEvent, type WeddingConfig } from './config/types';

// ─── Venues (written once, used by every function below) ─────────────

const TIRTHDHAM = {
  venueName: 'Shree Kalki Tirthdham, Prernapith',
  city: 'Ahmedabad',
  address: 'Shree Karsandasji Maharaj Marg, Paldi Kankaj, Ahmedabad',
  mapsUrl:
    'https://www.google.com/maps/place/Shree+Kalki+Tirthdham,+Prernapith/@22.8824021,72.5402187,17z/data=!4m14!1m7!3m6!1s0x395e8f6379907959:0x88d44690f75de31d!2sShree+Kalki+Tirthdham,+Prernapith!8m2!3d22.8823972!4d72.5427936!16s%2Fg%2F11sgnzc5d_!3m5!1s0x395e8f6379907959:0x88d44690f75de31d!8m2!3d22.8823972!4d72.5427936!16s%2Fg%2F11sgnzc5d_?entry=ttu',
};

const GAURI_HALL = {
  venueName: 'Gauri Hall',
  city: 'Badlapur',
  address: null, // e.g. 'Station Road, Badlapur West'
  mapsUrl: null, // paste the Google Maps link here
};

// ─── Everything else ─────────────────────────────────────────────────

export const wedding: WeddingConfig = {
  couple: {
    groomName: 'Harsh',
    brideName: 'Drasti',
    groomFullName: 'Harsh Mavani',
    brideFullName: 'Drasti Pokar',
    message:
      'Two hearts, two families and two cities — brought together by love, blessed by our elders, and ready to begin forever.',
    portrait: null, // { src: '/media/couple-portrait.jpg', alt: 'Harsh and Drashti' }
  },

  origin: { city: 'Badlapur', state: 'Maharashtra' },
  destination: { city: 'Ahmedabad', state: 'Gujarat' },

  weddingDate: '2026-11-21',
  muhurat: 'Shubh Muhurat · 11:30 AM', // placeholder: confirm with your pandit
  dateMessage: 'The day our forever begins.',

  // ─── Families ("With Blessings From") ──────────────────────────────
  families: [
    {
      side: 'groom',
      heading: "The Groom's Family",
      familyName: 'Mavani Family',
      city: null,
      father: 'Ramesh Mavani',
      mother: 'Harsha Mavani',
      blessings: [
        { relation: 'Sister', names: 'Pari Mavani' },
      ],
      message: null,
      photo: null,
    },
    {
      side: 'bride',
      heading: "The Bride's Family",
      familyName: 'Pokar Family',
      city: null,
      father: 'Sanjay Pokar',
      mother: 'Varsha Pokar',
      blessings: [
        { relation: 'Brother', names: 'Vansh Pokar' },
      ],
      message: null,
      photo: null,
    },
  ],

  // ─── Functions, in the order guests see them ───────────────────────
  events: [
    defineEvent({
      id: 'mandva',
      name: 'Mandva',
      date: '2026-11-20',
      startTime: '08:00',
      ...TIRTHDHAM,
      image: { src: '/media/events/mandva.webp', alt: 'Illustration of the bride and groom at the Mandva ceremony' },
    }),
    defineEvent({
      id: 'mameru',
      name: 'Mameru',
      date: '2026-11-20',
      startTime: '12:00',
      ...TIRTHDHAM,
      image: { src: '/media/events/mameru.webp', alt: 'Illustration of the bride and groom at the Mameru ceremony' },
    }),
    defineEvent({
      id: 'sangeet-dandiya',
      name: 'Sangeet & Dandiya Night',
      date: '2026-11-20',
      startTime: '19:00',
      ...TIRTHDHAM,
      image: { src: '/media/events/sangeet-dandiya.webp', alt: 'Illustration of the bride and groom playing dandiya at the Sangeet night' },
    }),
    defineEvent({
      id: 'wedding',
      name: 'Wedding Ceremony',
      date: '2026-11-21',
      startTime: '11:30', // keep in step with the muhurat above
      ...TIRTHDHAM,
      image: { src: '/media/events/wedding.webp', alt: 'Illustration of the bride and groom taking pheras around the sacred fire' },
    }),
    defineEvent({
      id: 'reception',
      name: 'Reception',
      date: '2026-11-22',
      startTime: '19:00',
      ...GAURI_HALL,
      image: { src: '/media/events/reception.webp', alt: 'Illustration of the bride and groom at the evening reception' },
    }),
  ],

  // ─── Main venue block ──────────────────────────────────────────────
  venue: {
    name: TIRTHDHAM.venueName,
    address: TIRTHDHAM.address,
    mapsUrl: TIRTHDHAM.mapsUrl,
    image: null,
    travelNotes: [], // e.g. ['Nearest station: Ahmedabad Junction (about 15 km)']
    accommodation: null,
  },

  // ─── Contacts ("For Any Assistance") ───────────────────────────────
  // Add phone numbers with +91 to show Call / WhatsApp buttons, e.g. phone: '+919800000000'
  contacts: [
    { name: 'Deep Patel', label: null, phone: '8879688815' },
    { name: 'Nainesh Dholu', label: null, phone: '5600666455' },
    { name: 'Ansh Pokar', label: null, phone: '9145120515' },
  ],

  // ─── RSVP ──────────────────────────────────────────────────────────
  rsvp: {
    enabled: true,
    endpoint: '/api/rsvp',
    deadline: '2026-11-15',
    askPhone: true,
    askDietary: true,
    askAccommodation: true,
    maxGuests: 10,
  },

  // ─── Words ─────────────────────────────────────────────────────────
  shloka: {
    // Widely recited Ganesh Vandana. Set verified: true once your pandit has checked it.
    devanagari: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'],
    transliteration: ['Vakratuṇḍa Mahākāya Sūryakoṭi Samaprabha', 'Nirvighnaṁ Kuru Me Deva Sarvakāryeṣu Sarvadā'],
    meaning:
      'O Lord Ganesha of the curved trunk and mighty form, radiant as a million suns — remove all obstacles from every undertaking, always.',
    verified: false,
  },

  closing: {
    invitation:
      'With the blessings of our elders and the love of our families, we invite you to celebrate the wedding of Harsh and Drashti.',
    blessing: 'Your presence and blessings will make our celebration even more special.',
    tagline: 'Together Begins Forever',
  },

  // ─── Media (optional) ──────────────────────────────────────────────
  ganeshImage: null, // '/media/ganesh.png'
  gallery: [], // [{ src: '/media/gallery/1.jpg', alt: 'Harsh and Drashti' }]
  music: { src: '/media/ishk_meetha.mp3', title: 'Ishk Meetha' },
  intro: {
    videoSrc: null, // '/media/intro.mp4'
    videoWebmSrc: null,
    posterSrc: null,
    videoIncludesRibbon: false,
    nameRevealAt: 4.5,
  },
};
