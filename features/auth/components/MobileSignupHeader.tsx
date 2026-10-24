import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { LOGIN_PATH } from "@/constants/navigation";
import { SIGNUP_STEPS } from "@/features/auth/constants";
import button from "@/features/auth/styles/button.module.css";
import styles from "./MobileSignupHeader.module.css";

interface MobileSignupHeaderProps {
  step: number;
  /** Back to the previous step; omitted where there is none (first and last step). */
  onPrev?: () => void;
}

/** Phone sign-up top bar: back, title and "n/4"; hidden on wider screens. */
export default function MobileSignupHeader({ step, onPrev }: MobileSignupHeaderProps) {
  return (
    <header className={styles.header}>
      {step === 1 ? (
        <Link href={LOGIN_PATH} className={`${button.icon} ${styles.back}`} aria-label="로그인으로 돌아가기">
          <Icon name="chevron-left" size={20} />
        </Link>
      ) : onPrev ? (
        <button type="button" className={`${button.icon} ${styles.back}`} aria-label="이전 단계" onClick={onPrev}>
          <Icon name="chevron-left" size={20} />
        </button>
      ) : (
        <span className={styles.back} />
      )}
      <span className={styles.title}>회원가입</span>
      <span className={styles.count} aria-label={`${SIGNUP_STEPS.length}단계 중 ${step}단계`}>
        <span className={styles.current}>{step}</span>/{SIGNUP_STEPS.length}
      </span>
    </header>
  );
}
