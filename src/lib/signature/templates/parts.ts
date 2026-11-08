import { CONTACT_ICON_SIZE, SOCIAL_ICON_SIZE } from "@/constants/signature-options";
import { EDIT_ATTR, type EditTarget } from "@/lib/signature/edit-targets";
import type { ContactLine, SignatureViewModel } from "@/types/signature";
import { escapeHtml, joinHtml, toInlineStyle, type InlineStyle } from "@/utils/html";

/**
 * Building blocks for email-safe HTML: tables for layout, inline styles only,
 * explicit image dimensions. Inputs are pre-escaped by the view model,
 * except `href`/`src` values which are escaped here as attributes.
 */

export const TABLE_RESET = 'cellpadding="0" cellspacing="0" border="0" role="presentation"';

const BORDER_COLOR = "#d1d5db";

export function renderTable(rows: string, style: InlineStyle = {}, attributes = ""): string {
  const styleAttr = toInlineStyle(style);
  return `<table ${TABLE_RESET}${attributes ? ` ${attributes}` : ""}${styleAttr ? ` style="${styleAttr}"` : ""}>${rows}</table>`;
}

/** Root table styles shared by every template. With a custom width, the template fills it. */
export function rootStyle(vm: SignatureViewModel): InlineStyle {
  return {
    fontFamily: vm.fontFamily,
    fontSize: "14px",
    lineHeight: "1.45",
    color: vm.textColor,
    width: vm.width ? "100%" : undefined,
  };
}

/** Wraps content in a centered table; `margin: auto` doesn't work in Outlook. */
export function centerBlock(html: string): string {
  return html ? renderTable(`<tr><td>${html}</td></tr>`, {}, 'align="center"') : "";
}

/** Right-aligns block content (e.g. a logo); `text-align` doesn't move block images. */
export function alignRight(html: string): string {
  return html ? renderTable(`<tr><td>${html}</td></tr>`, {}, 'align="right"') : "";
}

/** ` data-edit="…"` for click-to-edit in the preview; empty in copied signatures. */
export function editAttr(vm: SignatureViewModel, target: EditTarget): string {
  return vm.editable ? ` ${EDIT_ATTR}="${escapeHtml(target)}"` : "";
}

/** Wraps inline HTML in an editable span in the preview; returns it unchanged otherwise. */
export function editable(vm: SignatureViewModel, target: EditTarget, html: string): string {
  return html && vm.editable ? `<span${editAttr(vm, target)}>${html}</span>` : html;
}

export function verticalDivider(width: number, color = BORDER_COLOR): string {
  return `${width}px solid ${color}`;
}

/** A link, or plain text when there's no href (e.g. an address). */
export function renderLink(href: string, text: string, color: string): string {
  const style = toInlineStyle({ color, textDecoration: "none" });
  return href ? `<a href="${escapeHtml(href)}" style="${style}">${text}</a>` : `<span style="${style}">${text}</span>`;
}

export function renderImage(src: string, alt: string, width: number, height?: number, radius = 0, attributes = ""): string {
  const style = toInlineStyle({
    display: "block",
    border: 0,
    width: `${width}px`,
    height: height ? `${height}px` : "auto",
    borderRadius: radius ? `${radius}px` : undefined,
  });
  const heightAttr = height ? ` height="${height}"` : "";
  return `<img src="${escapeHtml(src)}" alt="${alt}" width="${width}"${heightAttr} style="${style}"${attributes} />`;
}

export function renderPhoto(vm: SignatureViewModel, size: number): string {
  return vm.photoUrl ? renderImage(vm.photoUrl, vm.name, size, size, size / 2, editAttr(vm, "images:photo")) : "";
}

export function renderLogo(vm: SignatureViewModel, width: number): string {
  return vm.logoUrl ? renderImage(vm.logoUrl, "Signature", width, undefined, 0, editAttr(vm, "images:logo")) : "";
}

export function renderSpacer(height: number): string {
  return `<div style="${toInlineStyle({ height: `${height}px`, lineHeight: `${height}px`, fontSize: 0 })}">&nbsp;</div>`;
}

/** A styled block of text; renders nothing when the content is empty. */
export function renderText(html: string, style: InlineStyle, attributes = ""): string {
  return html ? `<div style="${toInlineStyle(style)}"${attributes}>${html}</div>` : "";
}

interface NameOptions {
  fontSize?: number;
  color?: string;
  showPronouns?: boolean;
  /** Pronoun color; override on colored backgrounds where muted gray is unreadable. */
  pronounsColor?: string;
}

export function renderName(
  vm: SignatureViewModel,
  { fontSize = 18, color, showPronouns = true, pronounsColor }: NameOptions = {},
): string {
  const pronouns =
    showPronouns && vm.pronouns
      ? ` <span style="${toInlineStyle({ fontSize: "12px", fontWeight: "normal", color: pronounsColor ?? vm.mutedColor })}"${editAttr(vm, "details:pronouns")}>(${vm.pronouns})</span>`
      : "";
  return renderText(
    vm.name && `${editable(vm, "details:fullName", vm.name)}${pronouns}`,
    { fontSize: `${fontSize}px`, fontWeight: "bold", color: color ?? vm.textColor },
  );
}

export function renderTitleLine(vm: SignatureViewModel, separator: string): string {
  return joinHtml(
    [
      editable(vm, "details:jobTitle", vm.jobTitle),
      editable(vm, "details:department", vm.department),
      editable(vm, "details:company", vm.company),
    ],
    separator,
  );
}

/** Custom "Label: value" lines, placed directly under name / title / company. */
export function renderCustomFields(vm: SignatureViewModel): string {
  if (vm.customFields.length === 0) return "";

  const labelStyle = toInlineStyle({ color: vm.primaryColor, fontWeight: "bold" });
  const lines = vm.customFields
    .map(({ id, label, valueHtml }) =>
      renderText(
        label ? `<span style="${labelStyle}">${label}:</span>&nbsp;${valueHtml}` : valueHtml,
        { fontSize: "13px" },
        editAttr(vm, `details:custom-${id}`),
      ),
    )
    .join("");
  return `<div style="margin-top:4px">${lines}</div>`;
}

export function renderMutedText(vm: SignatureViewModel, html: string): string {
  return renderText(html, { fontSize: "13px", color: vm.mutedColor });
}

/** Each phone number, email or URL stays on one line; lines may break between values. Addresses wrap freely. */
function renderContactLinks(contact: ContactLine, vm: SignatureViewModel): string {
  return contact.links
    .map((link) => {
      const html = renderLink(link.href, link.text, vm.textColor);
      const target: EditTarget = `details:${link.field}`;
      return contact.icon === "address"
        ? editable(vm, target, html)
        : `<span style="white-space:nowrap"${editAttr(vm, target)}>${html}</span>`;
    })
    .join(" | ");
}

function withoutAddress(vm: SignatureViewModel): ContactLine[] {
  return vm.contacts.filter((contact) => contact.icon !== "address");
}

export function renderAddress(vm: SignatureViewModel): string {
  const address = vm.contacts.find((contact) => contact.icon === "address");
  return address ? renderMutedText(vm, editable(vm, "details:address", address.links[0].text)) : "";
}

/** "P: +1 555…" lines with accent-colored labels. */
export function renderLabeledContacts(vm: SignatureViewModel): string {
  return vm.contacts
    .map((contact) => {
      const label = `<span style="${toInlineStyle({ color: vm.primaryColor, fontWeight: "bold" })}">${contact.label}:</span>`;
      return renderText(`${label}&nbsp;${renderContactLinks(contact, vm)}`, { fontSize: "13px" });
    })
    .join("");
}

/** Phone, email and website on one line. Pair with `renderAddress`. */
export function renderInlineContacts(vm: SignatureViewModel, separator = "|"): string {
  const divider = `<span style="${toInlineStyle({ color: vm.primaryColor })}">&nbsp;${separator}&nbsp;</span>`;
  return withoutAddress(vm)
    .map((contact) => renderContactLinks(contact, vm))
    .join(divider);
}

/** One row per contact with an accent-colored icon, as in the Split template. */
export function renderIconContacts(vm: SignatureViewModel): string {
  if (vm.contacts.length === 0) return "";

  const rows = vm.contacts
    .map((contact) => {
      const icon = renderImage(vm.contactIcons[contact.icon], contact.label, CONTACT_ICON_SIZE, CONTACT_ICON_SIZE);
      const iconCell = `<td width="${CONTACT_ICON_SIZE}" style="${toInlineStyle({ verticalAlign: "middle", padding: "3px 10px 3px 0" })}">${icon}</td>`;
      const textCell = `<td style="${toInlineStyle({ verticalAlign: "middle", fontSize: "13px", padding: "3px 0" })}">${renderContactLinks(contact, vm)}</td>`;
      return `<tr>${iconCell}${textCell}</tr>`;
    })
    .join("");

  return renderTable(rows);
}

/** Brand-colored PNG icons; alt text keeps them meaningful when images are blocked. */
export function renderSocialIcons(vm: SignatureViewModel, align: "left" | "center" = "left"): string {
  if (vm.socials.length === 0) return "";

  const cells = vm.socials
    .map((social) => {
      const icon = renderImage(social.iconUrl, social.label, SOCIAL_ICON_SIZE, SOCIAL_ICON_SIZE);
      const link = `<a href="${escapeHtml(social.href)}" title="${social.label}" style="text-decoration:none"${editAttr(vm, `social:${social.network}`)}>${icon}</a>`;
      return `<td style="padding:0 3px">${link}</td>`;
    })
    .join("");

  const alignAttr = align === "center" ? 'align="center"' : "";
  return renderTable(`<tr>${cells}</tr>`, { marginTop: "10px", marginLeft: align === "left" ? "-3px" : undefined }, alignAttr);
}

/** Social profiles as text links, for image-free templates. */
export function renderSocialTextLinks(vm: SignatureViewModel): string {
  const links = vm.socials.map((social) =>
    editable(vm, `social:${social.network}`, renderLink(social.href, social.label, vm.primaryColor)),
  );
  return renderText(links.join("&nbsp;&middot;&nbsp;"), { fontSize: "12px", marginTop: "6px" });
}
