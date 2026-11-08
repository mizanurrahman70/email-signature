"use client";

import { TextField } from "@/components/ui/TextField";
import { MAX_TYPED_LENGTH } from "@/constants/handwriting";
import { cn } from "@/utils/cn";
import { HANDWRITING_FONTS, type HandwritingFontId } from "./fonts";
import { InkColorPicker } from "./InkColorPicker";

interface TypePanelProps {
  text: string;
  onTextChange: (text: string) => void;
  fontId: HandwritingFontId;
  onFontChange: (fontId: HandwritingFontId) => void;
  color: string;
  onColorChange: (color: string) => void;
}

/** Type a name and pick a handwriting font. */
export function TypePanel({ text, onTextChange, fontId, onFontChange, color, onColorChange }: TypePanelProps) {
  const sample = text.trim() || "Your name";

  return (
    <div className="flex flex-col gap-5">
      <TextField
        label="Type your name"
        value={text}
        onValueChange={onTextChange}
        maxLength={MAX_TYPED_LENGTH}
        placeholder="Jane Cooper"
        autoComplete="name"
      />

      <div role="radiogroup" aria-label="Handwriting style" className="grid gap-2.5 sm:grid-cols-2">
        {HANDWRITING_FONTS.map((font) => {
          const isSelected = font.id === fontId;
          return (
            <button
              key={font.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onFontChange(font.id)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-2xl px-4 py-3 text-left transition",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
                isSelected ? "bg-brand-50/70 ring-2 ring-brand-500" : "bg-[#faf8f3] ring-1 ring-slate-200 hover:ring-slate-300",
              )}
            >
              <span className={cn("block w-full truncate text-[32px] leading-tight", font.className)} style={{ color }}>
                {sample}
              </span>
              <span className="text-[11px] font-medium text-slate-500">{font.label}</span>
            </button>
          );
        })}
      </div>

      <InkColorPicker value={color} onChange={onColorChange} />
    </div>
  );
}
