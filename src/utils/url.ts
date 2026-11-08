const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Turns user input like "acme.com" into an absolute https URL.
 * Returns an empty string for anything that is not a valid http(s) URL,
 * which keeps `javascript:` and similar links out of the signature.
 */
export function normalizeWebUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const withProtocol = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

/** Strips the protocol and trailing slash for display: "https://acme.com/" -> "acme.com". */
export function toDisplayUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
}

export function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function toMailtoHref(email: string): string {
  const trimmed = email.trim();
  return isValidEmail(trimmed) ? `mailto:${trimmed}` : "";
}

/** Resolves `path` against `baseUrl`; returns "" if either is invalid. */
export function toAbsoluteUrl(path: string, baseUrl: string): string {
  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return "";
  }
}
