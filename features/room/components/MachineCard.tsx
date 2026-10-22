import type { Ref } from "react";
import Icon from "@/components/ui/Icon";
import motion from "@/styles/motion.module.css";
import type { MachineState } from "@/types/machine";
import { describeMachine } from "../machine-view";
import type { MachineSnapshotItem } from "../types";
import styles from "./MachineCard.module.css";
import MachineDial from "./MachineDial";
import ReportPicker from "./ReportPicker";
import WashSteps from "./WashSteps";

interface MachineCardProps {
  ref?: Ref<HTMLElement>;
  machine: MachineSnapshotItem;
  now: Date | null;
  mine: boolean;
  highlighted: boolean;
  alertOn: boolean;
  onToggleAlert: () => void;
  onToggleRegister: () => void;
  reportOpen: boolean;
  reportAck?: string;
  onToggleReport: () => void;
  onReport: (state: MachineState) => void;
}

export default function MachineCard({
  ref,
  machine,
  now,
  mine,
  highlighted,
  alertOn,
  onToggleAlert,
  onToggleRegister,
  reportOpen,
  reportAck,
  onToggleReport,
  onReport,
}: MachineCardProps) {
  const view = describeMachine(machine, now);
  const busy = view.tone === "busy" || view.tone === "soon";

  return (
    <article
      ref={ref}
      aria-label={machine.label}
      className={styles.card}
      data-tone={view.tone}
      data-mine={mine || undefined}
      data-highlighted={highlighted || undefined}
    >
      <div className={styles.dial}>
        <MachineDial view={view} />
      </div>

      <div className={styles.head}>
        <span className={styles.badge}>
          <span aria-hidden="true" className={busy ? `${styles.badgeDot} ${motion.pulse}` : styles.badgeDot} />
          {view.badge}
        </span>
        <span className={styles.label}>{machine.label}</span>
        {mine && <span className={styles.mineTag}>내 세탁</span>}
      </div>

      <div className={styles.titleRow}>
        <h4 className={styles.title}>{view.title}</h4>
        {view.sub && <span className={styles.sub}>{view.sub}</span>}
      </div>

      {(view.steps || view.bar != null || view.meta) && (
        <div className={styles.details}>
          {view.steps && <WashSteps steps={view.steps} />}
          {view.bar != null && (
            <div aria-hidden="true" className={styles.bar}>
              <div className={styles.barFill} style={{ width: `${(view.bar * 100).toFixed(1)}%` }} />
            </div>
          )}
          {view.meta && <p className={styles.meta}>{view.meta}</p>}
        </div>
      )}

      <div className={styles.actions}>
        {view.canNotify && (
          <button type="button" className={styles.secondary} aria-pressed={alertOn} onClick={onToggleAlert}>
            <Icon name={alertOn ? "bell-solid" : "bell"} />
            {alertOn ? "알림 설정됨" : "끝나면 알림"}
          </button>
        )}
        {view.canRegister && (
          <button type="button" className={styles.secondary} aria-pressed={mine} onClick={onToggleRegister}>
            {mine ? "내 세탁 등록됨" : "내 세탁으로 등록"}
          </button>
        )}
        <button
          type="button"
          className={styles.ghost}
          aria-label={`${machine.label} 상태가 달라요, 제보하기`}
          aria-expanded={reportOpen}
          onClick={onToggleReport}
        >
          상태가 달라요
        </button>
      </div>

      {(reportOpen || reportAck) && (
        <div className={styles.report}>
          {reportOpen && <ReportPicker onSelect={onReport} />}
          {reportAck && (
            <p role="status" className={styles.reportAck}>
              {reportAck}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
