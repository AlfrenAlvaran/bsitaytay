import "server-only";

import { RateLimit } from "@/server/models/rate-limit.model.ts";
import { connectDB } from "../config/databse";

/** Only accurate behind a proxy you control (Vercel, nginx, ...). */
export const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

/** Fixed window limiter. Returns false once the limit is exceeded. */
export async function checkRateLimit(key: string, limit: number, windowSec: number) {
  await connectDB();
  const bucket = Math.floor(Date.now() / (windowSec * 1000));
  const filter = { key: `${key}:${bucket}` };
  const update = {
    $inc: { count: 1 },
    $setOnInsert: { expiresAt: new Date((bucket + 1) * windowSec * 1000 + 60_000) },
  };
  const run = () => RateLimit.findOneAndUpdate(filter, update, { upsert: true, new: true });

  let doc;
  try {
    doc = await run();
  } catch (e) {
    // two simultaneous first requests can race on the unique index
    if ((e as { code?: number }).code === 11000) doc = await run();
    else throw e;
  }
  return !!doc && doc.count <= limit;
}
