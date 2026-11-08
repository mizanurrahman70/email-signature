import imageCompression from "browser-image-compression";

export interface CompressOptions {
  /** Longest side in px; keeps the aspect ratio and never upscales. */
  maxSide: number;
  /** Target file size in MB. */
  maxSizeMB: number;
  /** Starting quality, 0–1. */
  quality: number;
}

/**
 * Resizes and compresses an image in the browser before it's uploaded.
 * Converts to WebP (smallest, keeps transparency), fixes phone-photo rotation,
 * and runs in a Web Worker so big photos don't freeze the page.
 * Returns the original when compression wouldn't make it smaller.
 */
export async function compressImage(file: File, { maxSide, maxSizeMB, quality }: CompressOptions): Promise<File> {
  // Animated GIFs would lose their animation; they're small enough as-is.
  if (file.type === "image/gif") return file;

  const compressed = await imageCompression(file, {
    maxWidthOrHeight: maxSide,
    maxSizeMB,
    initialQuality: quality,
    fileType: "image/webp",
    useWebWorker: true,
  });

  return compressed.size < file.size ? compressed : file;
}
