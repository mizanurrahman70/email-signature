import "server-only";

import { createHash } from "node:crypto";
import { ALLOWED_FORMATS, UPLOAD_FOLDER } from "@/constants/cloudinary";
import type { CloudinaryCredentials, SignedUploadParams } from "@/types/cloudinary";
import { serializeParamsToSign } from "@/utils/cloudinary";

export function getCloudinaryCredentials(): CloudinaryCredentials | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/**
 * Signs a direct browser-to-Cloudinary upload. The file never passes through
 * our server, and the API secret never reaches the browser. Signing the
 * folder and formats stops clients from uploading elsewhere or uploading
 * non-images with this signature.
 */
export function createSignedUploadParams(credentials: CloudinaryCredentials): SignedUploadParams {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    allowed_formats: ALLOWED_FORMATS,
    folder: UPLOAD_FOLDER,
    timestamp,
  };

  return {
    cloudName: credentials.cloudName,
    apiKey: credentials.apiKey,
    timestamp,
    signature: sha1(serializeParamsToSign(paramsToSign) + credentials.apiSecret),
    folder: UPLOAD_FOLDER,
    allowedFormats: ALLOWED_FORMATS,
  };
}

function sha1(value: string): string {
  return createHash("sha1").update(value).digest("hex");
}
