import { beforeEach, describe, expect, it, vi } from "vitest";

const imageCompression = vi.fn();
vi.mock("browser-image-compression", () => ({ default: (...args: unknown[]) => imageCompression(...args) }));

const { compressImage } = await import("./image");

const OPTIONS = { maxSide: 512, maxSizeMB: 0.15, quality: 0.82 };
const fileOf = (bytes: number, type: string) => new File([new Uint8Array(bytes)], "photo", { type });

describe("compressImage", () => {
  beforeEach(() => imageCompression.mockReset());

  it("resizes to WebP with the given limits and returns the smaller file", async () => {
    const small = fileOf(40_000, "image/webp");
    imageCompression.mockResolvedValue(small);

    const result = await compressImage(fileOf(3_000_000, "image/jpeg"), OPTIONS);

    expect(result).toBe(small);
    expect(imageCompression).toHaveBeenCalledWith(
      expect.any(File),
      expect.objectContaining({ maxWidthOrHeight: 512, maxSizeMB: 0.15, initialQuality: 0.82, fileType: "image/webp" }),
    );
  });

  it("keeps the original when compression wouldn't make it smaller", async () => {
    const original = fileOf(10_000, "image/png");
    imageCompression.mockResolvedValue(fileOf(12_000, "image/webp"));
    expect(await compressImage(original, OPTIONS)).toBe(original);
  });

  it("leaves GIFs untouched so animations survive", async () => {
    const gif = fileOf(50_000, "image/gif");
    expect(await compressImage(gif, OPTIONS)).toBe(gif);
    expect(imageCompression).not.toHaveBeenCalled();
  });
});
