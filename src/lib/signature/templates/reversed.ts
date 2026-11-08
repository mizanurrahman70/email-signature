import type { SignatureViewModel } from "@/types/signature";
import { joinHtml, toInlineStyle } from "@/utils/html";
import {
  renderIconContacts,
  renderLogo,
  renderMutedText,
  renderName,
  renderPhoto,
  renderSocialIcons,
  renderSpacer,
  renderTable,
  renderTitleLine,
  rootStyle,
  verticalDivider,
} from "./parts";

const PHOTO_SIZE = 96;
const LOGO_WIDTH = 110;

/** Details and icon contacts on the left; photo and logo on the right behind an accent divider. */
export function renderReversedTemplate(vm: SignatureViewModel): string {
  const details = joinHtml([
    renderName(vm, { color: vm.primaryColor }),
    renderMutedText(vm, renderTitleLine(vm, " | ")),
    vm.contacts.length > 0 && renderSpacer(8),
    renderIconContacts(vm),
    renderSocialIcons(vm),
  ]);
  const detailsCell = `<td style="${toInlineStyle({ verticalAlign: "top", paddingRight: "20px" })}">${details}</td>`;

  const photo = renderPhoto(vm, PHOTO_SIZE);
  const logo = renderLogo(vm, LOGO_WIDTH);
  const media = joinHtml([photo, photo && logo && renderSpacer(12), logo]);
  const mediaCell = media
    ? `<td style="${toInlineStyle({ verticalAlign: "top", paddingLeft: "20px", borderLeft: verticalDivider(2, vm.primaryColor) })}">${media}</td>`
    : "";

  return renderTable(`<tr>${detailsCell}${mediaCell}</tr>`, rootStyle(vm));
}
