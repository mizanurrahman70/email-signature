import type { RenderOptions } from "@/types/signature";

/**
 * Public origin that serves /public assets (social icons). Set
 * NEXT_PUBLIC_SITE_URL to pin it; otherwise the current origin is used.
 * Browser-only when the env var is unset.
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
}

/** Copy/export options. Pass `showPlaceholders` only for the live preview. */
export function getRenderOptions(overrides: Partial<RenderOptions> = {}): RenderOptions {
  return { assetBaseUrl: getSiteUrl(), ...overrides };
}
