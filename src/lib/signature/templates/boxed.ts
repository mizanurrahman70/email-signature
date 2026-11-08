import type { SignatureViewModel } from "@/types/signature";
import { joinHtml, toInlineStyle } from "@/utils/html";
import {
  alignRight,
  renderCustomFields,
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
} from "./parts";

const PHOTO_SIZE = 72;
const LOGO_WIDTH = 100;
const BORDER_COLOR = "#e5e7eb";

/** A bordered card with a thick accent edge; socials and logo share the bottom row. */
export function renderBoxedTemplate(vm: SignatureViewModel): string {
  const photo = renderPhoto(vm, PHOTO_SIZE, "square");
  const photoCell = photo ? `<td style="${toInlineStyle({ verticalAlign: "top", paddingRight: "16px" })}">${photo}</td>` : "";
  const details = joinHtml([
    renderName(vm, { color: vm.primaryColor }),
    renderMutedText(vm, renderTitleLine(vm, " | ")),
    renderCustomFields(vm),
    vm.contacts.length > 0 && renderSpacer(8),
    renderIconContacts(vm),
  ]);
  const topRow = renderTable(`<tr>${photoCell}<td style="vertical-align:top">${details}</td></tr>`);

  const socials = renderSocialIcons(vm);
  const logo = renderLogo(vm, LOGO_WIDTH);
  const footerStyle = toInlineStyle({ paddingTop: "12px", marginTop: "12px", borderTop: `1px solid ${BORDER_COLOR}` });
  const footer =
    socials || logo
      ? `<div style="${footerStyle}">${renderTable(
          `<tr><td style="vertical-align:middle">${socials}</td><td align="right" style="${toInlineStyle({ verticalAlign: "middle", paddingLeft: "20px" })}">${alignRight(logo)}</td></tr>`,
          {},
          'width="100%"',
        )}</div>`
      : "";

  const cardStyle = toInlineStyle({
    padding: "16px 20px",
    border: `1px solid ${BORDER_COLOR}`,
    borderLeft: `4px solid ${vm.primaryColor}`,
    borderRadius: "10px",
  });

  return renderTable(`<tr><td style="${cardStyle}">${topRow}${footer}</td></tr>`, rootStyle(vm));
}
