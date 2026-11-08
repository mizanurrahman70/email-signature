import type { CONTACT_ICON_NAMES, IMAGE_KINDS, SOCIAL_NETWORKS, TEMPLATE_IDS } from "@/constants/signature-options";

export type TemplateId = (typeof TEMPLATE_IDS)[number];
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];
export type ImageKind = (typeof IMAGE_KINDS)[number];
export type ContactIconName = (typeof CONTACT_ICON_NAMES)[number];

export interface SignatureDetails {
  fullName: string;
  pronouns: string;
  jobTitle: string;
  department: string;
  company: string;
  phone: string;
  mobile: string;
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

/** A user-defined "Label: value" line shown in the signature footer. */
export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface SignatureFooter {
  /** Disclaimer / confidentiality notice, shown in small print. */
  legal: string;
  customFields: CustomField[];
}

export interface SignatureState {
  details: SignatureDetails;
  social: SocialLinks;
  images: SignatureImages;
  style: SignatureStyle;
  footer: SignatureFooter;
}

export type SignatureAction =
  | { type: "updateDetail"; field: DetailField; value: string }
  | { type: "updateSocial"; network: SocialNetwork; value: string }
  | { type: "setImage"; kind: ImageKind; url: string }
  | { type: "updateStyle"; style: Partial<SignatureStyle> }
  | { type: "updateLegal"; value: string }
  | { type: "addCustomField"; id: string }
  | { type: "updateCustomField"; id: string; patch: Partial<Omit<CustomField, "id">> }
  | { type: "removeCustomField"; id: string }
  | { type: "reset" };

export interface ContactLink {
  /** The form field this value comes from (for click-to-edit). */
  field: DetailField;
  /** Escaped, ready to embed in HTML. */
  text: string;
  /** Empty for plain text (e.g. an address). */
  href: string;
}

export interface ContactLine {
  icon: ContactIconName;
  /** Short text label for templates without icons, e.g. "P". */
  label: string;
  links: ContactLink[];
}

export interface SocialIcon {
  network: SocialNetwork;
  label: string;
  href: string;
  /** Absolute URL of the hosted PNG icon. */
  iconUrl: string;
}

export interface RenderOptions {
  /** Origin that serves /public assets, e.g. "https://signatures.acme.com". */
  assetBaseUrl: string;
  /** Show placeholder images where none are set. Preview only; never copied. */
  showPlaceholders?: boolean;
  /** Add `data-edit` markers for click-to-edit. Preview only; never copied. */
  editable?: boolean;
}

/**
 * Normalized, escaped data shared by every template. Templates never touch
 * raw user input, so escaping and URL validation live in exactly one place.
 */
export interface SignatureViewModel {
  name: string;
  pronouns: string;
  jobTitle: string;
  department: string;
  company: string;
  /** Phone, email, website and address, in display order; empty ones omitted. */
  contacts: ContactLine[];
  /** Absolute URLs of accent-colored contact icon PNGs. */
  contactIcons: Record<ContactIconName, string>;
  socials: SocialIcon[];
  photoUrl: string;
  logoUrl: string;
  primaryColor: string;
  textColor: string;
  mutedColor: string;
  fontFamily: string;
  /** Shown directly under name / title / company. */
  customFields: CustomFieldLine[];
  /** True when rendering the interactive preview (adds click-to-edit markers). */
  editable: boolean;
  footer: FooterViewModel;
}

/** An escaped "Label: value" line; the value may be a link. */
export interface CustomFieldLine {
  id: string;
  label: string;
  valueHtml: string;
}

export interface FooterViewModel {
  /** Escaped legal text with line breaks as <br>. */
  legalHtml: string;
}
