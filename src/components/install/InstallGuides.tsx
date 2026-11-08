import { Lightbulb } from "lucide-react";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { INSTALL_GUIDES } from "@/constants/install-guides";
import type { InstallGuide } from "@/types/install-guide";

const GUIDE_TABS: ReadonlyArray<TabItem> = INSTALL_GUIDES.map((guide) => ({
  id: guide.id,
  label: guide.client,
  content: <GuideSteps guide={guide} />,
}));

/** Server component: the steps are prerendered and indexable. */
export function InstallGuides({ id }: { id: string }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-indigo-600 uppercase">Last step</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Add it to your email</h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate-600">
            Click <span className="font-medium text-slate-900">Copy signature</span> in the editor, then paste it into
            your email app&apos;s signature settings. Formatting, links and images come along.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-studio ring-1 ring-slate-900/5 sm:p-8">
          <Tabs items={GUIDE_TABS} label="Email app" />
        </div>
      </div>
    </section>
  );
}

function GuideSteps({ guide }: { guide: InstallGuide }) {
  return (
    <div className="flex flex-col gap-5">
      <ol className="relative flex flex-col gap-4">
        {guide.steps.map((step, index) => (
          <li key={step} className="flex gap-3.5 text-sm text-slate-700">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
              {index + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
      {guide.tip && (
        <p className="flex gap-2.5 rounded-xl bg-slate-50 px-4 py-3 text-[13px] text-slate-600 ring-1 ring-inset ring-slate-200/70">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden="true" />
          {guide.tip}
        </p>
      )}
    </div>
  );
}
