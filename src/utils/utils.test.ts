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

  it("uses up/down for vertical lists and accepts all arrows for 'both'", () => {
    expect(getRovingIndex("ArrowDown", 0, 3, "vertical")).toBe(1);
    expect(getRovingIndex("ArrowUp", 0, 3, "vertical")).toBe(2);
    expect(getRovingIndex("ArrowRight", 0, 3, "vertical")).toBeNull();
    expect(getRovingIndex("ArrowRight", 0, 3, "both")).toBe(1);
    expect(getRovingIndex("ArrowDown", 0, 3, "horizontal")).toBeNull();
  });
});

describe("error", () => {
  it("falls back for non-Error values", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("boom");
    expect(getErrorMessage("nope", "fallback")).toBe("fallback");
  });
});

describe("url resolution", async () => {
  const { toAbsoluteUrl } = await import("./url");

  it("resolves asset paths against a base URL", () => {
    expect(toAbsoluteUrl("/social-icons/x.png", "https://a.com")).toBe("https://a.com/social-icons/x.png");
    expect(toAbsoluteUrl("/x.png", "not a url")).toBe("");
  });
});

describe("svg", async () => {
  const { buildStrokeIconSvg } = await import("./svg");

  it("wraps markup with size and stroke color", () => {
    const svg = buildStrokeIconSvg('<path d="M0 0"/>', "#ff0000", 48);
    expect(svg).toContain('width="48"');
    expect(svg).toContain('stroke="#ff0000"');
    expect(svg).toContain('<path d="M0 0"/>');
  });
});

describe("canvas", async () => {
  const { getContentBounds, getMidpoint } = await import("./canvas");

  const pixels = (width: number, height: number, inked: Array<[number, number]>) => {
    const data = new Uint8ClampedArray(width * height * 4);
    inked.forEach(([x, y]) => (data[(y * width + x) * 4 + 3] = 255));
    return { data, width, height };
  };

  it("finds the bounding box of inked pixels", () => {
    expect(getContentBounds(pixels(10, 8, [[2, 3], [6, 5], [4, 1]]))).toEqual({ x: 2, y: 1, width: 5, height: 5 });
  });

  it("returns null for an empty canvas", () => {
    expect(getContentBounds(pixels(4, 4, []))).toBeNull();
  });

  it("computes midpoints for curve smoothing", () => {
    expect(getMidpoint({ x: 0, y: 0 }, { x: 4, y: 2 })).toEqual({ x: 2, y: 1 });
  });
});

describe("fonts", async () => {
  const { getPrimaryFontFamily } = await import("./fonts");

  it("keeps only the first family, with its quotes", () => {
    expect(getPrimaryFontFamily("'Great Vibes', 'Great Vibes Fallback'")).toBe("'Great Vibes'");
    expect(getPrimaryFontFamily("Arial")).toBe("Arial");
  });
});
