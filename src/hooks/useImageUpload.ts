"use client";

import { useState, useTransition } from "react";
import { uploadSignatureImage } from "@/services/cloudinary-upload";
import type { ImageKind } from "@/types/signature";
import { getErrorMessage } from "@/utils/error";

/** Uploads an image to Cloudinary inside a transition, exposing pending and error state. */
export function useImageUpload(kind: ImageKind, onUploaded: (url: string) => void) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function upload(file: File) {
    setError(null);
    startTransition(async () => {
      try {
        const url = await uploadSignatureImage(file, kind);
        startTransition(() => onUploaded(url));
      } catch (uploadError) {
        setError(getErrorMessage(uploadError, "Upload failed. Please try again."));
      }
    });
  }

  return { upload, isPending, error };
}
