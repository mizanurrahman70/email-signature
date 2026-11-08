import { z } from "zod";
import { DEFAULT_SIGNATURE } from "@/constants/signature-defaults";
import {
  IMAGE_KINDS,
  MAX_CUSTOM_FIELDS,
  MAX_LEGAL_LENGTH,
  SIGNATURE_WIDTH,
  SOCIAL_NETWORKS,
  TEMPLATE_IDS,
} from "@/constants/signature-options";
import type { SignatureState } from "@/types/signature";
import { isHexColor } from "@/utils/color";

const MAX_FIELD_LENGTH = 300;

const text = z.string().max(MAX_FIELD_LENGTH).catch("");
const hexColor = z.string().refine(isHexColor);

const recordOf = <const T extends readonly string[]>(keys: T) =>
  z.object(Object.fromEntries(keys.map((key) => [key, text])) as Record<T[number], typeof text>);

/**
 * Validates state restored from localStorage. Every field falls back
 * independently, so one corrupt value never discards the whole draft.
 */
const signatureSchema = z.object({
  details: z
    .object({
      fullName: text,
      pronouns: text,
      jobTitle: text,
      department: text,
      company: text,
      phone: text,
      mobile: text,
      email: text,
      website: text,
      address: text,
    })
    .catch(DEFAULT_SIGNATURE.details),
  social: recordOf(SOCIAL_NETWORKS).catch(DEFAULT_SIGNATURE.social),
  images: recordOf(IMAGE_KINDS).catch(DEFAULT_SIGNATURE.images),
  style: z
    .object({
      templateId: z.enum(TEMPLATE_IDS).catch(DEFAULT_SIGNATURE.style.templateId),
      primaryColor: hexColor.catch(DEFAULT_SIGNATURE.style.primaryColor),
      textColor: hexColor.catch(DEFAULT_SIGNATURE.style.textColor),
      fontFamily: z.string().catch(DEFAULT_SIGNATURE.style.fontFamily),
      // Missing (older drafts) or out-of-range widths fall back to Auto.
      width: z.number().int().min(SIGNATURE_WIDTH.min).max(SIGNATURE_WIDTH.max).nullable().catch(null),
    })
    .catch(DEFAULT_SIGNATURE.style),
  // Drafts saved before the footer existed have no `footer`; they get the empty default.
  footer: z
    .object({
      legal: z.string().max(MAX_LEGAL_LENGTH).catch(""),
      customFields: z
        .array(z.object({ id: z.string().min(1), label: text, value: text }))
        .max(MAX_CUSTOM_FIELDS)
        .catch([]),
    })
    .catch(DEFAULT_SIGNATURE.footer),
});

export function parseSignatureState(raw: string | null): SignatureState {
  if (!raw) return DEFAULT_SIGNATURE;

  try {
    const result = signatureSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : DEFAULT_SIGNATURE;
  } catch {
    return DEFAULT_SIGNATURE;
  }
}
