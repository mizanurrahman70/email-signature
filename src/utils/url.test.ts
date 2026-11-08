import { describe, expect, it } from "vitest";
import { normalizeWebUrl, toDisplayUrl, toMailtoHref, toTelHref } from "./url";

describe("normalizeWebUrl", () => {
  it("adds https to bare domains", () => {
    expect(normalizeWebUrl("acme.com")).toBe("https://acme.com/");
  });

  it("keeps existing http(s) URLs", () => {
    expect(normalizeWebUrl("http://acme.com/about")).toBe("http://acme.com/about");
  });

  it("rejects non-web protocols", () => {
    expect(normalizeWebUrl("javascript:alert(1)")).toBe("");
    expect(normalizeWebUrl("data:image/png;base64,abc")).toBe("");
  });

  it("returns empty for blank input", () => {
    expect(normalizeWebUrl("   ")).toBe("");
  });
});

describe("toDisplayUrl", () => {
  it("strips protocol, www and trailing slash", () => {
    expect(toDisplayUrl("https://www.acme.com/")).toBe("acme.com");
  });
});

describe("toTelHref", () => {
  it("keeps only digits and plus", () => {
    expect(toTelHref("+1 (555) 010-2030")).toBe("tel:+15550102030");
  });
});

describe("toMailtoHref", () => {
  it("builds mailto for valid emails only", () => {
    expect(toMailtoHref(" jane@acme.com ")).toBe("mailto:jane@acme.com");
    expect(toMailtoHref("not-an-email")).toBe("");
  });
});
