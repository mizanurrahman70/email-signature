import type { SignatureViewModel } from "@/types/signature";
import { editAttr, renderText } from "./parts";

const LEGAL_MAX_WIDTH = "560px";
const DIVIDER_COLOR = "#e5e7eb";

/**
 * Footer shared by every template: the legal notice in small print below a
 * thin rule. Empty when no legal text is set. (Custom fields render inside each
 * template, under name / title / company.)
 */
export function renderFooter(vm: SignatureViewModel): string {
  const { legalHtml } = vm.footer;
  if (!legalHtml) return "";

  return renderText(
    legalHtml,
    {
      marginTop: "14px",
      paddingTop: "8px",
      borderTop: `1px solid ${DIVIDER_COLOR}`,
      maxWidth: LEGAL_MAX_WIDTH,
      fontSize: "11px",
      lineHeight: "1.5",
      color: vm.mutedColor,
    },
    editAttr(vm, "details:legal"),
  );
}
