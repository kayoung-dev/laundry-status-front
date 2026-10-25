import type { Metadata } from "next";
import LoginView from "@/features/auth/components/LoginView";

export const metadata: Metadata = {
  title: "로그인 · WashOn",
};

export default function LoginPage() {
  return <LoginView />;
}
