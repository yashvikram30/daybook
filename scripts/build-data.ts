// Usage: npm run data:build   (regenerates src/data/curriculum.json from data/legacy/*.js)
import fs from "node:fs";
import path from "node:path";
import { buildSnapshot } from "./lib/snapshot";

const out = path.resolve(process.cwd(), "src/data/curriculum.json");
fs.writeFileSync(out, JSON.stringify(buildSnapshot()) + "\n");
console.log("Wrote", path.relative(process.cwd(), out));
