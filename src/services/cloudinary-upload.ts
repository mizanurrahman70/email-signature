import {
  ACCEPTED_IMAGE_TYPES,
  DELIVERY_TRANSFORMS,
  MAX_UPLOAD_BYTES,
  UPLOAD_SIGNATURE_ENDPOINT,
} from "@/constants/cloudinary";
import type { CloudinaryUploadResponse, SignedUploadParams } from "@/types/cloudinary";
import type { ImageKind } from "@/types/signature";
import { buildUploadFormData, getUploadUrl, withTransforms } from "@/utils/cloudinary";
import { validateFile } from "@/utils/file";
import { fetchJson } from "@/utils/http";

const UPLOAD_FAILED = "Upload failed. Please try again.";

export function validateImageFile(file: File): string | null {
  return validateFile(file, { acceptedTypes: ACCEPTED_IMAGE_TYPES, maxBytes: MAX_UPLOAD_BYTES });
}

/** Uploads straight to Cloudinary and returns an email-ready delivery URL. */
export async function uploadSignatureImage(file: File, kind: ImageKind): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const params = await fetchJson<SignedUploadParams>(
    UPLOAD_SIGNATURE_ENDPOINT,
    { method: "POST" },
    "Could not start the upload.",
  );

  const result = await fetchJson<CloudinaryUploadResponse>(
    getUploadUrl(params.cloudName),
    { method: "POST", body: buildUploadFormData(file, params) },
    UPLOAD_FAILED,
  );

  if (!result.secure_url) throw new Error(UPLOAD_FAILED);
  return withTransforms(result.secure_url, DELIVERY_TRANSFORMS[kind]);
}
