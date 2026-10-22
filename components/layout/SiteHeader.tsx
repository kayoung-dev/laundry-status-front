import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { PAGE_NAV_ITEMS, type NavId } from "@/constants/navigation";
import tab from "./tab.module.css";
import HallPicker from "./HallPicker";
import HomeLink from "./HomeLink";
import ProfileMenu from "./ProfileMenu";
import styles from "./SiteHeader.module.css";
import WashOnLogo from "./WashOnLogo";

/** Sticky top bar. On phones only the hall picker stays; the other tabs move to MobileTabBar. */
export default function SiteHeader({ active }: { active?: NavId }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <HomeLink className={styles.home}>
          <WashOnLogo compactOnMobile />
        </HomeLink>
        <nav aria-label="주요 메뉴" className={styles.nav}>
          <HallPicker current={active === "room"} />
          {PAGE_NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${tab.tab} ${styles.pageTab}`}
              aria-current={item.id === active ? "page" : undefined}
              aria-label={item.isNew ? `${item.label}, 새 메뉴` : undefined}
            >
              {item.label}
              {item.isNew && <span aria-hidden="true" className={styles.newDot} />}
            </Link>
          ))}
        </nav>
        <span className={styles.spacer} />
        <button type="button" className={styles.iconButton} aria-label="알림">
          <Icon name="bell" size={18} />
        </button>
        <ProfileMenu />
      </div>
    </header>
  );
}
