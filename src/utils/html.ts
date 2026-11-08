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
