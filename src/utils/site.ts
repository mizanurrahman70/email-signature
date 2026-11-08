import type { RenderOptions } from "@/types/signature";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);

/**
 * Public origin that serves /public assets (social icons). Set
 * NEXT_PUBLIC_SITE_URL to pin it; otherwise the current origin is used.
 * Browser-only when the env var is unset.
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
}

export function getRenderOptions(): RenderOptions {
  return { assetBaseUrl: getSiteUrl() };
}

/** True for URLs that email recipients can't reach (e.g. dev servers). */
export function isLocalUrl(url: string): boolean {
  try {
    return LOCAL_HOSTNAMES.has(new URL(url).hostname);
  } catch {
    return false;
  }
}
