/**
 * First family in a CSS font-family list: "'Great Vibes', 'Great Vibes Fallback'" → "'Great Vibes'".
 * Quotes are kept so the result is valid in a CSS `font` shorthand.
 */
export function getPrimaryFontFamily(fontFamilyList: string): string {
  return fontFamilyList.split(",")[0]?.trim() ?? fontFamilyList;
}

/**
 * Waits for a web font to be ready before drawing it on a canvas.
 *
 * Only the primary family is loaded: next/font's generated "… Fallback" faces
 * use `local("Arial")`, which rejects with "A network error occurred." on
 * systems without Arial (common on Linux). A failed load is not fatal; the
 * canvas then draws with whatever font is available.
 */
export async function ensureFontLoaded(fontFamilyList: string, sizePx: number, sampleText: string): Promise<void> {
  try {
    await document.fonts.load(`${sizePx}px ${getPrimaryFontFamily(fontFamilyList)}`, sampleText);
  } catch {
    // Fall through: rendering still works, just possibly in a fallback font.
  }
}
