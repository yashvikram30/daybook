import { describe, expect, it } from "vitest";
import { decide } from "./sync-client";

const base = { local: null, server: null, synced: false, dirty: false };

describe("decide", () => {
  it("does nothing when both sides agree", () => {
    expect(decide({ ...base, local: "{}", server: "{}" })).toBe("none");
    expect(decide(base)).toBe("none");
  });
  it("uploads a fresh account's first data from this device", () => {
    expect(decide({ ...base, local: '{"a":1}' })).toBe("push");
  });
  it("pushes unsent local changes even if the server differs", () => {
    expect(decide({ ...base, local: "1", server: "2", synced: true, dirty: true })).toBe("push");
  });
  it("downloads when this device has nothing", () => {
    expect(decide({ ...base, server: "2" })).toBe("pull");
  });
  it("takes the server's newer data on a device that already syncs", () => {
    expect(decide({ ...base, local: "1", server: "2", synced: true })).toBe("pull");
  });
  it("parks local data when a never-synced device meets different account data", () => {
    expect(decide({ ...base, local: "1", server: "2" })).toBe("pull-keep-local");
  });
});
