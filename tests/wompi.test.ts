import crypto from "crypto";
import { afterEach, describe, expect, it } from "vitest";
import { verifyWebhookSignature } from "../lib/wompi";

const originalSecret = process.env.WOMPI_WEBHOOK_SECRET;

afterEach(() => {
  process.env.WOMPI_WEBHOOK_SECRET = originalSecret;
});

describe("verifyWebhookSignature", () => {
  it("acepta firma valida", () => {
    const secret = "test-secret";
    const timestamp = "1234567890";
    const body = JSON.stringify({ ok: true });

    process.env.WOMPI_WEBHOOK_SECRET = secret;

    const signature = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${body}`)
      .digest("hex");

    const valid = verifyWebhookSignature(body, signature, timestamp);
    expect(valid).toBe(true);
  });

  it("rechaza firma invalida", () => {
    process.env.WOMPI_WEBHOOK_SECRET = "test-secret";
    const valid = verifyWebhookSignature("{}", "invalid", "123");
    expect(valid).toBe(false);
  });
});
