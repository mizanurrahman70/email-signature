"use client";

import { Check } from "lucide-react";
import { TEMPLATE_OPTIONS } from "@/constants/signature-options";
import { cn } from "@/utils/cn";
import { useSignature } from "./SignatureContext";
import { TemplateThumbnail } from "./TemplateThumbnail";

export function TemplatePicker() {
  const { state, actions } = useSignature();

  return (
    <fieldset>
      <legend className="sr-only">Template</legend>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATE_OPTIONS.map((template) => {
          const isSelected = state.style.templateId === template.id;
          return (
            <label
              key={template.id}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-2.5 rounded-2xl p-2 transition-all",
                "has-focus-visible:ring-2 has-focus-visible:ring-brand-500 has-focus-visible:ring-offset-2",
                isSelected
                  ? "bg-brand-50/70 ring-2 ring-brand-500"
                  : "bg-slate-50 ring-1 ring-slate-200/70 hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:ring-slate-300",
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
              <TemplateThumbnail templateId={template.id} accent={state.style.primaryColor} />
              <span className="px-1 pb-1">
                <span className="block text-[13px] font-semibold text-slate-900">{template.name}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{template.description}</span>
              </span>
              {isSelected && (
                <span className="absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-full bg-brand-600 text-white shadow-md shadow-brand-600/30">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  <span className="sr-only">Selected</span>
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
