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
      <body>{children}</body>
    </html>
  );
}