import { joinHtml, toInlineStyle } from "@/utils/html";
import type { SignatureViewModel } from "@/types/signature";
import {
  TABLE_RESET,
  renderContactLines,
  renderImage,
  renderSocialIcons,
  renderSpacer,
  renderTitleLine,
} from "./parts";

const PHOTO_SIZE = 96;
const LOGO_WIDTH = 120;

/** Photo on the left, a colored divider, details on the right. */
export function renderClassicTemplate(vm: SignatureViewModel): string {
  const tableStyle = toInlineStyle({
    fontFamily: vm.fontFamily,
    fontSize: "14px",
    lineHeight: "1.45",
    color: vm.textColor,
  });

  const photoCell = vm.photoUrl
    ? `<td style="${toInlineStyle({ verticalAlign: "top", paddingRight: "16px" })}">${renderImage(vm.photoUrl, vm.name, PHOTO_SIZE, PHOTO_SIZE, PHOTO_SIZE / 2)}</td>`
    : "";

  const detailsStyle = toInlineStyle({
    verticalAlign: "top",
    borderLeft: `3px solid ${vm.primaryColor}`,
    paddingLeft: "16px",
  });

  const titleLine = renderTitleLine(vm, " &middot; ");
  const details = joinHtml([
    vm.name && `<div style="${toInlineStyle({ fontSize: "18px", fontWeight: "bold", color: vm.textColor })}">${vm.name}</div>`,
    titleLine && `<div style="${toInlineStyle({ fontSize: "13px", color: vm.mutedColor })}">${titleLine}</div>`,
    vm.contacts.length > 0 && renderSpacer(8),
    renderContactLines(vm),
    vm.address && `<div style="${toInlineStyle({ fontSize: "13px", color: vm.mutedColor })}">${vm.address}</div>`,
    renderSocialIcons(vm),
    vm.logoUrl && `${renderSpacer(10)}${renderImage(vm.logoUrl, vm.company || "Logo", LOGO_WIDTH)}`,
  ]);

  return `<table ${TABLE_RESET} style="${tableStyle}"><tr>${photoCell}<td style="${detailsStyle}">${details}</td></tr></table>`;
}
