import type { Metadata } from "next";
import type { ReactNode } from "react";
import OverlayScrollbar from "@/components/ui/OverlayScrollbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "WashOn",
  description: "Real-time laundry machine status monitoring",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <OverlayScrollbar />
      </body>
    </html>
  );
}
