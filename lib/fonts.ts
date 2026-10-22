import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";

// Geist for Latin and numbers, Noto Sans KR for Hangul (Geist has no Korean glyphs).
export const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
export const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
export const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-kr",
  preload: false,
});

export const siteFontVariables = `${geist.variable} ${geistMono.variable} ${notoSansKr.variable}`;
