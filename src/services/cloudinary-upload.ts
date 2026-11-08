import {
  ACCEPTED_IMAGE_TYPES,
  DELIVERY_TRANSFORMS,
  MAX_SOURCE_BYTES,
  MAX_UPLOAD_BYTES,
  UPLOAD_QUALITY,
  UPLOAD_RESIZE,
  UPLOAD_SIGNATURE_ENDPOINT,
} from "@/constants/cloudinary";
import type { CloudinaryUploadResponse, SignedUploadParams } from "@/types/cloudinary";
import type { ImageKind } from "@/types/signature";
import { buildUploadFormData, getUploadUrl, withTransforms } from "@/utils/cloudinary";
import { formatMegabytes, validateFile } from "@/utils/file";
import { fetchJson } from "@/utils/http";
import { compressImage } from "@/utils/image";

const UPLOAD_FAILED = "Upload failed. Please try again.";

export type UploadStage = "optimizing" | "uploading";

export interface UploadResult {
  /** Email-ready delivery URL. */
  url: string;
  originalBytes: number;
  uploadedBytes: number;
}

/** Checks the file the user picked (before compression). */
export function validateImageFile(file: File): string | null {
  return validateFile(file, { acceptedTypes: ACCEPTED_IMAGE_TYPES, maxBytes: MAX_SOURCE_BYTES });
}

/**
 * Shrinks the image in the browser, then uploads it straight to Cloudinary.
 * `onStage` reports progress so the UI can show "Optimizing…" / "Uploading…".
 */
export async function uploadSignatureImage(
  file: File,
  kind: ImageKind,
  onStage?: (stage: UploadStage) => void,
): Promise<UploadResult> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  onStage?.("optimizing");
  const optimized = await compressImage(file, { ...UPLOAD_RESIZE[kind], quality: UPLOAD_QUALITY });
  if (optimized.size > MAX_UPLOAD_BYTES) {
    throw new Error(`This image is still over ${formatMegabytes(MAX_UPLOAD_BYTES)} after optimizing. Try a smaller one.`);
  }

  onStage?.("uploading");
  const params = await fetchJson<SignedUploadParams>(
    UPLOAD_SIGNATURE_ENDPOINT,
    { method: "POST" },
    "Could not start the upload.",
  );

  const result = await fetchJson<CloudinaryUploadResponse>(
    getUploadUrl(params.cloudName),
    { method: "POST", body: buildUploadFormData(optimized, params) },
    UPLOAD_FAILED,
  );

  if (!result.secure_url) throw new Error(UPLOAD_FAILED);
  return {
    url: withTransforms(result.secure_url, DELIVERY_TRANSFORMS[kind]),
    originalBytes: file.size,
    uploadedBytes: optimized.size,
  };
}
