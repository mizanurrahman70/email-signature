"use client";

import { memo } from "react";
import { cn } from "@/utils/cn";

interface SignaturePreviewProps {
  html: string;
  isStale: boolean;
}

/**
 * Renders the exact HTML that gets copied, inside a mock email window.
 * The HTML is built from escaped, validated values in the view model.
 */
export const SignaturePreview = memo(function SignaturePreview({ html, isStale }: SignaturePreviewProps) {
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
        <div
          aria-live="polite"
          aria-label="Signature preview"
          className={cn("overflow-x-auto transition-opacity", isStale && "opacity-70")}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
});
