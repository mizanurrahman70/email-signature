"use client";

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
 * Renders the exact HTML that gets copied, inside a mock email window.
 * A sandboxed iframe keeps the app's CSS out, so the preview matches what
 * email clients show. No scripts run; same-origin is only for measuring height.
 */
export const SignaturePreview = memo(function SignaturePreview({ html, isStale }: SignaturePreviewProps) {
  const srcDoc = useMemo(() => buildPreviewDocument(html), [html]);
  const { iframeRef, height, handleLoad } = useIframeAutoHeight(INITIAL_HEIGHT);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-amber-400" />
        <span className="size-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-slate-500">New message</span>
      </div>
      <div className="space-y-1 border-b border-slate-100 px-5 py-3 text-xs text-slate-500">
        <p>
          <span className="font-medium text-slate-700">To:</span> client@example.com
        </p>
        <p>
          <span className="font-medium text-slate-700">Subject:</span> Following up
        </p>
      </div>
      <div className="px-5 py-5">
        <p className="mb-6 text-sm text-slate-600">
          Hi there,
          <br />
          <br />
          Thanks for your time today. Talk soon!
        </p>
        <iframe
          ref={iframeRef}
          title="Signature preview"
          srcDoc={srcDoc}
          sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          onLoad={handleLoad}
          style={{ height }}
          className={cn("block w-full border-0 transition-opacity", isStale && "opacity-70")}
        />
      </div>
    </div>
  );
});
