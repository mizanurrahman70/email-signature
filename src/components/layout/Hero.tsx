import { CheckCircle2 } from "lucide-react";
import { FreeSeal } from "./FreeSeal";

const HIGHLIGHTS = ["Gmail, Outlook & Apple Mail", "10 professional templates", "Images hosted for you"] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 mx-auto h-[420px] max-w-4xl rounded-full bg-brand-100/60 blur-3xl"
      />
      <FreeSeal />
      <div className="mx-auto max-w-3xl px-4 pt-14 pb-10 text-center sm:px-6 lg:pt-20 lg:pb-14">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/80 py-1 pr-3 pl-1 text-xs font-medium text-brand-800 shadow-xs ring-1 ring-brand-100">
          <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">100% free</span>
          No sign-up · No watermark
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
          A signature that looks{" "}
          <span className="text-brand-700">professional</span>{" "}
          in every inbox
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-slate-600 sm:text-lg">
          Pick a template, add your details, and copy it into your email app. It takes about two minutes.
        </p>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-slate-600">
          {HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-brand-600" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
