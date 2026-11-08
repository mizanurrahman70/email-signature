import { ImageIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { TemplateId } from "@/types/signature";
import { cn } from "@/utils/cn";

interface TemplateThumbnailProps {
  templateId: TemplateId;
  /** The user's accent color, so thumbnails preview their brand. */
  accent: string;
}

/**
 * A wireframe of each template's layout, drawn with a handful of skeleton
 * primitives. Accent-colored parts mirror where the template uses the accent.
 */
export function TemplateThumbnail({ templateId, accent }: TemplateThumbnailProps) {
  return (
    <div
      aria-hidden="true"
      style={{ "--accent": accent } as CSSProperties}
      className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl bg-white px-4 shadow-xs ring-1 ring-slate-900/5"
    >
      {LAYOUTS[templateId]}
    </div>
  );
}

const LAYOUTS: Record<TemplateId, ReactNode> = {
  classic: (
    <Row>
      <Avatar size={34} />
      <Stack className="border-l-2 border-[var(--accent)] pl-2.5">
        <NameBar width={44} />
        <Line width={56} />
        <Gap />
        <Line width={48} />
        <Line width={40} />
        <SocialDots />
      </Stack>
    </Row>
  ),
  stacked: (
    <Stack className="w-full">
      <Logo width={30} />
      <Row className="gap-2">
        <Avatar size={20} />
        <Stack>
          <NameBar width={46} />
          <Line width={34} />
        </Stack>
      </Row>
      <Line width={96} />
      <SocialDots />
      <div className="mt-0.5 h-[3px] w-full rounded-full bg-[var(--accent)]" />
    </Stack>
  ),
  split: (
    <Stack className="w-full gap-2">
      <Row className="gap-2">
        <Avatar size={30} />
        <Stack>
          <NameBar width={30} tone="ink" />
          <Line width={24} />
          <Line width={28} />
        </Stack>
        <Stack className="border-l border-slate-200 pl-2">
          <IconLine width={30} />
          <IconLine width={26} />
          <IconLine width={32} />
        </Stack>
      </Row>
      <div className="h-px w-full bg-slate-200" />
      <Logo width={26} />
    </Stack>
  ),
  centered: (
    <Stack className="items-center">
      <Avatar size={24} />
      <NameBar width={44} />
      <Line width={60} />
      <Line width={72} />
      <SocialDots />
    </Stack>
  ),
  reversed: (
    <Row>
      <Stack>
        <NameBar width={42} />
        <Line width={36} />
        <Gap />
        <IconLine width={34} />
        <IconLine width={30} />
        <SocialDots />
      </Stack>
      <Stack className="items-center border-l-2 border-[var(--accent)] pl-2.5">
        <Avatar size={30} square />
        <Logo width={26} />
      </Stack>
    </Row>
  ),
  minimal: (
    <Stack className="w-full">
      <NameBar width={52} tone="ink" />
      <Line width={72} />
      <Gap />
      <Line width={100} />
      <Line width={64} />
      <Row className="gap-1">
        {[18, 22, 16].map((width) => (
          <div key={width} className="h-1 rounded-full bg-[var(--accent)] opacity-70" style={{ width }} />
        ))}
      </Row>
    </Stack>
  ),
  banner: (
    <Stack className="w-full gap-0">
      <Row className="gap-2 rounded-t-md bg-[var(--accent)] px-2 py-1.5">
        <Avatar size={20} />
        <Stack className="gap-[4px]">
          <div className="h-[6px] w-11 rounded-full bg-white" />
          <div className="h-[4px] w-14 rounded-full bg-white/60" />
        </Stack>
      </Row>
      <Row className="items-end justify-between rounded-b-md px-2 py-1.5 ring-1 ring-slate-200">
        <Stack className="gap-[4px]">
          <IconLine width={30} />
          <IconLine width={26} />
          <SocialDots />
        </Stack>
        <Logo width={20} />
      </Row>
    </Stack>
  ),
  compact: (
    <Row className="w-full items-start gap-2">
      <Avatar size={18} square />
      <Stack>
        <Row className="gap-1.5">
          <NameBar width={30} />
          <Line width={36} />
        </Row>
        <Line width={84} />
        <SocialDots />
      </Stack>
    </Row>
  ),
  boxed: (
    <Stack className="w-full gap-1.5 rounded-md border-l-[3px] border-[var(--accent)] px-2 py-1.5 ring-1 ring-slate-200">
      <Row className="gap-2">
        <Avatar size={24} square />
        <Stack className="gap-[4px]">
          <NameBar width={36} />
          <Line width={30} />
          <IconLine width={28} />
        </Stack>
      </Row>
      <Row className="justify-between border-t border-slate-200 pt-1">
        <SocialDots />
        <Logo width={18} />
      </Row>
    </Stack>
  ),
  corporate: (
    <Row>
      <div className="flex h-7 w-11 shrink-0 items-center justify-center rounded bg-slate-100 ring-1 ring-slate-900/5">
        <ImageIcon className="size-3 text-slate-300" strokeWidth={2.5} />
      </div>
      <Stack className="border-l-2 border-[var(--accent)] pl-2.5">
        <NameBar width={42} />
        <Line width={36} />
        <Gap />
        <Line width={52} />
        <SocialDots />
      </Stack>
    </Row>
  ),
};

function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-3", className)}>{children}</div>;
}

function Stack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-[5px]", className)}>{children}</div>;
}

function Gap() {
  return <div className="h-0.5" />;
}

/** Circular photo placeholder with a person silhouette. */
function Avatar({ size, square = false }: { size: number; square?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-end justify-center overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 ring-1 ring-slate-900/5",
        square ? "rounded-none" : "rounded-full",
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" className="w-[78%] text-slate-300" fill="currentColor">
        <circle cx="12" cy="9" r="4.5" />
        <path d="M3 24c0-5 4-8.5 9-8.5s9 3.5 9 8.5z" />
      </svg>
    </div>
  );
}

function NameBar({ width, tone = "accent" }: { width: number; tone?: "accent" | "ink" }) {
  return (
    <div
      className={cn("h-[7px] rounded-full", tone === "accent" ? "bg-[var(--accent)]" : "bg-slate-700")}
      style={{ width }}
    />
  );
}

function Line({ width }: { width: number }) {
  return <div className="h-[5px] shrink-0 rounded-full bg-slate-200" style={{ width }} />;
}

function IconLine({ width }: { width: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="size-[5px] shrink-0 rounded-full bg-[var(--accent)] opacity-80" />
      <Line width={width} />
    </div>
  );
}

const SOCIAL_COLORS = ["#0A66C2", "#111827", "#E1306C"] as const;

function SocialDots() {
  return (
    <div className="mt-0.5 flex gap-[3px]">
      {SOCIAL_COLORS.map((color) => (
        <div key={color} className="size-[7px] rounded-full" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

function Logo({ width }: { width: number }) {
  return (
    <div
      className="flex h-3 shrink-0 items-center justify-center rounded-[3px] bg-slate-100 ring-1 ring-slate-900/5"
      style={{ width }}
    >
      <ImageIcon className="size-2 text-slate-300" strokeWidth={2.5} />
    </div>
  );
}
