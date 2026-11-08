/**
 * Generates the brand-colored social icons used in signatures.
 *
 * Email clients (Gmail, Outlook) don't render SVG, so icons ship as PNGs in
 * public/social-icons/. They're rendered at 3x (72px) for sharp display at
 * 24px on retina screens.
 *
 * Run: npm run icons
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { siFacebook, siGithub, siInstagram, siX, siYoutube } from "simple-icons";

const SIZE = 72;
const GLYPH_SCALE = 0.55;
const OUTPUT_DIR = path.join(import.meta.dirname, "..", "public", "social-icons");

/** simple-icons dropped LinkedIn at the brand's request; this is a 24x24 "in" mark. */
const LINKEDIN_PATH =
  "M5 9h3v10H5zM6.5 4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10 9h2.9v1.4c.4-.8 1.4-1.6 3-1.6 3.1 0 3.6 2 3.6 4.7V19h-3v-4.9c0-1.2 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5v5H10z";

const INSTAGRAM_GRADIENT = `
  <radialGradient id="bg" cx="30%" cy="107%" r="150%">
    <stop offset="0" stop-color="#fdf497"/>
    <stop offset="0.05" stop-color="#fdf497"/>
    <stop offset="0.45" stop-color="#fd5949"/>
    <stop offset="0.6" stop-color="#d6249f"/>
    <stop offset="0.9" stop-color="#285AEB"/>
  </radialGradient>`;

const ICONS = [
  { name: "linkedin", path: LINKEDIN_PATH, background: "#0A66C2" },
  { name: "x", path: siX.path, background: `#${siX.hex}` },
  { name: "facebook", path: siFacebook.path, background: `#${siFacebook.hex}` },
  { name: "instagram", path: siInstagram.path, background: "url(#bg)", defs: INSTAGRAM_GRADIENT },
  { name: "youtube", path: siYoutube.path, background: `#${siYoutube.hex}` },
  { name: "github", path: siGithub.path, background: `#${siGithub.hex}` },
];

function buildSvg({ path: glyphPath, background, defs = "" }) {
  const glyphSize = SIZE * GLYPH_SCALE;
  const offset = (SIZE - glyphSize) / 2;
  const scale = glyphSize / 24;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>${defs}</defs>
  <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="${background}"/>
  <path d="${glyphPath}" fill="#ffffff" transform="translate(${offset} ${offset}) scale(${scale})"/>
</svg>`;
}

await mkdir(OUTPUT_DIR, { recursive: true });

await Promise.all(
  ICONS.map(async (icon) => {
    const file = path.join(OUTPUT_DIR, `${icon.name}.png`);
    await sharp(Buffer.from(buildSvg(icon))).png({ compressionLevel: 9 }).toFile(file);
    console.log(`✓ ${path.relative(process.cwd(), file)}`);
  }),
);
