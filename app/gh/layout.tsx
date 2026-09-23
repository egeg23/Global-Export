import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import "../globals.css";

import { Guard } from "@/components/mavera/guard";
import { OpenAtTop } from "@/components/mavera/open-at-top";

/** Заголовки: геометрический гротеск, близкий к надписи GOLDEN HOUSE на знаке. */
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
});

/** Текст. */
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Четвёртый проект витрины: один макет главной для Golden House (gh.uz).
 *
 * Свой корень документа, а не раздел внутри витрины MAVERA: у макета своя
 * типографика, своя палитра и своя заставка во весь экран, и делить их с
 * соседом незачем. Открыт без кода, но закрыт от поиска — см. proxy.ts.
 */
export const metadata: Metadata = {
  title: {
    default: "Golden House — макет главной",
    template: "%s · Golden House",
  },
  description:
    "Макет главной страницы для застройщика Golden House: кинематографичная заставка, подбор квартиры, ипотечный калькулятор и панель управления.",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/favicon.svg" },
  other: {
    copyright: "© 2026 Maximov Tech. Макет для Golden House; копирование запрещено.",
  },
};

export default function GoldenHouseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <noscript>
          <style>{`.w-rise, .gh-enter { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body data-world="gh" className="min-h-screen antialiased">
        <Guard />
        <OpenAtTop />
        {children}
      </body>
    </html>
  );
}
