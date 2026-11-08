"use client";

import { useSignature } from "@/components/editor/SignatureContext";
import { Button } from "@/components/ui/Button";
import { COPY_STATUS_LABELS } from "@/constants/copy-status";
import { useCopyStatus } from "@/hooks/useCopyStatus";
import { copySignature, copySignatureSource } from "@/lib/signature/copy";

export function CopyActions() {
  const { state } = useSignature();
  const signatureCopy = useCopyStatus();
  const sourceCopy = useCopyStatus();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button className="flex-1" onClick={() => signatureCopy.run(() => copySignature(state))}>
        {COPY_STATUS_LABELS[signatureCopy.status] ?? "Copy signature"}
      </Button>
      <Button variant="secondary" className="flex-1" onClick={() => sourceCopy.run(() => copySignatureSource(state))}>
        {COPY_STATUS_LABELS[sourceCopy.status] ?? "Copy HTML source"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {COPY_STATUS_LABELS[signatureCopy.status] ?? COPY_STATUS_LABELS[sourceCopy.status] ?? ""}
      </span>
    </div>
  );
}
