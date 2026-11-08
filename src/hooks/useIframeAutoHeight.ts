"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Sizes a same-origin iframe to its content. Content wider than the frame is
 * zoomed out to fit, the way mobile mail apps shrink wide signatures.
 * Re-measures when the frame resizes or late images load.
 */
export function useIframeAutoHeight(initialHeight: number) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [height, setHeight] = useState(initialHeight);
  const [scale, setScale] = useState(1);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!iframe || !doc?.body) return;

    const measure = () => {
      doc.body.style.zoom = "1";
      const contentWidth = doc.documentElement.scrollWidth;
      const nextScale = Math.min(1, iframe.clientWidth / Math.max(contentWidth, 1));
      doc.body.style.zoom = String(nextScale);
      setScale(nextScale);
      setHeight(doc.documentElement.scrollHeight);
    };

    measure();

    cleanupRef.current?.();
    const observer = new ResizeObserver(measure);
    observer.observe(iframe);
    // `load` doesn't bubble, so capture it to catch each image finishing.
    doc.addEventListener("load", measure, true);
    cleanupRef.current = () => {
      observer.disconnect();
      doc.removeEventListener("load", measure, true);
    };
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return { iframeRef, height, scale, handleLoad };
}
