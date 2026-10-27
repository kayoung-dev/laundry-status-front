import Icon from "@/components/ui/Icon";
import WaveEdge from "@/components/ui/WaveEdge";
import type { ConnectionStatus, MachineSnapshotItem } from "../types";
import styles from "./RoomBanner.module.css";

interface RoomBannerProps {
  hall: string;
  machines: MachineSnapshotItem[];
  connectionStatus: ConnectionStatus;
}

/** Dotted band under the header: the page title (visually hidden), live connection and out-of-service notices. */
export default function RoomBanner({ hall, machines, connectionStatus }: RoomBannerProps) {
  const outOfService = machines.filter((m) => m.state === "maintenance" || m.state === "error");

  return (
    <section aria-label="세탁실 안내" className={styles.banner}>
      <h1 className="sr-only">{hall} 세탁실 현황</h1>
      <div className={styles.inner}>
        {connectionStatus === "error" && (
          <p role="status" className={styles.notice}>
            <span aria-hidden="true" className={styles.icon} data-tone="danger">
              <Icon name="alert" />
            </span>
            <span>
              <strong>연결 끊김</strong> · 실시간 연결에 문제가 생겨 다시 연결하고 있어요. 화면이 최신이 아닐 수 있어요.
            </span>
          </p>
        )}
        {outOfService.length > 0 && (
          <p role="status" className={styles.notice}>
            <span aria-hidden="true" className={styles.icon}>
              <Icon name="alert" />
            </span>
            <span>
              <strong>점검 안내</strong> · {outOfService.map((m) => m.label).join(", ")} — 지금은 사용할 수 없어요. 이용에 참고해 주세요.
            </span>
          </p>
        )}
      </div>
      <WaveEdge className={styles.wave} />
    </section>
  );
}
