"use client";

import { INK_COLORS } from "@/constants/handwriting";
import { cn } from "@/utils/cn";

interface InkColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function InkColorPicker({ value, onChange }: InkColorPickerProps) {
  return (
    <div role="radiogroup" aria-label="Ink color" className="flex items-center gap-2">
      {INK_COLORS.map((ink) => {
        const isSelected = ink.value === value;
        return (
          <button
            key={ink.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${ink.label} ink`}
            title={`${ink.label} ink`}
            onClick={() => onChange(ink.value)}
            style={{ backgroundColor: ink.value }}
            className={cn(
              "size-6 rounded-full ring-1 ring-black/10 ring-inset transition-transform hover:scale-110",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
              isSelected && "ring-2 ring-white ring-offset-2 ring-offset-slate-400",
            )}
          />
        );
      })}
    </div>
  );
}
