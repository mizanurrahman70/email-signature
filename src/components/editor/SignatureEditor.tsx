"use client";

import { use, useId, type ReactNode } from "react";
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
  const getTabId = (id: EditorStepId) => `${baseId}-tab-${id}`;
  const getPanelId = (id: EditorStepId) => `${baseId}-panel-${id}`;

  function handleReset() {
    if (window.confirm(RESET_CONFIRMATION)) actions.reset();
  }

  function handleFinish() {
    document.getElementById(INSTALL_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-studio ring-1 ring-slate-900/5 lg:h-[820px] lg:flex-row">
      <StepRail activeId={steps.activeId} onSelect={steps.setActiveId} getTabId={getTabId} getPanelId={getPanelId} />
      <StepPanel
        stepIndex={steps.activeIndex}
        tabId={getTabId(steps.activeId)}
        panelId={getPanelId(steps.activeId)}
        isFirst={steps.isFirst}
        isLast={steps.isLast}
        onBack={steps.back}
        onNext={steps.next}
        onFinish={handleFinish}
        onReset={handleReset}
      >
        {STEP_CONTENT[steps.activeId]}
      </StepPanel>
      <PreviewCanvas />
    </div>
  );
}
