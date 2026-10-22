"use client";

import { useEffect, type RefObject } from "react";

/** While `open`, a pointer press outside `rootRef` or Escape inside it calls `onDismiss`. */
export function useDismiss(rootRef: RefObject<HTMLElement | null>, open: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const root = rootRef.current;
    const onPointerDown = (event: PointerEvent) => {
      if (!root?.contains(event.target as Node)) {
        onDismiss();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    root?.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      root?.removeEventListener("keydown", onKeyDown);
    };
  }, [rootRef, open, onDismiss]);
}
