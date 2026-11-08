"use client";

import Image from "next/image";
import { TextField } from "@/components/ui/TextField";
import { SOCIAL_ICON_DIR, SOCIAL_OPTIONS } from "@/constants/signature-options";
import { useSignature } from "./SignatureContext";

export function SocialForm() {
  const { state, actions } = useSignature();

  return (
    <div className="flex flex-col gap-4">
      {SOCIAL_OPTIONS.map(({ network, label, placeholder }) => (
        <TextField
          key={network}
          label={label}
          type="url"
          inputMode="url"
          placeholder={placeholder}
          value={state.social[network]}
          onValueChange={(value) => actions.updateSocial(network, value)}
          leading={<Image src={`${SOCIAL_ICON_DIR}/${network}.png`} alt="" width={18} height={18} />}
        />
      ))}
      <p className="text-xs text-slate-500">Leave a field empty to hide that network.</p>
    </div>
  );
}
