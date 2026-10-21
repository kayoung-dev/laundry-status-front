import Link from "next/link";
import { FOOTER_NAV, OPERATOR_INFO } from "../constants";
import styles from "./SiteFooter.module.css";
import WashOnLogo from "./WashOnLogo";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <WashOnLogo size={24} />
            <p className={styles.about}>기숙사 세탁실의 빈자리를 실시간으로 알려 주는 서비스예요.</p>
          </div>
          {FOOTER_NAV.map((group) => (
            <nav key={group.id} aria-label={group.title} className={styles.nav} data-group={group.id}>
              <h3 className={styles.navTitle}>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <p className={styles.operator}>{OPERATOR_INFO}</p>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} WashOn</span>
          <span className={styles.legal}>
            <Link href="#" className={styles.link}>
              이용약관
            </Link>
            <Link href="#" className={`${styles.link} ${styles.strong}`}>
              개인정보처리방침
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
