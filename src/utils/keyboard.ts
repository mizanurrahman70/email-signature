/**
 * Roving-focus index for a horizontal list (WAI-ARIA tabs pattern).
 * Returns the index to focus for `key`, wrapping at both ends,
 * or null when the key isn't a navigation key.
 */
export function getRovingIndex(key: string, currentIndex: number, count: number): number | null {
  const targets: Record<string, number> = {
    ArrowRight: currentIndex + 1,
    ArrowLeft: currentIndex - 1,
    Home: 0,
    End: count - 1,
  };

  if (!(key in targets) || count === 0) return null;
  return (targets[key] + count) % count;
}
