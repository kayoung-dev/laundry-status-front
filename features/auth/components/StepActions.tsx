import Icon from "@/components/ui/Icon";
import button from "@/features/auth/styles/button.module.css";
import Spinner from "./Spinner";
import styles from "./StepActions.module.css";

interface StepActionsProps {
  /** Omitted on the first step. */
  onPrev?: () => void;
  nextLabel: string;
  busyLabel?: string;
  busy?: boolean;
  disabled?: boolean;
  /** Why the next button is disabled. */
  hint?: string;
}

/** Bottom row of a sign-up step. The next button submits the step's form. */
export default function StepActions({ onPrev, nextLabel, busyLabel, busy = false, disabled = false, hint }: StepActionsProps) {
  return (
    <div className={styles.actions}>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.row}>
        {onPrev && (
          <button type="button" className={`${button.text} ${styles.prev}`} onClick={onPrev}>
            <Icon name="arrow-left" className={button.arrowBack} />
            이전
          </button>
        )}
        <button type="submit" className={`${button.primary} ${styles.next}`} disabled={disabled} aria-busy={busy}>
          {busy && <Spinner />}
          {busy && busyLabel ? busyLabel : nextLabel}
        </button>
      </div>
    </div>
  );
}
