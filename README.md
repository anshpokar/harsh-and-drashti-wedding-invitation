# Harsh Weds Drashti: Royal Wedding Invitation

A mobile-first, cinematic wedding invitation. The guest opens the palace doors, a silk ribbon falls away, the names appear in gold, and then they scroll through a shloka, the couple, a scratch-to-reveal date, the Badlapur → Ahmedabad journey, families, events, venue, gallery, RSVP and the closing.

Built with React, TypeScript, Vite and **GSAP** (ScrollTrigger and MotionPath).

Scene plan, GSAP motion per scene, timings, intro-video brief and reference-video workflow: **[docs/STORYBOARD.md](docs/STORYBOARD.md)**

## Preview it on your computer

You need **Git** (https://git-scm.com) and **Node.js 18 or newer** (https://nodejs.org, the LTS version).

```bash
git clone https://github.com/anshpokar/harsh-and-drashti-wedding-invitation.git
cd harsh-and-drashti-wedding-invitation
npm install
npm start
```

Open **http://localhost:8787**. RSVPs you submit are saved to `data/rsvps.jsonl`.
Stop it with `Ctrl + C`.

**While editing `src/data.ts`**, use live reload instead. Open two terminals in the project folder:

```bash
npm run server   # terminal 1: RSVP saving
npm run dev      # terminal 2: open http://localhost:5173; it refreshes on every save
```

**On your phone:** connect it to the same Wi-Fi as the computer, then open the *Network* address `npm run dev` prints (like `http://192.168.1.5:5173`). With `npm start`, use `http://<your-computer's-IP>:8787` instead.

**Get the latest changes later:** `git pull`, then `npm install` and `npm start` again.

## Edit the content

**Every detail lives in one file: [`src/data.ts`](src/data.ts).** Names, dates, times, venues, contacts and the RSVP deadline are all there, with instructions at the top. You don't need to touch any other code.

- Any field left as `null` is simply left out, or shows "To be announced" where a date, time or venue is expected.
- Names wrapped in `sample('…')` are stand-ins. They display like any other name; the wrapper just marks them as ones to replace. Change `sample('Sunita Patel')` to `'Sunita Patel'` once the real name is known.
- Each venue is written once at the top of the file and reused by every function held there.
- Photos go in `public/media/` and are referenced as `'/media/file.jpg'`. Use real photos only. Resize them to about 1600px on the long edge and use WebP or JPEG at quality 80.
- Add `public/media/og-image.jpg` (1200×630) to get a nice WhatsApp link preview.
- Have the shloka checked by your pandit, then set `shloka.verified: true`.

### Still needed from the family

Confirmed muhurat (11:30 AM is a placeholder) · real mothers' and blessings names (the current ones are `sample('…')` stand-ins) · Gauri Hall's address and Google Maps pin link · travel and accommodation notes · phone numbers for Deep Patel, Nainesh Dholu and Ansh Pokar · photos (optional; the illustrations stand in) · optional Ganesh artwork, music and intro video · RSVP deadline.

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
