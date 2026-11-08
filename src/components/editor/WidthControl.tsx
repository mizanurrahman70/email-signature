"use client";

import { useId, useState } from "react";
import { FormSection } from "@/components/ui/FormSection";
import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
import { SIGNATURE_WIDTH } from "@/constants/signature-options";
import { useSignature } from "./SignatureContext";

type WidthMode = "auto" | "custom";

const MODE_OPTIONS: ReadonlyArray<SegmentOption<WidthMode>> = [
  { value: "auto", label: "Auto" },
  { value: "custom", label: "Custom" },
];

/** Signature width: Auto (natural) or a custom px value via slider + number box. */
export function WidthControl() {
  const { state, actions } = useSignature();
  const sliderId = useId();
  const width = state.style.width;
  // While typing, the number box may hold an out-of-range value; it's clamped on blur.
  const [draft, setDraft] = useState<string | null>(null);

  const setWidth = (value: number | null) => actions.updateStyle({ width: value });
  const clamp = (value: number) => Math.min(SIGNATURE_WIDTH.max, Math.max(SIGNATURE_WIDTH.min, Math.round(value)));

  function commitDraft() {
    if (draft === null) return;
    const value = Number(draft);
    if (Number.isFinite(value) && draft.trim() !== "") setWidth(clamp(value));
    setDraft(null);
  }

  return (
    <FormSection title="Signature width" description="Auto fits the content. Custom sets the width in the copied signature.">
      <SegmentedControl
        label="Signature width"
        options={MODE_OPTIONS}
        value={width === null ? "auto" : "custom"}
        onChange={(mode) => setWidth(mode === "auto" ? null : SIGNATURE_WIDTH.initial)}
      />

      {width !== null && (
        <div className="flex items-center gap-3">
          <label htmlFor={sliderId} className="sr-only">
            Signature width in pixels
          </label>
          <input
            id={sliderId}
            type="range"
            min={SIGNATURE_WIDTH.min}
            max={SIGNATURE_WIDTH.max}
            step={SIGNATURE_WIDTH.step}
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
            className="h-2 flex-1 cursor-pointer accent-brand-700"
          />
          <div className="flex h-9 items-center rounded-xl border border-slate-200 bg-white pr-2.5 shadow-xs focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
            <input
              type="number"
              inputMode="numeric"
              aria-label="Signature width in pixels"
              min={SIGNATURE_WIDTH.min}
              max={SIGNATURE_WIDTH.max}
              step={SIGNATURE_WIDTH.step}
              value={draft ?? width}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commitDraft}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitDraft();
              }}
              className="w-16 bg-transparent px-2.5 text-right text-sm tabular-nums text-slate-900 focus:outline-none"
            />
            <span className="text-xs text-slate-500">px</span>
          </div>
        </div>
      )}

      {width !== null && (
        <p className="text-xs text-slate-500">
          {SIGNATURE_WIDTH.min}–{SIGNATURE_WIDTH.max}px. On phones, the signature still shrinks to fit the screen.
        </p>
      )}
    </FormSection>
  );
}
