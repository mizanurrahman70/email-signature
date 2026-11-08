import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  /** Icon or image shown inside the input, before the text. */
  leading?: ReactNode;
  hint?: string;
}

export function TextField({ label, value, onValueChange, leading, hint, className, ...inputProps }: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {leading && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{leading}</span>
        )}
        <input
          id={id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          aria-describedby={hint ? hintId : undefined}
          className={cn(
            "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-xs transition",
            "placeholder:text-slate-400 hover:border-slate-300",
            "focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none",
            Boolean(leading) && "pl-10",
          )}
          {...inputProps}
        />
      </div>
      {hint && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}
