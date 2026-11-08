import { COLOR_PRESETS, FONT_OPTIONS } from "@/constants/signature-options";
import type { SignatureState } from "@/types/signature";

export const DEFAULT_SIGNATURE: SignatureState = {
  details: {
    fullName: "Jane Cooper",
    pronouns: "she/her",
    jobTitle: "Head of Marketing",
    department: "Marketing",
    company: "Acme Inc.",
    phone: "+1 555 010 2030",
    mobile: "+1 555 010 4050",
    email: "jane@acme.com",
    website: "acme.com",
    address: "123 Market St, San Francisco",
  },
  social: {
    linkedin: "",
    x: "",
    facebook: "",
    instagram: "",
    youtube: "",
    github: "",
  },
  images: {
    photo: "",
    logo: "",
  },
  style: {
    templateId: "split",
    primaryColor: COLOR_PRESETS[0],
    textColor: "#1f2937",
    fontFamily: FONT_OPTIONS[0].value,
    width: null,
  },
  footer: {
    legal: "",
    customFields: [],
  },
};
