import Icon from "@/components/ui/Icon";
import styles from "./RoomPickIllustration.module.css";

const BUILDINGS = ["은혜관", "국제관", "비전관"];

/** Step 1: choosing the default dorm and laundry room. */
export default function RoomPickIllustration() {
  return (
    <div className={styles.box}>
      <span className={styles.label}>기본 세탁실</span>
      <div className={styles.chips}>
        {BUILDINGS.map((name, index) => (
          <span key={name} className={styles.chip} data-selected={index === BUILDINGS.length - 1 || undefined}>
            {name}
          </span>
        ))}
      </div>
      <div className={styles.selected}>
        비전관 세탁실
        <Icon name="check" className={styles.check} />
      </div>
    </div>
  );
}
