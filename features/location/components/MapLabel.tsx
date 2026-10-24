"use client";

import { useCallback, useLayoutEffect, type ReactNode, type RefObject } from "react";
import type { LabelSlots } from "@/features/location/label-slots";
import type { Anchor } from "@/features/location/scene-anchors";
import styles from "./MapLabel.module.css";

interface MapLabelProps {
  slots: RefObject<LabelSlots>;
  id: string;
  at: Anchor;
  /** Kept above the other labels (the selected hall). */
  raised?: boolean;
  children: ReactNode;
}

/**
 * A label pinned to a 3D point. It renders in the page's own React tree; the
 * scene's LabelProjector moves it into place, so it stays hidden until the map draws.
 */
export default function MapLabel({ slots, id, at, raised, children }: MapLabelProps) {
  const register = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) {
        return;
      }
      slots.current.set(id, { at, el });
      return () => {
        slots.current.delete(id);
      };
    },
    // `at` is left out on purpose: the effect below keeps it current without registering again.
    [slots, id],
  );

  const [x, y, z] = at;
  useLayoutEffect(() => {
    const slot = slots.current.get(id);
    if (slot) {
      slot.at = [x, y, z];
    }
  }, [slots, id, x, y, z]);

  return (
    <div ref={register} className={styles.slot} data-raised={raised || undefined}>
      {children}
    </div>
  );
}
