"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Mounted only while open, so content state resets each time. Compose with ModalBody / ModalFooter. */
  children: ReactNode;
}

/**
 * Accessible modal built on the native <dialog> element: focus trapping,
 * Escape to close and the backdrop come from the browser.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a backdrop click.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto w-[min(640px,calc(100vw-24px))] rounded-3xl bg-white p-0 text-slate-900 shadow-2xl ring-1 ring-slate-900/10 backdrop:bg-slate-950/50 backdrop:backdrop-blur-[2px]"
    >
      {open && (
        <div className="flex max-h-[calc(100dvh-48px)] flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
            <h2 id={titleId} className="text-base font-semibold tracking-tight">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
      {children}
    </footer>
  );
}
