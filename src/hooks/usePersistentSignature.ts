"use client";

import { useEffect, useReducer } from "react";
import { SIGNATURE_SAVE_DELAY_MS, SIGNATURE_STORAGE_KEY } from "@/constants/storage";
import { signatureReducer } from "@/lib/signature/reducer";
import { parseSignatureState } from "@/lib/signature/schema";
import { readStorage, writeStorage } from "@/utils/storage";

/**
 * Signature state restored from and saved to localStorage.
 * Must run in the browser only; the caller guarantees that with `use(browser())`.
 */
export function usePersistentSignature() {
  const [state, dispatch] = useReducer(signatureReducer, null, () => parseSignatureState(readStorage(SIGNATURE_STORAGE_KEY)));

  useEffect(() => {
    const timeout = window.setTimeout(() => writeStorage(SIGNATURE_STORAGE_KEY, JSON.stringify(state)), SIGNATURE_SAVE_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [state]);

  return [state, dispatch] as const;
}
