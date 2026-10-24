"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import { TERM_BODY, type Term } from "@/features/auth/constants";
import button from "@/features/auth/styles/button.module.css";
import styles from "./TermsDialog.module.css";

interface TermsDialogProps {
  term: Term;
  onClose: () => void;
  onAgree: () => void;
}

/** Full text of one term: a centered modal on the web, a bottom sheet on phones. */
export default function TermsDialog({ term, onClose, onAgree }: TermsDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.layer}>
      <div aria-hidden="true" className={styles.backdrop} onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="terms-dialog-title" className={styles.dialog}>
        <span aria-hidden="true" className={styles.handle} />
        <div className={styles.head}>
          <h2 id="terms-dialog-title" className={styles.title}>
            {term.name}
          </h2>
          <button ref={closeRef} type="button" className={button.icon} aria-label="닫기" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className={styles.body}>
          {TERM_BODY.map((article) => (
            <section key={article.title} className={styles.article}>
              <h3 className={styles.articleTitle}>{article.title}</h3>
              <p className={styles.articleText}>{article.text}</p>
            </section>
          ))}
        </div>
        <div className={styles.foot}>
          <button type="button" className={`${button.text} ${styles.close}`} onClick={onClose}>
            닫기
          </button>
          <button type="button" className={`${button.primary} ${styles.agree}`} onClick={onAgree}>
            동의하기
          </button>
        </div>
      </div>
    </div>
  );
}
