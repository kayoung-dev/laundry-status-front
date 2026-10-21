import { STATE_LABEL } from "@/constants/machine-labels";
import type { MachineState } from "@/types/machine";
import { OVERRIDABLE_STATES } from "../constants";
import styles from "./OverrideActions.module.css";

interface OverrideActionsProps {
  busy: boolean;
  overrideActive: boolean;
  onOverride: (state: MachineState) => void;
  onClear: () => void;
  onToggleAudit: () => void;
}

export default function OverrideActions({
  busy,
  overrideActive,
  onOverride,
  onClear,
  onToggleAudit,
}: OverrideActionsProps) {
  return (
    <div className={styles.actions}>
      {OVERRIDABLE_STATES.map((state) => (
        <button key={state} type="button" disabled={busy} onClick={() => onOverride(state)}>
          {STATE_LABEL[state]}로 지정
        </button>
      ))}
      <button type="button" disabled={busy || !overrideActive} onClick={onClear}>
        해제
      </button>
      <button type="button" onClick={onToggleAudit}>
        감사 로그
      </button>
    </div>
  );
}
