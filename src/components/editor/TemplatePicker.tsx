"use client";

import { Button } from "@/components/ui/Button";
import { TEMPLATE_OPTIONS } from "@/constants/signature-options";
import { cn } from "@/utils/cn";
import { useSignature } from "./SignatureContext";
import { TemplateThumbnail } from "./TemplateThumbnail";

interface TemplatePickerProps {
  /** Moves the user on to filling in their details. */
  onContinue: () => void;
}

export function TemplatePicker({ onContinue }: TemplatePickerProps) {
  const { state, actions } = useSignature();

  return (
    <div className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-3 text-sm text-slate-500">
          Pick a layout. You can switch at any time; your details stay the same.
        </legend>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {TEMPLATE_OPTIONS.map((template) => {
            const isSelected = state.style.templateId === template.id;
            return (
              <label
                key={template.id}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 bg-slate-50 p-2 transition-colors",
                  "has-focus-visible:ring-2 has-focus-visible:ring-blue-600 has-focus-visible:ring-offset-2",
                  isSelected ? "border-blue-600" : "border-transparent hover:border-slate-300",
                )}
              >
                <input
                  type="radio"
                  name="template"
                  value={template.id}
                  checked={isSelected}
                  onChange={() => actions.updateStyle({ templateId: template.id })}
                  className="sr-only"
                />
                <TemplateThumbnail templateId={template.id} />
                <span className="px-1 text-sm font-semibold text-slate-900">{template.name}</span>
                <span className="px-1 pb-1 text-xs text-slate-500">{template.description}</span>
                {isSelected && <SelectedBadge />}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Button onClick={onContinue} className="self-end">
        Continue to your details →
      </Button>
    </div>
  );
}

function SelectedBadge() {
  return (
    <span className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-blue-600 text-white shadow">
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">Selected</span>
    </span>
  );
}
