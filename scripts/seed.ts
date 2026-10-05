// Usage: npm run db:seed   (applies migrations, then loads the curriculum into an empty database)
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { loadLegacyCurriculum } from "./lib/legacy";
import { seedCurriculum } from "../src/db/seed";
import * as schema from "../src/db/schema";

async function main() {
  const folder = path.resolve(process.cwd(), "drizzle");
  let db;
  if (process.env.DATABASE_URL) {
    const { drizzle } = await import("drizzle-orm/neon-http");
    const { migrate } = await import("drizzle-orm/neon-http/migrator");
    db = drizzle(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL, { schema });
    await migrate(db, { migrationsFolder: folder });
  } else {
    const { drizzle } = await import("drizzle-orm/pglite");
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    const { PGlite } = await import("@electric-sql/pglite");
    const dir = path.resolve(process.cwd(), ".data/pglite");
    fs.mkdirSync(dir, { recursive: true });
    db = drizzle(new PGlite(dir), { schema });
    await migrate(db, { migrationsFolder: folder });
  }
  console.log("Seeded:", await seedCurriculum(db as never, loadLegacyCurriculum()));
}
main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
