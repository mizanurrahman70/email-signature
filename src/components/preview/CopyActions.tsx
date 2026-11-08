"use client";

import { Check, Code2, Copy, TriangleAlert } from "lucide-react";
import { useSignature } from "@/components/editor/SignatureContext";
import { Button } from "@/components/ui/Button";
import { COPY_STATUS_LABELS } from "@/constants/copy-status";
import { useCopyStatus } from "@/hooks/useCopyStatus";
import { copySignature, copySignatureSource } from "@/lib/signature/copy";
import type { CopyStatus } from "@/types/copy-status";

const STATUS_ICONS: Record<CopyStatus, typeof Copy> = {
  idle: Copy,
  copied: Check,
  error: TriangleAlert,
};

export function CopyActions() {
  const { state } = useSignature();
  const signatureCopy = useCopyStatus();
  const sourceCopy = useCopyStatus();
  const SignatureIcon = STATUS_ICONS[signatureCopy.status];
  const SourceIcon = sourceCopy.status === "idle" ? Code2 : STATUS_ICONS[sourceCopy.status];

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => sourceCopy.run(() => copySignatureSource(state))}
        title="Copy the raw HTML"
      >
        <SourceIcon />
        <span className="max-sm:sr-only">{COPY_STATUS_LABELS[sourceCopy.status] ?? "HTML"}</span>
      </Button>
      <Button variant="brand" size="sm" onClick={() => signatureCopy.run(() => copySignature(state))}>
        <SignatureIcon />
        {COPY_STATUS_LABELS[signatureCopy.status] ?? "Copy signature"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {COPY_STATUS_LABELS[signatureCopy.status] ?? COPY_STATUS_LABELS[sourceCopy.status] ?? ""}
      </span>
    </div>
  );
}
