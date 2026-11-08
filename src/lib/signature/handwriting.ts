import { EXPORT_PADDING, EXPORT_SCALE, HANDWRITING_FILE_NAME, TYPED_FONT_SIZE } from "@/constants/handwriting";
import { canvasToPngFile, renderText, trimCanvas } from "@/utils/canvas";
import { ensureFontLoaded } from "@/utils/fonts";

/**
 * Renders typed text in a handwriting font to a cropped, transparent PNG.
 * Waits for the web font first; drawing before it loads would use the fallback.
 */
export async function createTypedSignatureFile(text: string, fontFamily: string, color: string): Promise<File> {
  await ensureFontLoaded(fontFamily, TYPED_FONT_SIZE, text);

  const rendered = renderText(text, fontFamily, color, TYPED_FONT_SIZE, EXPORT_SCALE);
  const trimmed = trimCanvas(rendered, EXPORT_PADDING);
  if (!trimmed) throw new Error("Type your name to create a signature.");

  return canvasToPngFile(trimmed, HANDWRITING_FILE_NAME);
}
