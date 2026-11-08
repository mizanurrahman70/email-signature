export type RovingOrientation = "horizontal" | "vertical" | "both";

const PREVIOUS_KEYS: Record<RovingOrientation, ReadonlyArray<string>> = {
  horizontal: ["ArrowLeft"],
  vertical: ["ArrowUp"],
  both: ["ArrowLeft", "ArrowUp"],
};

const NEXT_KEYS: Record<RovingOrientation, ReadonlyArray<string>> = {
  horizontal: ["ArrowRight"],
  vertical: ["ArrowDown"],
  both: ["ArrowRight", "ArrowDown"],
};

/**
 * Roving-focus index for a list of tabs (WAI-ARIA tabs pattern).
 * Returns the index to focus for `key`, wrapping at both ends,
 * or null when the key isn't a navigation key for this orientation.
 */
export function getRovingIndex(
  key: string,
  currentIndex: number,
  count: number,
  orientation: RovingOrientation = "horizontal",
): number | null {
  if (count === 0) return null;

  if (PREVIOUS_KEYS[orientation].includes(key)) return (currentIndex - 1 + count) % count;
  if (NEXT_KEYS[orientation].includes(key)) return (currentIndex + 1) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}
