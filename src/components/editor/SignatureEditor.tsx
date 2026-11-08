"use client";

import { use, useDeferredValue, useMemo } from "react";
import { browser } from "react-dom";
import { CopyActions } from "@/components/preview/CopyActions";
import { SignaturePreview } from "@/components/preview/SignaturePreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { usePersistentSignature } from "@/hooks/usePersistentSignature";
import { renderSignatureHtml } from "@/lib/signature/render";
import { getRenderOptions, isLocalUrl } from "@/utils/site";
import { DesignForm } from "./DesignForm";
import { DetailsForm } from "./DetailsForm";
import { ImagesForm } from "./ImagesForm";
import { SignatureProvider, useSignature } from "./SignatureContext";
import { SocialForm } from "./SocialForm";

const EDITOR_TABS: ReadonlyArray<TabItem> = [
  { id: "details", label: "Details", content: <DetailsForm /> },
  { id: "social", label: "Social", content: <SocialForm /> },
  { id: "images", label: "Images", content: <ImagesForm /> },
  { id: "design", label: "Design", content: <DesignForm /> },
];

/**
 * Browser-only: the draft lives in localStorage, so the first render can't
 * match server HTML. `use(browser())` suspends during prerendering and the
 * nearest <Suspense> fallback is served instead.
 */
export function SignatureEditor() {
  use(browser("The signature draft is restored from localStorage."));
  const [state, dispatch] = usePersistentSignature();

  return (
    <SignatureProvider state={state} dispatch={dispatch}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <EditorPanel />
        <PreviewPanel />
      </div>
    </SignatureProvider>
  );
}

function EditorPanel() {
  const { actions } = useSignature();

  return (
    <Card
      title="Your signature"
      description="Changes are saved in this browser automatically."
      actions={
        <Button variant="ghost" onClick={actions.reset}>
          Reset
        </Button>
      }
    >
      <Tabs items={EDITOR_TABS} label="Signature settings" />
    </Card>
  );
}

function PreviewPanel() {
  const { state } = useSignature();
  // Typing stays responsive; the preview re-renders at lower priority.
  const deferredState = useDeferredValue(state);
  const renderOptions = useMemo(() => getRenderOptions(), []);
  const html = useMemo(() => renderSignatureHtml(deferredState, renderOptions), [deferredState, renderOptions]);
  const hasSocialLinks = Object.values(deferredState.social).some((link) => link.trim());

  return (
    <div className="lg:sticky lg:top-6 lg:self-start">
      <Card title="Live preview" description="This is exactly what gets copied.">
        <div className="flex flex-col gap-4">
          <SignaturePreview html={html} isStale={state !== deferredState} />
          {hasSocialLinks && isLocalUrl(renderOptions.assetBaseUrl) && (
            <p role="note" className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Social icons are served from {renderOptions.assetBaseUrl}, which recipients can&apos;t reach. Deploy the
              app or set NEXT_PUBLIC_SITE_URL before copying a signature for real use.
            </p>
          )}
          <CopyActions />
        </div>
      </Card>
    </div>
  );
}
