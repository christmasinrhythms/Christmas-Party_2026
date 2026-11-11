/* =====================================================================
   ✏️  EDIT THIS FILE to update the party page.

   Rules so nothing breaks:
     • Only change the text inside the "quotes".
     • Keep every comma , bracket [ ] and brace { } where it is.
     • To add a schedule item, copy one whole { ... } line (including
       its comma) and paste it where you want it.

   When you're done, click "Commit changes". The live page updates
   in 1–2 minutes (refresh the page to see it).
   ===================================================================== */

window.EVENT = {

  /* ---------- Event details (top of the page) ---------- */
  title:     "Christmas In Rhythms",
  date:      "Thursday, 24 December 2026",
  time:      "11:30 – 15:00",

  // Used for the countdown and "Add to calendar". Format: YYYY-MM-DDTHH:MM:SS+08:00
  startsAt:  "2026-12-24T11:30:00+08:00",
  endsAt:    "2026-12-24T15:00:00+08:00",

  venue:     "1/F, Harbour Grand Hong Kong",
  address:   "23 Oil Street, North Point, Hong Kong Island",
  mapLink:   "https://maps.google.com/?q=Harbour+Grand+Hong+Kong+23+Oil+Street+North+Point",

  theme:     "Music-inspired Fashion",
  themeNote: "Dress in your picked music genre",

  rsvp:      "RSVP before 16 Nov",
    rsvpLink: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=bvGrKaKVE02NUW2xt3XUW9x4G49tIZ9Lh76f3qPEQo9UODJTQldSM1c1NFNYNTUwVDhJNk5QQTQzQy4u",

  // Upload the poster into the "images" folder with exactly this name.
  // Leave it as "" to hide the poster section.
  poster:    "Poster.jpg",

  // Change this whenever you edit, so the team knows the page is fresh.
  lastUpdated: "8 Nov 2026",


  /* ---------- Fun extras ---------- */

  santa:      true,   // true = Santa runs across the bottom of the screen
  santaEvery: 5,      // seconds Santa rests between runs


  /* ---------- Schedule ---------- */

  // false = the schedule is HIDDEN from the page (guests see "coming soon").
  //         You can fill in the list below in the meantime.
  // true  = the schedule appears under the poster.
  scheduleConfirmed: false,

  // The items below are placeholders. Replace them with the real plan.
  // icon options: bell, drinks, food, music, fashion, gift, star, camera, tree
  schedule: [
    { time: "11:30", title: "Arrival & Welcome Drinks",   note: "Check in and grab a festive mocktail.",        icon: "drinks"  },
    { time: "12:00", title: "Opening Words",              note: "",                                             icon: "bell"    },
    { time: "12:15", title: "Christmas Lunch",            note: "",                                             icon: "food"    },
    { time: "13:15", title: "Genre Runway",               note: "Show off your music-inspired look.",           icon: "fashion" },
    { time: "13:45", title: "Games & Lucky Draw",         note: "",                                             icon: "gift"    },
    { time: "14:30", title: "Best Dressed Awards",        note: "",                                             icon: "star"    },
    { time: "14:45", title: "Group Photo",                note: "",                                             icon: "camera"  },
    { time: "15:00", title: "Merry Christmas & Farewell", note: "",                                             icon: "tree"    }
  ]

};
