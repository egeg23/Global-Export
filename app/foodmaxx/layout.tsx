import type { Metadata } from "next";
import { Inter, Nunito_Sans, Rubik, Unbounded } from "next/font/google";

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

/** Шрифты варианта 02: округлые, как на карточках маркетплейсов. */
const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
});

const nunito = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-nunito",
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
  icons: { icon: "/foodmaxx/favicon.svg" },
};

export default function FoodmaxxLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${unbounded.variable} ${rubik.variable} ${nunito.variable}`}>
      <body
        data-foodmaxx=""
        className="min-h-screen bg-fm-ink-950 font-fm text-fm-cream-50 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
