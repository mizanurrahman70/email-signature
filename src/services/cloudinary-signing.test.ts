import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { createSignedUploadParams } = await import("./cloudinary-signing");

describe("createSignedUploadParams", () => {
  it("signs sorted params with the API secret", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    const params = createSignedUploadParams({ cloudName: "demo", apiKey: "key", apiSecret: "secret" });
    const expected = createHash("sha1")
      .update(`allowed_formats=${params.allowedFormats}&folder=${params.folder}&timestamp=${params.timestamp}secret`)
      .digest("hex");

    expect(params.timestamp).toBe(1767225600);
    expect(params.signature).toBe(expected);
    expect(params).not.toHaveProperty("apiSecret");

    vi.useRealTimers();
  });
});
