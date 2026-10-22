import styles from "./WashOnLogo.module.css";

interface WashOnLogoProps {
  size?: number;
  /** Hide the "WashOn" wordmark on phones (header). */
  compactOnMobile?: boolean;
}

export default function WashOnLogo({ size = 28, compactOnMobile = false }: WashOnLogoProps) {
  return (
    <span className={styles.logo} data-compact={compactOnMobile || undefined} data-small={size < 28 || undefined}>
      <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="var(--gray-1000)" />
        <circle cx="14" cy="15.5" r="6.5" stroke="#ffffff" strokeWidth="2" fill="none" />
        <circle cx="8.5" cy="6.5" r="1.3" fill="#ffffff" />
        <path d="M10.5 16.5c1.2-1 2.3 1 3.5 0s2.3 1 3.5 0" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      <span className={styles.wordmark}>WashOn</span>
    </span>
  );
}
