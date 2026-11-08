/** Prerendered placeholder shown until the browser-only editor mounts. */
export function EditorSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2" aria-busy="true" aria-label="Loading signature editor">
      <SkeletonCard rows={6} />
      <SkeletonCard rows={4} />
    </div>
  );
}

function SkeletonCard({ rows }: { rows: number }) {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-2 h-5 w-40 rounded bg-slate-200" />
      <div className="mb-6 h-4 w-64 rounded bg-slate-100" />
      <div className="mb-6 h-9 rounded-lg bg-slate-100" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="h-9 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
