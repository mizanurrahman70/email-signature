"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COPY_STATUS_RESET_MS } from "@/constants/copy-status";
import type { CopyStatus } from "@/types/copy-status";

/** Runs a copy function and exposes a short-lived success/error status for UI feedback. */
export function useCopyStatus() {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const run = useCallback(async (copy: () => Promise<void>) => {
    window.clearTimeout(timeoutRef.current);
    try {
      await copy();
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    timeoutRef.current = window.setTimeout(() => setStatus("idle"), COPY_STATUS_RESET_MS);
  }, []);

  return { status, run };
}
