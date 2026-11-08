import { PenLine } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur-lg">
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-brand-500">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-900 text-white shadow-sm">
            <PenLine className="size-4" strokeWidth={2.25} aria-hidden="true" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-900">Signature Studio</span>
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 text-[13px] font-medium text-slate-600">
          <a href="#studio" className="hidden rounded-lg px-3 py-1.5 hover:bg-slate-100 hover:text-slate-900 sm:block">
            Editor
          </a>
          <a href="#install" className="hidden rounded-lg px-3 py-1.5 hover:bg-slate-100 hover:text-slate-900 sm:block">
            How to install
          </a>
          <span className="ml-2 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 ring-1 ring-inset ring-brand-200">
            100% free
          </span>
        </nav>
      </div>
    </header>
  );
}
