import type { HANDWRITING_MODES } from "@/constants/handwriting";

export type HandwritingMode = (typeof HANDWRITING_MODES)[number]["value"];

/** A point in CSS pixels, relative to the drawing pad. */
export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  color: string;
  points: Point[];
}

/** Minimal ImageData shape, so bounds detection stays testable without a DOM. */
export interface PixelData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
