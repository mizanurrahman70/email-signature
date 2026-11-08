import type { SignatureState } from "@/types/signature";
import { copyPlainText, copyRichText } from "@/utils/clipboard";
import { getRenderOptions } from "@/utils/site";
import { renderSignatureHtml, renderSignatureText } from "./render";

/** Copies the formatted signature, ready to paste into an email app's settings. */
export function copySignature(state: SignatureState): Promise<void> {
  return copyRichText(renderSignatureHtml(state, getRenderOptions()), renderSignatureText(state));
}

/** Copies the raw HTML, for apps or tools that take signature source code. */
export function copySignatureSource(state: SignatureState): Promise<void> {
  return copyPlainText(renderSignatureHtml(state, getRenderOptions()));
}
