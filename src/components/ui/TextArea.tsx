import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  hint?: string;
  /** Rendered on the label row, right-aligned (e.g. a helper button). */
  action?: ReactNode;
}

export function TextArea({ label, value, onValueChange, hint, action, maxLength, className, ...props }: TextAreaProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-slate-700">
          {label}
        </label>
        {action}
      </div>
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onValueChange(event.target.value)}
        aria-describedby={hintId}
        className={cn(
          "min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 shadow-xs transition",
          "placeholder:text-slate-400 hover:border-slate-300",
          "focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none",
        )}
        {...props}
      />
      <div id={hintId} className="flex justify-between gap-3 text-xs text-slate-500">
        <span>{hint}</span>
        {maxLength !== undefined && (
          <span className="shrink-0 tabular-nums">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
