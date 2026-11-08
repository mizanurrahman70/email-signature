export interface CloudinaryCredentials {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/** Returned by /api/upload-signature for a direct browser upload. */
export interface SignedUploadParams {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
  /** Incoming transformation Cloudinary applies before storing. */
  transformation: string;
}

export interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: { message: string };
}
