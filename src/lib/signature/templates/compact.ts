import type { SignatureViewModel } from "@/types/signature";
import { joinHtml, toInlineStyle } from "@/utils/html";
import {
  renderAddress,
  renderInlineContacts,
  renderName,
  renderPhoto,
  renderSocialIcons,
  renderTable,
  renderText,
  renderTitleLine,
  rootStyle,
} from "./parts";

const PHOTO_SIZE = 44;

/** A small photo beside two tight lines: name and title, then contacts. Made for replies. */
export function renderCompactTemplate(vm: SignatureViewModel): string {
  const photo = renderPhoto(vm, PHOTO_SIZE);
  const photoCell = photo ? `<td style="${toInlineStyle({ verticalAlign: "top", paddingRight: "12px" })}">${photo}</td>` : "";

  const titleLine = renderTitleLine(vm, " &middot; ");
  const nameLine = joinHtml([
    renderName(vm, { fontSize: 15, color: vm.primaryColor }),
    titleLine && renderText(titleLine, { fontSize: "12px", color: vm.mutedColor }),
  ]);

  const content = joinHtml([
    nameLine,
    renderText(renderInlineContacts(vm, "&middot;"), { fontSize: "12px", marginTop: "4px" }),
    renderAddress(vm),
    renderSocialIcons(vm),
  ]);

  return renderTable(`<tr>${photoCell}<td style="vertical-align:top">${content}</td></tr>`, {
    ...rootStyle(vm),
    fontSize: "13px",
  });
}
