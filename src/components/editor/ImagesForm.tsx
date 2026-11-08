"use client";

import { IMAGE_FIELDS } from "@/constants/signature-options";
import { ImageUploadField } from "./ImageUploadField";

export function ImagesForm() {
  return (
    <div className="flex flex-col gap-4">
      {IMAGE_FIELDS.map(({ kind, label, hint }) => (
        <ImageUploadField key={kind} kind={kind} label={label} hint={hint} />
      ))}
    </div>
  );
}
