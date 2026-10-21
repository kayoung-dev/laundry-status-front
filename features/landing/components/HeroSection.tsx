import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { DEFAULT_ROOM, DEFAULT_ROOM_PATH, HERO_POINTS } from "../constants";
import motion from "../styles/motion.module.css";
import BubbleField, { type Bubble } from "./BubbleField";
import styles from "./HeroSection.module.css";
import LaundryPreview from "./LaundryPreview";
import WaveDivider from "./WaveDivider";

const BUBBLES: Bubble[] = [
  { left: "3%", size: 14, duration: 10 },
  { left: "9%", size: 8, duration: 8, delay: 2.5 },
  { left: "47%", size: 10, duration: 9, delay: 4 },
  { left: "58%", size: 18, duration: 11, delay: 1 },
  { left: "71%", size: 9, duration: 7.5, delay: 3 },
  { left: "83%", size: 22, duration: 12, delay: 5 },
  { left: "92%", size: 12, duration: 9.5, delay: 0.8 },
  { left: "97%", size: 7, duration: 8.5, delay: 6 },
];

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <BubbleField bubbles={BUBBLES} tone="hero" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="hero-title" className={`${styles.title} ${motion.rise} ${motion.d1}`}>
            <span className={styles.accent}>빈자리</span> 먼저 보고,
            <br />
            세탁하러 가세요
          </h1>
          <p className={`${styles.lead} ${motion.rise} ${motion.d2}`}>
            WashOn은 기숙사 세탁실의 세탁기와 건조기 상태를 실시간으로 보여 주고, 내 세탁이 끝나면 바로 알려
            드려요.
          </p>
          <div className={`${styles.ctaRow} ${motion.rise} ${motion.d3}`}>
            <Link href={DEFAULT_ROOM_PATH} className={styles.cta}>
              내 세탁실 보기
              <Icon name="arrow-right" size={18} className={styles.ctaArrow} />
            </Link>
          </div>
          <ul className={`${styles.points} ${motion.rise} ${motion.d4}`}>
            {HERO_POINTS.map((point) => (
              <li key={point}>
                <Icon name="check" className={styles.check} />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className={`${styles.preview} ${motion.rise} ${motion.d2}`}>
          <LaundryPreview roomName={DEFAULT_ROOM.name} />
        </div>
      </div>
      <WaveDivider back="var(--wash-wave)" front="var(--background-100)" />
    </section>
  );
}
