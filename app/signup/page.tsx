import type { Metadata } from "next";
import SignupView from "@/features/auth/components/SignupView";

export const metadata: Metadata = {
  title: "회원가입 · WashOn",
};

export default function SignupPage() {
  return <SignupView />;
}
