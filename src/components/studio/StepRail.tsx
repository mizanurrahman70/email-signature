"use client";

import { ImageUp, LayoutTemplate, Palette, Share2, UserRound, type LucideIcon } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import { EDITOR_STEPS } from "@/constants/editor";
import type { EditorStepId } from "@/types/editor";
import { cn } from "@/utils/cn";
import { getRovingIndex } from "@/utils/keyboard";

const STEP_ICONS: Record<EditorStepId, LucideIcon> = {
  template: LayoutTemplate,
  details: UserRound,
  social: Share2,
  images: ImageUp,
  style: Palette,
};

interface StepRailProps {
  activeId: EditorStepId;
  onSelect: (id: EditorStepId) => void;
  /** Builds ids shared with the panel for aria-controls / aria-labelledby. */
  getTabId: (id: EditorStepId) => string;
  getPanelId: (id: EditorStepId) => string;
}

/** Solid brand-color vertical step bar on desktop; a horizontal bar on small screens. */
export function StepRail({ activeId, onSelect, getTabId, getPanelId }: StepRailProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex = getRovingIndex(event.key, index, EDITOR_STEPS.length, "both");
    if (nextIndex === null) return;

    event.preventDefault();
    onSelect(EDITOR_STEPS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <nav aria-label="Signature editor" className="order-1 bg-brand-900 lg:w-[92px]">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Editor steps"
        className="scrollbar-thin flex gap-1 overflow-x-auto p-2 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-2.5 lg:py-4"
      >
        {EDITOR_STEPS.map((step, index) => {
          const Icon = STEP_ICONS[step.id];
          const isActive = step.id === activeId;
          return (
            <button
              key={step.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={getTabId(step.id)}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={getPanelId(step.id)}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(step.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "group relative flex min-w-[60px] flex-1 flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 text-[11px] font-medium transition-colors lg:min-w-[72px] lg:flex-none lg:px-2",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                isActive ? "bg-white/10 text-white" : "text-brand-100/70 hover:bg-white/5 hover:text-white",
              )}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 -bottom-2 h-0.5 rounded-full bg-white lg:inset-x-auto lg:inset-y-3 lg:-left-2.5 lg:h-auto lg:w-0.5"
                />
              )}
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-white text-brand-900 shadow-md shadow-black/20"
                    : "bg-white/5 ring-1 ring-white/10 group-hover:bg-white/10",
                )}
              >
                <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              {step.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
