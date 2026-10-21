import Icon from "@/components/ui/Icon";
import motion from "../styles/motion.module.css";
import styles from "./NotifyIllustration.module.css";

/** Step 3: the "done" notification for my machine. */
export default function NotifyIllustration() {
  return (
    <div className={styles.stack}>
      <div className={`${styles.notice} ${motion.bob}`}>
        <span className={styles.icon}>
          <Icon name="bell" />
        </span>
        <span className={styles.text}>
          <span className={styles.title}>세탁이 끝났어요</span>
          <span className={styles.meta}>세탁기 3번 · 방금</span>
        </span>
      </div>
      <div className={styles.watching}>끝나면 알림 받는 중</div>
    </div>
  );
}
