import styles from "./WaveEdge.module.css";

/** Wavy bottom edge of a dotted band, filled with the page background. The parent needs `position: relative`. */
export default function WaveEdge({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className ? `${styles.wave} ${className}` : styles.wave} viewBox="0 0 1440 40" preserveAspectRatio="none">
      <path d="M0 22 C240 4 480 4 720 20 S1200 36 1440 18 V40 H0z" fill="var(--background-100)" />
    </svg>
  );
}
