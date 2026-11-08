"use client";

import { Monitor, MousePointerClick, Smartphone } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { useSignature } from "@/components/editor/SignatureContext";
import { CopyActions } from "@/components/preview/CopyActions";
import { EmailWindow } from "@/components/preview/EmailWindow";
import { SignaturePreview } from "@/components/preview/SignaturePreview";
import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
import { PREVIEW_DEVICES } from "@/constants/editor";
import { TEMPLATE_OPTIONS } from "@/constants/signature-options";
import { renderSignatureHtml } from "@/lib/signature/render";
import type { PreviewDevice } from "@/types/editor";
import { getRenderOptions } from "@/utils/site";

const DEVICE_OPTIONS: ReadonlyArray<SegmentOption<PreviewDevice>> = [
  { value: "desktop", label: "Desktop", icon: <Monitor aria-hidden="true" /> },
  { value: "mobile", label: "Mobile", icon: <Smartphone aria-hidden="true" /> },
];

interface PreviewCanvasProps {
  /** Click-to-edit: receives the clicked part's edit target (or null for empty space). */
  onEdit: (target: string | null) => void;
}

/** Right side of the studio: toolbar with device toggle and copy, plus the email preview. */
export function PreviewCanvas({ onEdit }: PreviewCanvasProps) {
  const { state } = useSignature();
  const [device, setDevice] = useState<PreviewDevice>("desktop");

  // Typing stays responsive; the preview re-renders at lower priority.
  const deferredState = useDeferredValue(state);
  // Placeholders and click-to-edit markers are preview-only; copies never include them.
  const renderOptions = useMemo(() => getRenderOptions({ showPlaceholders: true, editable: true }), []);
  const html = useMemo(() => renderSignatureHtml(deferredState, renderOptions), [deferredState, renderOptions]);

  const templateName = TEMPLATE_OPTIONS.find((template) => template.id === state.style.templateId)?.name;
  const deviceWidth = PREVIEW_DEVICES.find((option) => option.id === device)?.width ?? PREVIEW_DEVICES[0].width;

  return (
    <section
      aria-label="Live preview"
      className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-50"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white/70 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[13px] font-medium text-slate-800">Live preview</span>
          {templateName && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              {templateName}
            </span>
          )}
          <span className="hidden items-center gap-1 text-[11px] text-slate-400 xl:flex">
            <MousePointerClick className="size-3.5" aria-hidden="true" />
            Click any part to edit it
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SegmentedControl label="Preview size" options={DEVICE_OPTIONS} value={device} onChange={setDevice} />
          <CopyActions />
        </div>
      </div>

      <div className="bg-dots scrollbar-thin min-h-0 flex-1 overflow-auto px-4 py-8 sm:px-8 lg:overscroll-contain lg:py-12">
        <EmailWindow width={deviceWidth}>
          <SignaturePreview html={html} isStale={state !== deferredState} onEdit={onEdit} />
        </EmailWindow>
      </div>
    </section>
  );
}
