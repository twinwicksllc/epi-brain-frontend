import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EPI Brain - AI-Powered Conversational Platform",
  description: "Experience 9 distinct AI personalities designed to enhance your life, business, and personal growth.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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