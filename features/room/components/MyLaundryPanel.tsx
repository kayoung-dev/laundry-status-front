import Icon from "@/components/ui/Icon";
import { formatClock } from "@/lib/time";
import { describeMachine } from "../machine-view";
import type { MachineSnapshotItem } from "../types";
import styles from "./MyLaundryPanel.module.css";

interface MyLaundryPanelProps {
  machine: MachineSnapshotItem | null;
  now: Date | null;
  alertOn: boolean;
  onToggleAlert: () => void;
  onUnregister: () => void;
}

/** The machine registered as "내 세탁": minutes left, stage progress and its end alert. */
export default function MyLaundryPanel({ machine, now, alertOn, onToggleAlert, onUnregister }: MyLaundryPanelProps) {
  if (!machine) {
    return (
      <section aria-labelledby="mine-heading" className={styles.panel}>
        <h2 id="mine-heading" className={`${styles.heading} ${styles.emptyHeading}`}>
          내 세탁
        </h2>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>지금 세탁 중인 기기가 없어요</p>
          <p className={styles.emptyBody}>비어 있는 기기에서 ‘내 세탁으로 등록’을 누르면 끝날 때 알려 드려요.</p>
        </div>
      </section>
    );
  }

  const view = describeMachine(machine, now);
  const running = machine.state === "in_use";
  const notStarted = machine.state === "available";
  const left = view.remainingMin;

  return (
    <section aria-labelledby="mine-heading" className={styles.panel} data-active>
      <div className={styles.headRow}>
        <h2 id="mine-heading" className={styles.heading}>
          내 세탁
        </h2>
        <span className={styles.machine}>
          {machine.label}
          {running && view.steps && <span className={styles.headPhase}> · {view.title}</span>}
        </span>
      </div>

      {running && left != null ? (
        <div role="timer" className={styles.timer}>
          <span className={styles.minutes}>{left}분</span>
          <span className={styles.left}>남음</span>
          <span className={styles.endAt}>
            {now ? `${formatClock(now, left)} 종료 예정` : "종료 시각 계산 중"}
            {view.steps && <span className={styles.endPhase}> · {view.title}</span>}
          </span>
        </div>
      ) : (
        <div className={styles.status}>
          <p className={styles.statusTitle}>{notStarted ? "세탁 시작 전이에요" : view.title}</p>
          <p className={styles.statusBody}>{notStarted ? "세탁을 시작하면 남은 시간을 보여 드려요." : view.meta}</p>
        </div>
      )}

      {running && view.steps && (
        <ol aria-label="세탁 단계" className={styles.segments}>
          {view.steps.map((step) => (
            <li key={step.name} className={styles.segment} data-status={step.status}>
              <div aria-hidden="true" className={styles.segmentTrack}>
                <div className={styles.segmentFill} style={{ width: `${(step.fill * 100).toFixed(1)}%` }} />
              </div>
              <span className={styles.segmentName}>{step.name}</span>
            </li>
          ))}
        </ol>
      )}
      {running && view.bar != null && (
        <div aria-hidden="true" className={styles.segmentTrack} data-single>
          <div className={styles.segmentFill} style={{ width: `${(view.bar * 100).toFixed(1)}%` }} />
        </div>
      )}

      {running ? (
        <button type="button" className={styles.alert} aria-pressed={alertOn} onClick={onToggleAlert}>
          <Icon name={alertOn ? "bell-solid" : "bell"} />
          {alertOn ? "끝나면 알림 받는 중" : "끝나면 알림 받기"}
        </button>
      ) : (
        <button type="button" className={styles.unregister} onClick={onUnregister}>
          등록 취소
        </button>
      )}
    </section>
  );
}
