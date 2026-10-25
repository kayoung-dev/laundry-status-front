"use client";

import styles from "./SegmentedControl.module.css";

interface SegmentedControlProps<T extends string> {
  label: string;
  options: { id: T; label: string; short?: string }[];
  value: T;
  onChange: (id: T) => void;
}

/** Two or three mutually exclusive views ("3D 지도 / 목록", "펼치기 / 접기"). */
export default function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={styles.group}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={o.id === value}
          className={styles.option}
          onClick={() => onChange(o.id)}
        >
          {o.short ? (
            <>
              <span className={styles.long}>{o.label}</span>
              <span className={styles.short}>{o.short}</span>
            </>
          ) : (
            o.label
          )}
        </button>
      ))}
    </div>
  );
}
