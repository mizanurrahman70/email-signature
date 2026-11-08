/** Prerendered placeholder shaped like the studio, shown until the browser-only editor mounts. */
export function EditorSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading signature editor"
      className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-studio ring-1 ring-slate-900/5 lg:h-[820px] lg:flex-row"
    >
      <div className="flex gap-2 bg-brand-900 p-2 lg:w-[92px] lg:flex-col lg:px-2.5 lg:py-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex min-w-[76px] flex-col items-center gap-1.5 py-2.5">
            <div className="size-9 animate-pulse rounded-lg bg-white/10" />
            <div className="h-2 w-10 animate-pulse rounded bg-white/10" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 border-slate-200 p-6 lg:w-[420px] lg:border-r">
        <div className="space-y-2">
          <div className="h-2.5 w-20 animate-pulse rounded bg-brand-100" />
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-64 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>

      <div className="bg-dots flex flex-1 items-start justify-center bg-slate-50 p-8 lg:p-12">
        <div className="h-80 w-full max-w-[680px] animate-pulse rounded-2xl bg-white shadow-window ring-1 ring-slate-900/5" />
      </div>
    </div>
  );
}
