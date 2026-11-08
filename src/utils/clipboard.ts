/**
 * Copies HTML as rich text so it pastes as a formatted signature
 * (not raw markup) into Gmail, Outlook and Apple Mail settings.
 */
export async function copyRichText(html: string, plainText: string): Promise<void> {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plainText], { type: "text/plain" }),
        }),
      ]);
      return;
    } catch {
      // Fall through to the selection-based fallback (e.g. older Firefox).
    }
  }

  copyViaSelection(html);
}

export async function copyPlainText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  runCopyCommand(textarea, () => textarea.select());
}

function copyViaSelection(html: string): void {
  const container = document.createElement("div");
  container.innerHTML = html;
  container.contentEditable = "true";

  runCopyCommand(container, () => {
    const range = document.createRange();
    range.selectNodeContents(container);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  });

  window.getSelection()?.removeAllRanges();
}

function runCopyCommand(element: HTMLElement, select: () => void): void {
  element.style.position = "fixed";
  element.style.left = "-9999px";
  document.body.appendChild(element);

  try {
    select();
    // execCommand is deprecated but remains the only fallback for rich-text copy.
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command was rejected by the browser.");
  } finally {
    element.remove();
  }
}
