import { useId } from "react";
import { STATE_LABEL } from "@/constants/machine-labels";
import type { MachineState } from "@/types/machine";
import { REPORTABLE_STATES } from "../constants";
import styles from "./ReportPicker.module.css";

interface ReportPickerProps {
  onSelect: (state: MachineState) => void;
}

/** "상태가 달라요" options: the state the student actually sees. */
export default function ReportPicker({ onSelect }: ReportPickerProps) {
  const labelId = useId();
  return (
    <div role="group" aria-labelledby={labelId} className={styles.picker}>
      <p id={labelId} className={styles.label}>
        실제로는 어떤 상태인가요?
      </p>
      <div className={styles.options}>
        {REPORTABLE_STATES.map((state) => (
          <button key={state} type="button" className={styles.option} onClick={() => onSelect(state)}>
            {STATE_LABEL[state]}
          </button>
        ))}
      </div>
    </div>
  );
}
