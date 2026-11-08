const FLASH_ATTR = "data-flash";
const FLASH_MS = 1400;
const MAX_WAIT_FRAMES = 10;

/**
 * Focuses and scrolls to the element matching `selector`, waiting a few frames
 * for it to appear (e.g. right after switching editor steps), then briefly
 * flashes it so the user sees where they landed.
 */
export function focusWhenReady(selector: string): void {
  let frames = 0;

  const tryFocus = () => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
      if (++frames < MAX_WAIT_FRAMES) requestAnimationFrame(tryFocus);
      return;
    }
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.focus({ preventScroll: true });
    element.setAttribute(FLASH_ATTR, "");
    window.setTimeout(() => element.removeAttribute(FLASH_ATTR), FLASH_MS);
  };

  requestAnimationFrame(tryFocus);
}
