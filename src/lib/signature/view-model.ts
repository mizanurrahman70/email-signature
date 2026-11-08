import { DEFAULT_SIGNATURE } from "@/constants/signature-defaults";
import {
  CONTACT_ICON_ENDPOINT,
  CONTACT_ICON_NAMES,
  FONT_OPTIONS,
  MUTED_TEXT_COLOR,
  SOCIAL_ICON_DIR,
  SOCIAL_OPTIONS,
} from "@/constants/signature-options";
import type {
  ContactIconName,
  ContactLine,
  ContactLink,
  RenderOptions,
  SignatureDetails,
  SignatureState,
  SignatureViewModel,
  SocialIcon,
} from "@/types/signature";
import { safeHexColor } from "@/utils/color";
import { escapeHtml } from "@/utils/html";
import { normalizeWebUrl, toAbsoluteUrl, toDisplayUrl, toMailtoHref, toTelHref } from "@/utils/url";

const ALLOWED_FONTS = new Set<string>(FONT_OPTIONS.map((font) => font.value));

export function buildViewModel(
  { details, social, images, style }: SignatureState,
  { assetBaseUrl }: RenderOptions,
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
    photoUrl: toImageUrl(images.photo),
    logoUrl: toImageUrl(images.logo),
    primaryColor,
    textColor: safeHexColor(style.textColor, fallbackStyle.textColor),
    mutedColor: MUTED_TEXT_COLOR,
    fontFamily: ALLOWED_FONTS.has(style.fontFamily) ? style.fontFamily : fallbackStyle.fontFamily,
  };
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
      links: [phone, mobile].map((number) => ({ text: escapeText(number), href: toTelHref(number) })),
    },
    { icon: "email", label: "E", links: [{ text: escapeText(email), href: toMailtoHref(email) }] },
    { icon: "website", label: "W", links: [{ text: escapeHtml(toDisplayUrl(websiteHref)), href: websiteHref }] },
    { icon: "address", label: "A", links: [{ text: escapeText(address), href: "" }] },
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
    return href && iconUrl ? [{ label, href, iconUrl }] : [];
  });
}

/** Images must be absolute https URLs; email clients cannot load data: or blob: URLs. */
function toImageUrl(url: string): string {
  const normalized = normalizeWebUrl(url);
  return normalized.startsWith("https://") ? normalized : "";
}
