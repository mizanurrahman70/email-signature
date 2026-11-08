import { DEFAULT_SIGNATURE } from "@/constants/signature-defaults";
import { FONT_OPTIONS, MUTED_TEXT_COLOR, SOCIAL_ICON_DIR, SOCIAL_OPTIONS } from "@/constants/signature-options";
import type {
  ContactLine,
  RenderOptions,
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

  return {
    name: escapeHtml(details.fullName.trim()),
    jobTitle: escapeHtml(details.jobTitle.trim()),
    company: escapeHtml(details.company.trim()),
    address: escapeHtml(details.address.trim()),
    contacts: buildContacts(details.phone, details.email, details.website),
    socials: buildSocials(social, assetBaseUrl),
    photoUrl: toImageUrl(images.photo),
    logoUrl: toImageUrl(images.logo),
    primaryColor: safeHexColor(style.primaryColor, fallbackStyle.primaryColor),
    textColor: safeHexColor(style.textColor, fallbackStyle.textColor),
    mutedColor: MUTED_TEXT_COLOR,
    fontFamily: ALLOWED_FONTS.has(style.fontFamily) ? style.fontFamily : fallbackStyle.fontFamily,
  };
}

function buildContacts(phone: string, email: string, website: string): ContactLine[] {
  const websiteHref = normalizeWebUrl(website);
  const candidates: ContactLine[] = [
    { label: "P", text: escapeHtml(phone.trim()), href: toTelHref(phone) },
    { label: "E", text: escapeHtml(email.trim()), href: toMailtoHref(email) },
    { label: "W", text: escapeHtml(toDisplayUrl(websiteHref)), href: websiteHref },
  ];

  return candidates.filter((contact) => contact.text && contact.href);
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
