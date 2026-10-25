import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import styles from "./LocationHero.module.css";

export interface Crumb {
  label: string;
  href?: string;
}

interface LocationHeroProps {
  /** Path from 세탁실 위치 down to this page; the last one is the current page. */
  crumbs: Crumb[];
  title: string;
  /** Building number beside the title. */
  code?: string;
  /** Web: sentence under the title. */
  lead?: string;
  /** Phones: the short line under the title (lead or chips are hidden there). */
  mobileLead: string;
  chips?: ReactNode;
  /** One level up, shown as the back button. */
  back?: { href: string; label: string };
  actions?: ReactNode;
}

/** Dotted band under the header: where you are, the title and the view switches. */
export default function LocationHero({ crumbs, title, code, lead, mobileLead, chips, back, actions }: LocationHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          {crumbs.length > 1 && (
            <nav aria-label="위치 경로" className={styles.crumbs}>
              {crumbs.map((c, i) => (
                <span key={c.label} className={styles.crumb}>
                  {i > 0 && <Icon name="chevron-right" size={12} className={styles.sep} />}
                  {c.href ? (
                    <Link href={c.href} className={styles.crumbLink}>
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className={styles.current}>
                      {c.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <div className={styles.titleRow}>
            {back && (
              <Link href={back.href} className={styles.back} aria-label={back.label}>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M10 3.5L5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
            <span className={styles.titleText}>
              <h1 className={styles.title}>
                {title}
                {code && <span className={styles.code}>{code}</span>}
              </h1>
              <span className={styles.mobileLead}>{mobileLead}</span>
            </span>
            {chips && <span className={styles.chips}>{chips}</span>}
          </div>
          {lead && <p className={styles.lead}>{lead}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <svg aria-hidden="true" className={styles.wave} viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0 22 C240 4 480 4 720 20 S1200 36 1440 18 V40 H0z" fill="var(--background-100)" />
      </svg>
    </section>
  );
}
