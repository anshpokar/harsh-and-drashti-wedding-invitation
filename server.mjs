/**
 * Production server: serves the built site from /dist and stores RSVPs.
 *
 *   POST /api/rsvp            → validates and appends to data/rsvps.jsonl
 *   GET  /api/rsvp/export     → CSV of all responses (needs ADMIN_TOKEN)
 *
 * Env: PORT (default 8787), ADMIN_TOKEN (required for export), DATA_DIR.
 * RSVP data is never served publicly — only /dist is static.
 */
import { createServer } from 'node:http';
import { appendFile, mkdir, readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const DIST = resolve(ROOT, 'dist');
const DATA_DIR = resolve(process.env.DATA_DIR ?? join(ROOT, 'data'));
const RSVP_FILE = join(DATA_DIR, 'rsvps.jsonl');
const PORT = Number(process.env.PORT ?? 8787);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? '';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// ── tiny in-memory rate limit: 8 submissions / 10 min / IP ──
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readBody(req, limit = 8 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error('Request too large'), { status: 413 });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

const clean = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');

export function validateRsvp(input) {
  if (!input || typeof input !== 'object') return { error: 'Invalid submission.' };
  const name = clean(input.name, 80);
  if (name.length < 2) return { error: 'Please enter your name.' };
  const attending = ['yes', 'no', 'maybe'].includes(input.attending) ? input.attending : null;
  if (!attending) return { error: 'Please tell us whether you can attend.' };
  let guests = attending === 'no' ? 0 : Number(input.guests);
  if (attending !== 'no' && (!Number.isInteger(guests) || guests < 1 || guests > 20))
    return { error: 'Please enter a valid number of guests.' };
  const phone = clean(input.phone, 20);
  if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) return { error: 'Please enter a valid phone number.' };
  const events = Array.isArray(input.events)
    ? input.events.filter((e) => typeof e === 'string').slice(0, 20).map((e) => clean(e, 40))
    : [];
  return {
    value: {
      name,
      attending,
      guests,
      phone,
      events,
      dietary: clean(input.dietary, 200),
      accommodation: input.accommodation === true,
      message: clean(input.message, 500),
    },
  };
}

async function handleRsvp(req, res) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || '?';
  if (rateLimited(ip)) return json(res, 429, { ok: false, error: 'Too many submissions. Please try again later.' });
  let input;
  try {
    input = JSON.parse(await readBody(req));
  } catch (err) {
    return json(res, err.status ?? 400, { ok: false, error: 'Invalid submission.' });
  }
  // Honeypot filled → pretend success, store nothing.
  if (input?.website) return json(res, 200, { ok: true });
  const { value, error } = validateRsvp(input);
  if (error) return json(res, 422, { ok: false, error });
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(RSVP_FILE, JSON.stringify({ ...value, submittedAt: new Date().toISOString() }) + '\n', { mode: 0o600 });
  json(res, 201, { ok: true });
}

async function handleExport(req, res) {
  const auth = req.headers.authorization ?? '';
  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) return json(res, 401, { ok: false, error: 'Unauthorized' });
  const raw = await readFile(RSVP_FILE, 'utf8').catch(() => '');
  const rows = raw.split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const cols = ['submittedAt', 'name', 'attending', 'guests', 'phone', 'events', 'dietary', 'accommodation', 'message'];
  const cell = (v) => `"${String(Array.isArray(v) ? v.join('; ') : v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n');
  res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="rsvps.csv"' });
  res.end(csv);
}

async function serveStatic(req, res) {
  const url = new URL(req.url, 'http://x');
  let path = normalize(join(DIST, decodeURIComponent(url.pathname)));
  if (!path.startsWith(DIST)) return json(res, 403, { error: 'Forbidden' });
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
  } catch {
    path = join(DIST, 'index.html'); // SPA fallback
  }
  try {
    const info = await stat(path);
    const type = TYPES[extname(path)] ?? 'application/octet-stream';
    const immutable = path.includes(`${DIST}/assets/`);
    const headers = {
      'Content-Type': type,
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
      'Accept-Ranges': 'bytes',
    };
    // Range support so iOS Safari can stream the intro video.
    const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
    if (range) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Number(range[2]) : info.size - 1;
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${info.size}`, 'Content-Length': end - start + 1 });
      return createReadStream(path, { start, end }).pipe(res);
    }
    res.writeHead(200, { ...headers, 'Content-Length': info.size });
    createReadStream(path).pipe(res);
  } catch {
    json(res, 404, { error: 'Not found. Did you run npm run build?' });
  }
}

const server = createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, 'http://x');
    if (pathname === '/api/rsvp' && req.method === 'POST') return await handleRsvp(req, res);
    if (pathname === '/api/rsvp/export' && req.method === 'GET') return await handleExport(req, res);
    if (pathname.startsWith('/api/')) return json(res, 404, { ok: false, error: 'Not found' });
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Method not allowed' });
    await serveStatic(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) json(res, 500, { ok: false, error: 'Something went wrong. Please try again.' });
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`Harsh Weds Drashti → http://localhost:${PORT}`));
}
