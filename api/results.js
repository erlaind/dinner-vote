import { redis, OPTIONS, COUNT_KEY, SUM_KEY } from "./_redis.js";

export default async function handler(req, res) {
  try {
    const [counts, sums] = await Promise.all([
      redis.hgetall(COUNT_KEY),
      redis.hgetall(SUM_KEY),
    ]);

    const tally = {};
    for (const id of OPTIONS) {
      tally[id] = {
        count: Number((counts && counts[id]) || 0),
        sum: Number((sums && sums[id]) || 0),
      };
    }

    // Don't let intermediaries cache live results.
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json({ ok: true, tally });
  } catch (err) {
    console.error("results error", err);
    return res.status(500).json({ error: "Storage unavailable" });
  }
}
