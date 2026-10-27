"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { Color, type InstancedMesh, type Matrix4 } from "three";

const tint = new Color();

/**
 * Places one instance per item whenever `items` change, then redraws. `place`
 * returns the instance's matrix; `color` (optional) its color.
 */
export function useInstanceLayout<T>(items: T[], place: (item: T) => Matrix4, color?: (item: T) => string) {
  const ref = useRef<InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }
    items.forEach((item, i) => {
      mesh.setMatrixAt(i, place(item));
      if (color) {
        mesh.setColorAt(i, tint.set(color(item)));
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    mesh.computeBoundingSphere();
    invalidate();
    // `place` and `color` are left out: each caller passes fixed layout functions.
  }, [items, invalidate]);

  return ref;
}
