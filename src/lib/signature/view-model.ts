import { DEFAULT_SIGNATURE } from "@/constants/signature-defaults";
import {
  CONTACT_ICON_ENDPOINT,
  CONTACT_ICON_NAMES,
  FONT_OPTIONS,
  MUTED_TEXT_COLOR,
  PLACEHOLDER_IMAGES,
  SOCIAL_ICON_DIR,
  SOCIAL_OPTIONS,
} from "@/constants/signature-options";
import type {
  ContactIconName,
  ContactLine,
  ContactLink,
  CustomField,
  CustomFieldLine,
  FooterViewModel,
  ImageKind,
  RenderOptions,
  SignatureDetails,
  SignatureFooter,
  SignatureState,
  SignatureViewModel,
  SocialIcon,
} from "@/types/signature";
import { safeHexColor } from "@/utils/color";
import { escapeHtml } from "@/utils/html";
import { isValidEmail, normalizeWebUrl, toAbsoluteUrl, toDisplayUrl, toMailtoHref, toTelHref } from "@/utils/url";

const ALLOWED_FONTS = new Set<string>(FONT_OPTIONS.map((font) => font.value));

export function buildViewModel(
  { details, social, images, style, footer }: SignatureState,
  { assetBaseUrl, showPlaceholders = false, editable = false }: RenderOptions,
): SignatureViewModel {
  const fallbackStyle = DEFAULT_SIGNATURE.style;
  const primaryColor = safeHexColor(style.primaryColor, fallbackStyle.primaryColor);

  return {
    name: escapeText(details.fullName),
    pronouns: escapeText(details.pronouns),
    jobTitle: escapeText(details.jobTitle),
    department: escapeText(details.department),
    company: escapeText(details.company),
    contacts: buildContacts(details),
    contactIcons: buildContactIcons(primaryColor, assetBaseUrl),
    socials: buildSocials(social, assetBaseUrl),
    photoUrl: toImageUrl(images.photo) || placeholderFor("photo", showPlaceholders, assetBaseUrl),
    logoUrl: toImageUrl(images.logo) || placeholderFor("logo", showPlaceholders, assetBaseUrl),
    primaryColor,
    textColor: safeHexColor(style.textColor, fallbackStyle.textColor),
    mutedColor: MUTED_TEXT_COLOR,
    fontFamily: ALLOWED_FONTS.has(style.fontFamily) ? style.fontFamily : fallbackStyle.fontFamily,
    customFields: buildCustomFields(footer.customFields, primaryColor),
    editable,
    footer: buildFooter(footer),
  };
}

function buildCustomFields(fields: CustomField[], linkColor: string): CustomFieldLine[] {
  return fields
    .filter((field) => field.value.trim())
    .map((field) => ({
      id: field.id,
      label: escapeText(field.label),
      valueHtml: renderFieldValue(field.value.trim(), linkColor),
    }));
}

function buildFooter({ legal }: SignatureFooter): FooterViewModel {
  return { legalHtml: escapeText(legal).replace(/\r?\n/g, "<br>") };
}

/** Emails and web addresses become links; anything else is plain escaped text. */
function renderFieldValue(value: string, linkColor: string): string {
  const linkStyle = `color:${linkColor};text-decoration:none`;
  if (isValidEmail(value)) {
    return `<a href="${escapeHtml(toMailtoHref(value))}" style="${linkStyle}">${escapeHtml(value)}</a>`;
  }
  if (/^(https?:\/\/|www\.)\S+$/i.test(value)) {
    const href = normalizeWebUrl(value);
    if (href) return `<a href="${escapeHtml(href)}" style="${linkStyle}">${escapeHtml(toDisplayUrl(href))}</a>`;
  }
  return escapeHtml(value);
}

function escapeText(value: string): string {
  return escapeHtml(value.trim());
}

function buildContacts({ phone, mobile, email, website, address }: SignatureDetails): ContactLine[] {
  const websiteHref = normalizeWebUrl(website);
  const candidates: ContactLine[] = [
    {
      icon: "phone",
      label: "P",
      links: [
        { field: "phone", text: escapeText(phone), href: toTelHref(phone) },
        { field: "mobile", text: escapeText(mobile), href: toTelHref(mobile) },
      ],
    },
    { icon: "email", label: "E", links: [{ field: "email", text: escapeText(email), href: toMailtoHref(email) }] },
    {
      icon: "website",
      label: "W",
      links: [{ field: "website", text: escapeHtml(toDisplayUrl(websiteHref)), href: websiteHref }],
    },
    { icon: "address", label: "A", links: [{ field: "address", text: escapeText(address), href: "" }] },
  ];

  return candidates
    .map((contact) => ({ ...contact, links: contact.links.filter(isUsableLink(contact.icon)) }))
    .filter((contact) => contact.links.length > 0);
}

/** Addresses are plain text; every other contact needs a valid link to be shown. */
function isUsableLink(icon: ContactIconName) {
  return (link: ContactLink) => Boolean(link.text) && (icon === "address" || Boolean(link.href));
}

function buildContactIcons(color: string, assetBaseUrl: string): Record<ContactIconName, string> {
  const colorParam = color.slice(1).toLowerCase();
  return Object.fromEntries(
    CONTACT_ICON_NAMES.map((name) => [
      name,
      toAbsoluteUrl(`${CONTACT_ICON_ENDPOINT}/${name}?color=${colorParam}`, assetBaseUrl),
    ]),
  ) as Record<ContactIconName, string>;
}

function buildSocials(social: SignatureState["social"], assetBaseUrl: string): SocialIcon[] {
  return SOCIAL_OPTIONS.flatMap(({ network, label }) => {
    const href = normalizeWebUrl(social[network]);
    const iconUrl = toAbsoluteUrl(`${SOCIAL_ICON_DIR}/${network}.png`, assetBaseUrl);
    return href && iconUrl ? [{ network, label, href, iconUrl }] : [];
  });
}

function placeholderFor(kind: ImageKind, enabled: boolean, assetBaseUrl: string): string {
  return enabled ? toAbsoluteUrl(PLACEHOLDER_IMAGES[kind], assetBaseUrl) : "";
}

/** Images must be absolute https URLs; email clients cannot load data: or blob: URLs. */
function toImageUrl(url: string): string {
  const normalized = normalizeWebUrl(url);
  return normalized.startsWith("https://") ? normalized : "";
}
