// Shared persistence for the Better@Work summer tracker.
//   GET  /api/data              -> { v, WEEKS, NUMBERS, FEED?, t? } or null
//   POST /api/data (x-edit-key) -> replaces payload; optimistic concurrency via `v`
// Uses the Redis connection string Vercel injects as REDIS_URL.
const crypto = require('crypto');
const { createClient } = require('redis');
const KEY = 'baw-summer';
const MAX_PAYLOAD_BYTES = 900000;

let client;
async function getClient() {
  if (client && client.isOpen) return client;
  client = createClient({ url: process.env.REDIS_URL });
  client.on('error', () => {});
  await client.connect();
  return client;
}
function safeEqual(a, b) {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}
function readRaw(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    let bytes = 0;
    let settled = false;
    req.on('data', chunk => {
      if (settled) return;
      bytes += Buffer.byteLength(chunk);
      if (bytes > MAX_PAYLOAD_BYTES) {
        settled = true;
        const error = new Error('payload too large');
        error.code = 'PAYLOAD_TOO_LARGE';
        reject(error);
        return;
      }
      data += chunk;
    });
    req.on('end', () => { if (!settled) resolve(data); });
    req.on('error', error => { if (!settled) reject(error); });
  });
}
function validate(body) { return body && typeof body === 'object' && Array.isArray(body.WEEKS) && body.WEEKS.length > 0 && Array.isArray(body.NUMBERS); }
function parse(raw) { if (!raw) return null; try { return JSON.parse(raw); } catch (e) { return null; } }
function sameOrigin(req) {
  const origin = req.headers.origin;
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch (e) { return false; }
}
function setSecurityHeaders(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
}

module.exports = async (req, res) => {
  try {
    setSecurityHeaders(res);
    if (!process.env.REDIS_URL) return res.status(500).json({ error: 'storage not configured' });
    const c = await getClient();

    if (req.method === 'GET') {
      return res.status(200).json(parse(await c.get(KEY)));
    }

    if (req.method === 'POST') {
      if (!sameOrigin(req)) return res.status(403).json({ error: 'forbidden origin' });
      if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
        return res.status(415).json({ error: 'content type must be application/json' });
      }
      const contentLength = Number(req.headers['content-length'] || 0);
      if (Number.isFinite(contentLength) && contentLength > MAX_PAYLOAD_BYTES) {
        return res.status(413).json({ error: 'payload too large' });
      }
      const k = req.headers['x-edit-key'] || '';
      if (!process.env.EDIT_KEY || !safeEqual(k, process.env.EDIT_KEY)) return res.status(401).json({ error: 'unauthorized' });

      let body = req.body;
      if (body === undefined || body === null || body === '') {
        try { body = JSON.parse(await readRaw(req)); }
        catch (e) { return res.status(e.code === 'PAYLOAD_TOO_LARGE' ? 413 : 400).json({ error: e.code === 'PAYLOAD_TOO_LARGE' ? 'payload too large' : 'invalid json' }); }
      }
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: 'invalid json' }); } }
      if (!validate(body)) return res.status(400).json({ error: 'expected { WEEKS: [ ... ], NUMBERS: [ ... ] }' });
      if (Buffer.byteLength(JSON.stringify(body)) > MAX_PAYLOAD_BYTES) return res.status(413).json({ error: 'payload too large' });

      // Atomic compare-and-set: WATCH aborts the MULTI if another write lands between the read and the SET.
      const result = await c.executeIsolated(async (iso) => {
        await iso.watch(KEY);
        const current = parse(await iso.get(KEY));
        const curV = current && typeof current.v === 'number' ? current.v : 0;
        const baseV = typeof body.v === 'number' ? body.v : 0;
        if (current && baseV !== curV) { await iso.unwatch(); return { conflict: curV }; }
        const next = { v: curV + 1, WEEKS: body.WEEKS, NUMBERS: body.NUMBERS, t: Date.now() };
        // FEED is optional (added 14 Jul); preserve the stored value when an older client posts without it.
        const feed = Array.isArray(body.FEED) ? body.FEED : (current && Array.isArray(current.FEED) ? current.FEED : null);
        if (feed) next.FEED = feed;
        const exec = await iso.multi().set(KEY, JSON.stringify(next)).exec();
        if (exec === null) return { conflict: curV };
        return { next };
      });
      if (result.conflict !== undefined) return res.status(409).json({ error: 'version conflict', v: result.conflict });
      return res.status(200).json({ ok: true, v: result.next.v, t: result.next.t });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'server error' });
  }
};
