import { beforeEach, describe, expect, it } from "vitest";
import { __resetInMemoryRateLimitForTests, checkRateLimit } from "../lib/security";

beforeEach(() => {
  __resetInMemoryRateLimitForTests();
});

describe("checkRateLimit (in-memory)", () => {
  it("permite solicitudes hasta el limite", async () => {
    const a = await checkRateLimit("key-a", 2, 60_000);
    const b = await checkRateLimit("key-a", 2, 60_000);

    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
  });

  it("bloquea cuando excede el limite", async () => {
    await checkRateLimit("key-b", 1, 60_000);
    const blocked = await checkRateLimit("key-b", 1, 60_000);

    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });
});
