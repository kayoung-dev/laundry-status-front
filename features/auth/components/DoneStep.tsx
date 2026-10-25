"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { DEFAULT_ROOM_PATH } from "@/constants/navigation";
import button from "@/features/auth/styles/button.module.css";
import styles from "./DoneStep.module.css";

type NotifyState = "ask" | "on" | "blocked";

/** Step 4: account created; offer browser notifications. */
export default function DoneStep({ roomName }: { roomName: string }) {
  const router = useRouter();
  const [notify, setNotify] = useState<NotifyState>("ask");

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setNotify("blocked");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotify(permission === "granted" ? "on" : "blocked");
  }

  return (
    <section className={styles.done} aria-labelledby="signup-done-title">
      <h1 id="signup-done-title" className={styles.title}>
        가입이 끝났어요
      </h1>
      <p className={styles.summary}>
        기본 세탁실을 <strong className={styles.room}>{roomName}</strong>로 <br className={styles.mobileBreak} />
        설정했어요
      </p>

      <div className={styles.notify}>
        <div className={styles.notifyInfo}>
          <span aria-hidden="true" className={styles.bell}>
            <Icon name="bell" size={20} />
          </span>
          <span className={styles.notifyText}>
            <span className={styles.notifyTitle}>세탁이 끝나면 알려 드릴까요?</span>
            <span className={styles.notifySub}>
              {notify === "blocked" ? "브라우저 설정에서 이 사이트의 알림을 허용해 주세요" : "기기가 끝나거나 비면 알려 드려요"}
            </span>
          </span>
        </div>
        {notify === "on" ? (
          <p role="status" className={styles.notifyOn}>
            <Icon name="check-badge" size={16} className={styles.onIcon} />
            알림을 켰어요
          </p>
        ) : (
          <div className={styles.notifyActions}>
            <button type="button" className={`${button.text} ${styles.later}`} onClick={() => router.push(DEFAULT_ROOM_PATH)}>
              나중에
            </button>
            <button type="button" className={`${button.primary} ${styles.enable}`} onClick={enableNotifications}>
              알림 켜기
            </button>
          </div>
        )}
      </div>

      <Link href={DEFAULT_ROOM_PATH} className={`${button.link} ${styles.go}`}>
        세탁실 현황 보러 가기
        <Icon name="arrow-right" size={14} />
      </Link>
    </section>
  );
}
