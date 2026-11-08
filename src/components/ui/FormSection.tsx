import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface FormSectionProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

/** Groups related fields under a small uppercase heading. */
export function FormSection({ title, description, className, children }: FormSectionProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <header>
        <h3 className="text-[11px] font-semibold tracking-[0.08em] text-slate-400 uppercase">{title}</h3>
        {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      </header>
      {children}
    </section>
  );
}
