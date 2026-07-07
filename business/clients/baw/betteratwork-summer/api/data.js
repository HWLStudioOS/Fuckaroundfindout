// Shared persistence for the Better@Work summer tracker.
//   GET  /api/data              -> { v, WEEKS, NUMBERS } or null
//   POST /api/data (x-edit-key) -> replaces payload; optimistic concurrency via `v`
// Zero-dependency beyond Node's crypto; talks to Vercel KV / Upstash Redis over REST.
const crypto = require('crypto');
const KEY = 'baw-summer';

function kvConf() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) return { url: process.env.KV_REST_API_URL, tok: process.env.KV_REST_API_TOKEN };
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) return { url: process.env.UPSTASH_REDIS_REST_URL, tok: process.env.UPSTASH_REDIS_REST_TOKEN };
  return { url: '', tok: '' };
}
function safeEqual(a, b) {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}
async function kvGet(base, tok) {
  const r = await fetch(`${base}/get/${KEY}`, { headers: { Authorization: `Bearer ${tok}` } });
  if (!r.ok) throw new Error('kv get ' + r.status);
  const j = await r.json();
  if (j.result == null) return null;
  try { return JSON.parse(j.result); } catch (e) { return null; }
}
async function kvSet(base, tok, value) {
  const r = await fetch(`${base}/set/${KEY}`, {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'text/plain' }, body: JSON.stringify(value),
  });
  if (!r.ok) throw new Error('kv set ' + r.status);
}
function readRaw(req) { return new Promise((res, rej) => { let d = ''; req.on('data', c => (d += c)); req.on('end', () => res(d)); req.on('error', rej); }); }
function validate(body) { return body && typeof body === 'object' && Array.isArray(body.WEEKS) && body.WEEKS.length > 0 && Array.isArray(body.NUMBERS); }

module.exports = async (req, res) => {
  try {
    const { url, tok } = kvConf();
    const base = url.replace(/\/$/, '');
    if (!base || !tok) return res.status(500).json({ error: 'storage not configured' });

    if (req.method === 'GET') {
      const data = await kvGet(base, tok);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const k = req.headers['x-edit-key'] || '';
      if (!process.env.EDIT_KEY || !safeEqual(k, process.env.EDIT_KEY)) return res.status(401).json({ error: 'unauthorized' });

      let body = req.body;
      if (body === undefined || body === null || body === '') { try { body = JSON.parse(await readRaw(req)); } catch (e) { return res.status(400).json({ error: 'invalid json' }); } }
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: 'invalid json' }); } }
      if (!validate(body)) return res.status(400).json({ error: 'expected { WEEKS: [ ... ], NUMBERS: [ ... ] }' });
      if (JSON.stringify(body).length > 900000) return res.status(413).json({ error: 'payload too large' });

      const current = await kvGet(base, tok);
      const curV = current && typeof current.v === 'number' ? current.v : 0;
      const baseV = typeof body.v === 'number' ? body.v : 0;
      if (current && baseV !== curV) return res.status(409).json({ error: 'version conflict', v: curV });

      const next = { v: curV + 1, WEEKS: body.WEEKS, NUMBERS: body.NUMBERS };
      await kvSet(base, tok, next);
      return res.status(200).json({ ok: true, v: next.v });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'server error' });
  }
};
