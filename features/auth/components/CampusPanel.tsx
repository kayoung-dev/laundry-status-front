"use client";

import Image from "next/image";
import { useNow } from "@/hooks/useNow";
import campusWide from "@/features/auth/assets/campus-wide.jpg";
import { panelTone } from "@/features/auth/utils";
import styles from "./CampusPanel.module.css";

// Soap bubbles drifting up over the photo: horizontal position, size, loop length, start offset.
const BUBBLES = [
  { left: "14%", size: 140, duration: 26, delay: -6 },
  { left: "40%", size: 72, duration: 20, delay: -14 },
  { left: "70%", size: 104, duration: 24, delay: -2 },
  { left: "86%", size: 56, duration: 19, delay: -11 },
  { left: "28%", size: 88, duration: 23, delay: -19 },
];

const TONE_REFRESH_MS = 5 * 60_000;

/** Web login's left panel: headline over a campus photo tinted for the time of day. */
export default function CampusPanel() {
  const tone = panelTone(useNow(TONE_REFRESH_MS));

  return (
    <section aria-label="서비스 소개" className={styles.panel}>
      <div className={styles.frame} data-tone={tone}>
        <div aria-hidden="true" className={styles.stars} />
        <div className={styles.copy}>
          <p className={styles.eyebrow}>기숙사 세탁실 실시간 현황</p>
          <h2 className={styles.headline}>
            방에서 확인하고,
            <br />
            <span className={styles.accent}>빈자리로</span> 바로 가요
          </h2>
        </div>
        <div className={styles.photo}>
          <Image
            src={campusWide}
            alt="생활관과 운동장이 내려다보이는 캠퍼스 전경"
            fill
            sizes="(max-width: 1040px) 100vw, 55vw"
            loading="eager"
            className={styles.image}
          />
          <div aria-hidden="true" className={styles.wash} />
          <div aria-hidden="true" className={styles.shade} />
        </div>
        <div aria-hidden="true" className={styles.bubbles}>
          {BUBBLES.map((bubble) => (
            <span
              key={bubble.left}
              className={styles.bubble}
              style={{
                left: bubble.left,
                width: bubble.size,
                height: bubble.size,
                marginLeft: -bubble.size / 2,
                animationDuration: `${bubble.duration}s`,
                animationDelay: `${bubble.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
