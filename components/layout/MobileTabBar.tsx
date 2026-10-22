import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { NAV_ITEMS, type NavId } from "@/constants/navigation";
import styles from "./MobileTabBar.module.css";

/** Bottom tab bar replacing the header menu on phones (hidden from 768px). Home is the logo. */
export default function MobileTabBar({ active }: { active?: NavId }) {
  return (
    <nav aria-label="주요 메뉴" className={styles.bar}>
      {NAV_ITEMS.map((item) => {
        const current = item.id === active;
        return (
          <Link key={item.label} href={item.href} className={styles.tab} aria-current={current ? "page" : undefined}>
            <Icon name={item.icon} size={22} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
