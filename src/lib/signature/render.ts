import type { RenderOptions, SignatureState, SignatureViewModel, TemplateId } from "@/types/signature";
import { renderCenteredTemplate } from "./templates/centered";
import { renderClassicTemplate } from "./templates/classic";
import { renderMinimalTemplate } from "./templates/minimal";
import { renderReversedTemplate } from "./templates/reversed";
import { renderSplitTemplate } from "./templates/split";
import { renderStackedTemplate } from "./templates/stacked";
import { buildViewModel } from "./view-model";

const TEMPLATE_RENDERERS: Record<TemplateId, (vm: SignatureViewModel) => string> = {
  classic: renderClassicTemplate,
  stacked: renderStackedTemplate,
  split: renderSplitTemplate,
  centered: renderCenteredTemplate,
  reversed: renderReversedTemplate,
  minimal: renderMinimalTemplate,
};

/** Email-client-ready HTML. The live preview renders this exact string. */
export function renderSignatureHtml(state: SignatureState, options: RenderOptions): string {
  const render = TEMPLATE_RENDERERS[state.style.templateId] ?? renderClassicTemplate;
  return render(buildViewModel(state, options));
}

/** Plain-text fallback placed on the clipboard next to the HTML. */
export function renderSignatureText({ details, social }: SignatureState): string {
  const join = (parts: string[], separator: string) => parts.map((part) => part.trim()).filter(Boolean).join(separator);

  return [
    details.pronouns.trim() ? `${details.fullName.trim()} (${details.pronouns.trim()})` : details.fullName,
    join([details.jobTitle, details.department, details.company], ", "),
    join([details.phone, details.mobile], " | "),
    details.email,
    details.website,
    details.address,
    ...Object.values(social),
  ]
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}
