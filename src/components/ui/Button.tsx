import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "brand" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-ink-950 text-white shadow-sm hover:bg-ink-800 disabled:bg-slate-300",
  brand:
    "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-600/30 ring-1 ring-inset ring-white/10 hover:from-indigo-500 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none",
  secondary:
    "bg-white text-slate-800 shadow-xs ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 disabled:text-slate-400",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-300",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-10 gap-2 rounded-xl px-4 text-sm",
  lg: "h-11 gap-2 rounded-xl px-5 text-sm",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed",
        "active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
}
