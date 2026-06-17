# 🤝 Handoff — Dinner Vote

Last updated: 2026-06-17

A live "What do we want for dinner?" workshop survey. Participants rate five
options 1–5; results update across all devices in real time.

---

## TL;DR status

| Piece | Status |
| --- | --- |
| App code (`index.html`) | ✅ Done |
| Serverless API (`api/*`) | ✅ Done |
| GitHub repo | ✅ Pushed → https://github.com/erlaind/dinner-vote |
| Vercel deploy | ✅ Deployed (root URL serves `index.html`) |
| Upstash Redis store | ✅ Created — `upstash-kv-bronze-arrow` (Free plan, Available) |
| Redis ↔ Vercel project connected | ⚠️ **Verify** — click "Connect to Project" in Upstash |
| Redeploy after connecting Redis | ⚠️ **Required** — env vars only apply to new deploys |
| `RESET_TOKEN` env var (optional) | ⬜ Not set — reset endpoint stays disabled until added |

**Definition of done:** open the deployed root URL and the badge under the
title reads **🟢 Live · shared across all devices**.

---

## What it is

- **Headline:** "What do we want for dinner — Please Vote"
- **Options:** Pizza 🍕, Burger 🍔, Pasta 🍝, Fish 🐟, Salad 🥗 (each with an
  Unsplash photo + emoji fallback)
- **Scale:** click 1 (no thanks) → 5 (yes please) behind each option
- **One vote per option per browser session** (prevents duplicates)
- **Live results bar chart** — average rating per option, leader gets 👑,
  updates every 2 seconds across every device
- **"Next voter" button** — clears the lock for a passed-around device while
  keeping the shared tally

---

## Architecture

```
index.html        Static survey page. Polls /api/results every 2s.
                  Falls back to a per-browser tally if no backend (badge: Offline).
api/_redis.js     Shared Upstash Redis client + option list + key names.
api/vote.js       POST /api/vote  { id, value } → HINCRBY count & sum.
api/results.js    GET  /api/results → { tally: { id: {count, sum} } }.
api/reset.js      GET  /api/reset?token=… → clears votes (needs RESET_TOKEN).
package.json      Dependency: @upstash/redis.
```

**Data model in Redis:** two hashes — `dinner:count` and `dinner:sum`, one
field per option id. Average = sum / count.

**Env vars** (auto-injected by the Upstash↔Vercel integration; code accepts
either naming): `KV_REST_API_URL` / `KV_REST_API_TOKEN`, or
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.

---

## To finish setup (2 steps)

1. **Connect the Redis store to the Vercel project** — in Upstash
   (`upstash-kv-bronze-arrow`) click **Connect to Project** → select the
   `dinner-vote` project.
2. **Redeploy** — Vercel → project → Deployments → ⋯ → **Redeploy**.

Then load the root URL → badge should be green.

### Troubleshooting
- Badge stays **yellow / Offline** → visit `…/api/results` directly.
  - Returns 500 → env vars not reaching the deployment (redo steps 1–2).
  - Returns `{ok:true, tally:…}` → backend fine; hard-refresh the page.

---

## Running the workshop

1. Share the deployed root URL (a QR code works great on a slide).
2. Everyone votes from their own phone → one shared live chart.
3. Project the root URL on the big screen to show results updating live.
4. Start a fresh round: visit `…/api/reset?token=YOUR_TOKEN`
   (requires the `RESET_TOKEN` env var to be set first).

---

## Notes / gotchas

- No personal data is stored — only anonymous counts and sums per option.
- The app **also works offline** (open `index.html` directly): it keeps a
  per-browser tally. Good as a no-network backup, but votes won't be shared.
- To change options or images, edit the `SCHEMA` array in `index.html` **and**
  the `OPTIONS` array in `api/_redis.js` (keep the ids in sync).
- Free Upstash plan is far more than enough for a one-time workshop.

---

## Useful links

- Repo: https://github.com/erlaind/dinner-vote
- Upstash DB: `upstash-kv-bronze-arrow` (ID `75897043-c372-47f2-9757-495b851f7310`)
- See [README.md](README.md) for the condensed version.
