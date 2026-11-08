const HEX_COLOR_PATTERN = /^#[\da-f]{6}$/i;

export function isHexColor(value: string): boolean {
  return HEX_COLOR_PATTERN.test(value);
}

/** Returns `value` when it is a 6-digit hex color, otherwise `fallback`. */
export function safeHexColor(value: string, fallback: string): string {
  return isHexColor(value) ? value : fallback;
}

/** Case-insensitive hex comparison: "#1D4ED8" equals "#1d4ed8". */
export function isSameColor(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
