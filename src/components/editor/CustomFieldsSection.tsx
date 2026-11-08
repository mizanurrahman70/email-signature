"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { MAX_CUSTOM_FIELDS } from "@/constants/signature-options";
import { useSignature } from "./SignatureContext";

/** User-defined "Label: value" lines, shown in the signature right under name / title / company. */
export function CustomFieldsSection() {
  const { state, actions } = useSignature();
  const { customFields } = state.footer;
  const canAddField = customFields.length < MAX_CUSTOM_FIELDS;

  return (
    <FormSection title="Custom fields" description="Shown right under your name, title and company.">
      {customFields.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500">
          Add anything else people should see, like a booking link, Skype or a license number.
        </p>
      )}

      {customFields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] items-end gap-2">
          <TextField
            label={`Label ${index + 1}`}
            value={field.label}
            onValueChange={(label) => actions.updateCustomField(field.id, { label })}
            placeholder="Booking"
            maxLength={40}
          />
          <TextField
            label={`Value ${index + 1}`}
            value={field.value}
            onValueChange={(value) => actions.updateCustomField(field.id, { value })}
            placeholder="calendly.com/jane"
            maxLength={200}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => actions.removeCustomField(field.id)}
            aria-label={`Remove custom field ${index + 1}`}
            className="mb-1 size-8 px-0"
          >
            <Trash2 />
          </Button>
        </div>
      ))}

      <Button variant="secondary" size="sm" onClick={actions.addCustomField} disabled={!canAddField} className="self-start">
        <Plus />
        {canAddField ? "Add custom field" : `Up to ${MAX_CUSTOM_FIELDS} custom fields`}
      </Button>
    </FormSection>
  );
}
