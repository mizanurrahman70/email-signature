import type { RenderOptions, SignatureState, SignatureViewModel, TemplateId } from "@/types/signature";
import { renderBannerTemplate } from "./templates/banner";
import { renderBoxedTemplate } from "./templates/boxed";
import { renderCenteredTemplate } from "./templates/centered";
import { renderClassicTemplate } from "./templates/classic";
import { renderCompactTemplate } from "./templates/compact";
import { renderCorporateTemplate } from "./templates/corporate";
import { renderFooter } from "./templates/footer";
import { renderMinimalTemplate } from "./templates/minimal";
import { renderReversedTemplate } from "./templates/reversed";
import { renderSplitTemplate } from "./templates/split";
import { renderTable, rootStyle } from "./templates/parts";
import { renderStackedTemplate } from "./templates/stacked";
import { buildViewModel } from "./view-model";

const TEMPLATE_RENDERERS: Record<TemplateId, (vm: SignatureViewModel) => string> = {
  classic: renderClassicTemplate,
  stacked: renderStackedTemplate,
  split: renderSplitTemplate,
  centered: renderCenteredTemplate,
  reversed: renderReversedTemplate,
  minimal: renderMinimalTemplate,
  banner: renderBannerTemplate,
  compact: renderCompactTemplate,
  boxed: renderBoxedTemplate,
  corporate: renderCorporateTemplate,
};

/** Email-client-ready HTML. The live preview renders this exact string. */
export function renderSignatureHtml(state: SignatureState, options: RenderOptions): string {
  const render = TEMPLATE_RENDERERS[state.style.templateId] ?? renderClassicTemplate;
  const vm = buildViewModel(state, options);
  const body = render(vm);
  const footer = renderFooter(vm);
  if (!footer && !vm.width) return body;

  // The footer sits under any template, so templates don't each repeat it.
  const rows = [body, footer].filter(Boolean).map((html) => `<tr><td>${html}</td></tr>`).join("");
  if (!vm.width) return renderTable(rows, rootStyle(vm));

  // Custom width: Outlook desktop honours the width attribute; other clients use
  // width:100% capped by max-width, so the signature still shrinks on phones.
  return renderTable(rows, { ...rootStyle(vm), maxWidth: `${vm.width}px` }, `width="${vm.width}"`);
}

/** Plain-text fallback placed on the clipboard next to the HTML. */
export function renderSignatureText({ details, social, footer }: SignatureState): string {
  const join = (parts: string[], separator: string) => parts.map((part) => part.trim()).filter(Boolean).join(separator);
  const customFieldLines = footer.customFields
    .filter((field) => field.value.trim())
    .map((field) => join([field.label.trim() && `${field.label.trim()}:`, field.value], " "));

  const lines = [
    details.pronouns.trim() ? `${details.fullName.trim()} (${details.pronouns.trim()})` : details.fullName,
    join([details.jobTitle, details.department, details.company], ", "),
    ...customFieldLines,
    join([details.phone, details.mobile], " | "),
    details.email,
    details.website,
    details.address,
    ...Object.values(social),
  ]
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");

  // A blank line sets the legal notice apart, as in the HTML version.
  const legal = footer.legal.trim();
  return legal ? `${lines}\n\n${legal}` : lines;
}
