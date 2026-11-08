/**
 * Generates the placeholder photo and logo shown in the live preview until
 * the user adds their own images. They're never copied into a signature.
 *
 * Rendered at 2x the display size for retina screens.
 *
 * Run: npm run placeholders
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUTPUT_DIR = path.join(import.meta.dirname, "..", "public", "placeholders");
const BACKGROUND = "#eef2f7";
const GLYPH = "#cbd5e1";

/** 24x24 "image" glyph: a sun and a mountain. */
function imageGlyph(x, y, size) {
  const scale = size / 24;
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${GLYPH}">
    <circle cx="6" cy="6" r="2.6"/>
    <path d="M1.5 21.5 9 13l4 4.2 6.2-7.7 3.3 3.6v8.4z" stroke="${GLYPH}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>`;
}

const PLACEHOLDERS = [
  {
    name: "photo",
    width: 192,
    height: 192,
    body: `<circle cx="96" cy="96" r="96" fill="${BACKGROUND}"/>${imageGlyph(52, 52, 88)}`,
  },
  {
    name: "logo",
    width: 280,
    height: 80,
    body: `<rect width="280" height="80" rx="8" fill="${BACKGROUND}"/>${imageGlyph(122, 22, 36)}`,
  },
];

await mkdir(OUTPUT_DIR, { recursive: true });

await Promise.all(
  PLACEHOLDERS.map(async ({ name, width, height, body }) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
    const file = path.join(OUTPUT_DIR, `${name}.png`);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
    console.log(`✓ ${path.relative(process.cwd(), file)}`);
  }),
);
