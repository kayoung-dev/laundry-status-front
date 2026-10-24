import Link from "next/link";
import Icon from "@/components/ui/Icon";
import button from "@/features/auth/styles/button.module.css";
import AuthFrame from "./AuthFrame";
import CampusPanel from "./CampusPanel";
import LoginForm from "./LoginForm";
import styles from "./LoginView.module.css";

/** /login — campus photo panel beside the login form. */
export default function LoginView() {
  return (
    <AuthFrame
      aside={
        <Link href="/" className={`${button.text} ${styles.back}`}>
          <Icon name="arrow-left" className={button.arrowBack} />
          홈으로 돌아가기
        </Link>
      }
    >
      <div className={styles.split}>
        <CampusPanel />
        <div className={styles.formSide}>
          <LoginForm />
        </div>
      </div>
    </AuthFrame>
  );
}
