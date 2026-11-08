import type { CopyStatus } from "@/types/copy-status";

export const COPY_STATUS_RESET_MS = 2000;

/** Button text per status; null means "show the button's default label". */
export const COPY_STATUS_LABELS: Record<CopyStatus, string | null> = {
  idle: null,
  copied: "Copied!",
  error: "Copy failed. Try again.",
};
