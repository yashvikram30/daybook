import { MongoClient, type Collection } from "mongodb";

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
