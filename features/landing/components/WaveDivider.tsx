import styles from "./WaveDivider.module.css";

interface WaveDividerProps {
  /** Back wave color, front wave color (the next section's background). */
  back: string;
  front: string;
  height?: number;
  size?: "md" | "sm";
}

/** Two drifting waves along a section's bottom edge. */
export default function WaveDivider({ back, front, height = 72, size = "md" }: WaveDividerProps) {
  return (
    <div aria-hidden="true" className={styles.waves} data-size={size} style={{ height }}>
      <svg className={styles.back} width="200%" viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path d="M0 32 C120 12 240 12 360 32 S600 52 720 32 S960 12 1080 32 S1320 52 1440 32 V64 H0z" fill={back} />
      </svg>
      <svg className={styles.front} width="200%" viewBox="0 0 1440 56" preserveAspectRatio="none">
        <path d="M0 28 C120 44 240 44 360 28 S600 12 720 28 S960 44 1080 28 S1320 12 1440 28 V56 H0z" fill={front} />
      </svg>
    </div>
  );
}
