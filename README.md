# 🎄 Holiday Harmony — Christmas Party Page

Live page: `https://longtat2704.github.io/Christmas-Party_2026/`

## Where to edit

| I want to change…                          | Open this file    |
|--------------------------------------------|-------------------|
| Schedule times, activities, notes          | **`event.js`**    |
| Date, venue, theme, RSVP text              | **`event.js`**    |
| Show the schedule on the page              | **`event.js`** → set `scheduleConfirmed: true` |
| Turn Santa on/off or change how often      | **`event.js`** → `santa`, `santaEvery` |
| The poster image                           | `images/poster.jpg` (upload a new one with the same name) |
| Colours or fonts                           | `style.css` (top section only) |
| Page layout                                | `index.html` (ask before changing) |
| Animations                                 | `script.js` (ask before changing) |

**99% of edits happen in `event.js`.**

## How to edit `event.js`

1. Click `event.js`, then the ✏️ pencil icon.
2. Change only the text inside the "quotes". Keep every comma, `[ ]` and `{ }`.
3. To add a schedule item, copy a whole `{ time: ..., icon: "..." },` line and paste it where you want it.
4. Update `lastUpdated` to today's date.
5. Click **Commit changes** and write a short note (e.g. "Update lunch time").
6. Wait 1–2 minutes, then refresh the live page.

Icon options: `bell`, `drinks`, `food`, `music`, `fashion`, `gift`, `star`, `camera`, `tree`.

## If the page looks blank after an edit

A comma or quote probably went missing in `event.js`. Open the file → **History** → compare with the previous version, or ask the page owner.

Before editing, tell the team which file you're working on so you don't overwrite each other.
