import type { ReactNode } from "react";
import section from "../styles/section.module.css";
import AvailabilityIllustration from "./AvailabilityIllustration";
import styles from "./HowItWorksSection.module.css";
import NotifyIllustration from "./NotifyIllustration";
import RoomPickIllustration from "./RoomPickIllustration";

interface Step {
  title: string;
  body: string;
  illustration: ReactNode;
}

const STEPS: Step[] = [
  {
    title: "내 세탁실 정하기",
    body: "거주 생활관과 세탁실을 한 번만 골라 두세요. 언제든 헤더에서 바꿀 수 있어요.",
    illustration: <RoomPickIllustration />,
  },
  {
    title: "빈자리 확인하고 내려가기",
    body: "비어 있는 기기와 곧 끝나는 기기를 확인하세요. 헛걸음할 일이 없어요.",
    illustration: <AvailabilityIllustration />,
  },
  {
    title: "끝나면 알림 받기",
    body: "쓰는 기기를 내 세탁으로 등록하면, 끝나는 순간 알려 드려요. 세탁실 앞에서 기다리지 않아도 돼요.",
    illustration: <NotifyIllustration />,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how" className={styles.section} aria-labelledby="how-title">
      <div className={`${section.container} ${styles.container}`}>
        <div className={styles.heading}>
          <div className={styles.headingText}>
            <span className={section.eyebrow}>사용 방법</span>
            <h2 id="how-title" className={section.title}>
              세 단계면 충분해요
            </h2>
          </div>
          <p className={styles.lead}>처음 한 번만 세탁실을 정해 두면, 그다음부터는 앱을 열자마자 빈자리를 볼 수 있어요.</p>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <div aria-hidden="true" className={styles.illustration}>
                {step.illustration}
              </div>
              <span className={`${section.eyebrow} ${styles.number}`}>{String(index + 1).padStart(2, "0")}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
