import { afterEach, describe, expect, it, vi } from "vitest";
import { isOwnerEmail } from "./owner";

afterEach(() => vi.unstubAllEnvs());

describe("isOwnerEmail", () => {
  it("matches listed emails case-insensitively", () => {
    vi.stubEnv("ANALYTICS_OWNER_EMAIL", " Me@Example.com, other@example.com ");
    expect(isOwnerEmail("me@example.com")).toBe(true);
    expect(isOwnerEmail("OTHER@example.com")).toBe(true);
    expect(isOwnerEmail("someone@example.com")).toBe(false);
  });

  it("matches nobody when unset or when signed out", () => {
    vi.stubEnv("ANALYTICS_OWNER_EMAIL", "");
    expect(isOwnerEmail("me@example.com")).toBe(false);
    vi.stubEnv("ANALYTICS_OWNER_EMAIL", "me@example.com");
    expect(isOwnerEmail(null)).toBe(false);
    expect(isOwnerEmail(undefined)).toBe(false);
  });
});
