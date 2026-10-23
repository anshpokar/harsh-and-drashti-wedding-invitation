# Harsh Weds Drashti: Royal Wedding Invitation

A mobile-first, cinematic wedding invitation. The guest opens the palace doors, a silk ribbon falls away, the names appear in gold, and then they scroll through a shloka, the couple, a scratch-to-reveal date, the Badlapur → Ahmedabad journey, families, events, venue, gallery, RSVP and the closing.

Built with React, TypeScript, Vite and **GSAP** (ScrollTrigger and MotionPath).

Scene plan, GSAP motion per scene, timings, intro-video brief and reference-video workflow: **[docs/STORYBOARD.md](docs/STORYBOARD.md)**

## Run it

```bash
npm install
npm run server      # RSVP API on :8787 (terminal 1)
npm run dev         # site with hot reload on :5173 (terminal 2)
```

Production: `ADMIN_TOKEN=some-long-secret npm start`. This builds the site and serves it together with the RSVP API on `PORT` (default 8787).

## Edit the content

**Everything lives in `src/config/wedding.ts`.** You don't need to touch the UI code.

- Any field left as `null` counts as "to be provided".
- While `previewMode: true`, missing details show as dashed *"…: to be provided"* labels, and a banner sits at the top.
- **Set `previewMode: false` before sending the link.** Sections with no data (families, events, venue, gallery) are then hidden entirely, and no placeholder text is ever shown to guests.
- Photos go in `public/media/` and are referenced as `'/media/file.jpg'`. Use real photos only. Resize them to about 1600px on the long edge and use WebP or JPEG at quality 80.
- Add `public/media/og-image.jpg` (1200×630) to get a nice WhatsApp link preview.
- Have the shloka checked by your pandit, then set `shloka.verified: true`.

### Still needed from the family

Muhurat · parents' names and the blessings list (grandparents, siblings, nieces and nephews) for both families · dates, times and venues for Mandva & Mameru, Sangeet & Dandiya Night and the Reception · Tirthdham's full address and exact Google Maps pin link · travel and accommodation notes · contact numbers · couple, family and gallery photos · optional Ganesh artwork, music and intro video · RSVP deadline.

## RSVP

`server.mjs` (no dependencies) validates every submission on the server, rate-limits it, drops bot submissions caught by a honeypot field, and appends each response to `data/rsvps.jsonl` (file mode 600). That file is never served publicly.

Download the responses as CSV:

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://your-site/api/rsvp/export -o rsvps.csv
```

Hosting: any Node host with a persistent disk works (Render, Railway, Fly.io, a VPS). Put it behind HTTPS.
If you'd rather use static hosting (Netlify or Vercel without functions), point `rsvp.endpoint` at your own form backend. It must return JSON `{ "ok": true }` with a 2xx status. The form only shows "Thank you" after a confirmed save.

## Built-in behaviour

- Skip intro button, Replay button, deep links (`/#venue`) that bypass the intro.
- Music never autoplays. It only plays when the guest turns on the toggle.
- Respects `prefers-reduced-motion`: animations are removed and the intro becomes a simple fade.
- Scratch card works with touch, mouse and pen, doesn't scroll the page while scratching, and has a tap-to-reveal button.
- Events get "Open in Maps" and "Add to Calendar" (.ics, India time) once their details are filled in.
- Gallery viewer supports swipe, arrow keys and Esc.
- Map uses real coordinates for Badlapur, Mumbai, Surat, Vadodara and Ahmedabad.
