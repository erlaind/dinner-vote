import { redis, OPTIONS, COUNT_KEY, SUM_KEY } from "./_redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const id = body && body.id;
  const value = Number(body && body.value);

  if (!OPTIONS.includes(id)) {
    return res.status(400).json({ error: "Unknown option id" });
  }
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return res.status(400).json({ error: "value must be an integer 1-5" });
  }

  try {
    await Promise.all([
      redis.hincrby(COUNT_KEY, id, 1),
      redis.hincrby(SUM_KEY, id, value),
    ]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("vote error", err);
    return res.status(500).json({ error: "Storage unavailable" });
  }
}
