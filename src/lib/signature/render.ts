import type { RenderOptions, SignatureState, SignatureViewModel, TemplateId } from "@/types/signature";
import { renderClassicTemplate } from "./templates/classic";
import { renderStackedTemplate } from "./templates/stacked";
import { buildViewModel } from "./view-model";

const TEMPLATE_RENDERERS: Record<TemplateId, (vm: SignatureViewModel) => string> = {
  classic: renderClassicTemplate,
  stacked: renderStackedTemplate,
};

/** Email-client-ready HTML. The live preview renders this exact string. */
export function renderSignatureHtml(state: SignatureState, options: RenderOptions): string {
  const render = TEMPLATE_RENDERERS[state.style.templateId] ?? renderClassicTemplate;
  return render(buildViewModel(state, options));
}

/** Plain-text fallback placed on the clipboard next to the HTML. */
export function renderSignatureText({ details, social }: SignatureState): string {
  const titleLine = [details.jobTitle, details.company].map((part) => part.trim()).filter(Boolean).join(", ");
  const socialLines = Object.values(social).map((link) => link.trim());

  return [
    details.fullName,
    titleLine,
    details.phone,
    details.email,
    details.website,
    details.address,
    ...socialLines,
  ]
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}
