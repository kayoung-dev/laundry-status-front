import type { Ref } from "react";
import { STATE_LABEL } from "@/constants/machine-labels";
import type { MachineState } from "@/types/machine";
import { STAGE_LABEL } from "../constants";
import type { MachineSnapshotItem } from "../types";
import styles from "./MachineCard.module.css";
import ReportPicker from "./ReportPicker";

interface MachineCardProps {
  ref?: Ref<HTMLElement>;
  machine: MachineSnapshotItem;
  highlighted: boolean;
  reportOpen: boolean;
  reportAck?: string;
  onToggleReport: () => void;
  onReport: (state: MachineState) => void;
}

export default function MachineCard({
  ref,
  machine,
  highlighted,
  reportOpen,
  reportAck,
  onToggleReport,
  onReport,
}: MachineCardProps) {
  return (
    <article
      ref={ref}
      className={highlighted ? `${styles.card} ${styles.cardHighlighted}` : styles.card}
      data-state={machine.state}
      data-highlighted={highlighted || undefined}
    >
      <h2>{machine.label}</h2>
      <p className={styles.stateLabel}>
        {/* P2-002: known stage gets its own icon+label next to the state;
            unknown/null stage falls back to the plain state label. */}
        {machine.state === "in_use" && machine.washStage
          ? STAGE_LABEL[machine.washStage]
          : STATE_LABEL[machine.state]}
      </p>
      {machine.state === "in_use" && machine.remainingMin != null && <p>남은 시간: {machine.remainingMin}분</p>}
      {machine.state === "error" && machine.errorCode && <p>에러 코드: {machine.errorCode}</p>}

      <button type="button" onClick={onToggleReport}>
        상태가 달라요
      </button>

      {reportOpen && <ReportPicker onSelect={onReport} />}

      {reportAck && <p className={styles.reportAck}>{reportAck}</p>}
    </article>
  );
}
