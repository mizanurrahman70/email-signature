import type { SignatureViewModel } from "@/types/signature";
import { joinHtml, toInlineStyle } from "@/utils/html";
import {
  alignRight,
  renderCustomFields,
  renderIconContacts,
  renderLogo,
  renderName,
  renderPhoto,
  renderSocialIcons,
  renderTable,
  renderText,
  renderTitleLine,
  rootStyle,
} from "./parts";

const PHOTO_SIZE = 56;
const LOGO_WIDTH = 110;
const BORDER = "1px solid #e5e7eb";
/** Light text on the accent bar. */
const ON_ACCENT = "#ffffff";
const ON_ACCENT_MUTED = "#e5e7eb";

/** An accent-colored header bar with photo, name and title; contacts and socials below. */
export function renderBannerTemplate(vm: SignatureViewModel): string {
  const photo = renderPhoto(vm, PHOTO_SIZE);
  const photoCell = photo ? `<td style="${toInlineStyle({ verticalAlign: "middle", paddingRight: "14px" })}">${photo}</td>` : "";
  const identity = joinHtml([
    renderName(vm, { color: ON_ACCENT, pronounsColor: ON_ACCENT_MUTED }),
    renderText(renderTitleLine(vm, " | "), { fontSize: "13px", color: ON_ACCENT_MUTED }),
  ]);
  const bannerStyle = toInlineStyle({
    backgroundColor: vm.primaryColor,
    padding: "14px 18px",
    borderRadius: "10px 10px 0 0",
  });
  const banner = `<tr><td bgcolor="${vm.primaryColor}" style="${bannerStyle}">${renderTable(
    `<tr>${photoCell}<td style="vertical-align:middle">${identity}</td></tr>`,
  )}</td></tr>`;

  const logo = renderLogo(vm, LOGO_WIDTH);
  const details = joinHtml([renderCustomFields(vm), renderIconContacts(vm), renderSocialIcons(vm)]);
  const logoCell = logo
    ? `<td align="right" style="${toInlineStyle({ verticalAlign: "bottom", paddingLeft: "20px" })}">${alignRight(logo)}</td>`
    : "";
  const bodyStyle = toInlineStyle({
    padding: "12px 18px 14px",
    border: BORDER,
    borderTop: 0,
    borderRadius: "0 0 10px 10px",
  });
  const body = `<tr><td style="${bodyStyle}">${renderTable(
    `<tr><td style="vertical-align:top">${details}</td>${logoCell}</tr>`,
    {},
    'width="100%"',
  )}</td></tr>`;

  return renderTable(`${banner}${body}`, rootStyle(vm));
}
