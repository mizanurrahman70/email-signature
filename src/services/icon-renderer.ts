import "server-only";

import sharp from "sharp";
import { CONTACT_ICON_RENDER_SIZE, CONTACT_ICON_SVG } from "@/constants/contact-icons";
import type { ContactIconName } from "@/types/signature";
import { buildStrokeIconSvg } from "@/utils/svg";

/** Rasterizes a contact icon in `color` (a validated #rrggbb) to PNG. */
export async function renderContactIconPng(name: ContactIconName, color: string): Promise<Uint8Array> {
  const svg = buildStrokeIconSvg(CONTACT_ICON_SVG[name], color, CONTACT_ICON_RENDER_SIZE);
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Uint8Array(png);
}
