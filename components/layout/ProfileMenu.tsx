"use client";

import { useCallback, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { useDismiss } from "@/hooks/useDismiss";
import { useSelectedHall } from "@/hooks/useSelectedHall";
import motion from "@/styles/motion.module.css";
import styles from "./ProfileMenu.module.css";

const MENU_ITEMS = ["내 정보", "알림 설정", "내 제보 내역"];

/**
 * Student profile dropdown. Student login does not exist yet, so the header
 * shows a guest and the items have no destination.
 */
export default function ProfileMenu() {
  const hall = useSelectedHall();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="프로필 메뉴"
        aria-haspopup="menu"
        aria-expanded={open}
        data-open={open || undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" className={styles.avatar}>
          <Icon name="user" />
        </span>
        <span className={styles.chevron}>
          <Icon name="chevron-down" size={14} />
        </span>
      </button>
      {open && (
        <div role="menu" aria-label="프로필" className={`${styles.menu} ${motion.rise}`}>
          <div className={styles.identity}>
            <span className={styles.name}>게스트</span>
            <span className={styles.meta}>기본 세탁실 {hall} 세탁실</span>
          </div>
          {MENU_ITEMS.map((label) => (
            <button key={label} type="button" role="menuitem" className={styles.item}>
              {label}
            </button>
          ))}
          <span aria-hidden="true" className={styles.separator} />
          <button type="button" role="menuitem" className={`${styles.item} ${styles.itemMuted}`}>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
