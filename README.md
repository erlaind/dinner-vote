# 🍽️ Dinner Vote

A live workshop survey: rate dinner options 1–5, see results update across
every device in real time. Deployed on Vercel with a tiny serverless backend.

## How it works

- `index.html` — the survey (static page, no build step)
- `api/vote.js` — `POST /api/vote` records one vote `{ id, value }`
- `api/results.js` — `GET /api/results` returns the running tally
- `api/reset.js` — `GET /api/reset?token=…` clears all votes (facilitator only)
- Votes are stored in **Upstash Redis** (counts + sums per option)

The page polls `/api/results` every 2 seconds, so all phones share one live
chart. If no backend is reachable (e.g. opening the file directly), it falls
back to a per-browser tally automatically — the badge under the title shows
**Live** vs **Offline**.

## One-time setup on Vercel

1. **Add a Redis store** — Vercel dashboard → your project → **Storage** →
   **Create Database** → **Upstash for Redis** (Marketplace). Connect it to the
   project. This auto-injects the connection env vars
   (`KV_REST_API_URL` / `KV_REST_API_TOKEN` or the `UPSTASH_REDIS_REST_*` pair).
2. *(Optional)* To enable the reset endpoint, add an env var
   **`RESET_TOKEN`** = any secret string.
3. **Redeploy** so the functions pick up the env vars.

That's it — open the project's root URL and the badge should read **Live**.

## During the workshop

- Project the page (or share the URL) — the page shows a **QR code** that
  encodes its own URL, so everyone scans and votes from their own phone.
- Each device gets one vote per option (per browser session).
- To start a fresh round, visit `…/api/reset?token=YOUR_TOKEN`.

> See [HANDOFF.md](HANDOFF.md) for current deployment status and what's left to do.
