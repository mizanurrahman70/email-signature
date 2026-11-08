import type { ImageKind } from "@/types/signature";

/** Shared between server and client: upload limits and delivery transforms. */

/** Largest file a user may pick. Big phone photos are fine: they're shrunk before upload. */
export const MAX_SOURCE_BYTES = 5 * 1024 * 1024;
/** Largest file actually sent to Cloudinary, after compression. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Browser-side resize + compression before upload. Sizes are about 2–3× the
 * delivered size (photo 192px, logo 280px), so images stay sharp on retina.
 */
export const UPLOAD_RESIZE: Record<ImageKind, { maxSide: number; maxSizeMB: number }> = {
  photo: { maxSide: 512, maxSizeMB: 0.15 },
  logo: { maxSide: 840, maxSizeMB: 0.2 },
};
export const UPLOAD_QUALITY = 0.82;

/** Signed "incoming transformation": Cloudinary stores at most 1200px even if the browser step is skipped. */
export const UPLOAD_INCOMING_TRANSFORM = "c_limit,w_1200,h_1200";
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
export const ALLOWED_FORMATS = "png,jpg,jpeg,webp,gif";
export const UPLOAD_FOLDER = "email-signatures";

export const UPLOAD_SIGNATURE_ENDPOINT = "/api/upload-signature";
export const CLOUDINARY_API_BASE = "https://api.cloudinary.com/v1_1";

/**
 * Delivery transformations baked into the saved URL. PNG output keeps
 * transparency and works in every mail client (Outlook can't show WebP/AVIF,
 * so `f_auto` is avoided). `r_max` rounds the photo in the image itself,
 * since Outlook desktop ignores CSS border-radius.
 */
export const DELIVERY_TRANSFORMS: Record<ImageKind, string> = {
  photo: "c_fill,g_face,w_192,h_192,r_max,f_png,q_auto",
  logo: "c_limit,w_280,h_160,f_png,q_auto",
};
