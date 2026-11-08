"use client";

import { ZoomOut } from "lucide-react";
import { memo, useEffect, useMemo, useRef } from "react";
import { useIframeAutoHeight } from "@/hooks/useIframeAutoHeight";
import { EDIT_ATTR } from "@/lib/signature/edit-targets";
import { cn } from "@/utils/cn";
import { buildPreviewDocument, EDITABLE_PREVIEW_GUTTER } from "@/utils/html";

const INITIAL_HEIGHT = 120;

interface SignaturePreviewProps {
  html: string;
  isStale: boolean;
  /**
   * Click-to-edit: called with the clicked part's `data-edit` value, or null
   * for a click on empty space. Links don't navigate while this is set.
   */
  onEdit?: (target: string | null) => void;
}

/**
 * Renders the exact HTML that gets copied. A sandboxed iframe keeps the app's
 * CSS out, so the preview matches what email clients show. No scripts run
 * inside it; same-origin lets the parent measure it and listen for clicks.
 */
export const SignaturePreview = memo(function SignaturePreview({ html, isStale, onEdit }: SignaturePreviewProps) {
  const isEditable = Boolean(onEdit);
  const srcDoc = useMemo(() => buildPreviewDocument(html, { editable: isEditable }), [html, isEditable]);
  const { iframeRef, height, scale, handleLoad } = useIframeAutoHeight(INITIAL_HEIGHT);

  // The iframe reloads on every change, so read the latest callback through a ref.
  const onEditRef = useRef(onEdit);
  useEffect(() => {
    onEditRef.current = onEdit;
  }, [onEdit]);

  function handleFrameLoad() {
    handleLoad();
    const doc = iframeRef.current?.contentDocument;
    if (!doc || !isEditable) return;

    doc.addEventListener("click", (event) => {
      event.preventDefault();
      // `instanceof Element` fails across frames (the iframe has its own Element), so check for closest().
      const target = event.target as Element | null;
      const part = typeof target?.closest === "function" ? target.closest(`[${EDIT_ATTR}]`) : null;
      onEditRef.current?.(part?.getAttribute(EDIT_ATTR) ?? null);
    });
  }

  return (
    <div>
      <iframe
        ref={iframeRef}
        title={isEditable ? "Signature preview. Click any part to edit it." : "Signature preview"}
        srcDoc={srcDoc}
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        onLoad={handleFrameLoad}
        style={
          isEditable
            ? { height, margin: -EDITABLE_PREVIEW_GUTTER, width: `calc(100% + ${EDITABLE_PREVIEW_GUTTER * 2}px)` }
            : { height }
        }
        className={cn("block w-full max-w-none border-0 transition-opacity", isStale && "opacity-60")}
      />
      {scale < 1 && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
          <ZoomOut className="size-3" aria-hidden="true" />
          Zoomed to {Math.round(scale * 100)}% to fit, as phone mail apps do
        </p>
      )}
    </div>
  );
});
