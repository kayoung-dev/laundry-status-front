import Icon from "@/components/ui/Icon";
import { SIGNUP_STEPS } from "@/features/auth/constants";
import styles from "./SignupProgress.module.css";

/** The four sign-up steps as a segmented bar; `step` is 1-based. */
export default function SignupProgress({ step }: { step: number }) {
  return (
    <ol aria-label="가입 단계" className={styles.steps}>
      {SIGNUP_STEPS.map((name, index) => {
        const n = index + 1;
        const status = n < step ? "done" : n === step ? "current" : "todo";
        return (
          <li key={name} aria-current={status === "current" ? "step" : undefined} className={styles.step} data-status={status}>
            <span aria-hidden="true" className={styles.track}>
              <span className={styles.fill} />
            </span>
            <span className={styles.label}>
              {status === "done" ? (
                <Icon name="check-badge" size={14} className={styles.check} />
              ) : (
                <span className={styles.num}>{String(n).padStart(2, "0")}</span>
              )}
              {name}
              {status === "done" && <span className={styles.srOnly}>, 완료</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
