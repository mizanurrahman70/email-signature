export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/60">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p>
            <span className="font-medium text-slate-700">Signature Studio</span>: free email signatures, no account needed.
          </p>
          <p>Your details stay in your browser. Uploaded images are hosted on Cloudinary.</p>
        </div>
        <p>
          Developed by{" "}
          <span className="font-semibold text-brand-800">Traideas</span>
        </p>
      </div>
    </footer>
  );
}
