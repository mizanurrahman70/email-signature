import { Card } from "@/components/ui/Card";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { INSTALL_GUIDES } from "@/constants/install-guides";
import type { InstallGuide } from "@/types/install-guide";

const GUIDE_TABS: ReadonlyArray<TabItem> = INSTALL_GUIDES.map((guide) => ({
  id: guide.id,
  label: guide.client,
  content: <GuideSteps guide={guide} />,
}));

/** Server component: the steps are prerendered and indexable. */
export function InstallGuides() {
  return (
    <Card title="Add it to your email" description="Copy your signature, then follow the steps for your email app.">
      <Tabs items={GUIDE_TABS} label="Email app" />
    </Card>
  );
}

function GuideSteps({ guide }: { guide: InstallGuide }) {
  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col gap-3">
        {guide.steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm text-slate-700">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
      {guide.tip && <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">{guide.tip}</p>}
    </div>
  );
}
