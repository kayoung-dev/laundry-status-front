import styles from "./RouteSteps.module.css";

/** "가는 길": from the elevator to the laundry room door, in three lines. */
export default function RouteSteps({ steps, basic }: { steps: string[]; basic: boolean }) {
  return (
    <section aria-labelledby="route-title" className={styles.panel}>
      <h2 id="route-title" className={styles.title}>
        가는 길
      </h2>
      <ol className={styles.steps}>
        {steps.map((s, i) => (
          <li key={s} className={styles.step}>
            <span aria-hidden="true" className={styles.n}>
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      {basic && <p className={styles.note}>실제 도면이 아닌 기본 배치예요. 위치는 현장 안내를 함께 확인해 주세요.</p>}
    </section>
  );
}
