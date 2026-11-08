"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { EXPORT_PADDING, EXPORT_SCALE, HANDWRITING_FILE_NAME } from "@/constants/handwriting";
import type { Point, Stroke } from "@/types/handwriting";
import { canvasToPngFile, drawSmoothStroke, renderStrokes, trimCanvas } from "@/utils/canvas";

export interface SignaturePadHandlers {
  onPointerDown: (event: PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
}

interface SignaturePadOptions {
  color: string;
  strokeWidth: number;
}

/**
 * Freehand drawing with Pointer Events (mouse, touch and pen alike).
 * Strokes are stored in CSS pixels so the pad can be redrawn crisply at any
 * device pixel ratio, and exported at a fixed high resolution.
 */
export function useSignaturePad({ color, strokeWidth }: SignaturePadOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const ratio = window.devicePixelRatio || 1;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    strokesRef.current.forEach((stroke) => drawSmoothStroke(context, stroke, strokeWidth));
  }, [strokeWidth]);

  // Match the backing store to the displayed size × devicePixelRatio, then redraw.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      redraw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redraw]);

  function toPoint(event: PointerEvent<HTMLCanvasElement> | globalThis.PointerEvent): Point {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const stroke: Stroke = { color, points: [toPoint(event)] };
    activeStrokeRef.current = stroke;
    strokesRef.current = [...strokesRef.current, stroke];
    redraw();
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const stroke = activeStrokeRef.current;
    if (!stroke) return;

    // Coalesced events give every sample since the last frame, for smoother lines.
    const samples = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
    samples.forEach((sample) => stroke.points.push(toPoint(sample)));
    redraw();
  }

  function handlePointerUp() {
    if (!activeStrokeRef.current) return;
    activeStrokeRef.current = null;
    setStrokeCount(strokesRef.current.length);
  }

  const undo = useCallback(() => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    redraw();
  }, [redraw]);

  const clear = useCallback(() => {
    strokesRef.current = [];
    setStrokeCount(0);
    redraw();
  }, [redraw]);

  /** High-resolution, tightly cropped transparent PNG of the drawing. */
  const exportFile = useCallback(async (): Promise<File | null> => {
    const canvas = canvasRef.current;
    if (!canvas || strokesRef.current.length === 0) return null;

    const rendered = renderStrokes(
      strokesRef.current,
      { width: canvas.clientWidth, height: canvas.clientHeight },
      strokeWidth,
      EXPORT_SCALE,
    );
    const trimmed = trimCanvas(rendered, EXPORT_PADDING);
    return trimmed ? canvasToPngFile(trimmed, HANDWRITING_FILE_NAME) : null;
  }, [strokeWidth]);

  return {
    canvasRef,
    isEmpty: strokeCount === 0,
    undo,
    clear,
    exportFile,
    padHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    } satisfies SignaturePadHandlers,
  };
}
