import Icon from "@/components/ui/Icon";
import { formatClock } from "@/lib/time";
import { countByType, nextToFinish, typeLabel } from "../machine-view";
import type { MachineSnapshotItem } from "../types";
import styles from "./RoomVerdict.module.css";

interface RoomVerdictProps {
  machines: MachineSnapshotItem[];
  now: Date | null;
  loading: boolean;
  isAlertOn: (machineId: string) => boolean;
  onToggleAlert: (machineId: string) => void;
}

/** One-line answer to "can I do laundry now?", free counts per type, and an alert for the next washer. */
export default function RoomVerdict({ machines, now, loading, isAlertOn, onToggleAlert }: RoomVerdictProps) {
  const counts = countByType(machines);
  const washers = counts.find((c) => c.type === "washer");
  const dryers = counts.find((c) => c.type === "dryer");
  const outOfService = machines.filter((m) => m.state === "maintenance" || m.state === "error").length;
  const nextWasher = nextToFinish(machines, "washer");
  const nextDryer = nextToFinish(machines, "dryer");
  const clock = (min: number) => (now ? formatClock(now, min) : `${min}분 후`);

  let tone: "ok" | "wait" | "none" = "none";
  let title: string;
  let sub = "";
  if (loading) {
    title = "기기 상태를 불러오는 중이에요";
  } else if (washers && washers.available > 0) {
    tone = "ok";
    title = "바로 세탁할 수 있어요";
    sub = `세탁기 ${washers.available}대 비어 있음`;
    if (dryers) {
      sub +=
        dryers.available > 0
          ? ` · 건조기 ${dryers.available}대 비어 있음`
          : nextDryer
            ? ` · 건조기는 ${clock(nextDryer.remainingMin!)}부터 사용 가능`
            : " · 건조기는 지금 사용할 수 없음";
    }
  } else if (nextWasher) {
    tone = "wait";
    title = "지금은 모두 사용 중이에요";
    sub = `${clock(nextWasher.remainingMin!)}에 ${nextWasher.label} 사용이 끝나요 (${nextWasher.remainingMin}분 후)`;
  } else {
    title = "지금 바로 쓸 수 있는 세탁기가 없어요";
    sub = machines.some((m) => m.state === "in_use")
      ? "끝나는 시간은 아직 확인하고 있어요"
      : "점검 중이거나 상태를 확인하고 있어요";
  }

  const alertOn = nextWasher ? isAlertOn(nextWasher.machineId) : false;

  return (
    <section aria-label="세탁실 요약" className={styles.verdict} data-tone={tone}>
      <div className={styles.answer}>
        <div className={styles.titleRow}>
          {tone === "ok" && <Icon name="check-circle" size={32} className={styles.mark} />}
          {tone === "wait" && <Icon name="clock-circle" size={32} className={styles.mark} />}
          <h2 className={styles.title}>{title}</h2>
        </div>
        {sub && <p className={styles.sub}>{sub}</p>}
      </div>
      <div className={styles.side}>
        {counts.length > 0 && (
          <ul aria-label="기기 종류별 빈 기기" className={styles.chips}>
            {counts.map((c) => (
              <li key={c.type} className={styles.chip}>
                {typeLabel(c.type)} <strong>{`${c.available}/${c.total}`}</strong>
              </li>
            ))}
            {outOfService > 0 && (
              <li className={styles.chip}>
                점검 <strong>{outOfService}</strong>
              </li>
            )}
          </ul>
        )}
        {tone === "wait" && nextWasher && (
          <button
            type="button"
            className={styles.cta}
            aria-pressed={alertOn}
            onClick={() => onToggleAlert(nextWasher.machineId)}
          >
            <Icon name={alertOn ? "bell-solid" : "bell"} />
            {alertOn ? `${nextWasher.label} 알림 설정됨` : `${nextWasher.label} 끝나면 알림`}
          </button>
        )}
      </div>
    </section>
  );
}
