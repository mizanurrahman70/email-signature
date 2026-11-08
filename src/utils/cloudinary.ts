import { CLOUDINARY_API_BASE } from "@/constants/cloudinary";
import type { SignedUploadParams } from "@/types/cloudinary";

export function getUploadUrl(cloudName: string): string {
  return `${CLOUDINARY_API_BASE}/${encodeURIComponent(cloudName)}/image/upload`;
}

/** Form fields must match the signed params exactly, or Cloudinary rejects the upload. */
export function buildUploadFormData(file: File, params: SignedUploadParams): FormData {
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", params.apiKey);
  body.append("timestamp", String(params.timestamp));
  body.append("signature", params.signature);
  body.append("folder", params.folder);
  body.append("allowed_formats", params.allowedFormats);
  body.append("transformation", params.transformation);
  return body;
}

/** Inserts a transformation segment: ".../upload/v123/x.jpg" -> ".../upload/<t>/v123/x.jpg". */
export function withTransforms(secureUrl: string, transforms: string): string {
  return secureUrl.replace("/image/upload/", `/image/upload/${transforms}/`);
}

/** Cloudinary's string-to-sign: alphabetically sorted `key=value` pairs joined by `&`. */
export function serializeParamsToSign(params: Record<string, string | number>): string {
  return Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
}

/**
 * Square version of a photo URL. Uploaded photos are rounded inside the image
 * (Cloudinary `r_max`, because Outlook ignores CSS border-radius), so square
 * templates drop that step. Other URLs are returned unchanged.
 */
export function toSquarePhotoUrl(url: string): string {
  return url.replace(/(\/image\/upload\/[^/]*?)(?:,r_max|r_max,)/, "$1");
}
