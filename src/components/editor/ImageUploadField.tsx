"use client";

import { useId, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ACCEPTED_IMAGE_TYPES } from "@/constants/cloudinary";
import type { ImageKind } from "@/types/signature";
import { cn } from "@/utils/cn";
import { useSignature } from "./SignatureContext";

interface ImageUploadFieldProps {
  kind: ImageKind;
  label: string;
  hint: string;
}

export function ImageUploadField({ kind, label, hint }: ImageUploadFieldProps) {
  const { state, actions } = useSignature();
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const imageUrl = state.images[kind];
  const { upload, isPending, error } = useImageUpload(kind, (url) => actions.setImage(kind, url));

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset so choosing the same file again still triggers a change.
    event.target.value = "";
    if (file) upload(file);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-4">
        <ImageThumbnail url={imageUrl} alt={label} rounded={kind === "photo"} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={handleFileChange}
          className="sr-only"
          aria-describedby={hintId}
          tabIndex={-1}
        />
        <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={isPending}>
          {isPending ? "Uploading…" : imageUrl ? "Replace" : "Upload"}
        </Button>
        {imageUrl && (
          <Button variant="ghost" onClick={() => actions.setImage(kind, "")} disabled={isPending}>
            Remove
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <TextField
        label="Or paste an image URL"
        type="url"
        placeholder="https://…"
        value={imageUrl}
        onValueChange={(value) => actions.setImage(kind, value)}
      />
    </div>
  );
}

function ImageThumbnail({ url, alt, rounded }: { url: string; alt: string; rounded: boolean }) {
  const shape = rounded ? "rounded-full" : "rounded-lg";

  if (!url) {
    return (
      <div className={cn("flex size-16 shrink-0 items-center justify-center bg-slate-100 text-xs text-slate-400", shape)}>
        None
      </div>
    );
  }

  return (
    // A plain <img> is intentional: URLs can point at any host the user pastes.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={cn("size-16 shrink-0 border border-slate-200 object-contain", shape)} />
  );
}
