"use client";

import { Info } from "lucide-react";
import { IMAGE_FIELDS } from "@/constants/signature-options";
import { ImageUploadField } from "./ImageUploadField";

export function ImagesForm() {
  return (
    <div className="flex flex-col gap-6">
      <p className="flex gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-200/70">
        <Info className="mt-px size-4 shrink-0 text-indigo-500" aria-hidden="true" />
        Until you add images, the preview shows gray placeholders. They&apos;re left out when you copy your
        signature.
      </p>
      {IMAGE_FIELDS.map(({ kind, label, hint }) => (
        <ImageUploadField key={kind} kind={kind} label={label} hint={hint} />
      ))}
    </div>
  );
}
