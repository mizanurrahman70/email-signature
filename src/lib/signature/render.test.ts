import { describe, expect, it } from "vitest";
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
  it.each(["classic", "stacked"] as const)("renders the %s template with contact links", (templateId) => {
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
});

describe("renderSignatureText", () => {
  it("lists non-empty lines", () => {
    expect(renderSignatureText(DEFAULT_SIGNATURE)).toBe(
      ["Jane Cooper", "Head of Marketing, Acme Inc.", "+1 555 010 2030", "jane@acme.com", "acme.com", "linkedin.com/in/janecooper"].join("\n"),
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
