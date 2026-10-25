"use client";

import styles from "./MapControls.module.css";

interface MapControlsProps {
  onRotate: (direction: 1 | -1) => void;
  onReset: () => void;
  /** Omitted where the map has no zoom buttons. */
  onZoom?: (direction: 1 | -1) => void;
}

function TurnIcon({ flip }: { flip?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M3.5 6.5A5 5 0 1 1 3 9.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M3 3v3.5h3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Buttons in the map's corner: zoom, quarter turns, back to the first view. */
export default function MapControls({ onRotate, onReset, onZoom }: MapControlsProps) {
  return (
    <div className={styles.controls}>
      {onZoom && (
        <div className={`${styles.group} ${styles.zoom}`}>
          <button type="button" className={styles.button} aria-label="확대" onClick={() => onZoom(1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className={styles.button} aria-label="축소" onClick={() => onZoom(-1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
      <div className={styles.group}>
        <button type="button" className={`${styles.button} ${styles.left}`} aria-label="왼쪽으로 90도 돌리기" onClick={() => onRotate(-1)}>
          <TurnIcon />
        </button>
        <button type="button" className={styles.button} aria-label="오른쪽으로 90도 돌리기" onClick={() => onRotate(1)}>
          <TurnIcon flip />
        </button>
        <button type="button" className={styles.button} aria-label="처음 시점으로" onClick={onReset}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="8" cy="8" r="1.6" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
