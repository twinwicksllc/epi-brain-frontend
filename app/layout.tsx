import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EPI Brain - AI-Powered Conversational Platform",
  description: "Experience 9 distinct AI personalities designed to enhance your life, business, and personal growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e]">{children}</body>
    </html>
  );
}