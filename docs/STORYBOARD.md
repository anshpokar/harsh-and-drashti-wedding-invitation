# Harsh Weds Drashti: Storyboard and Scene Plan

This is the scene order the site uses (`src/App.tsx`), with what each scene does, how it's built, and how long it runs.
The reference video hasn't been analysed yet. See **§3** for the steps to follow once it arrives.

## 1. Scene order

**Look:** the opening (palace doors) and hero are dark royal burgundy and gold. From the shloka onward, the pages switch to the blush-ivory style of the reference designs: Pinyon Script headings, gold letter-spaced capitals, white cards. The site closes on a maroon airmail "Thank You" letter.
**Motion:** all animation is GSAP (`src/lib/gsap.ts`). The opening is one master timeline. Every later scene is driven by ScrollTrigger, and everything is skipped under `prefers-reduced-motion`.

| # | Scene | Component | GSAP motion | Guest action |
|---|-------|-----------|-------------|--------------|
| 1 | **Royal entrance**: carved doors, toran, lanterns, gold dust, silk ribbon with bow | `RoyalIntro`, `PalaceDoors`, `RibbonReveal` | Palace emerges, garland drops, lanterns bounce in then sway, ribbon stretches across, bow springs in and breathes | Taps (or Skip intro) |
| 2a | **Ribbon release** | `RibbonReveal` | Bow loops collapse, bow drops and spins away, ribbon halves fall outward (0–1.3 s) | |
| 2b | **Doors open** | `PalaceDoors` | `rotationY` ±108° with perspective, light floods (0.9–3.3 s) | |
| 2c | **Name reveal** | `CoupleNameReveal` | Camera pushes through the doorway; letters condense out of blur; "weds" blooms (from 2.4 s) | "Enter the Celebration" (auto-enters about 4.5 s later) |
| 3 | **Hero**: names under an arch, Badlapur ✦ Ahmedabad, 21 · November · 2026 | `HeroNames` | Arch rises and names replay; scrubbed parallax as it scrolls away | |
| 4 | **Sacred welcome**: lotus, ॥ श्री गणेशाय नमः ॥, shloka | `ShlokaSection` | Lotus spins in; each Devanagari line is inked left to right | |
| 5 | **Couple**: Harsh & Drashti, Harsh Patel · Drashti Pokar | `CoupleIntroduction` | Portrait lifts out of the arch; scrubbed photo parallax | |
| 6 | **Save the Date** scratch card | `ScratchDateCard` | Foil dissolves, "21" pops elastically, spark burst, card wobble, "N days to go" counts up | Scratches / taps |
| 7 | **Royal journey** map | `JourneyMap` | Coast draws, route draws while a traveller rides it (MotionPath), Ahmedabad pin pops, dashed **Reception** route draws back to Badlapur | Directions |
| 8 | **With Blessings From**: Patel family (son of Ramesh Patel) / Pokar family (daughter of Kantilal Pokar) | `FamilyIntroduction` | Cards slide in from both sides; relation groups stagger | |
| 9 | **Wedding Events**: Mandva & Mameru · Sangeet & Dandiya Night · Wedding Ceremony (21 Nov), all at Shree Kalki Tirthdham, Prernapith · Reception at Gauri Hall, Badlapur | `WeddingTimeline`, `EventArt` | Card rises, script name pops, illustration unveils, marigold strands drop; idle flame flicker, dandiya clash, chandelier sway; Ken Burns on scroll | View on Maps / Add to Calendar |
| 10 | **Venue**: Shree Kalki Tirthdham, Prernapith (Paldi Kankaj, Ahmedabad), skyline, Gauri Hall reception venue | `VenueDetails`, `CitySkyline` | Venue name letter-spacing settles; skyline buildings rise out of the Sabarmati, reflection fades in, kite floats, ripples drift | View on Maps |
| 11 | **Gallery** | `PhotoGallery` | Staggered reveals | Opens viewer |
| 12 | **Kindly Respond** RSVP | `RSVPForm` | Heading writes itself in | Submits |
| 13 | **Thank You** airmail letter | `ClosingInvitation` | Letter flies up, script writes in, postmark stamps, wax seal presses down, marigold petals fall while on screen | Replay |

Each section heading (`SectionTitle`) writes itself in with a clip-path wipe while its divider draws outward.
There's always a bottom bar with **Date · Events · Venue · RSVP**. If music is configured, a spinning vinyl button appears too. Shared links like `…/#venue` skip the intro.

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
