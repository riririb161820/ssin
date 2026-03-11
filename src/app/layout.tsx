import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "상상인 마켓플레이스 | B2B 선박기자재",
  description: "상상인그룹 B2B 기자재 마켓플레이스 — 여신결제 · 선정산",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
