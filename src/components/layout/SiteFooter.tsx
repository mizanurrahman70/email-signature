import { cacheLife } from "next/cache";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/60">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:px-6">
        <p>
          © <CopyrightYear /> Signature Studio. All rights reserved.
        </p>
        <p>
          Developed by <span className="font-semibold text-brand-800">Traideas</span>
        </p>
      </div>
    </footer>
  );
}

/** Captured in the static page and refreshed daily, so the year rolls over on its own. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
