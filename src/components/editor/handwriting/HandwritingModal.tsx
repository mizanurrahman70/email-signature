"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { HANDWRITING_MODES, INK_COLORS, STROKE_WIDTH } from "@/constants/handwriting";
import { useSignaturePad } from "@/hooks/useSignaturePad";
import { createTypedSignatureFile } from "@/lib/signature/handwriting";
import type { HandwritingMode } from "@/types/handwriting";
import { getErrorMessage } from "@/utils/error";
import { DrawPanel } from "./DrawPanel";
import { HANDWRITING_FONTS, type HandwritingFontId } from "./fonts";
import { TypePanel } from "./TypePanel";

interface HandwritingModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-fills the "Use fonts" tab. */
  defaultName: string;
  /** Receives the finished signature as a cropped transparent PNG. */
  onApply: (file: File) => void;
}

export function HandwritingModal({ open, onClose, defaultName, onApply }: HandwritingModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Create handwritten signature">
      <HandwritingEditor defaultName={defaultName} onCancel={onClose} onApply={onApply} />
    </Modal>
  );
}

interface HandwritingEditorProps {
  defaultName: string;
  onCancel: () => void;
  onApply: (file: File) => void;
}

/** Mounted only while the modal is open, so each opening starts with a clean pad. */
function HandwritingEditor({ defaultName, onCancel, onApply }: HandwritingEditorProps) {
  const [mode, setMode] = useState<HandwritingMode>("draw");
  const [color, setColor] = useState<string>(INK_COLORS[0].value);
  const [text, setText] = useState(defaultName);
  const [fontId, setFontId] = useState<HandwritingFontId>(HANDWRITING_FONTS[0].id);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { canvasRef, padHandlers, isEmpty, undo, clear, exportFile } = useSignaturePad({ color, strokeWidth: STROKE_WIDTH });

  const canApply = mode === "draw" ? !isEmpty : text.trim().length > 0;

  async function handleApply() {
    setIsApplying(true);
    setError(null);
    try {
      const font = HANDWRITING_FONTS.find((option) => option.id === fontId) ?? HANDWRITING_FONTS[0];
      const file = mode === "draw" ? await exportFile() : await createTypedSignatureFile(text.trim(), font.fontFamily, color);
      if (!file) throw new Error("Draw your signature first.");
      onApply(file);
    } catch (applyError) {
      setError(getErrorMessage(applyError, "Couldn't create your signature. Please try again."));
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <>
      <ModalBody>
        <div className="mb-6 flex justify-center">
          <SegmentedControl
            label="Signature method"
            options={HANDWRITING_MODES}
            value={mode}
            onChange={(next) => {
              setMode(next);
              setError(null);
            }}
          />
        </div>

        {/* Both panels stay mounted so the drawing survives switching tabs. */}
        <div hidden={mode !== "draw"}>
          <DrawPanel
            canvasRef={canvasRef}
            padHandlers={padHandlers}
            isEmpty={isEmpty}
            onUndo={undo}
            onClear={clear}
            color={color}
            onColorChange={setColor}
          />
        </div>
        <div hidden={mode !== "type"}>
          <TypePanel
            text={text}
            onTextChange={setText}
            fontId={fontId}
            onFontChange={setFontId}
            color={color}
            onColorChange={setColor}
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-[13px] text-red-600">
            {error}
          </p>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleApply} disabled={!canApply || isApplying}>
          <Check />
          {isApplying ? "Creating…" : "Apply"}
        </Button>
      </ModalFooter>
    </>
  );
}
