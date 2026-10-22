import motion from "@/styles/motion.module.css";
import styles from "./MachineDrum.module.css";

/** idle: still glass · running: slow gray swirl · mine: fast blue swirl. */
export type DrumState = "idle" | "running" | "mine";

/** Washing-machine door with the drum turning behind the glass (decorative). */
export default function MachineDrum({ state }: { state: DrumState }) {
  return (
    <div className={styles.door} data-state={state}>
      <div className={styles.glass}>
        {state === "idle" ? (
          <div className={styles.still} />
        ) : (
          <>
            <div className={`${styles.swirl} ${state === "mine" ? motion.rotate : motion.rotateSlow}`} />
            <div className={styles.foam} />
          </>
        )}
        <div className={styles.shine} />
        <div className={styles.glint} />
      </div>
    </div>
  );
}
