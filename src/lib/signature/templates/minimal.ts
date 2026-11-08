import type { SignatureViewModel } from "@/types/signature";
import { joinHtml } from "@/utils/html";
import {
  renderAddress,
  renderInlineContacts,
  renderMutedText,
  renderName,
  renderSocialTextLinks,
  renderTable,
  renderText,
  renderTitleLine,
  rootStyle,
} from "./parts";

/** Text only: no images to block or load, so it looks the same everywhere. */
export function renderMinimalTemplate(vm: SignatureViewModel): string {
  const content = joinHtml([
    renderName(vm, { fontSize: 16 }),
    renderMutedText(vm, renderTitleLine(vm, ", ")),
    renderText(renderInlineContacts(vm, "&middot;"), { fontSize: "13px", marginTop: "6px" }),
    renderAddress(vm),
    vm.socials.length > 0 && renderSocialTextLinks(vm),
  ]);

  return renderTable(`<tr><td>${content}</td></tr>`, rootStyle(vm));
}
