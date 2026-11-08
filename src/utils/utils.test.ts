import { describe, expect, it } from "vitest";
import { serializeParamsToSign, withTransforms } from "./cloudinary";
import { isSameColor, safeHexColor } from "./color";
import { getErrorMessage } from "./error";
import { formatMegabytes, validateFile } from "./file";
import { escapeHtml, toInlineStyle } from "./html";
import { getRovingIndex } from "./keyboard";

describe("html", () => {
  it("escapes special characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });

  it("builds inline styles and skips empty values", () => {
    expect(toInlineStyle({ fontSize: "14px", borderRadius: undefined, color: "" })).toBe("font-size:14px");
  });
});

describe("color", () => {
  it("validates and compares hex colors", () => {
    expect(safeHexColor("#ABCDEF", "#000000")).toBe("#ABCDEF");
    expect(safeHexColor("red", "#000000")).toBe("#000000");
    expect(isSameColor("#1D4ED8", "#1d4ed8")).toBe(true);
  });
});

describe("file", () => {
  const rules = { acceptedTypes: ["image/png"], maxBytes: 1024 * 1024 };
  const makeFile = (type: string, size: number) => new File([new Uint8Array(size)], "x", { type });

  it("formats sizes", () => {
    expect(formatMegabytes(5 * 1024 * 1024)).toBe("5 MB");
    expect(formatMegabytes(1.5 * 1024 * 1024)).toBe("1.5 MB");
  });

  it("rejects wrong types and oversized files", () => {
    expect(validateFile(makeFile("image/png", 10), rules)).toBeNull();
    expect(validateFile(makeFile("application/pdf", 10), rules)).toMatch(/PNG/);
    expect(validateFile(makeFile("image/png", 2 * 1024 * 1024), rules)).toMatch(/1 MB/);
  });
});

describe("cloudinary", () => {
  it("inserts transformations after /image/upload/", () => {
    expect(withTransforms("https://res.cloudinary.com/demo/image/upload/v1/a.jpg", "w_100")).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_100/v1/a.jpg",
    );
  });

  it("serializes params alphabetically", () => {
    expect(serializeParamsToSign({ timestamp: 1, folder: "f", allowed_formats: "png" })).toBe(
      "allowed_formats=png&folder=f&timestamp=1",
    );
  });
});

describe("keyboard", () => {
  it("wraps arrow navigation and ignores other keys", () => {
    expect(getRovingIndex("ArrowRight", 2, 3)).toBe(0);
    expect(getRovingIndex("ArrowLeft", 0, 3)).toBe(2);
    expect(getRovingIndex("End", 0, 3)).toBe(2);
    expect(getRovingIndex("Enter", 0, 3)).toBeNull();
  });
});

describe("error", () => {
  it("falls back for non-Error values", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("boom");
    expect(getErrorMessage("nope", "fallback")).toBe("fallback");
  });
});

describe("site", async () => {
  const { isLocalUrl } = await import("./site");
  const { toAbsoluteUrl } = await import("./url");

  it("detects local origins", () => {
    expect(isLocalUrl("http://localhost:3000")).toBe(true);
    expect(isLocalUrl("https://signatures.example.com")).toBe(false);
  });

  it("resolves asset paths against a base URL", () => {
    expect(toAbsoluteUrl("/social-icons/x.png", "https://a.com")).toBe("https://a.com/social-icons/x.png");
    expect(toAbsoluteUrl("/x.png", "not a url")).toBe("");
  });
});
