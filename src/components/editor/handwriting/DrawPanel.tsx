"use client";

import { Eraser, Undo2 } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "@/components/ui/Button";
import type { SignaturePadHandlers } from "@/hooks/useSignaturePad";
import { cn } from "@/utils/cn";
import { InkColorPicker } from "./InkColorPicker";

interface DrawPanelProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  padHandlers: SignaturePadHandlers;
  isEmpty: boolean;
  onUndo: () => void;
  onClear: () => void;
  color: string;
  onColorChange: (color: string) => void;
}

/** The freehand pad: works with mouse, touch and stylus via Pointer Events. */
export function DrawPanel({ canvasRef, padHandlers, isEmpty, onUndo, onClear, color, onColorChange }: DrawPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] font-medium text-slate-700">Draw your signature inside this box</p>

      <div className="relative">
        <canvas
          ref={canvasRef}
          {...padHandlers}
          aria-label="Signature drawing pad. Draw with your mouse, finger or stylus."
          className="block h-52 w-full cursor-crosshair touch-none rounded-2xl bg-[#faf8f3] ring-1 ring-slate-200 sm:h-56"
        />
        {/* Decorative signing line; it isn't part of the exported image. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 bottom-12 flex items-end gap-2">
          <span className="text-lg leading-none text-slate-300">×</span>
          <span className="mb-1 flex-1 border-b border-dashed border-slate-300" />
        </div>
        <p
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400 transition-opacity",
            !isEmpty && "opacity-0",
          )}
        >
          Sign here with your mouse or finger
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <InkColorPicker value={color} onChange={onColorChange} />
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onUndo} disabled={isEmpty}>
            <Undo2 />
            Undo
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear} disabled={isEmpty}>
            <Eraser />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
