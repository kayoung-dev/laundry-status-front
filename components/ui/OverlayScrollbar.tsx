"use client";

import { type PointerEvent, useEffect, useRef, useState } from "react";
import styles from "./OverlayScrollbar.module.css";

const HIDE_NATIVE_CLASS = "overlay-scrollbar";
const MIN_THUMB_PX = 40;
const EDGE_GAP_PX = 3;

interface Thumb {
  top: number;
  height: number;
}

/**
 * Page scrollbar drawn over the content, so the track is transparent and each
 * section's color shows through (the native root scrollbar always paints its
 * own strip). Mouse/trackpad only: on touch screens the native overlay
 * scrollbar stays. The native one is hidden only after this mounts, so the
 * page is never left without a scrollbar. Wheel, keyboard and assistive tech
 * keep using native scrolling; this only mirrors and drags it.
 */
export default function OverlayScrollbar() {
  const [enabled, setEnabled] = useState(false);
  const [thumb, setThumb] = useState<Thumb | null>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startY: number; startScroll: number } | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const apply = () => setEnabled(fine.matches);
    apply();
    fine.addEventListener("change", apply);
    return () => fine.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const root = document.documentElement;
    root.classList.add(HIDE_NATIVE_CLASS);

    let frame = 0;
    const measure = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const content = root.scrollHeight;
      if (content <= viewport + 1) {
        setThumb(null);
        return;
      }
      const track = viewport - EDGE_GAP_PX * 2;
      const height = Math.max(MIN_THUMB_PX, (viewport / content) * track);
      const top = EDGE_GAP_PX + (window.scrollY / (content - viewport)) * (track - height);
      setThumb({ top, height });
    };
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);

    return () => {
      root.classList.remove(HIDE_NATIVE_CLASS);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled || !thumb) {
    return null;
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startY: event.clientY, startScroll: window.scrollY };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) {
      return;
    }
    const root = document.documentElement;
    const viewport = window.innerHeight;
    const scrollable = root.scrollHeight - viewport;
    const travel = viewport - EDGE_GAP_PX * 2 - thumb.height;
    const delta = ((event.clientY - drag.current.startY) / travel) * scrollable;
    window.scrollTo({ top: drag.current.startScroll + delta, behavior: "instant" });
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div aria-hidden="true" className={styles.rail}>
      <div
        className={styles.thumb}
        data-dragging={dragging || undefined}
        style={{ transform: `translateY(${thumb.top}px)`, height: thumb.height }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
    </div>
  );
}
