import { COLOR_PRESETS, FONT_OPTIONS } from "@/constants/signature-options";
import type { SignatureState } from "@/types/signature";

export const DEFAULT_SIGNATURE: SignatureState = {
  details: {
    fullName: "Jane Cooper",
    pronouns: "",
    jobTitle: "Head of Marketing",
    department: "",
    company: "Acme Inc.",
    phone: "+1 555 010 2030",
    mobile: "",
    email: "jane@acme.com",
    website: "acme.com",
    address: "",
  },
  social: {
    linkedin: "linkedin.com/in/janecooper",
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
    templateId: "classic",
    primaryColor: COLOR_PRESETS[0],
    textColor: "#1f2937",
    fontFamily: FONT_OPTIONS[0].value,
  },
};
