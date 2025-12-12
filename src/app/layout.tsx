import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/markdown.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pemrograman Piranti Bergerak - Universitas Terbuka",
  description: "Website pembelajaran mata kuliah Pemrograman Piranti Bergerak untuk mahasiswa Universitas Terbuka. Pelajari pengembangan aplikasi mobile dengan Ionic Framework.",
  keywords: ["ionic", "mobile development", "universitas terbuka", "pemrograman", "tutorial"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
