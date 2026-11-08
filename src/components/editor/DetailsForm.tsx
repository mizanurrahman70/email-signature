"use client";

import { TextField } from "@/components/ui/TextField";
import { DETAIL_FIELDS } from "@/constants/signature-options";
import { useSignature } from "./SignatureContext";

export function DetailsForm() {
  const { state, actions } = useSignature();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {DETAIL_FIELDS.map(({ field, label, placeholder, type, autoComplete, wide }) => (
        <TextField
          key={field}
          label={label}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={state.details[field]}
          onValueChange={(value) => actions.updateDetail(field, value)}
          className={wide ? "sm:col-span-2" : undefined}
        />
      ))}
    </div>
  );
}
