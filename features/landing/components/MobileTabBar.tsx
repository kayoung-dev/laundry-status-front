import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { NAV_ITEMS } from "../constants";
import styles from "./MobileTabBar.module.css";

/** Bottom tab bar replacing the header menu on phones (hidden from 768px). */
export default function MobileTabBar({ currentPath }: { currentPath: string }) {
  return (
    <nav aria-label="주요 메뉴" className={styles.bar}>
      {NAV_ITEMS.map((item) => {
        const current = item.href === currentPath;
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
