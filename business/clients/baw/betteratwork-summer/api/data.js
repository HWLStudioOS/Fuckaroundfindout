// Shared persistence for the Better@Work summer tracker.
//   GET  /api/data              -> { v, WEEKS, NUMBERS, FEED?, t? } or null
//   POST /api/data (x-edit-key) -> replaces payload; optimistic concurrency via `v`
// Uses the Redis connection string Vercel injects as REDIS_URL.
const crypto = require('crypto');
const { createClient } = require('redis');
const KEY = 'baw-summer';

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
function readRaw(req) { return new Promise((res, rej) => { let d = ''; req.on('data', c => (d += c)); req.on('end', () => res(d)); req.on('error', rej); }); }
function validate(body) { return body && typeof body === 'object' && Array.isArray(body.WEEKS) && body.WEEKS.length > 0 && Array.isArray(body.NUMBERS); }
function parse(raw) { if (!raw) return null; try { return JSON.parse(raw); } catch (e) { return null; } }

module.exports = async (req, res) => {
  try {
    if (!process.env.REDIS_URL) return res.status(500).json({ error: 'storage not configured' });
    const c = await getClient();

    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(parse(await c.get(KEY)));
    }

    if (req.method === 'POST') {
      const k = req.headers['x-edit-key'] || '';
      if (!process.env.EDIT_KEY || !safeEqual(k, process.env.EDIT_KEY)) return res.status(401).json({ error: 'unauthorized' });

      let body = req.body;
      if (body === undefined || body === null || body === '') { try { body = JSON.parse(await readRaw(req)); } catch (e) { return res.status(400).json({ error: 'invalid json' }); } }
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: 'invalid json' }); } }
      if (!validate(body)) return res.status(400).json({ error: 'expected { WEEKS: [ ... ], NUMBERS: [ ... ] }' });
      if (JSON.stringify(body).length > 900000) return res.status(413).json({ error: 'payload too large' });

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
