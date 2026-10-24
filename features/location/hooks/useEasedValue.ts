"use client";

import { useEffect, useRef, useState } from "react";

/** Eases toward `target` over `ms` (ease-out); jumps straight there when `instant`. */
export function useEasedValue(target: number, ms: number, instant: boolean): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const from = valueRef.current;
    if (instant || from === target) {
      valueRef.current = target;
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      const next = from + (target - from) * (1 - (1 - t) ** 3);
      valueRef.current = next;
      setValue(next);
      if (t < 1) {
        frame = requestAnimationFrame(step);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, ms, instant]);

  return value;
}
