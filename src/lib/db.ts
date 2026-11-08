import mongoose from "mongoose";
import { autoSeedMasterDatabase } from "@/lib/auto-seed";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/educoach_master";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    // Auto seed database if empty
    autoSeedMasterDatabase().catch((err) => {
      console.error("AutoSeed background task error:", err.message);
    });
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

