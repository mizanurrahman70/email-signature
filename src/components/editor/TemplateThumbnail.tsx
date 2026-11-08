import type { ReactNode } from "react";
import type { TemplateId } from "@/types/signature";
import { cn } from "@/utils/cn";

/**
 * Wireframe previews of each template's layout. They only need to convey
 * structure, so they're built from a few gray primitives, not real data.
 */
export function TemplateThumbnail({ templateId }: { templateId: TemplateId }) {
  return (
    <div aria-hidden="true" className="flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-white p-4">
      {THUMBNAILS[templateId]}
    </div>
  );
}

const THUMBNAILS: Record<TemplateId, ReactNode> = {
  classic: (
    <Row>
      <Avatar size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 border-l-2 border-slate-300 pl-3">
        <Line width="w-3/4" strong />
        <Line width="w-full" />
        <Line width="w-2/3" />
        <Dots />
      </div>
    </Row>
  ),
  stacked: (
    <div className="flex w-full flex-col gap-1.5">
      <LogoBox />
      <Row className="gap-2">
        <Avatar size="sm" />
        <div className="flex flex-col gap-1">
          <Line width="w-16" strong />
          <Line width="w-12" />
        </div>
      </Row>
      <Line width="w-full" />
      <Dots />
      <div className="h-1 w-full rounded bg-slate-300" />
    </div>
  ),
  split: (
    <div className="flex w-full flex-col gap-2">
      <Row className="gap-2">
        <Avatar size="sm" />
        <div className="flex flex-col gap-1.5">
          <Line width="w-7" strong />
          <Line width="w-5" />
          <Line width="w-6" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 border-l border-slate-300 pl-2">
          <IconLine width="w-5" />
          <IconLine width="w-5" />
          <IconLine width="w-5" />
        </div>
      </Row>
      <div className="h-px w-full bg-slate-200" />
      <LogoBox />
    </div>
  ),
  centered: (
    <div className="flex w-full flex-col items-center gap-1.5">
      <Avatar size="sm" />
      <Line width="w-16" strong />
      <Line width="w-24" />
      <Dots />
    </div>
  ),
  reversed: (
    <Row>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Line width="w-16" strong />
        <Line width="w-12" />
        <IconLine />
        <IconLine />
        <Dots />
      </div>
      <div className="flex flex-col items-center gap-1.5 border-l-2 border-slate-300 pl-3">
        <Avatar size="md" />
        <LogoBox />
      </div>
    </Row>
  ),
  minimal: (
    <div className="flex w-full flex-col gap-1.5">
      <Line width="w-20" strong />
      <Line width="w-28" />
      <Line width="w-full" />
      <Line width="w-16" />
    </div>
  ),
};

function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex w-full items-center gap-3", className)}>{children}</div>;
}

function Avatar({ size }: { size: "sm" | "md" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-end justify-center overflow-hidden rounded-full bg-slate-200",
        size === "sm" ? "size-8" : "size-11",
      )}
    >
      <div className={cn("rounded-t-full bg-slate-300", size === "sm" ? "h-3 w-5" : "h-4 w-7")} />
    </div>
  );
}

function Line({ width, strong }: { width: string; strong?: boolean }) {
  return <div className={cn("h-1.5 shrink-0 rounded-full", width, strong ? "bg-slate-400" : "bg-slate-200")} />;
}

function IconLine({ width = "w-8" }: { width?: string }) {
  return (
    <div className="flex w-full items-center gap-1">
      <div className="size-1.5 shrink-0 rounded-full bg-slate-400" />
      <Line width={width} />
    </div>
  );
}

function Dots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((index) => (
        <div key={index} className="size-2 rounded-full bg-slate-300" />
      ))}
    </div>
  );
}

function LogoBox() {
  return <div className="h-3 w-10 rounded bg-slate-200" />;
}
