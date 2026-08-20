import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * The panel is a private tool, not part of the site: its own document root, no
 * locale prefix, no display face, and kept out of search results.
 */
export const metadata: Metadata = {
  title: "Панель управления — Global Export",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-sand-100 antialiased">{children}</body>
    </html>
  );
}
