import { createSignedUploadParams, getCloudinaryCredentials } from "@/services/cloudinary-signing";

export async function POST() {
  const credentials = getCloudinaryCredentials();

  if (!credentials) {
    return Response.json(
      { error: "Image uploads are not configured. Set the CLOUDINARY_* environment variables." },
      { status: 503 },
    );
  }

  return Response.json(createSignedUploadParams(credentials), {
    headers: { "Cache-Control": "no-store" },
  });
}
