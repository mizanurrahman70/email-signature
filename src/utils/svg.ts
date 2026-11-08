/** Wraps 24x24 stroke-icon markup in a sized, colored SVG document. */
export function buildStrokeIconSvg(innerMarkup: string, color: string, size: number): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"`,
    ` fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
    innerMarkup,
    "</svg>",
  ].join("");
}
