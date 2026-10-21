import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { FEATURES } from "../constants";
import section from "../styles/section.module.css";
import BubbleField, { type Bubble } from "./BubbleField";
import styles from "./FeaturesSection.module.css";

const BUBBLES: Bubble[] = [
  { left: "4%", size: 12 },
  { left: "8%", size: 7, delay: 5, duration: 16 },
  { left: "93%", size: 14, delay: 2.5 },
  { left: "97%", size: 8, delay: 8, duration: 18 },
];

export default function FeaturesSection() {
  return (
    <section className={styles.section} aria-labelledby="features-title">
      <svg aria-hidden="true" className={styles.topCurve} width="100%" height="40" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0 0 H1440 V14 C1200 34 960 34 720 20 S240 4 0 22 Z" fill="var(--background-100)" />
      </svg>
      <BubbleField bubbles={BUBBLES} tone="soft" />
      <div className={`${section.container} ${styles.container}`}>
        <div className={styles.heading}>
          <span className={section.eyebrow}>핵심 기능</span>
          <h2 id="features-title" className={section.title}>
            기다리는 시간을
            <br className={section.mobileBreak} /> 줄이는 네 가지
          </h2>
        </div>
        <ul className={styles.grid}>
          {FEATURES.map((feature) => (
            <li key={feature.title} className={styles.card}>
              <span aria-hidden="true" className={styles.icon}>
                <Icon name={feature.icon} size={20} />
              </span>
              <span className={styles.text}>
                <h3 className={styles.title}>{feature.title}</h3>
                <p className={styles.body}>{feature.body}</p>
                {feature.link && (
                  <Link href={feature.link.href} className={styles.link}>
                    {feature.link.label}
                  </Link>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
