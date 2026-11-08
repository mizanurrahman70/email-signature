"use client";

import { IMAGE_FIELDS } from "@/constants/signature-options";
import { ImageUploadField } from "./ImageUploadField";

export function ImagesForm() {
  return (
    <div className="flex flex-col gap-6">
      {IMAGE_FIELDS.map(({ kind, label, hint, allowHandwriting }) => (
        <ImageUploadField key={kind} kind={kind} label={label} hint={hint} allowHandwriting={allowHandwriting} />
      ))}
    </div>
  );
}
