const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapes text for safe use in HTML content and quoted attributes. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export type InlineStyle = Record<string, string | number | undefined>;

/** Converts a camelCase style object to an inline `style` attribute value. */
export function toInlineStyle(style: InlineStyle): string {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${toKebabCase(key)}:${value}`)
    .join(";");
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

/** Joins non-empty HTML fragments. */
export function joinHtml(parts: ReadonlyArray<string | false | null | undefined>, separator = ""): string {
  return parts.filter(Boolean).join(separator);
}

/**
 * A standalone HTML document for previewing email markup in an iframe,
 * isolated from the app's CSS the way an email client would show it.
 * Links open in a new tab.
 */
export function buildPreviewDocument(bodyHtml: string, { editable = false } = {}): string {
  return [
    "<!doctype html>",
    '<html><head><meta charset="utf-8"><base target="_blank">',
    // overflow:hidden: the iframe is sized to fit, so it never needs scroll bars
    // (which would also steal space and throw off the fit-to-width zoom).
    "<style>html,body{margin:0;padding:0;background:#ffffff}html{overflow:hidden}",
    editable ? EDITABLE_PREVIEW_CSS : "",
    "</style>",
    `</head><body>${bodyHtml}</body></html>`,
  ].join("");
}

/**
 * Space around the editable preview so hover outlines (drawn outside each part)
 * aren't clipped at the iframe's edges. The iframe is shifted out by the same
 * amount, so the signature stays aligned with the surrounding email.
 */
export const EDITABLE_PREVIEW_GUTTER = 6;

/** Hover outline for click-to-edit parts (`data-edit`) in the preview only. */
const EDITABLE_PREVIEW_CSS = [
  `body{cursor:pointer;padding:${EDITABLE_PREVIEW_GUTTER}px}`,
  "[data-edit]{cursor:pointer;outline:2px solid transparent;outline-offset:2px;transition:outline-color .15s,background-color .15s}",
  // Images keep their own shape (round or square photo); only text gets soft corners.
  "[data-edit]:not(img){border-radius:4px}",
  "[data-edit]:hover{outline-color:rgba(54,138,126,.55);background-color:rgba(54,138,126,.07)}",
].join("");
