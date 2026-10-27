import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import WaveEdge from "@/components/ui/WaveEdge";
import styles from "./LocationHero.module.css";

export interface Crumb {
  label: string;
  href?: string;
}

/** Fact beside the title ("지상 9층"); `accent` = the laundry floors. */
export interface HeroChip {
  label: string;
  accent?: boolean;
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
  chips?: HeroChip[];
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
                <Icon name="chevron-left" />
              </Link>
            )}
            <span className={styles.titleText}>
              <h1 className={styles.title}>
                {title}
                {code && <span className={styles.code}>{code}</span>}
              </h1>
              <span className={styles.mobileLead}>{mobileLead}</span>
            </span>
            {chips && chips.length > 0 && (
              <span className={styles.chips}>
                {chips.map((c) => (
                  <span key={c.label} className={styles.chip} data-tone={c.accent ? "accent" : undefined}>
                    {c.label}
                  </span>
                ))}
              </span>
            )}
          </div>
          {lead && <p className={styles.lead}>{lead}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <WaveEdge className={styles.wave} />
    </section>
  );
}
