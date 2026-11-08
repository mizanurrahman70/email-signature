"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Keeps a same-origin iframe as tall as its content, including when late
 * image loads change the height. Returns a ref, the height and an onLoad handler.
 */
export function useIframeAutoHeight(initialHeight: number) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState(initialHeight);

  const handleLoad = useCallback(() => {
    const body = iframeRef.current?.contentDocument?.body;
    if (!body) return;

    const measure = () => setHeight(body.scrollHeight);
    measure();

    observerRef.current?.disconnect();
    observerRef.current = new ResizeObserver(measure);
    observerRef.current.observe(body);
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return { iframeRef, height, handleLoad };
}
