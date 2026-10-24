import Link from "next/link";
import type { ReactNode } from "react";
import HomeLink from "@/components/layout/HomeLink";
import WashOnLogo from "@/components/layout/WashOnLogo";
import { siteFontVariables } from "@/lib/fonts";
import styles from "./AuthFrame.module.css";

const POLICY_LINKS = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#", strong: true },
  { label: "문의하기", href: "#" },
];

interface AuthFrameProps {
  /** Right side of the top bar, e.g. a link back home or to the login page. */
  aside?: ReactNode;
  /** Main area background: the plain white login split or the dotted sign-up backdrop. */
  backdrop?: "plain" | "dots";
  children: ReactNode;
}

/** Page frame of the login and sign-up screens: a slim top bar and policy footer instead of the site menus. */
export default function AuthFrame({ aside, backdrop = "plain", children }: AuthFrameProps) {
  return (
    <div className={`${siteFontVariables} ${styles.root}`}>
      <header className={styles.header}>
        <HomeLink className={styles.home}>
          <WashOnLogo />
        </HomeLink>
        {aside}
      </header>
      <main className={styles.main} data-backdrop={backdrop}>
        {children}
      </main>
      <footer className={styles.footer}>
        <nav aria-label="정책" className={styles.policies}>
          {POLICY_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className={styles.policy} data-strong={link.strong || undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <span>© 2026 WashOn</span>
      </footer>
    </div>
  );
}
