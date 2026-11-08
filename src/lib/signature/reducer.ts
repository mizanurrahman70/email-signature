import { DEFAULT_SIGNATURE } from "@/constants/signature-defaults";
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
    case "reset":
      return DEFAULT_SIGNATURE;
  }
}
