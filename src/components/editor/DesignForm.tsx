"use client";

import { useId } from "react";
import { COLOR_PRESETS, FONT_OPTIONS, TEXT_COLOR_PRESETS } from "@/constants/signature-options";
import type { ColorField } from "@/types/signature";
import { cn } from "@/utils/cn";
import { isSameColor } from "@/utils/color";
import { useSignature } from "./SignatureContext";

export function DesignForm() {
  return (
    <div className="flex flex-col gap-6">
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

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700">{label}</legend>
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((color) => (
          <ColorSwatch key={color} color={color} isSelected={isSameColor(value, color)} onSelect={setColor} />
        ))}
        <label htmlFor={customId} className="ml-1 flex items-center gap-2 text-sm text-slate-600">
          <input
            id={customId}
            type="color"
            value={value}
            onChange={(event) => setColor(event.target.value)}
            className="size-8 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
          />
          Custom
        </label>
      </div>
    </fieldset>
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
        "size-8 rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        isSelected ? "border-white ring-2 ring-slate-900" : "border-transparent",
      )}
    />
  );
}

function FontPicker() {
  const { state, actions } = useSignature();
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        Font
      </label>
      <select
        id={id}
        value={state.style.fontFamily}
        onChange={(event) => actions.updateStyle({ fontFamily: event.target.value })}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
      >
        {FONT_OPTIONS.map((font) => (
          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
            {font.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500">Only email-safe fonts are listed, so the signature looks the same for every recipient.</p>
    </div>
  );
}
