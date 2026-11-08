import type { ReactNode } from "react";

interface EmailWindowProps {
  width: number;
  children: ReactNode;
}

/** A realistic "new message" window that frames the signature preview. */
export function EmailWindow({ width, children }: EmailWindowProps) {
  return (
    <div
      className="mx-auto w-full overflow-hidden rounded-2xl bg-white shadow-window ring-1 ring-slate-900/5 transition-[max-width] duration-300 ease-out"
      style={{ maxWidth: width }}
    >
      <div className="flex items-center gap-2 bg-ink-900 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs font-medium text-slate-400">New message</span>
      </div>

      <dl className="divide-y divide-slate-100 border-b border-slate-100 text-[13px]">
        <div className="flex items-center gap-3 px-5 py-2.5">
          <dt className="w-14 text-slate-400">To</dt>
          <dd>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
              Your recipient
            </span>
          </dd>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5">
          <dt className="w-14 text-slate-400">Subject</dt>
          <dd className="font-medium text-slate-800">Check out my new email signature</dd>
        </div>
      </dl>

      <div className="px-5 pt-5 pb-6">
        <div aria-hidden="true" className="mb-7 space-y-2.5">
          <div className="h-2 w-full rounded-full bg-slate-100" />
          <div className="h-2 w-11/12 rounded-full bg-slate-100" />
          <div className="h-2 w-3/5 rounded-full bg-slate-100" />
        </div>
        {children}
      </div>
    </div>
  );
}
