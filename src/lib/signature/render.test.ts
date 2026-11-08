import { describe, expect, it } from "vitest";
import { TEMPLATE_IDS } from "@/constants/signature-options";
import { DEFAULT_SIGNATURE } from "@/constants/signature-defaults";
import { renderSignatureHtml, renderSignatureText } from "./render";
import { parseSignatureState } from "./schema";
import type { RenderOptions, SignatureState } from "@/types/signature";

const OPTIONS: RenderOptions = { assetBaseUrl: "https://signatures.example.com" };

function withState(overrides: Partial<{ [K in keyof SignatureState]: Partial<SignatureState[K]> }>): SignatureState {
  return {
    details: { ...DEFAULT_SIGNATURE.details, ...overrides.details },
    social: { ...DEFAULT_SIGNATURE.social, ...overrides.social },
    images: { ...DEFAULT_SIGNATURE.images, ...overrides.images },
    style: { ...DEFAULT_SIGNATURE.style, ...overrides.style },
  };
}

describe("renderSignatureHtml", () => {
  it.each(TEMPLATE_IDS)("renders the %s template with contact links", (templateId) => {
    const html = renderSignatureHtml(withState({ style: { templateId } }), OPTIONS);

    expect(html).toContain("Jane Cooper");
    expect(html).toContain('href="mailto:jane@acme.com"');
    expect(html).toContain('href="tel:+15550102030"');
    expect(html).toContain('href="https://acme.com/"');
    expect(html).toContain('href="https://linkedin.com/in/janecooper"');
  });

  it("links social profiles with hosted brand icons", () => {
    const html = renderSignatureHtml(withState({ social: { github: "github.com/jane" } }), OPTIONS);

    expect(html).toContain('src="https://signatures.example.com/social-icons/linkedin.png"');
    expect(html).toContain('src="https://signatures.example.com/social-icons/github.png"');
    expect(html).toContain('alt="GitHub"');
    expect(html).not.toContain("social-icons/x.png");
  });

  it.each(TEMPLATE_IDS)("shows pronouns, department and both phone numbers in %s", (templateId) => {
    const html = renderSignatureHtml(
      withState({
        details: { pronouns: "she/her", department: "Growth", mobile: "+1 555 999 0000" },
        style: { templateId },
      }),
      OPTIONS,
    );

    expect(html).toContain("she/her");
    expect(html).toContain("Growth");
    expect(html).toContain('href="tel:+15559990000"');
  });

  it.each(["split", "reversed"] as const)("uses accent-colored contact icons in %s", (templateId) => {
    const html = renderSignatureHtml(withState({ style: { templateId, primaryColor: "#BE123C" } }), OPTIONS);

    expect(html).toContain('src="https://signatures.example.com/api/icons/phone?color=be123c"');
    expect(html).toContain('src="https://signatures.example.com/api/icons/email?color=be123c"');
  });

  it("renders minimal without any images", () => {
    const html = renderSignatureHtml(
      withState({ style: { templateId: "minimal" }, images: { photo: "https://x.com/p.png", logo: "https://x.com/l.png" } }),
      OPTIONS,
    );

    expect(html).not.toContain("<img");
    expect(html).toContain(">LinkedIn</a>");
  });

  it("escapes user input", () => {
    const html = renderSignatureHtml(withState({ details: { fullName: '<script>alert("x")</script>' } }), OPTIONS);

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("drops unsafe links and image URLs", () => {
    const html = renderSignatureHtml(
      withState({
        social: { x: "javascript:alert(1)" },
        images: { photo: "http://insecure.example/photo.png", logo: "data:image/png;base64,abc" },
      }),
      OPTIONS,
    );

    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("insecure.example");
    expect(html).not.toContain("data:image");
    expect(html).not.toContain("social-icons/x.png");
  });

  it("falls back to defaults for invalid style values", () => {
    const html = renderSignatureHtml(withState({ style: { primaryColor: "red;background:url(x)", fontFamily: "Comic" } }), OPTIONS);

    expect(html).toContain(DEFAULT_SIGNATURE.style.primaryColor);
    expect(html).not.toContain("url(x)");
    expect(html).not.toContain("Comic");
  });

  it("includes https images", () => {
    const html = renderSignatureHtml(withState({ images: { logo: "https://res.cloudinary.com/demo/logo.png" } }), OPTIONS);
    expect(html).toContain('src="https://res.cloudinary.com/demo/logo.png"');
  });

  it("shows placeholder images only when asked (preview), never by default (copy)", () => {
    const state = withState({ images: { photo: "", logo: "" } });
    const preview = renderSignatureHtml(state, { ...OPTIONS, showPlaceholders: true });
    const copied = renderSignatureHtml(state, OPTIONS);

    expect(preview).toContain('src="https://signatures.example.com/placeholders/photo.png"');
    expect(preview).toContain('src="https://signatures.example.com/placeholders/logo.png"');
    expect(copied).not.toContain("placeholders/");
  });

  it("prefers real images over placeholders", () => {
    const state = withState({ images: { photo: "https://res.cloudinary.com/demo/me.png" } });
    const preview = renderSignatureHtml(state, { ...OPTIONS, showPlaceholders: true });

    expect(preview).toContain('src="https://res.cloudinary.com/demo/me.png"');
    expect(preview).not.toContain("placeholders/photo.png");
    expect(preview).toContain("placeholders/logo.png");
  });
});

describe("renderSignatureText with optional fields", () => {
  it("includes pronouns, department and mobile", () => {
    const text = renderSignatureText(
      withState({ details: { pronouns: "she/her", department: "Growth", mobile: "+1 555 999 0000" } }),
    );

    expect(text).toContain("Jane Cooper (she/her)");
    expect(text).toContain("Head of Marketing, Growth, Acme Inc.");
    expect(text).toContain("+1 555 010 2030 | +1 555 999 0000");
  });
});

describe("renderSignatureText", () => {
  it("lists non-empty lines", () => {
    expect(renderSignatureText(DEFAULT_SIGNATURE)).toBe(
      [
        "Jane Cooper (she/her)",
        "Head of Marketing, Marketing, Acme Inc.",
        "+1 555 010 2030 | +1 555 010 4050",
        "jane@acme.com",
        "acme.com",
        "123 Market St, San Francisco",
        "linkedin.com/in/janecooper",
      ].join("\n"),
    );
  });
});

describe("parseSignatureState", () => {
  it("returns defaults for missing or malformed data", () => {
    expect(parseSignatureState(null)).toEqual(DEFAULT_SIGNATURE);
    expect(parseSignatureState("{not json")).toEqual(DEFAULT_SIGNATURE);
  });

  it("keeps valid fields and repairs invalid ones independently", () => {
    const stored = JSON.stringify({
      ...DEFAULT_SIGNATURE,
      details: { ...DEFAULT_SIGNATURE.details, fullName: "Sam Lee" },
      style: { ...DEFAULT_SIGNATURE.style, templateId: "unknown", primaryColor: "#000000" },
    });
    const state = parseSignatureState(stored);

    expect(state.details.fullName).toBe("Sam Lee");
    expect(state.style.templateId).toBe(DEFAULT_SIGNATURE.style.templateId);
    expect(state.style.primaryColor).toBe("#000000");
  });
});
