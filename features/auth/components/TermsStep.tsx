import type { FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { TERMS, type TermKey } from "@/features/auth/constants";
import step from "@/features/auth/styles/step.module.css";
import type { Agreements } from "@/features/auth/types";
import CheckBox from "./CheckBox";
import StepActions from "./StepActions";
import styles from "./TermsStep.module.css";

interface TermsStepProps {
  agreements: Agreements;
  onChange: (agreements: Agreements) => void;
  onOpenTerm: (key: TermKey) => void;
  onNext: () => void;
}

/** Step 1: agree to the terms; every required one unlocks the next step. */
export default function TermsStep({ agreements, onChange, onOpenTerm, onNext }: TermsStepProps) {
  const allOn = TERMS.every((term) => agreements[term.key]);
  const requiredOk = TERMS.filter((term) => term.required).every((term) => agreements[term.key]);

  function setAll(on: boolean) {
    onChange({ tos: on, privacy: on, push: on });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requiredOk) {
      onNext();
    }
  }

  return (
    <form className={step.step} aria-labelledby="signup-terms-title" noValidate onSubmit={onSubmit}>
      <h1 id="signup-terms-title" className={`${step.title} ${styles.title}`}>
        서비스 이용에 <br className={step.mobileBreak} />
        동의해 주세요
      </h1>

      <CheckBox checked={allOn} onChange={setAll} className={styles.all}>
        <span className={styles.allText}>
          <span className={styles.allTitle}>전체 동의</span>
          <span className={styles.allSub}>선택 항목까지 모두 동의해요</span>
        </span>
      </CheckBox>

      <ul className={styles.list}>
        {TERMS.map((term) => (
          <li key={term.key} className={styles.row}>
            <CheckBox
              checked={agreements[term.key]}
              onChange={(on) => onChange({ ...agreements, [term.key]: on })}
              className={styles.term}
            >
              <span>
                <span className={styles.tag} data-required={term.required || undefined}>
                  {term.required ? "필수" : "선택"}
                </span>
                {term.name}
              </span>
            </CheckBox>
            <button
              type="button"
              className={styles.view}
              aria-haspopup="dialog"
              aria-label={`${term.name} 보기`}
              onClick={() => onOpenTerm(term.key)}
            >
              보기
              <Icon name="chevron-right" size={14} />
            </button>
          </li>
        ))}
      </ul>

      <StepActions
        nextLabel="동의하고 계속"
        disabled={!requiredOk}
        hint={requiredOk ? undefined : "필수 항목에 모두 동의하면 계속할 수 있어요"}
      />
    </form>
  );
}
