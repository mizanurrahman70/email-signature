"use client";

import { ImageUp, Loader2, Trash2 } from "lucide-react";
import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { ACCEPTED_IMAGE_TYPES } from "@/constants/cloudinary";
import { useImageUpload } from "@/hooks/useImageUpload";
import type { ImageKind } from "@/types/signature";
import { cn } from "@/utils/cn";
import { useSignature } from "./SignatureContext";

interface ImageUploadFieldProps {
  kind: ImageKind;
  label: string;
  hint: string;
}

/** Drop zone + file picker + URL fallback for one signature image. */
export function ImageUploadField({ kind, label, hint }: ImageUploadFieldProps) {
  const { state, actions } = useSignature();
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const imageUrl = state.images[kind];
  const { upload, isPending, error } = useImageUpload(kind, (url) => actions.setImage(kind, url));

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset so choosing the same file again still triggers a change.
    event.target.value = "";
    if (file) upload(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) upload(file);
  }

  return (
    <FormSection title={label}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex items-center gap-4 rounded-2xl border border-dashed p-4 transition-colors",
          isDragging ? "border-indigo-400 bg-indigo-50/60" : "border-slate-300 bg-slate-50/60",
        )}
      >
        <ImageThumbnail url={imageUrl} alt={label} rounded={kind === "photo"} isPending={isPending} />
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <p id={hintId} className="text-xs leading-relaxed text-slate-500">
            <span className="font-medium text-slate-700">Drop an image here</span> or browse. {hint}
          </p>
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
            <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()} disabled={isPending}>
              <ImageUp />
              {isPending ? "Uploading…" : imageUrl ? "Replace" : "Upload"}
            </Button>
            {imageUrl && (
              <Button variant="ghost" size="sm" onClick={() => actions.setImage(kind, "")} disabled={isPending}>
                <Trash2 />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-[13px] text-red-600">
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
    </FormSection>
  );
}

interface ImageThumbnailProps {
  url: string;
  alt: string;
  rounded: boolean;
  isPending: boolean;
}

function ImageThumbnail({ url, alt, rounded, isPending }: ImageThumbnailProps) {
  const shape = rounded ? "rounded-full" : "rounded-xl";

  if (isPending || !url) {
    return (
      <div
        className={cn(
          "flex size-16 shrink-0 items-center justify-center bg-white text-slate-300 ring-1 ring-slate-200",
          shape,
        )}
      >
        {isPending ? <Loader2 className="size-5 animate-spin text-indigo-500" /> : <ImageUp className="size-5" />}
      </div>
    );
  }

  return (
    // A plain <img> is intentional: URLs can point at any host the user pastes.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={cn("size-16 shrink-0 bg-white object-contain ring-1 ring-slate-200", shape)} />
  );
}
