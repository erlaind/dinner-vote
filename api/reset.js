import { redis, COUNT_KEY, SUM_KEY } from "./_redis.js";

// Clears all votes. Requires ?token=... matching the RESET_TOKEN env var.
// If RESET_TOKEN is not configured, the endpoint stays disabled.
export default async function handler(req, res) {
  const expected = process.env.RESET_TOKEN;
  if (!expected) {
    return res.status(403).json({ error: "Reset disabled (no RESET_TOKEN set)" });
  }
  if ((req.query && req.query.token) !== expected) {
    return res.status(401).json({ error: "Bad token" });
  }

  try {
    await redis.del(COUNT_KEY, SUM_KEY);
    return res.status(200).json({ ok: true, cleared: true });
  } catch (err) {
    console.error("reset error", err);
    return res.status(500).json({ error: "Storage unavailable" });
  }
}
