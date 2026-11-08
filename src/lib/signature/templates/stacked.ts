import { joinHtml, toInlineStyle } from "@/utils/html";
import type { SignatureViewModel } from "@/types/signature";
import {
  TABLE_RESET,
  renderImage,
  renderInlineContacts,
  renderSocialIcons,
  renderTitleLine,
} from "./parts";

const PHOTO_SIZE = 56;
const LOGO_WIDTH = 140;

/** Logo on top, name block with optional photo, contacts on one line, accent bar below. */
export function renderStackedTemplate(vm: SignatureViewModel): string {
  const tableStyle = toInlineStyle({
    fontFamily: vm.fontFamily,
    fontSize: "14px",
    lineHeight: "1.45",
    color: vm.textColor,
  });

  const logoRow = vm.logoUrl
    ? `<tr><td style="padding-bottom:12px">${renderImage(vm.logoUrl, vm.company || "Logo", LOGO_WIDTH)}</td></tr>`
    : "";

  const titleLine = renderTitleLine(vm, " | ");
  const nameBlock = joinHtml([
    vm.name && `<div style="${toInlineStyle({ fontSize: "18px", fontWeight: "bold", color: vm.primaryColor })}">${vm.name}</div>`,
    titleLine && `<div style="${toInlineStyle({ fontSize: "13px", color: vm.mutedColor })}">${titleLine}</div>`,
  ]);

  const photoCell = vm.photoUrl
    ? `<td style="${toInlineStyle({ verticalAlign: "middle", paddingRight: "12px" })}">${renderImage(vm.photoUrl, vm.name, PHOTO_SIZE, PHOTO_SIZE, PHOTO_SIZE / 2)}</td>`
    : "";

  const identityRow = `<tr><td><table ${TABLE_RESET}><tr>${photoCell}<td style="vertical-align:middle">${nameBlock}</td></tr></table></td></tr>`;

  const contactsRow =
    vm.contacts.length > 0
      ? `<tr><td style="${toInlineStyle({ paddingTop: "8px", fontSize: "13px" })}">${renderInlineContacts(vm)}</td></tr>`
      : "";

  const addressRow = vm.address
    ? `<tr><td style="${toInlineStyle({ fontSize: "13px", color: vm.mutedColor })}">${vm.address}</td></tr>`
    : "";

  const socialRow = vm.socials.length > 0 ? `<tr><td>${renderSocialIcons(vm)}</td></tr>` : "";

  const accentBar = `<tr><td style="padding-top:12px"><table ${TABLE_RESET} width="100%"><tr><td height="3" bgcolor="${vm.primaryColor}" style="${toInlineStyle({ height: "3px", lineHeight: "3px", fontSize: 0, backgroundColor: vm.primaryColor })}">&nbsp;</td></tr></table></td></tr>`;

  return `<table ${TABLE_RESET} style="${tableStyle}">${logoRow}${identityRow}${contactsRow}${addressRow}${socialRow}${accentBar}</table>`;
}
