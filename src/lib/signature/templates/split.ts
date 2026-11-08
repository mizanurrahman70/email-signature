import type { SignatureViewModel } from "@/types/signature";
import { joinHtml, toInlineStyle } from "@/utils/html";
import {
  renderIconContacts,
  renderLogo,
  renderMutedText,
  renderName,
  renderPhoto,
  renderSocialIcons,
  renderTable,
  renderText,
  rootStyle,
  verticalDivider,
} from "./parts";

const PHOTO_SIZE = 100;
const LOGO_WIDTH = 140;

/**
 * Photo | name, title, department, pronouns | divider + contacts with icons.
 * A rule and the logo sit underneath.
 */
export function renderSplitTemplate(vm: SignatureViewModel): string {
  const photo = renderPhoto(vm, PHOTO_SIZE);
  const photoCell = photo
    ? `<td style="${toInlineStyle({ verticalAlign: "middle", paddingRight: "20px" })}">${photo}</td>`
    : "";

  const identity = joinHtml([
    renderName(vm, { showPronouns: false }),
    renderText(vm.jobTitle, { fontSize: "14px", marginTop: "4px" }),
    renderText(joinHtml([vm.department, vm.company], " | "), { fontSize: "14px" }),
    renderMutedText(vm, vm.pronouns),
  ]);
  const identityCell = `<td style="${toInlineStyle({ verticalAlign: "middle", paddingRight: "20px", whiteSpace: "nowrap" })}">${identity}</td>`;

  const contacts = joinHtml([renderIconContacts(vm), renderSocialIcons(vm)]);
  const contactsCell = contacts
    ? `<td style="${toInlineStyle({ verticalAlign: "middle", paddingLeft: "20px", borderLeft: verticalDivider(1) })}">${contacts}</td>`
    : "";

  const columnCount = [photoCell, identityCell, contactsCell].filter(Boolean).length;
  const logo = renderLogo(vm, LOGO_WIDTH);
  const logoRow = logo
    ? `<tr><td colspan="${columnCount}" style="${toInlineStyle({ paddingTop: "16px", borderTop: verticalDivider(1) })}">${logo}</td></tr>`
    : "";
  const spacerRow = logo ? `<tr><td colspan="${columnCount}" style="height:16px;line-height:16px;font-size:0">&nbsp;</td></tr>` : "";

  return renderTable(`<tr>${photoCell}${identityCell}${contactsCell}</tr>${spacerRow}${logoRow}`, rootStyle(vm));
}
