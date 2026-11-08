import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "adcut AI — 병원 숏폼 자동 편집",
  description: "대본대로 자동 컷편집, 의료광고법 검수 자막까지",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">{children}</body>
    </html>
  );
}
