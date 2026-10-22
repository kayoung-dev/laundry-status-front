"use client";

import Icon from "@/components/ui/Icon";
import motion from "@/styles/motion.module.css";
import { useClock } from "../hooks/useClock";
import styles from "./LaundryPreview.module.css";
import MachineDrum, { type DrumState } from "./MachineDrum";
import StatusPill, { type PillTone } from "./StatusPill";

interface PreviewMachine {
  number: number;
  drum: DrumState;
  chip: string;
  dot: PillTone;
  status: string;
  /** Shorter label used on phones, where the name line is dropped. */
  compactStatus: string;
}

// Illustration only: a sample room, not live data.
const MACHINES: PreviewMachine[] = [
  { number: 1, drum: "idle", chip: "READY", dot: "ready", status: "비어 있음", compactStatus: "비어 있음" },
  { number: 2, drum: "running", chip: "24:00", dot: "running", status: "24분 남음", compactStatus: "24분" },
  { number: 3, drum: "mine", chip: "08:00", dot: "mine", status: "내 세탁 · 8분", compactStatus: "내 세탁" },
];

const NEXT_FREE_IN_MIN = 8;

/** Hero illustration: three machines, a "done" toast and the next free slot. */
export default function LaundryPreview({ roomName }: { roomName: string }) {
  const now = useClock();
  const nextAt = useClock(NEXT_FREE_IN_MIN);

  return (
    <div aria-hidden="true" className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.room}>{roomName}</span>
          <span className={styles.live}>
            <span className={`${styles.liveDot} ${motion.pulse}`} />
            실시간 · {now ?? "--:--"}
          </span>
        </div>
        <div className={styles.machines}>
          {MACHINES.map((machine) => (
            <div key={machine.number} className={styles.machine}>
              <div className={styles.tile} data-mine={machine.drum === "mine" || undefined}>
                <div className={styles.tileTop}>
                  <span className={styles.chip} data-tone={machine.dot}>
                    {machine.chip}
                  </span>
                  <span
                    className={`${styles.dot} ${machine.drum === "mine" ? motion.pulse : ""}`}
                    data-tone={machine.dot}
                  />
                </div>
                <div className={styles.drum}>
                  <MachineDrum state={machine.drum} />
                </div>
              </div>
              <span className={styles.name}>세탁기 {machine.number}번</span>
              <span className={styles.status}>
                <StatusPill tone={machine.dot}>{machine.status}</StatusPill>
              </span>
              <span className={styles.compactStatus}>
                <StatusPill tone={machine.dot} size="sm">
                  {machine.number}번 · {machine.compactStatus}
                </StatusPill>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.toast} ${motion.toast}`}>
        <span className={styles.toastIcon}>
          <Icon name="bell" size={18} />
        </span>
        <span className={styles.toastText}>
          <span className={styles.toastTitle}>세탁기 3번 세탁이 끝났어요</span>
          <span className={styles.toastBody}>지금 꺼내러 가면 딱 맞아요</span>
        </span>
      </div>

      <div className={`${styles.next} ${motion.bob}`}>
        <Icon name="clock" size={14} />
        다음 빈자리 {nextAt ?? "--:--"} · 세탁기 3번
      </div>
    </div>
  );
}
