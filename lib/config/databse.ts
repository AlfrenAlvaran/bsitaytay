import "server-only";
import mongoose from "mongoose";
import { secretEnv } from "./env";

const MONGODB_URI = secretEnv.MONGO_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");

declare global {
  var _mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cache = (global._mongooseCache ??= { conn: null, promise: null });

export async function connectDB() {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(MONGODB_URI!, { bufferCommands: false });
  cache.conn = await cache.promise;
  return cache.conn;
}
