import type { EDITOR_STEPS, PREVIEW_DEVICES } from "@/constants/editor";

export type EditorStepId = (typeof EDITOR_STEPS)[number]["id"];
export type PreviewDevice = (typeof PREVIEW_DEVICES)[number]["id"];
