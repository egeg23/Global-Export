import type { Metadata } from "next";
import { Inter, Unbounded } from "next/font/google";

import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Заголовочный гротеск с характером: у соседних проектов засечная антиква и
 * гуманистический гротеск, а консервному бренду нужен голос погромче.
 */
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-unbounded",
});

/**
 * Третий проект витрины: сайт для ООО «Global Food Exclusive», бренд FOODMAXX.
 *
 * Свой корень документа, а не общий с сайтом Global Export: другая компания,
 * другая палитра, другие шрифты. Из индексации закрыт — это предложение, а не
 * чей-то сайт.
 */
export const metadata: Metadata = {
  title: {
    default: "FOODMAXX — мир мясных и овощных консерваций",
    template: "%s · FOODMAXX",
  },
  description:
    "Консервация под брендом FOODMAXX: огурцы и ассорти в стекле, тушёное мясо и готовые блюда. Производство ООО «Global Food Exclusive», Ташкентская область.",
  robots: { index: false, follow: false, nocache: true },
};

export default function FoodmaxxLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${unbounded.variable}`}>
      <body
        data-foodmaxx=""
        className="min-h-screen bg-fm-ink-950 font-fm text-fm-cream-50 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
