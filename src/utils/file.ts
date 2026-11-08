const BYTES_PER_MEGABYTE = 1024 * 1024;

export function formatMegabytes(bytes: number): string {
  return `${Math.round((bytes / BYTES_PER_MEGABYTE) * 10) / 10} MB`;
}

interface FileRules {
  acceptedTypes: ReadonlyArray<string>;
  maxBytes: number;
}

/** Returns an error message for an unacceptable file, or null if it is fine. */
export function validateFile(file: File, { acceptedTypes, maxBytes }: FileRules): string | null {
  if (!acceptedTypes.includes(file.type)) {
    return "Please choose a PNG, JPG, WebP or GIF image.";
  }
  if (file.size > maxBytes) {
    return `Images must be ${formatMegabytes(maxBytes)} or smaller.`;
  }
  return null;
}
