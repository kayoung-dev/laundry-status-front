import type { CSSProperties } from "react";
import styles from "./BubbleField.module.css";

export interface Bubble {
  left: string;
  size: number;
  duration?: number;
  delay?: number;
}

interface BubbleFieldProps {
  bubbles: Bubble[];
  /** hero: bright, rises far · soft: faint on tinted sections · dark: on navy. */
  tone: "hero" | "soft" | "dark";
}

/** Decorative soap bubbles drifting up from the bottom edge. */
export default function BubbleField({ bubbles, tone }: BubbleFieldProps) {
  return (
    <div aria-hidden="true" className={styles.field}>
      {bubbles.map((bubble, index) => (
        <span
          key={index}
          className={styles.bubble}
          data-tone={tone}
          style={
            {
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animationDuration: bubble.duration ? `${bubble.duration}s` : undefined,
              animationDelay: bubble.delay ? `${bubble.delay}s` : undefined,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
