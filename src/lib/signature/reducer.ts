import { DEFAULT_SIGNATURE } from "@/constants/signature-defaults";
import { MAX_CUSTOM_FIELDS } from "@/constants/signature-options";
import type { SignatureAction, SignatureState } from "@/types/signature";

export function signatureReducer(state: SignatureState, action: SignatureAction): SignatureState {
  switch (action.type) {
    case "updateDetail":
      return { ...state, details: { ...state.details, [action.field]: action.value } };
    case "updateSocial":
      return { ...state, social: { ...state.social, [action.network]: action.value } };
    case "setImage":
      return { ...state, images: { ...state.images, [action.kind]: action.url } };
    case "updateStyle":
      return { ...state, style: { ...state.style, ...action.style } };
    case "updateLegal":
      return { ...state, footer: { ...state.footer, legal: action.value } };
    case "addCustomField":
      if (state.footer.customFields.length >= MAX_CUSTOM_FIELDS) return state;
      return {
        ...state,
        footer: { ...state.footer, customFields: [...state.footer.customFields, { id: action.id, label: "", value: "" }] },
      };
    case "updateCustomField":
      return {
        ...state,
        footer: {
          ...state.footer,
          customFields: state.footer.customFields.map((field) =>
            field.id === action.id ? { ...field, ...action.patch } : field,
          ),
        },
      };
    case "removeCustomField":
      return {
        ...state,
        footer: { ...state.footer, customFields: state.footer.customFields.filter((field) => field.id !== action.id) },
      };
    case "reset":
      return DEFAULT_SIGNATURE;
  }
}
