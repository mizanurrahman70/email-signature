"use client";

import { Check } from "lucide-react";
import { useId } from "react";
import { FormSection } from "@/components/ui/FormSection";
import { COLOR_PRESETS, FONT_OPTIONS, TEXT_COLOR_PRESETS } from "@/constants/signature-options";
import type { ColorField } from "@/types/signature";
import { cn } from "@/utils/cn";
import { isSameColor } from "@/utils/color";
import { useSignature } from "./SignatureContext";

export function DesignForm() {
  return (
    <div className="flex flex-col gap-8">
      <ColorPicker field="primaryColor" label="Accent color" presets={COLOR_PRESETS} />
      <ColorPicker field="textColor" label="Text color" presets={TEXT_COLOR_PRESETS} />
      <FontPicker />
    </div>
  );
}

interface ColorPickerProps {
  field: ColorField;
  label: string;
  presets: ReadonlyArray<string>;
}

function ColorPicker({ field, label, presets }: ColorPickerProps) {
  const { state, actions } = useSignature();
  const customId = useId();
  const value = state.style[field];
  const setColor = (color: string) => actions.updateStyle({ [field]: color });
  const isCustom = !presets.some((preset) => isSameColor(preset, value));

  return (
    <FormSection title={label}>
      <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2.5">
        {presets.map((color) => (
          <ColorSwatch key={color} color={color} isSelected={isSameColor(value, color)} onSelect={setColor} />
        ))}
        <label
          htmlFor={customId}
          className={cn(
            "flex h-9 cursor-pointer items-center gap-2 rounded-full bg-white pr-3 pl-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 transition hover:ring-slate-300",
            "has-focus-visible:ring-2 has-focus-visible:ring-indigo-500",
            isCustom && "ring-2 ring-slate-900",
          )}
        >
          <input
            id={customId}
            type="color"
            value={value}
            onChange={(event) => setColor(event.target.value)}
            className="size-7 cursor-pointer appearance-none rounded-full border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
          />
          <span className="font-mono uppercase">{value}</span>
        </label>
      </div>
    </FormSection>
  );
}

interface ColorSwatchProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
}

function ColorSwatch({ color, isSelected, onSelect }: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(color)}
      aria-label={`Use ${color}`}
      aria-pressed={isSelected}
      style={{ backgroundColor: color }}
      className={cn(
        "flex size-9 items-center justify-center rounded-full text-white shadow-sm ring-1 ring-black/10 ring-inset transition-transform hover:scale-110",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
        isSelected && "ring-2 ring-white ring-offset-2 ring-offset-slate-900",
      )}
    >
      {isSelected && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
    </button>
  );
}

function FontPicker() {
  const { state, actions } = useSignature();

  return (
    <FormSection title="Font" description="Email-safe fonts only, so every recipient sees the same thing.">
      <div role="radiogroup" aria-label="Font" className="grid grid-cols-2 gap-2.5">
        {FONT_OPTIONS.map((font) => {
          const isSelected = state.style.fontFamily === font.value;
          return (
            <button
              key={font.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => actions.updateStyle({ fontFamily: font.value })}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                isSelected
                  ? "bg-indigo-50/70 ring-2 ring-indigo-500"
                  : "bg-white ring-1 ring-slate-200 hover:ring-slate-300",
              )}
            >
              <span className="text-xl leading-none text-slate-900" style={{ fontFamily: font.value }}>
                Aa
              </span>
              <span className="truncate text-xs font-medium text-slate-700">{font.label}</span>
            </button>
          );
        })}
      </div>
    </FormSection>
  );
}
