"use client";

import { useEffect, type RefObject } from "react";

const LINE_HEIGHT_PX = 16;

/**
 * Wheel behaviour for a full-height "studio" with inner scroll areas, so one
 * continuous scroll goes from the top of the page to the footer:
 *
 * 1. Docking: while the studio is on its way to its docked position (top edge
 *    `dockTop` px from the viewport top), the wheel scrolls the page, not an
 *    inner panel, and the page stops exactly at the dock.
 * 2. Docked: the panel under the cursor scrolls; once it reaches its end, the
 *    page carries on in the same direction.
 *
 * Only active when `mediaQuery` matches (the desktop studio layout).
 */
export function useDockingWheel(ref: RefObject<HTMLElement | null>, dockTop: number, mediaQuery: string): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = window.matchMedia(mediaQuery);

    function handleWheel(event: WheelEvent) {
      if (!media.matches || event.ctrlKey) return; // ctrl+wheel is zoom

      const deltaY = event.deltaMode === 1 ? event.deltaY * LINE_HEIGHT_PX : event.deltaY;
      if (deltaY === 0) return;
      const distanceToDock = element!.getBoundingClientRect().top - dockTop;

      // 1. Docking: move the page toward the dock, never past it.
      const approachingFromBelow = deltaY > 0 && distanceToDock > 1;
      const approachingFromAbove = deltaY < 0 && distanceToDock < -1;
      if (approachingFromBelow || approachingFromAbove) {
        event.preventDefault();
        const step = approachingFromBelow ? Math.min(deltaY, distanceToDock) : Math.max(deltaY, distanceToDock);
        window.scrollBy({ top: step, behavior: "instant" });
        return;
      }

      // 2. Docked: let the panel scroll; at its end, continue scrolling the page.
      const panel = findScrollableAncestor(event.target, element!);
      if (!panel || !isAtEdge(panel, deltaY)) return; // Native scrolling handles it.

      event.preventDefault();
      window.scrollBy({ top: deltaY, behavior: "instant" });
    }

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [ref, dockTop, mediaQuery]);
}

/** Nearest vertically scrollable element between `target` and `boundary`. */
function findScrollableAncestor(target: EventTarget | null, boundary: HTMLElement): HTMLElement | null {
  let node = target instanceof HTMLElement ? target : null;
  while (node && node !== boundary) {
    const { overflowY } = getComputedStyle(node);
    if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight + 1) return node;
    node = node.parentElement;
  }
  return null;
}

function isAtEdge(panel: HTMLElement, deltaY: number): boolean {
  return deltaY > 0
    ? panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1
    : panel.scrollTop <= 0;
}
