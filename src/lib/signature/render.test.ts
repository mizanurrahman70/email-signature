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
    footer: { ...DEFAULT_SIGNATURE.footer, ...overrides.footer },
  };
}

describe("renderSignatureHtml", () => {
  it.each(TEMPLATE_IDS)("renders the %s template with contact links", (templateId) => {
    const html = renderSignatureHtml(withState({ style: { templateId } }), OPTIONS);

    expect(html).toContain("Jane Cooper");
    expect(html).toContain('href="mailto:jane@acme.com"');
    expect(html).toContain('href="tel:+15550102030"');
    expect(html).toContain('href="https://acme.com/"');
    // New signatures start without social profiles.
    expect(html).not.toContain("social-icons/");
  });

  it("links social profiles with hosted brand icons", () => {
    const html = renderSignatureHtml(
      withState({ social: { linkedin: "linkedin.com/in/jane", github: "github.com/jane" } }),
      OPTIONS,
    );

    expect(html).toContain('href="https://linkedin.com/in/jane"');
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

  it("puts the name on an accent-colored bar in banner", () => {
    const html = renderSignatureHtml(withState({ style: { templateId: "banner", primaryColor: "#276f66" } }), OPTIONS);
    expect(html).toContain('bgcolor="#276f66"');
    expect(html).toMatch(/color:#ffffff">Jane Cooper/);
  });

  it("leads with the logo in corporate, falling back to the photo", () => {
    const withLogo = renderSignatureHtml(
      withState({ style: { templateId: "corporate" }, images: { logo: "https://x.com/l.png", photo: "https://x.com/p.png" } }),
      OPTIONS,
    );
    const photoOnly = renderSignatureHtml(
      withState({ style: { templateId: "corporate" }, images: { photo: "https://x.com/p.png" } }),
      OPTIONS,
    );

    expect(withLogo).toContain("https://x.com/l.png");
    expect(withLogo).not.toContain("https://x.com/p.png");
    expect(photoOnly).toContain("https://x.com/p.png");
  });

  it("renders minimal without any images", () => {
    const html = renderSignatureHtml(
      withState({
        style: { templateId: "minimal" },
        images: { photo: "https://x.com/p.png", logo: "https://x.com/l.png" },
        social: { linkedin: "linkedin.com/in/jane" },
      }),
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

describe("email signature footer", () => {
  const footerState = (templateId: SignatureState["style"]["templateId"] = "split") =>
    withState({
      style: { templateId },
      footer: {
        legal: "Confidential <b>notice</b>\nLine two",
        customFields: [
          { id: "1", label: "Booking", value: "https://calendly.com/jane" },
          { id: "2", label: "Skype", value: "jane.cooper" },
          { id: "3", label: "Assistant", value: "sam@acme.com" },
          { id: "4", label: "Empty", value: "   " },
        ],
      },
    });

  it.each(TEMPLATE_IDS)("puts custom fields under name/title/company and legal text last in %s", (templateId) => {
    const html = renderSignatureHtml(footerState(templateId), OPTIONS);

    expect(html).toContain("Booking:</span>");
    expect(html).toContain('href="https://calendly.com/jane"');
    expect(html).toContain("jane.cooper");
    expect(html).toContain('href="mailto:sam@acme.com"');
    expect(html).not.toContain("Empty:");
    expect(html).toContain("Confidential &lt;b&gt;notice&lt;/b&gt;<br>Line two");

    // Order: identity → custom fields → contact details → legal notice.
    const name = html.indexOf("Jane Cooper");
    const company = html.indexOf("Acme Inc.");
    const customField = html.indexOf("Booking:");
    const phone = html.indexOf('href="tel:');
    const legal = html.indexOf("Confidential &lt;b&gt;");
    expect(name).toBeLessThan(customField);
    expect(company).toBeLessThan(customField);
    expect(customField).toBeLessThan(phone);
    expect(phone).toBeLessThan(legal);
  });

  it("leaves the template untouched when the footer is empty", () => {
    const html = renderSignatureHtml(withState({}), OPTIONS);
    expect(html).not.toContain("border-top:1px solid #e5e7eb;max-width");
    expect(html.startsWith("<table")).toBe(true);
  });

  it("adds custom fields under the title and legal text at the end of the plain-text version", () => {
    const text = renderSignatureText(footerState());
    expect(text).toContain("Head of Marketing, Marketing, Acme Inc.\nBooking: https://calendly.com/jane\nSkype: jane.cooper");
    expect(text.indexOf("Booking:")).toBeLessThan(text.indexOf("+1 555 010 2030"));
    expect(text.endsWith("\n\nConfidential <b>notice</b>\nLine two")).toBe(true);
  });

  it("restores old drafts without a footer, and repairs a bad one", () => {
    const { footer: _omit, ...withoutFooter } = DEFAULT_SIGNATURE;
    void _omit;
    expect(parseSignatureState(JSON.stringify(withoutFooter)).footer).toEqual(DEFAULT_SIGNATURE.footer);
    expect(
      parseSignatureState(JSON.stringify({ ...DEFAULT_SIGNATURE, footer: { legal: 42, customFields: "nope" } })).footer,
    ).toEqual({ legal: "", customFields: [] });
  });
});

describe("click-to-edit markers", () => {
  const fullState = (templateId: SignatureState["style"]["templateId"]) =>
    withState({
      style: { templateId },
      images: { photo: "https://res.cloudinary.com/demo/p.png", logo: "https://res.cloudinary.com/demo/l.png" },
      social: { linkedin: "linkedin.com/in/jane", github: "github.com/jane" },
      footer: { legal: "Notice", customFields: [{ id: "abc", label: "Skype", value: "jane" }] },
    });

  it.each(TEMPLATE_IDS)("marks every editable part in the %s preview", (templateId) => {
    const html = renderSignatureHtml(fullState(templateId), { ...OPTIONS, editable: true });

    for (const target of [
      "details:fullName",
      "details:pronouns",
      "details:jobTitle",
      "details:department",
      "details:company",
      "details:custom-abc",
      "details:phone",
      "details:mobile",
      "details:email",
      "details:website",
      "details:address",
      "details:legal",
      "social:linkedin",
      "social:github",
    ]) {
      expect(html, target).toContain(`data-edit="${target}"`);
    }
    // Minimal is text-only; Corporate shows the signature image in place of the photo.
    if (templateId !== "minimal") expect(html).toMatch(/data-edit="images:(photo|logo)"/);
  });

  it.each(TEMPLATE_IDS)("never puts markers in the copied %s signature", (templateId) => {
    expect(renderSignatureHtml(fullState(templateId), OPTIONS)).not.toContain("data-edit");
  });
});

describe("signature width", () => {
  it("leaves the output unchanged on Auto", () => {
    const auto = renderSignatureHtml(withState({ style: { width: null } }), OPTIONS);
    expect(auto).not.toContain("max-width:");
    expect(auto.startsWith("<table")).toBe(true);
  });

  it.each(TEMPLATE_IDS)("wraps the %s template in a fixed but shrinkable width", (templateId) => {
    const html = renderSignatureHtml(withState({ style: { templateId, width: 600 } }), OPTIONS);
    expect(html).toMatch(/^<table[^>]* width="600"[^>]*style="[^"]*width:100%;max-width:600px/);
  });

  it("lets the legal text fill the custom width", () => {
    const html = renderSignatureHtml(withState({ style: { width: 640 }, footer: { legal: "Notice" } }), OPTIONS);
    expect(html).not.toContain("max-width:560px");
  });

  it("repairs saved widths that are out of range or missing", () => {
    const save = (width: unknown) => JSON.stringify({ ...DEFAULT_SIGNATURE, style: { ...DEFAULT_SIGNATURE.style, width } });
    expect(parseSignatureState(save(600)).style.width).toBe(600);
    expect(parseSignatureState(save(5000)).style.width).toBeNull();
    expect(parseSignatureState(save("wide")).style.width).toBeNull();
    const { width: _omit, ...styleWithoutWidth } = DEFAULT_SIGNATURE.style;
    void _omit;
    expect(parseSignatureState(JSON.stringify({ ...DEFAULT_SIGNATURE, style: styleWithoutWidth })).style.width).toBeNull();
  });
});
