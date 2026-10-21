import Link from "next/link";
import Icon from "@/components/ui/Icon";
import motion from "../styles/motion.module.css";
import { DEFAULT_ROOM, DEFAULT_ROOM_PATH, NAV_ITEMS } from "../constants";
import ProfileMenu from "./ProfileMenu";
import styles from "./SiteHeader.module.css";
import WashOnLogo from "./WashOnLogo";

/** Sticky top bar. On phones the menu moves to MobileTabBar. */
export default function SiteHeader({ currentPath }: { currentPath: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" aria-label="WashOn 홈" className={styles.home}>
          <WashOnLogo compactOnMobile />
        </Link>
        <span aria-hidden="true" className={styles.divider} />
        <Link href={DEFAULT_ROOM_PATH} className={styles.room} aria-label={`현재 세탁실 ${DEFAULT_ROOM.name} 현황 보기`}>
          <span aria-hidden="true" className={`${styles.liveDot} ${motion.pulse}`} />
          {DEFAULT_ROOM.name}
          <Icon name="chevron-down" size={14} />
        </Link>
        <nav aria-label="주요 메뉴" className={styles.nav}>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={item.href === currentPath ? "page" : undefined}
                >
                  {item.label}
                  {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span className={styles.spacer} />
        <button type="button" className={styles.iconButton} aria-label="알림">
          <Icon name="bell" size={18} />
        </button>
        <ProfileMenu roomName={DEFAULT_ROOM.name} />
      </div>
    </header>
  );
}
