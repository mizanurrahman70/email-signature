import { escapeHtml, joinHtml, toInlineStyle } from "@/utils/html";
import { SOCIAL_ICON_SIZE } from "@/constants/signature-options";
import type { SignatureViewModel } from "@/types/signature";

/**
 * Building blocks for email-safe HTML: tables for layout, inline styles only,
 * explicit image dimensions. Inputs are pre-escaped by the view model,
 * except `href`/`src` values which are escaped here as attributes.
 */

export const TABLE_RESET = 'cellpadding="0" cellspacing="0" border="0" role="presentation"';

export function renderLink(href: string, text: string, color: string): string {
  const style = toInlineStyle({ color, textDecoration: "none" });
  return `<a href="${escapeHtml(href)}" style="${style}">${text}</a>`;
}

export function renderImage(src: string, alt: string, width: number, height?: number, radius = 0): string {
  const style = toInlineStyle({
    display: "block",
    border: 0,
    width: `${width}px`,
    height: height ? `${height}px` : "auto",
    borderRadius: radius ? `${radius}px` : undefined,
  });
  const heightAttr = height ? ` height="${height}"` : "";
  return `<img src="${escapeHtml(src)}" alt="${alt}" width="${width}"${heightAttr} style="${style}" />`;
}

export function renderContactLines(vm: SignatureViewModel): string {
  return vm.contacts
    .map((contact) => {
      const label = `<span style="${toInlineStyle({ color: vm.primaryColor, fontWeight: "bold" })}">${contact.label}:</span>`;
      const line = `${label}&nbsp;${renderLink(contact.href, contact.text, vm.textColor)}`;
      return `<div style="${toInlineStyle({ margin: 0, fontSize: "13px" })}">${line}</div>`;
    })
    .join("");
}

export function renderInlineContacts(vm: SignatureViewModel): string {
  const separator = `<span style="${toInlineStyle({ color: vm.primaryColor })}">&nbsp;|&nbsp;</span>`;
  return vm.contacts.map((contact) => renderLink(contact.href, contact.text, vm.textColor)).join(separator);
}

/** Brand-colored PNG icons; alt text keeps them meaningful when images are blocked. */
export function renderSocialIcons(vm: SignatureViewModel): string {
  if (vm.socials.length === 0) return "";

  const cells = vm.socials
    .map((social) => {
      const icon = renderImage(social.iconUrl, social.label, SOCIAL_ICON_SIZE, SOCIAL_ICON_SIZE);
      const link = `<a href="${escapeHtml(social.href)}" title="${social.label}" style="text-decoration:none">${icon}</a>`;
      return `<td style="padding-right:6px">${link}</td>`;
    })
    .join("");

  return `<table ${TABLE_RESET} style="margin-top:10px"><tr>${cells}</tr></table>`;
}

export function renderTitleLine(vm: SignatureViewModel, separator: string): string {
  return joinHtml([vm.jobTitle, vm.company], separator);
}

export function renderSpacer(height: number): string {
  return `<div style="${toInlineStyle({ height: `${height}px`, lineHeight: `${height}px`, fontSize: 0 })}">&nbsp;</div>`;
}
