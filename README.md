# 🎄 Christmas in Rhythms — Party Website

Live page: https://christmasinrhythms.github.io/Christmas-Party_2026/

**How it flows:** opening video → the Christmas house → tap the **door lock** → the doors open and you walk into **the ballroom** (`room.html`). In the ballroom, the elf by the **mirror and clothes rail** leads to *How should I dress?* (a character changes outfit for each genre, plus real-life looks), and the snowman by the **camera** leads to the *Reel challenge* (how it works, challenge ideas and reference links). The floor plan is hidden until `show: true` in `room-content.js`.

Direct links for emails: `room.html#dress`, `room.html#reels` (add `?lang=zh` before the # for Chinese).

## Where to edit

| I want to change… | File |
|---|---|
| Anything written in the ballroom (outfits, reel steps and ideas, video links, floor-plan notes, "last updated") | **`room-content.js`** |
| The floor plan picture | `assets/room/floor-plan.png` (upload a new one with the same name) |
| Higgsfield pictures for the inside page | `assets/room/` — see the names below |
| Party date/time for the countdown & calendar, RSVP link | `assets/scene-manifest.json` |
| Words on the signs outside the house | Picture labels in `assets/labels/` (ask the designer) |
| House layout, animations, music | Leave these to the designer |

### Picture names for `assets/room/`
If a picture is missing, the page shows its own illustration instead, so nothing breaks.

| File name | Where it shows | Shape |
|---|---|---|
| `entrance.mp4` | Plays instead of the door animation when you walk in (keep under 15 MB) | 16:9 video |
| `theme-rock.jpg` | "Reference look" for Rock & Punk in the dressing room | 3:4 |
| `theme-disco.jpg` | "Reference look" for Disco Vibe | 3:4 |
| `theme-kpop.jpg` | "Reference look" for K-pop | 3:4 |
| `theme-jazz.jpg` | "Reference look" for Jazz & Classic | 3:4 |
| `looks/rock-1.jpg` … `looks/jazz-2.jpg` | Real-life looks for each genre (listed in `room-content.js` under photos) | any |

## How to edit `room-content.js`

1. Click `room-content.js`, then the ✏️ pencil.
2. Change only the text inside the "quotes". `en` = English, `zh` = 繁體中文.
3. Every line ending in `"…"` needs a **comma** after it.
4. Update `lastUpdated` at the top.
5. Click **Commit changes**. Refresh the page after 1–2 minutes.

**If the ballroom says "Content is being updated"**, a comma or quote is missing in `room-content.js`. Open the file → **History** → compare with the previous version.

## Not used any more
`event.js`, `script.js`, `style.css`, `existing-site.html` and `Poster.jpg` are left over from the first version and can be deleted.
