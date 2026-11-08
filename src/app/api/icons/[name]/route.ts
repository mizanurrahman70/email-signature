import type { NextRequest } from "next/server";
import { CONTACT_ICON_NAMES } from "@/constants/signature-options";
import { renderContactIconPng } from "@/services/icon-renderer";
import type { ContactIconName } from "@/types/signature";
import { isHexColor } from "@/utils/color";

/** One year; a given name + color always produces the same image. */
const CACHE_CONTROL = "public, max-age=31536000, s-maxage=31536000, immutable";

/** GET /api/icons/phone?color=1d4ed8 → accent-colored PNG for email signatures. */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/icons/[name]">) {
  const { name } = await ctx.params;
  const color = `#${request.nextUrl.searchParams.get("color") ?? ""}`;

  if (!isContactIconName(name) || !isHexColor(color)) {
    return new Response("Not found", { status: 404 });
  }

  const png = await renderContactIconPng(name, color);
  return new Response(png as BodyInit, {
    headers: { "Content-Type": "image/png", "Cache-Control": CACHE_CONTROL },
  });
}

function isContactIconName(value: string): value is ContactIconName {
  return (CONTACT_ICON_NAMES as readonly string[]).includes(value);
}
