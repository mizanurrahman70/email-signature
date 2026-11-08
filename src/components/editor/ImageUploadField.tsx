"use client";

import { ImageUp, Loader2, PenLine, Trash2 } from "lucide-react";
import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { ACCEPTED_IMAGE_TYPES } from "@/constants/cloudinary";
import { useImageUpload } from "@/hooks/useImageUpload";
import type { ImageKind } from "@/types/signature";
import { cn } from "@/utils/cn";
import { formatBytes } from "@/utils/file";
import { HandwritingModal } from "./handwriting/HandwritingModal";
import { useSignature } from "./SignatureContext";

interface ImageUploadFieldProps {
  kind: ImageKind;
  label: string;
  hint: string;
  /** Offer "Create handwritten signature" (draw or type) alongside upload. */
  allowHandwriting?: boolean;
}

/** Drop zone + file picker + URL fallback for one signature image. */
export function ImageUploadField({ kind, label, hint, allowHandwriting = false }: ImageUploadFieldProps) {
  const { state, actions } = useSignature();
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [isHandwritingOpen, setIsHandwritingOpen] = useState(false);
  const imageUrl = state.images[kind];
  const { upload, isPending, stage, saving, error } = useImageUpload(kind, (url) => actions.setImage(kind, url));

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

  function handleHandwritingApply(file: File) {
    setIsHandwritingOpen(false);
    upload(file);
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
          isDragging ? "border-brand-400 bg-brand-50/60" : "border-slate-300 bg-slate-50/60",
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
            <Button
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
              data-edit-target={`images:${kind}`}
            >
              <ImageUp />
              {stage === "optimizing" ? "Optimizing…" : isPending ? "Uploading…" : imageUrl ? "Replace" : "Upload"}
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

      {allowHandwriting && (
        <>
          <button
            type="button"
            onClick={() => setIsHandwritingOpen(true)}
            disabled={isPending}
            className="group flex items-center gap-3 rounded-2xl bg-white p-3 text-left ring-1 ring-slate-200 transition hover:ring-brand-300 focus-visible:outline-2 focus-visible:outline-brand-500 disabled:opacity-60"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition group-hover:bg-brand-100">
              <PenLine className="size-[18px]" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-slate-900">Create handwritten signature</span>
              <span className="block text-xs text-slate-500">Draw with your mouse or finger, or type it in a script font.</span>
            </span>
          </button>
          <HandwritingModal
            open={isHandwritingOpen}
            onClose={() => setIsHandwritingOpen(false)}
            defaultName={state.details.fullName}
            onApply={handleHandwritingApply}
          />
        </>
      )}

      {saving && saving.uploadedBytes < saving.originalBytes && (
        <p className="text-xs text-brand-700">
          Optimized {formatBytes(saving.originalBytes)} → {formatBytes(saving.uploadedBytes)} before upload.
        </p>
      )}

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
        {isPending ? <Loader2 className="size-5 animate-spin text-brand-500" /> : <ImageUp className="size-5" />}
      </div>
    );
  }

  return (
    // A plain <img> is intentional: URLs can point at any host the user pastes.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={cn("size-16 shrink-0 bg-white object-contain ring-1 ring-slate-200", shape)} />
  );
}
