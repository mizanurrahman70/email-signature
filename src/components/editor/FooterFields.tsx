"use client";

import { FormSection } from "@/components/ui/FormSection";
import { TextArea } from "@/components/ui/TextArea";
import { MAX_LEGAL_LENGTH, STANDARD_DISCLAIMER } from "@/constants/signature-options";
import { useSignature } from "./SignatureContext";

/** "Email signature footer": the legal notice shown at the bottom of every template. */
export function FooterFields() {
  const { state, actions } = useSignature();
  const { legal } = state.footer;

  return (
    <FormSection title="Email signature footer" description="Shown at the bottom of your signature, under any template.">
      <TextArea
        label="Legal content"
        value={legal}
        onValueChange={actions.updateLegal}
        data-edit-target="details:legal"
        maxLength={MAX_LEGAL_LENGTH}
        rows={4}
        placeholder="e.g. a confidentiality notice or disclaimer"
        hint="Appears in small print below a thin line."
        action={
          !legal.trim() && (
            <button
              type="button"
              onClick={() => actions.updateLegal(STANDARD_DISCLAIMER)}
              className="rounded-md text-xs font-medium text-brand-700 hover:text-brand-900 hover:underline focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              Insert standard disclaimer
            </button>
          )
        }
      />
    </FormSection>
  );
}
