# Harsh Weds Drasti: Storyboard and Scene Plan

This is the scene order the site uses (`src/App.tsx`), with what each scene does, how it's built, and how long it runs.
The reference video hasn't been analysed yet. See **§3** for the steps to follow once it arrives.

## 1. Scene order

| # | Scene | Component | Built with | Duration / trigger | Guest action |
|---|-------|-----------|------------|--------------------|--------------|
| 1 | **Royal entrance**: dark palace, carved doors, marigold toran, lanterns, gold dust, red silk ribbon with bow. "A Royal Celebration of Love". | `RoyalIntro`, `PalaceDoors`, `RibbonReveal`, `GoldDust`, `Toran` | SVG + CSS, canvas particles | Waits for a tap | Taps "Tap to Open the Invitation" (or Skip intro) |
| 2a | **Ribbon release**: the bow loosens and both ribbon halves fall away | `RibbonReveal` | SVG layer, CSS transitions | 0 – 1.3 s after tap | |
| 2b | **Doors open** with 3D perspective, and warm light floods out | `PalaceDoors` | CSS 3D `rotateY` | 0.9 – 3.1 s | |
| 2c | **Name reveal**: the camera pushes through the doorway, and HARSH *weds* DRASTI forms letter by letter in metallic gold | `CoupleNameReveal` | CSS keyframes | 2.5 – 5 s | "Enter the Celebration" (auto-enters at 9.5 s) |
| 3 | **Hero**: the names under a palace arch, Badlapur ✦ Ahmedabad | `HeroNames` | CSS | On scroll | Scrolls |
| 4 | **Sacred welcome**: lotus (or Ganesh artwork), ॥ श्री गणेशाय नमः ॥, shloka written in line by line, transliteration, meaning | `ShlokaSection` | Clip-path "ink" wipe | About 3 s once in view | |
| 5 | **Couple introduction**: "Together with the blessings of our families", arched portrait, full names, message | `CoupleIntroduction` | Scroll reveals | | |
| 6 | **Scratch to reveal the date**: gold-foil card, auto-reveals at 50% scratched, sparkle burst | `ScratchDateCard` | Canvas `destination-out` | Interactive | Scratches, or taps "Tap to reveal instead" |
| 7 | **Royal journey**: stylised western-India map, gold route Badlapur → Surat → Vadodara → Ahmedabad drawn with a glowing traveller | `JourneyMap` | SVG (real lon/lat projection) | 3.2 s once in view | "Directions to the Venue" (once venue is set) |
| 8 | **Two families**: groom's and bride's cards | `FamilyIntroduction` | Scroll reveals | | |
| 9 | **Festivities**: numbered timeline of royal scrolls that unroll | `WeddingTimeline` | Clip-path unroll | | Open in Maps / Add to Calendar (.ics) |
| 10 | **Venue and travel**: venue card, travel notes, stay, contacts (Call / WhatsApp) | `VenueDetails` | | | Open in Maps / View All Events / Contact |
| 11 | **Gallery**: editorial grid and full-screen viewer (swipe, arrows, Esc) | `PhotoGallery` | | | Taps a photo |
| 12 | **RSVP**: saved on the server | `RSVPForm` + `server.mjs` | | | Submits |
| 13 | **Closing**: invitation text, "Harsh weds Drasti / Together Begins Forever", lotus, replay | `ClosingInvitation` | | | "Replay the Royal Entrance" |

There's always a floating bar with **Date · Events · Venue · RSVP**, plus a music toggle when music is configured.
Shared links like `…/#venue` skip the intro.

## 2. Separate cinematic entry video (optional)

The site works fully without a video: the doors are pure SVG/CSS.
If you produce a video, set `intro.videoSrc` in `src/config/wedding.ts`. The site then plays it after the tap and shows the HTML title over it at `intro.nameRevealAt` seconds.

### Rules

- **Format:** portrait 9:16, 1080×1920, 8–10 s, no audio needed. Export `intro.mp4` (H.264, CRF about 26, under 4 MB), plus optionally `intro.webm` (VP9), plus `intro-poster.jpg`, the first frame with the doors closed.
- **No text in the video.** The names are rendered as HTML so they're never misspelled. Keep the centre third of the frame clean from about 4.5 s onward.
- **Ribbon:** keep the ribbon *out* of the video and let the website's interactive SVG ribbon handle it. If the video *does* include the ribbon untying, set `videoIncludesRibbon: true` so the ribbon isn't shown twice.
- Optimise: `ffmpeg -i master.mov -vf scale=1080:-2 -c:v libx264 -crf 26 -preset slow -movflags +faststart -an public/media/intro.mp4`
- Poster: `ffmpeg -i public/media/intro.mp4 -frames:v 1 -q:v 3 public/media/intro-poster.jpg`

### Shot list

| t (s) | Shot | Camera | Notes |
|-------|------|--------|-------|
| 0.0–1.5 | Dark royal palace courtyard at night, giant antique-gold carved doors, centred | Slow push-in | Lanterns flicker, gold dust drifts |
| 1.5–2.5 | Light catches the door carvings: lotus rosettes, jali lattice, brass studs | Continue push | Matches the site's door design (burgundy wood, gold) |
| 2.5–3.0 | *(Ribbon moment: handled by the website layer)* | Hold | Leave a clear horizontal band at about 52% height |
| 3.0–5.0 | Doors swing inward. Warm golden light floods out | Push through the doorway | Rose petals or marigolds float |
| 5.0–8.0 | Soft golden haze inside a palace hall, bokeh | Slow drift | **Clean centre for the title overlay** |
| 8.0–9.0 | Gentle fade to deep plum `#24091a` | | Matches the site background for a seamless hand-off |

### Prompt for a video model (Veo / Runway / Kling / Sora)

> Cinematic vertical 9:16 shot, night, a grand Rajasthani palace entrance. Two enormous ornate doors of deep burgundy lacquered wood with antique-gold carvings, lotus rosettes, jali lattice panels and brass studs, set in a pointed Mughal arch. Marigold garlands across the top, brass lanterns glowing warmly on both sides, floating golden dust particles, rich shadows. Slow dolly-in. At 3 seconds the doors swing inward and warm golden light pours out, with marigold petals drifting. The camera glides through into a softly glowing golden haze with bokeh. Luxurious, royal Indian wedding, photoreal, shallow depth of field. **No text, no letters, no people, no ribbon.**

Negative prompt: `text, letters, watermark, logo, people, faces, ribbon, modern elements, cartoon`.

## 3. When the reference video arrives (for the coding agent)

1. Extract frames to study them: `ffmpeg -i reference.mp4 -vf fps=2 ref/frame_%03d.jpg`. Also note the total length (`ffprobe`).
2. Fill in this table for every scene in the reference:

   | Ref time | What's on screen | Text shown and how it enters | Transition out | Interactive? | Maps to our scene # | Build as (CSS / SVG / canvas / video) |
   |---|---|---|---|---|---|---|

3. Compare it with §1. Re-order scenes in `src/App.tsx`, adjust the timings in `RoyalIntro.tsx` (`const T`), and adjust the reveal delays and CSS keyframes in `src/styles/global.css` to match the reference's pacing.
4. Anything the reference shows that needs real input (ribbon, scratch, RSVP) stays a web layer. Purely cinematic moments (camera moves, fabric physics, light rays) can go into the separate intro video.
5. Don't copy music from the reference unless it's licensed.
