import type { ReactNode } from "react";
import styles from "./Message.module.css";

interface MessageProps {
  /** warning: in-progress / degraded notices, danger: failures. */
  tone: "warning" | "danger";
  size?: "md" | "sm";
  /** Render inline (`<span>`) instead of as a paragraph. */
  inline?: boolean;
  children: ReactNode;
}

/** Colored status or error text. */
export default function Message({ tone, size = "md", inline = false, children }: MessageProps) {
  const Tag = inline ? "span" : "p";
  return (
    <Tag className={styles.message} data-tone={tone} data-size={size}>
      {children}
    </Tag>
  );
}
