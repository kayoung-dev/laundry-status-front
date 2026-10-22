import Icon from "@/components/ui/Icon";
import motion from "@/styles/motion.module.css";
import type { StepView } from "../types";
import styles from "./WashSteps.module.css";

/** 세탁 → 헹굼 → 탈수 with done / current / upcoming nodes. */
export default function WashSteps({ steps }: { steps: StepView[] }) {
  return (
    <ol aria-label="세탁 단계" className={styles.steps}>
      {steps.map((step) => (
        <li key={step.name} className={styles.step} data-status={step.status}>
          <div className={styles.track}>
            <span className={styles.node}>
              {step.status === "done" && <Icon name="check" size={10} />}
              {step.status === "current" && <span className={`${styles.dot} ${motion.pulse}`} />}
            </span>
            <span className={styles.line} />
          </div>
          <span className={styles.name}>
            {step.name}
            {step.status === "current" && <span className={styles.srOnly}> (진행 중)</span>}
            {step.status === "done" && <span className={styles.srOnly}> (완료)</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
