"use client";

import { ArrowRight, ChevronLeft, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { EDITOR_STEPS } from "@/constants/editor";

interface StepPanelProps {
  stepIndex: number;
  tabId: string;
  panelId: string;
  isFirst: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  onReset: () => void;
  children: ReactNode;
}

/** The settings column: step header, scrollable form, and Back/Next footer. */
export function StepPanel({
  stepIndex,
  tabId,
  panelId,
  isFirst,
  isLast,
  onBack,
  onNext,
  onFinish,
  onReset,
  children,
}: StepPanelProps) {
  const step = EDITOR_STEPS[stepIndex];

  return (
    <section
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      className="flex min-h-0 flex-col border-slate-200 bg-white lg:w-[420px] lg:border-r"
    >
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 pt-6 pb-5">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] text-brand-600 uppercase">
            Step {stepIndex + 1} of {EDITOR_STEPS.length}
          </p>
          <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-900">{step.title}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{step.description}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} aria-label="Reset all fields" className="-mr-2">
          <RotateCcw />
          <span className="max-sm:sr-only">Reset</span>
        </Button>
      </header>

      <div key={panelId} className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-6 py-6 [scrollbar-gutter:stable]">
        {children}
      </div>

      <footer className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
        <Button variant="ghost" size="sm" onClick={onBack} disabled={isFirst}>
          <ChevronLeft />
          Back
        </Button>
        <StepDots activeIndex={stepIndex} />
        {isLast ? (
          <Button size="sm" onClick={onFinish}>
            Add to my email
            <ArrowRight />
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={onNext}>
            Next: {EDITOR_STEPS[stepIndex + 1].label}
            <ArrowRight />
          </Button>
        )}
      </footer>
    </section>
  );
}

function StepDots({ activeIndex }: { activeIndex: number }) {
  return (
    <div aria-hidden="true" className="hidden items-center gap-1 sm:flex">
      {EDITOR_STEPS.map((step, index) => (
        <span
          key={step.id}
          className={
            index === activeIndex
              ? "h-1.5 w-4 rounded-full bg-brand-500"
              : index < activeIndex
                ? "size-1.5 rounded-full bg-brand-200"
                : "size-1.5 rounded-full bg-slate-200"
          }
        />
      ))}
    </div>
  );
}
