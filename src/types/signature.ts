import type { IMAGE_KINDS, SOCIAL_NETWORKS, TEMPLATE_IDS } from "@/constants/signature-options";

export type TemplateId = (typeof TEMPLATE_IDS)[number];
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];
export type ImageKind = (typeof IMAGE_KINDS)[number];

export interface SignatureDetails {
  fullName: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export type DetailField = keyof SignatureDetails;

export type SocialLinks = Record<SocialNetwork, string>;

export type SignatureImages = Record<ImageKind, string>;

export interface SignatureStyle {
  templateId: TemplateId;
  primaryColor: string;
  textColor: string;
  fontFamily: string;
}

export type ColorField = "primaryColor" | "textColor";

export interface SignatureState {
  details: SignatureDetails;
  social: SocialLinks;
  images: SignatureImages;
  style: SignatureStyle;
}

export type SignatureAction =
  | { type: "updateDetail"; field: DetailField; value: string }
  | { type: "updateSocial"; network: SocialNetwork; value: string }
  | { type: "setImage"; kind: ImageKind; url: string }
  | { type: "updateStyle"; style: Partial<SignatureStyle> }
  | { type: "reset" };

export interface ContactLine {
  label: string;
  /** Escaped, ready to embed in HTML. */
  text: string;
  href: string;
}

export interface SocialIcon {
  label: string;
  href: string;
  /** Absolute URL of the hosted PNG icon. */
  iconUrl: string;
}

export interface RenderOptions {
  /** Origin that serves /public assets, e.g. "https://signatures.acme.com". */
  assetBaseUrl: string;
}

/**
 * Normalized, escaped data shared by every template. Templates never touch
 * raw user input, so escaping and URL validation live in exactly one place.
 */
export interface SignatureViewModel {
  name: string;
  jobTitle: string;
  company: string;
  address: string;
  contacts: ContactLine[];
  socials: SocialIcon[];
  photoUrl: string;
  logoUrl: string;
  primaryColor: string;
  textColor: string;
  mutedColor: string;
  fontFamily: string;
}
