"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { LOGIN_PATH } from "@/constants/navigation";
import { selectHall } from "@/hooks/useSelectedHall";
import { signup } from "@/features/auth/api";
import { TERMS, roomsOfHall, type TermKey } from "@/features/auth/constants";
import button from "@/features/auth/styles/button.module.css";
import type { AccountForm, Agreements, DormForm } from "@/features/auth/types";
import AccountStep from "./AccountStep";
import AuthFrame from "./AuthFrame";
import DoneStep from "./DoneStep";
import DormStep from "./DormStep";
import SignupProgress from "./SignupProgress";
import TermsDialog from "./TermsDialog";
import TermsStep from "./TermsStep";
import styles from "./SignupView.module.css";

const NO_AGREEMENTS: Agreements = { tos: false, privacy: false, push: false };
const EMPTY_ACCOUNT: AccountForm = { email: "", code: "", password: "", confirm: "", codeSentAt: null };
const EMPTY_DORM: DormForm = { name: "", hall: "", floor: "", roomNumber: "", roomId: "" };

/** /signup — four steps: terms, account, dorm info, done. */
export default function SignupView() {
  const [step, setStep] = useState(1);
  const [agreements, setAgreements] = useState<Agreements>(NO_AGREEMENTS);
  const [openTerm, setOpenTerm] = useState<TermKey | null>(null);
  const [account, setAccount] = useState<AccountForm>(EMPTY_ACCOUNT);
  const [dorm, setDorm] = useState<DormForm>(EMPTY_DORM);

  const go = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0 });
  };
  const closeTerm = useCallback(() => setOpenTerm(null), []);
  const term = TERMS.find((t) => t.key === openTerm);
  const roomName = roomsOfHall(dorm.hall).find((room) => room.id === dorm.roomId)?.name ?? "";

  async function createAccount() {
    await signup({
      email: account.email.trim(),
      code: account.code,
      password: account.password,
      name: dorm.name.trim(),
      hall: dorm.hall,
      floor: dorm.floor || null,
      roomNumber: dorm.roomNumber || null,
      defaultRoomId: dorm.roomId,
      agreements,
    });
    selectHall(dorm.hall);
    go(4);
  }

  return (
    <AuthFrame
      backdrop="dots"
      aside={
        step < 4 && (
          <p className={styles.haveAccount}>
            이미 계정이 있나요?
            <Link href={LOGIN_PATH} className={`${button.link} ${styles.loginLink}`}>
              로그인
            </Link>
          </p>
        )
      }
    >
      <div className={styles.stage}>
        <div className={styles.card}>
          <SignupProgress step={step} />
          {step === 1 && (
            <TermsStep agreements={agreements} onChange={setAgreements} onOpenTerm={setOpenTerm} onNext={() => go(2)} />
          )}
          {step === 2 && (
            <AccountStep
              form={account}
              onChange={(patch) => setAccount((prev) => ({ ...prev, ...patch }))}
              onPrev={() => go(1)}
              onNext={() => go(3)}
            />
          )}
          {step === 3 && (
            <DormStep
              form={dorm}
              onChange={(patch) => setDorm((prev) => ({ ...prev, ...patch }))}
              onPrev={() => go(2)}
              onSubmit={createAccount}
            />
          )}
          {step === 4 && <DoneStep roomName={roomName} />}
        </div>
      </div>
      {term && (
        <TermsDialog
          term={term}
          onClose={closeTerm}
          onAgree={() => {
            setAgreements((prev) => ({ ...prev, [term.key]: true }));
            closeTerm();
          }}
        />
      )}
    </AuthFrame>
  );
}
