"use client";

import { ZoomOut } from "lucide-react";
import { memo, useMemo } from "react";
import { useIframeAutoHeight } from "@/hooks/useIframeAutoHeight";
import { cn } from "@/utils/cn";
import { buildPreviewDocument } from "@/utils/html";

const INITIAL_HEIGHT = 120;

interface SignaturePreviewProps {
  html: string;
  isStale: boolean;
}

/**
 * Renders the exact HTML that gets copied. A sandboxed iframe keeps the app's
 * CSS out, so the preview matches what email clients show. No scripts run;
 * same-origin is only for measuring size.
 */
export const SignaturePreview = memo(function SignaturePreview({ html, isStale }: SignaturePreviewProps) {
  const srcDoc = useMemo(() => buildPreviewDocument(html), [html]);
  const { iframeRef, height, scale, handleLoad } = useIframeAutoHeight(INITIAL_HEIGHT);

  return (
    <div>
      <iframe
        ref={iframeRef}
        title="Signature preview"
        srcDoc={srcDoc}
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        onLoad={handleLoad}
        style={{ height }}
        className={cn("block w-full border-0 transition-opacity", isStale && "opacity-60")}
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
