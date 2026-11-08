export const HANDWRITING_MODES = [
  { value: "draw", label: "Draw freehand" },
  { value: "type", label: "Use fonts" },
] as const;

/** Ink colors that read well on white and in dark-mode mail clients. */
export const INK_COLORS = [
  { label: "Black", value: "#111827" },
  { label: "Blue", value: "#1e3a8a" },
  { label: "Green", value: "#183d39" },
] as const;

/** Stroke width in CSS pixels on the pad. */
export const STROKE_WIDTH = 2.6;

/** Exported PNGs are rendered at this multiple of pad size, then cropped. */
export const EXPORT_SCALE = 3;

/** Transparent space kept around the ink after cropping, in exported pixels. */
export const EXPORT_PADDING = 16;

/** Font size, in CSS pixels, for typed signatures before export scaling. */
export const TYPED_FONT_SIZE = 56;

export const MAX_TYPED_LENGTH = 40;

export const HANDWRITING_FILE_NAME = "handwritten-signature.png";
