import type { Bounds, PixelData, Point, Stroke } from "@/types/handwriting";

/** Smallest rectangle containing every non-transparent pixel, or null if empty. */
export function getContentBounds({ data, width, height }: PixelData, alphaThreshold = 8): Bounds | null {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return maxX < 0 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Copies the inked area of `source` into a new canvas with transparent padding. */
export function trimCanvas(source: HTMLCanvasElement, padding: number): HTMLCanvasElement | null {
  const context = source.getContext("2d");
  if (!context) return null;

  const bounds = getContentBounds(context.getImageData(0, 0, source.width, source.height));
  if (!bounds) return null;

  const trimmed = document.createElement("canvas");
  trimmed.width = bounds.width + padding * 2;
  trimmed.height = bounds.height + padding * 2;
  trimmed
    .getContext("2d")
    ?.drawImage(source, bounds.x, bounds.y, bounds.width, bounds.height, padding, padding, bounds.width, bounds.height);
  return trimmed;
}

export function canvasToPngFile(canvas: HTMLCanvasElement, fileName: string): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(new File([blob], fileName, { type: "image/png" }));
      else reject(new Error("Couldn't create the signature image."));
    }, "image/png");
  });
}

/**
 * Draws a stroke as a smooth curve: each segment is a quadratic curve through
 * the midpoints of consecutive points, which hides pointer-sampling jitter.
 */
export function drawSmoothStroke(context: CanvasRenderingContext2D, { color, points }: Stroke, width: number): void {
  if (points.length === 0) return;

  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = width;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (points.length === 1) {
    context.beginPath();
    context.arc(points[0].x, points[0].y, width / 2, 0, Math.PI * 2);
    context.fill();
    return;
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length - 1; index++) {
    const midpoint = getMidpoint(points[index], points[index + 1]);
    context.quadraticCurveTo(points[index].x, points[index].y, midpoint.x, midpoint.y);
  }
  const last = points[points.length - 1];
  context.lineTo(last.x, last.y);
  context.stroke();
}

export function getMidpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Renders `strokes` (in CSS pixels) onto a fresh canvas at `scale`. */
export function renderStrokes(strokes: Stroke[], size: { width: number; height: number }, strokeWidth: number, scale: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(size.width * scale);
  canvas.height = Math.round(size.height * scale);
  const context = canvas.getContext("2d");
  if (context) {
    context.scale(scale, scale);
    strokes.forEach((stroke) => drawSmoothStroke(context, stroke, strokeWidth));
  }
  return canvas;
}

/** Renders a line of text in `fontFamily` onto a canvas sized to fit it. */
export function renderText(text: string, fontFamily: string, color: string, fontSize: number, scale: number) {
  const font = `${fontSize * scale}px ${fontFamily}`;
  const measure = document.createElement("canvas").getContext("2d");
  if (measure) measure.font = font;
  const width = Math.ceil((measure?.measureText(text).width ?? 0) + fontSize * scale);

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(width, 1);
  canvas.height = Math.ceil(fontSize * scale * 2);
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    context.fillStyle = color;
    context.textBaseline = "middle";
    context.fillText(text, (fontSize * scale) / 2, canvas.height / 2);
  }
  return canvas;
}
