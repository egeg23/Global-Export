import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "../globals.css";
import { projectRobots } from "@/lib/showcase/seo";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-display",
});

/**
 * The showcase wrapper: a single page that hands a visitor the whole prototype.
 * Its own document root, outside the locale prefix, and kept out of search —
 * it belongs to the pitch, not to the company's site.
 */
export const metadata: Metadata = {
  title: "Прототип сайта Global Export Company",
  description:
    "Рабочий прототип: каталог на трёх языках, две концепции дизайна, демонстрация анимации и панель управления.",
  robots: projectRobots,
  // Без этого браузер просит /favicon.ico и получает 404 — мелочь, но она
  // видна в консоли на странице, которую открывают при заказчике.
  icons: { icon: "/favicon.svg" },
};

export default function PresentLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-forest-950 antialiased">{children}</body>
    </html>
  );
}
