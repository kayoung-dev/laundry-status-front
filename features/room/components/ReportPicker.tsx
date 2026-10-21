import { STATE_LABEL } from "@/constants/machine-labels";
import type { MachineState } from "@/types/machine";
import { REPORTABLE_STATES } from "../constants";
import styles from "./ReportPicker.module.css";

interface ReportPickerProps {
  onSelect: (state: MachineState) => void;
}

/** "상태가 달라요" options: the state the student actually sees. */
export default function ReportPicker({ onSelect }: ReportPickerProps) {
  return (
    <div role="group" aria-label="상태 제보" className={styles.reportPicker}>
      <p>실제 상태를 선택해주세요:</p>
      {REPORTABLE_STATES.map((state) => (
        <button key={state} type="button" onClick={() => onSelect(state)}>
          {STATE_LABEL[state]}
        </button>
      ))}
    </div>
  );
}
