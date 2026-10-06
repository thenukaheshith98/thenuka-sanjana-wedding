/**
 * Wedding details — edit this file before sharing the invitation.
 * Guest links: invitation.html?to=Uncle%20Sunil
 */
window.WEDDING = {
  couple: {
    bride: {
      firstName: "Sanjana",
      lastName: "",
      fullName: "Sanjana",
      honorific: "Daughter of",
      parents: "Mr. & Mrs.",
      photo: "",
    },
    groom: {
      firstName: "Thenuka",
      lastName: "",
      fullName: "Thenuka",
      honorific: "Son of",
      parents: "Mr. & Mrs.",
      photo: "",
    },
  },

  monogram: "T · S",
  sealInitials: "T&S",
  hashtag: "#ThenukaAndSanjana",

  blessingSi: "ශ්‍රී සුභ මංගලම්",
  blessingEn: "Together with their families",
  headline: "request the pleasure of your company at their marriage",
  quote:
    "Two souls, one promise — written in the language of forever.",

  datetime: "2026-12-12T10:00:00+05:30",
  displayDate: "Saturday, 12 December 2026",
  rsvpDeadline: "15 November 2026",

  /**
   * WhatsApp number in international format, no + or spaces.
   * RSVPs open a pre-filled chat. Leave blank to keep replies on this device only.
   */
  whatsapp: "",

  /** Optional POST endpoint (e.g. Google Apps Script) that receives RSVP JSON. */
  rsvpWebhook: "",

  /** Relative path to an mp3 you own. Leave blank to hide music. */
  music: "assets/music/song.mp3",

  /** Optional full-bleed cover photo behind the envelope. */
  coverPhoto: "",

  map: {
    venue: "Cinnamon Grand Colombo",
    address: "77 Galle Road, Colombo 03, Sri Lanka",
    embed:
      "https://maps.google.com/maps?q=Cinnamon%20Grand%20Colombo&z=16&output=embed",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Cinnamon%20Grand%20Colombo",
  },

  events: [
    {
      id: "poruwa",
      title: "Poruwa Ceremony",
      time: "10:00 in the morning",
      isoStart: "2026-12-12T10:00:00+05:30",
      isoEnd: "2026-12-12T12:00:00+05:30",
      venue: "The Oaks, Cinnamon Grand",
      note: "Traditional vows beneath the poruwa",
    },
    {
      id: "reception",
      title: "Wedding Reception",
      time: "7:00 in the evening",
      isoStart: "2026-12-12T19:00:00+05:30",
      isoEnd: "2026-12-12T23:30:00+05:30",
      venue: "Cinnamon Grand Ballroom",
      note: "Dinner, toasts, and the first dance",
    },
    {
      id: "homecoming",
      title: "Homecoming",
      time: "6:30 in the evening",
      isoStart: "2026-12-13T18:30:00+05:30",
      isoEnd: "2026-12-13T22:30:00+05:30",
      venue: "The Family Home, Nugegoda",
      note: "An intimate evening with close family",
    },
  ],

  story: [
    {
      year: "2019",
      title: "A quiet introduction",
      body: "A mutual friend sat us at the same table. Neither of us planned to stay late. We did.",
    },
    {
      year: "2022",
      title: "The ordinary days",
      body: "Markets on Saturday, too much tea, and the slow certainty that home had become a person.",
    },
    {
      year: "2025",
      title: "The question",
      body: "Under a monsoon sky in Galle, one of us finally asked. The answer was already waiting.",
    },
  ],

  gallery: [
    { src: "assets/photos/1.jpg", alt: "Portrait of the couple" },
    { src: "assets/photos/2.jpg", alt: "An evening together" },
    { src: "assets/photos/3.jpg", alt: "A quiet moment" },
    { src: "assets/photos/4.jpg", alt: "Family and laughter" },
    { src: "assets/photos/5.jpg", alt: "The coast at dusk" },
    { src: "assets/photos/6.jpg", alt: "Hands, rings, forever" },
  ],

  meals: ["Chicken", "Fish", "Vegetarian", "Vegan", "No preference"],
};
