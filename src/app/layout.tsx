import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "PULSE - AI Operating System дл€ бизнеса",
  description:
    "PULSE - цифровой управл€ющий вашим бизнесом. AI-аналитика, рекомендации и автоматизаци€ дл€ малого офлайн-бизнеса.",
  keywords: [
    "PULSE",
    "AI бизнес",
    "аналитика",
    "CRM",
    "малый бизнес",
    "управление бизнесом",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
