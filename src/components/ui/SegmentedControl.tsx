"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
}

/** A compact radio group styled as a pill switch. */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl bg-slate-100 p-1 ring-1 ring-inset ring-slate-200/60">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all [&_svg]:size-3.5",
              "focus-visible:outline-2 focus-visible:outline-indigo-500",
              isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800",
            )}
          >
            {option.icon}
            <span className="max-sm:sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
