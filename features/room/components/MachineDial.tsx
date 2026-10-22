import type { MachineView } from "../types";
import styles from "./MachineDial.module.css";

const SIZE = 128;
const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Ring that fills with cycle progress, the state or minutes left in the middle. */
export default function MachineDial({ view }: { view: MachineView }) {
  const filled = CIRCUMFERENCE * Math.max(0, Math.min(1, view.progress));
  return (
    <div className={styles.dial} data-tone={view.tone}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={view.dialAria} className={styles.ring}>
        <circle cx="64" cy="64" r={RADIUS} className={styles.track} />
        <circle
          cx="64"
          cy="64"
          r={RADIUS}
          className={styles.arc}
          strokeDasharray={`${filled.toFixed(1)} ${CIRCUMFERENCE.toFixed(1)}`}
          transform="rotate(-90 64 64)"
        />
        <circle cx="64" cy="64" r="47" className={styles.face} />
      </svg>
      <div aria-hidden="true" className={styles.text}>
        <span className={styles.caption}>{view.dialLabel}</span>
        <span className={styles.value} data-numeric={view.dialNumeric || undefined}>
          {view.dialValue}
        </span>
        {view.dialSub && <span className={styles.caption}>{view.dialSub}</span>}
      </div>
    </div>
  );
}
