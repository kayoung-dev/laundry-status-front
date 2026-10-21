import type { Metadata } from "next";
import LandingPage from "@/features/landing/components/LandingPage";

export const metadata: Metadata = {
  title: "WashOn — 기숙사 세탁실 빈자리 실시간 확인",
  description: "기숙사 세탁실의 세탁기·건조기 상태를 실시간으로 보고, 내 세탁이 끝나면 알림을 받으세요.",
};

export default function HomePage() {
  return <LandingPage />;
}
