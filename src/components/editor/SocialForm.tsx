"use client";

import { TextField } from "@/components/ui/TextField";
import { SOCIAL_OPTIONS } from "@/constants/signature-options";
import { useSignature } from "./SignatureContext";

export function SocialForm() {
  const { state, actions } = useSignature();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">Leave a field empty to hide that network.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {SOCIAL_OPTIONS.map(({ network, label, placeholder }) => (
          <TextField
            key={network}
            label={label}
            type="url"
            inputMode="url"
            placeholder={placeholder}
            value={state.social[network]}
            onValueChange={(value) => actions.updateSocial(network, value)}
          />
        ))}
      </div>
    </div>
  );
}
