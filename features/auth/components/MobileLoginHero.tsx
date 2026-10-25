import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import WashOnLogo from "@/components/layout/WashOnLogo";
import campusNarrow from "@/features/auth/assets/campus-narrow.jpg";
import styles from "./MobileLoginHero.module.css";

/** Phone login's top photo strip with a close button and the logo; hidden on wider screens. */
export default function MobileLoginHero() {
  return (
    <div className={styles.hero}>
      <Image
        src={campusNarrow}
        alt="녹음이 짙은 캠퍼스와 생활관 건물 풍경"
        fill
        sizes="100vw"
        loading="eager"
        className={styles.image}
      />
      <div aria-hidden="true" className={styles.fade} />
      <div className={styles.bar}>
        <Link href="/" aria-label="닫기" className={styles.close}>
          <Icon name="close" size={18} />
        </Link>
        <span className={styles.logo}>
          <WashOnLogo size={22} />
        </span>
        <span className={styles.spacer} />
      </div>
    </div>
  );
}
