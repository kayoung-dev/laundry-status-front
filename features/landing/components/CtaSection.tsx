import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { DEFAULT_ROOM_PATH } from "@/constants/navigation";
import section from "../styles/section.module.css";
import BubbleField, { type Bubble } from "./BubbleField";
import styles from "./CtaSection.module.css";
import WaveDivider from "./WaveDivider";

const BUBBLES: Bubble[] = [
  { left: "62%", size: 14 },
  { left: "74%", size: 8, delay: 4 },
  { left: "88%", size: 18, delay: 7, duration: 15 },
];

export default function CtaSection() {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className={`${section.container} ${styles.container}`}>
        <div className={styles.panel}>
          <BubbleField bubbles={BUBBLES} tone="dark" />
          <WaveDivider back="#ffffff0d" front="#ffffff12" height={56} size="sm" />
          <div className={styles.copy}>
            <h2 id="cta-title" className={styles.title}>
              오늘 세탁, 기다리지 말고
              <br className={section.mobileBreak} /> 맞춰 가세요
            </h2>
            <p className={styles.body}>지금 내 세탁실에 빈 기기가 있는지 바로 확인해 보세요.</p>
          </div>
          <Link href={DEFAULT_ROOM_PATH} className={styles.button}>
            내 세탁실 보기
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
