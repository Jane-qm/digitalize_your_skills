import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digitalize Your Skills Demo",
  description: "校友技能交换 + 智能体对话 Demo"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
