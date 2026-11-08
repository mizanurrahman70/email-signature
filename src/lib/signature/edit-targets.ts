import { EDITOR_STEPS } from "@/constants/editor";
import type { EditorStepId } from "@/types/editor";

/**
 * Click-to-edit links the preview to the form. Preview HTML carries
 * `data-edit="<step>:<field>"` (only when rendered with `editable: true`, never
 * in copied signatures); matching form controls carry `data-edit-target` with
 * the same value.
 *
 *   details:fullName · details:custom-<id> · details:legal · social:linkedin · images:photo
 */
export type EditTarget = `${EditorStepId}:${string}`;

export const EDIT_ATTR = "data-edit";
export const EDIT_TARGET_ATTR = "data-edit-target";

const STEP_IDS = new Set<string>(EDITOR_STEPS.map((step) => step.id));

export function parseEditTarget(value: string | null | undefined): { step: EditorStepId; target: EditTarget } | null {
  if (!value) return null;
  const [step, field] = value.split(":");
  if (!step || !field || !STEP_IDS.has(step)) return null;
  return { step: step as EditorStepId, target: value as EditTarget };
}
