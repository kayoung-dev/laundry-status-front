import styles from "./AvailabilityIllustration.module.css";
import StatusPill, { type PillTone } from "./StatusPill";

const ROWS: { name: string; tone: PillTone; status: string }[] = [
  { name: "세탁기 1번", tone: "ready", status: "비어 있음" },
  { name: "세탁기 3번", tone: "soon", status: "곧 끝나요" },
  { name: "건조기 1번", tone: "running", status: "31분 남음" },
];

/** Step 2: a short machine list with free / almost done / running. */
export default function AvailabilityIllustration() {
  return (
    <div className={styles.list}>
      {ROWS.map((row) => (
        <div key={row.name} className={styles.row}>
          <span className={styles.dot} data-tone={row.tone} />
          <span className={styles.name}>{row.name}</span>
          <StatusPill tone={row.tone} size="sm">
            {row.status}
          </StatusPill>
        </div>
      ))}
    </div>
  );
}
