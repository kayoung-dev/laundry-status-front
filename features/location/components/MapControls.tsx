"use client";

import Icon from "@/components/ui/Icon";
import styles from "./MapControls.module.css";

interface MapControlsProps {
  onRotate: (direction: 1 | -1) => void;
  onReset: () => void;
  /** Omitted where the map has no zoom buttons. */
  onZoom?: (direction: 1 | -1) => void;
}

/** Buttons in the map's corner: zoom, quarter turns, back to the first view. */
export default function MapControls({ onRotate, onReset, onZoom }: MapControlsProps) {
  return (
    <div className={styles.controls}>
      {onZoom && (
        <div className={`${styles.group} ${styles.zoom}`}>
          <button type="button" className={styles.button} aria-label="확대" onClick={() => onZoom(1)}>
            <Icon name="plus" />
          </button>
          <button type="button" className={styles.button} aria-label="축소" onClick={() => onZoom(-1)}>
            <Icon name="minus" />
          </button>
        </div>
      )}
      <div className={styles.group}>
        <button type="button" className={`${styles.button} ${styles.left}`} aria-label="왼쪽으로 90도 돌리기" onClick={() => onRotate(-1)}>
          <Icon name="rotate-left" />
        </button>
        <button type="button" className={styles.button} aria-label="오른쪽으로 90도 돌리기" onClick={() => onRotate(1)}>
          <Icon name="rotate-left" style={{ transform: "scaleX(-1)" }} />
        </button>
        <button type="button" className={styles.button} aria-label="처음 시점으로" onClick={onReset}>
          <Icon name="target" />
        </button>
      </div>
    </div>
  );
}
