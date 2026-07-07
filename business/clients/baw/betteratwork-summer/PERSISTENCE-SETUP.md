# Live persistence setup (Creepers calendar + B@W tracker)

Both sites now share a small backend so edits sync live for everyone, gated so only you can write. This is the one-time setup. It applies to **both** projects: `creepers-content-calendar` and `betteratwork-summer`.

## What's in the code already
- `api/data.js` in each site: `GET /api/data` (public read), `POST /api/data` (write, requires the `x-edit-key` header). Talks to Vercel KV / Upstash Redis over REST. Zero npm dependencies.
- Frontend loads from `/api/data` on open, falls back to the baked-in default only on a clean empty store, and autosaves every edit. Editing is gated by `?edit` + your key. Optimistic-concurrency (version) guards against stale-tab overwrites; a failed initial load blocks saves so nothing clobbers good data.

## Your one-time setup

**1. Generate a strong edit key** (never send it to anyone; it's the only lock on writes):
```
openssl rand -base64 32
```
Copy the output.

**2. Create the KV store on Vercel** (dashboard):
- Storage → Create Database → **Upstash for Redis** (a.k.a. KV). Name it e.g. `hwl-sites`.
- Connect it to **both** projects (`creepers-content-calendar` and `betteratwork-summer`). This injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` into each.

**3. Add the edit key to both projects:**
- Each project → Settings → Environment Variables → add `EDIT_KEY` = the value from step 1, for Production. (Or `vercel env add EDIT_KEY production` in each project folder.)

**4. Redeploy both** (env vars apply on the next deploy):
```
cd ~/creepers-content-calendar && npx vercel@latest deploy --prod --yes
cd "/Users/harrison/HWL META/business/clients/baw/betteratwork-summer" && npx vercel@latest deploy --prod --yes
```

**5. Unlock editing:** open `…vercel.app?edit`, paste the edit key into the Unlock box once (stored in your browser only). Now add/delete/tick/edit-numbers all save live.

## Smoke test
- Open `?edit`, unlock, tick or add something. Status should read `saved ✓`.
- Refresh the plain URL (or open it in a private window) — the change is there.
- If the store is briefly unreachable, the editbar shows `load failed — reload` and refuses to save, rather than overwriting good data.

## Day-to-day notes
- **KV is the source of truth once seeded.** After the first edit, the baked-in HTML is just a seed. To change content wholesale, edit in the site (or I can write to the API). A plain redeploy of new baked data will NOT override the stored data — use **Reset to default** in the editbar to re-seed from the deployed baseline (this overwrites current edits for everyone, so it's deliberate).
- **Rotate the key** anytime by changing `EDIT_KEY` and redeploying; old browsers get a 401 and re-prompt.
- To clone this for another client site, copy `api/data.js` (change the `KEY` constant), wire the same load/save layer, connect the store, set `EDIT_KEY`.
