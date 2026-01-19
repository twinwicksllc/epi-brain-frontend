import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EPI Brain | 9 AI Personalities for Life, Business & Growth",
  description: "Transform your life with 9 specialized AI personalities. 24/7 support for business, learning, fitness, mental health & more. Get started free.",
  keywords: [
    "AI life companion",
    "AI personality chat",
    "personal AI assistant",
    "AI coaching platform",
    "mental health AI support",
    "Christian AI companion",
    "business AI mentor",
    "weight loss AI coach",
    "psychology AI expert",
    "AI learning tutor",
    "24/7 AI support",
    "semantic memory AI",
    "CBT therapy AI"
  ],
  authors: [{ name: "Twin Wicks Digital Solutions" }],
  creator: "Twin Wicks Digital Solutions",
  publisher: "EPI Brain",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://epibrain.app',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://epibrain.app',
    title: 'EPI Brain | 9 AI Personalities for Life, Business & Growth',
    description: 'Transform your life with 9 specialized AI personalities. 24/7 support for business, learning, fitness, mental health & more. Get started free.',
    siteName: 'EPI Brain',
    images: [
      {
        url: 'https://epibrain.app/assets/brain-logo-landing.png',
        width: 1200,
        height: 630,
        alt: 'EPI Brain - AI Life Companion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EPI Brain | 9 AI Personalities for Life, Business & Growth',
    description: 'Transform your life with 9 specialized AI personalities. 24/7 support for business, learning, fitness, mental health & more. Get started free.',
    images: ['https://epibrain.app/assets/brain-logo-landing.png'],
    creator: '@epibrain',
  },
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