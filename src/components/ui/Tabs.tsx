"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { getRovingIndex } from "@/utils/keyboard";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: ReadonlyArray<TabItem>;
  label: string;
  className?: string;
  /** Pass with `onActiveIdChange` to control the selected tab from outside. */
  activeId?: string;
  onActiveIdChange?: (id: string) => void;
}

/** Accessible tabs following the WAI-ARIA pattern (arrow keys, Home/End). */
export function Tabs({ items, label, className, activeId: controlledId, onActiveIdChange }: TabsProps) {
  const baseId = useId();
  const [uncontrolledId, setUncontrolledId] = useState(items[0]?.id);
  const activeId = controlledId ?? uncontrolledId;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function setActiveId(id: string) {
    setUncontrolledId(id);
    onActiveIdChange?.(id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex = getRovingIndex(event.key, index, items.length);
    if (nextIndex === null) return;

    event.preventDefault();
    setActiveId(items[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-blue-600",
                isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== activeId}
          className="pt-5"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
