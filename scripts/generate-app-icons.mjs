/**
 * Generates the site's favicons from one logo definition (a white pen on a
 * solid brand-color tile, matching the header logo):
 *   src/app/icon.svg       — modern browsers
 *   src/app/favicon.ico    — legacy browsers (16/32/48px PNGs in an ICO wrapper)
 *   src/app/apple-icon.png — iOS home screen (180px, square; iOS rounds it)
 *
 * Run: npm run app-icons
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const APP_DIR = path.join(import.meta.dirname, "..", "src", "app");

/** Keep in sync with --color-brand-900 in src/app/globals.css. */
const BRAND_COLOR = "#183d39";

/** Lucide "pen-line" (ISC), 24x24. */
const PEN_PATHS = [
  "M12 20h9",
  "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
];

function buildLogoSvg({ size, radius }) {
  const glyph = size * 0.56;
  const offset = (size - glyph) / 2;
  const paths = PEN_PATHS.map((d) => `<path d="${d}"/>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BRAND_COLOR}"/>
  <g transform="translate(${offset} ${offset}) scale(${glyph / 24})" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>`;
}

/** Packs PNG buffers into an ICO file (PNG-in-ICO is supported by all current browsers). */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

const renderPng = (svg) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

const iconSvg = buildLogoSvg({ size: 64, radius: 14 });
await writeFile(path.join(APP_DIR, "icon.svg"), iconSvg);

const icoImages = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, png: await renderPng(buildLogoSvg({ size, radius: size * 0.22 })) })),
);
await writeFile(path.join(APP_DIR, "favicon.ico"), buildIco(icoImages));

await writeFile(path.join(APP_DIR, "apple-icon.png"), await renderPng(buildLogoSvg({ size: 180, radius: 0 })));

console.log("✓ src/app/icon.svg, src/app/favicon.ico, src/app/apple-icon.png");
