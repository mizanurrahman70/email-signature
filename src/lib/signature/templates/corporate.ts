import type { SignatureViewModel } from "@/types/signature";
import { joinHtml, toInlineStyle } from "@/utils/html";
import {
  renderAddress,
  renderCustomFields,
  renderInlineContacts,
  renderLogo,
  renderMutedText,
  renderName,
  renderPhoto,
  renderSocialIcons,
  renderSpacer,
  renderTable,
  renderText,
  renderTitleLine,
  rootStyle,
  verticalDivider,
} from "./parts";

const LOGO_WIDTH = 120;
const PHOTO_SIZE = 80;

/** Company-led: the logo (or photo, if there's no logo) on the left, details beside an accent divider. */
export function renderCorporateTemplate(vm: SignatureViewModel): string {
  const brandMark = renderLogo(vm, LOGO_WIDTH) || renderPhoto(vm, PHOTO_SIZE);
  const brandCell = brandMark
    ? `<td style="${toInlineStyle({ verticalAlign: "middle", paddingRight: "20px" })}">${brandMark}</td>`
    : "";

  const details = joinHtml([
    renderName(vm, { color: vm.primaryColor }),
    renderMutedText(vm, renderTitleLine(vm, " | ")),
    renderCustomFields(vm),
    vm.contacts.length > 0 && renderSpacer(6),
    renderText(renderInlineContacts(vm), { fontSize: "13px" }),
    renderAddress(vm),
    renderSocialIcons(vm),
  ]);
  const detailsStyle = toInlineStyle({
    verticalAlign: "middle",
    paddingLeft: brandMark ? "20px" : undefined,
    borderLeft: brandMark ? verticalDivider(2, vm.primaryColor) : undefined,
  });

  return renderTable(`<tr>${brandCell}<td style="${detailsStyle}">${details}</td></tr>`, rootStyle(vm));
}
