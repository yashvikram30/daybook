import { MongoClient, type Collection } from "mongodb";
import type { Visit } from "./analytics";

/** One row per user per synced store: { uid, key, value (JSON text), updated }. */
export type SyncRow = { uid: string; key: string; value: string; updated: number };

declare global {
  var _mongo: Promise<MongoClient> | undefined;
}

// Kept on globalThis so dev hot reloads reuse one connection pool.
function client(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  return (globalThis._mongo ??= new MongoClient(uri).connect());
}

let indexed = false;

export async function syncRows(): Promise<Collection<SyncRow>> {
  const col = (await client()).db(process.env.MONGODB_DB || "daybook").collection<SyncRow>("sync");
  if (!indexed) {
    await col.createIndex({ uid: 1, key: 1 }, { unique: true });
    indexed = true;
  }
  return col;
}

let visitsIndexed = false;

/** One document per page view, expired after a year or so. See lib/analytics.ts. */
export async function visits(): Promise<Collection<Visit>> {
  const col = (await client()).db(process.env.MONGODB_DB || "daybook").collection<Visit>("visits");
  if (!visitsIndexed) {
    await col.createIndex({ ts: 1 }, { expireAfterSeconds: 400 * 24 * 3600 });
    await col.createIndex({ vid: 1, ts: 1 });
    visitsIndexed = true;
  }
  return col;
}
