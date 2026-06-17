import { Redis } from "@upstash/redis";

// Valid option ids — keep in sync with index.html SCHEMA.
export const OPTIONS = ["pizza", "burger", "pasta", "fish", "salad"];

// Works with either the Vercel KV or the Upstash integration env vars.
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const COUNT_KEY = "dinner:count";
export const SUM_KEY = "dinner:sum";
