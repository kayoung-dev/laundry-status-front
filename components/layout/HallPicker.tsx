"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { HALLS, hallRoomPath } from "@/constants/navigation";
import { useDismiss } from "@/hooks/useDismiss";
import { selectHall, useSelectedHall } from "@/hooks/useSelectedHall";
import motion from "@/styles/motion.module.css";
import tab from "./tab.module.css";
import styles from "./HallPicker.module.css";

/** Header tab that opens the residence hall list (4 columns on desktop, a list on phones); a pick opens that hall's room page. */
export default function HallPicker({ current = false }: { current?: boolean }) {
  const hall = useSelectedHall();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={tab.tab}
        aria-current={current ? "page" : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`생활관 세탁실, 현재 ${hall} 세탁실`}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" className={`${styles.liveDot} ${motion.pulse}`} />
        {hall} 세탁실
        <span className={styles.chevron} data-open={open || undefined}>
          <Icon name="chevron-down" size={14} />
        </span>
      </button>
      {open && (
        <div role="menu" aria-label="생활관 세탁실 목록" className={`${styles.menu} ${motion.rise}`}>
          <span className={styles.heading}>생활관</span>
          <div className={styles.list}>
            {HALLS.map((name) => (
              <button
                key={name}
                type="button"
                role="menuitemradio"
                aria-checked={name === hall}
                className={styles.item}
                onClick={() => {
                  selectHall(name);
                  setOpen(false);
                  const path = hallRoomPath(name);
                  if (pathname !== path) {
                    router.push(path);
                  }
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
