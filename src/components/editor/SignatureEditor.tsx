"use client";

import { use, useId, useRef, type ReactNode } from "react";
import { browser } from "react-dom";
import { PreviewCanvas } from "@/components/studio/PreviewCanvas";
import { StepPanel } from "@/components/studio/StepPanel";
import { StepRail } from "@/components/studio/StepRail";
import { EDITOR_STEPS, RESET_CONFIRMATION } from "@/constants/editor";
import { usePersistentSignature } from "@/hooks/usePersistentSignature";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import type { EditorStepId } from "@/types/editor";
import { DesignForm } from "./DesignForm";
import { DetailsForm } from "./DetailsForm";
import { ImagesForm } from "./ImagesForm";
import { SignatureProvider, useSignature } from "./SignatureContext";
import { SocialForm } from "./SocialForm";
import { TemplatePicker } from "./TemplatePicker";

const STEP_IDS = EDITOR_STEPS.map((step) => step.id);
const INSTALL_SECTION_ID = "install";
/** Height of the sticky site header (h-14); sticky studio parts sit just below it. */
const STICKY_HEADER_HEIGHT = 56;

const STEP_CONTENT: Record<EditorStepId, ReactNode> = {
  template: <TemplatePicker />,
  details: <DetailsForm />,
  social: <SocialForm />,
  images: <ImagesForm />,
  style: <DesignForm />,
};

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
      <Studio />
    </SignatureProvider>
  );
}

/** Rail | settings panel | preview canvas. Stacks vertically below `lg`. */
function Studio() {
  const { actions } = useSignature();
  const steps = useStepNavigation(STEP_IDS);
  const baseId = useId();
  const studioRef = useRef<HTMLDivElement>(null);
  const getTabId = (id: EditorStepId) => `${baseId}-tab-${id}`;
  const getPanelId = (id: EditorStepId) => `${baseId}-panel-${id}`;

  /** Changes step; if the studio is partly scrolled out of view, brings it back into view. */
  function goToStep(change: () => void) {
    change();
    const studio = studioRef.current;
    if (studio && studio.getBoundingClientRect().top < STICKY_HEADER_HEIGHT) {
      studio.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleReset() {
    if (window.confirm(RESET_CONFIRMATION)) actions.reset();
  }

  function handleFinish() {
    document.getElementById(INSTALL_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      ref={studioRef}
      className="flex scroll-mt-20 flex-col overflow-clip rounded-3xl bg-white shadow-studio ring-1 ring-slate-900/5 lg:h-[calc(100dvh-5rem)] lg:min-h-[600px] lg:flex-row"
    >
      <StepRail
        activeId={steps.activeId}
        onSelect={(id) => goToStep(() => steps.setActiveId(id))}
        getTabId={getTabId}
        getPanelId={getPanelId}
      />
      <StepPanel
        stepIndex={steps.activeIndex}
        tabId={getTabId(steps.activeId)}
        panelId={getPanelId(steps.activeId)}
        isFirst={steps.isFirst}
        isLast={steps.isLast}
        onBack={() => goToStep(steps.back)}
        onNext={() => goToStep(steps.next)}
        onFinish={handleFinish}
        onReset={handleReset}
      >
        {STEP_CONTENT[steps.activeId]}
      </StepPanel>
      <PreviewCanvas />
    </div>
  );
}
