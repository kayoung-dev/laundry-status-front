import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { LOCATION_PATH } from "@/constants/navigation";
import styles from "./LocationTile.module.css";

/** Link to the machine layout map ("세탁실 위치"). */
export default function LocationTile() {
  return (
    <Link href={LOCATION_PATH} className={styles.tile}>
      <span aria-hidden="true" className={styles.icon}>
        <Icon name="pin" size={24} />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>기기 위치 보기</span>
        <span className={styles.body}>세탁기·건조기 배치를 그림으로 확인해요</span>
      </span>
      <Icon name="chevron-right" className={styles.chevron} />
    </Link>
  );
}
