import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { FloorLabel } from "@/features/location/scene-anchors";
import styles from "./FloorMarker.module.css";

interface FloorMarkerProps {
  label: FloorLabel;
  hallName: string;
  href: string;
}

/** Floor number beside a slab in the hall view; laundry floors link to their floor plan. */
export default function FloorMarker({ label, hallName, href }: FloorMarkerProps) {
  if (!label.laundry) {
    return <span className={styles.floor}>{label.floor}층</span>;
  }
  return (
    <Link href={href} className={styles.tag} aria-label={`${hallName} ${label.floor}층 세탁실 배치도 보기`}>
      {label.floor}층 세탁실
      <Icon name="chevron-right" size={14} className={styles.chevron} />
    </Link>
  );
}
