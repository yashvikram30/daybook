import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSnapshot } from "./lib/snapshot";

describe("curriculum snapshot", () => {
  it("src/data/curriculum.json matches data/legacy (run `npm run data:build` if this fails)", () => {
    const file = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "src/data/curriculum.json"), "utf8"));
    expect(file).toEqual(buildSnapshot());
  });
});
