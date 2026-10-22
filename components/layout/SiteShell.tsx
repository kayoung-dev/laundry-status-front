import type { ReactNode } from "react";
import type { NavId } from "@/constants/navigation";
import { siteFontVariables } from "@/lib/fonts";
import MobileTabBar from "./MobileTabBar";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./SiteShell.module.css";

interface SiteShellProps {
  /** Menu item of the current page, marked in the header and the phone tab bar. */
  active?: NavId;
  children: ReactNode;
}

/** Student-facing page frame: header, footer, phone tab bar and the Geist / Noto Sans KR fonts. */
export default function SiteShell({ active, children }: SiteShellProps) {
  return (
    <div className={`${siteFontVariables} ${styles.root}`}>
      <SiteHeader active={active} />
      {children}
      <SiteFooter />
      <MobileTabBar active={active} />
    </div>
  );
}
