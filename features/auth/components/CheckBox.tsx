import type { ReactNode } from "react";
import styles from "./CheckBox.module.css";

interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Smaller box for inline options such as "로그인 상태 유지". */
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
}

/** Checkbox drawn as a button so the whole label is the hit area. */
export default function CheckBox({ checked, onChange, size = "md", className, children }: CheckBoxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={`${styles.check} ${className ?? ""}`}
      data-size={size}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.box}>
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 6.2l2.3 2.3 4.7-5" stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </button>
  );
}
