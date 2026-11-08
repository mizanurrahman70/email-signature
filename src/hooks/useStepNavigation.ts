"use client";

import { useState } from "react";

/** Tracks the active step in an ordered list and exposes next/back helpers. */
export function useStepNavigation<T extends string>(stepIds: ReadonlyArray<T>) {
  const [activeId, setActiveId] = useState<T>(stepIds[0]);
  const activeIndex = Math.max(stepIds.indexOf(activeId), 0);

  return {
    activeId,
    activeIndex,
    setActiveId,
    isFirst: activeIndex === 0,
    isLast: activeIndex === stepIds.length - 1,
    next: () => setActiveId(stepIds[Math.min(activeIndex + 1, stepIds.length - 1)]),
    back: () => setActiveId(stepIds[Math.max(activeIndex - 1, 0)]),
  };
}
