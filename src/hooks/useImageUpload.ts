"use client";

import { useState, useTransition } from "react";
import { uploadSignatureImage, type UploadStage } from "@/services/cloudinary-upload";
import type { ImageKind } from "@/types/signature";
import { getErrorMessage } from "@/utils/error";

export interface UploadSaving {
  originalBytes: number;
  uploadedBytes: number;
}

/**
 * Optimizes and uploads an image to Cloudinary inside a transition, exposing
 * the current stage, the size saving of the last upload, and any error.
 */
export function useImageUpload(kind: ImageKind, onUploaded: (url: string) => void) {
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState<UploadStage | null>(null);
  const [saving, setSaving] = useState<UploadSaving | null>(null);
  const [error, setError] = useState<string | null>(null);

  function upload(file: File) {
    setError(null);
    setSaving(null);
    startTransition(async () => {
      try {
        const { url, originalBytes, uploadedBytes } = await uploadSignatureImage(file, kind, setStage);
        startTransition(() => {
          onUploaded(url);
          setSaving({ originalBytes, uploadedBytes });
        });
      } catch (uploadError) {
        setError(getErrorMessage(uploadError, "Upload failed. Please try again."));
      } finally {
        setStage(null);
      }
    });
  }

  return { upload, isPending, stage, saving, error };
}
