import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "../globals.css";

import { OpenAtTop } from "@/components/mavera/open-at-top";

/**
 * Заголовки — высококонтрастный антиквенный шрифт: надпись NAMUNA на их
 * логотипе набрана именно такой засечной, и страница должна звучать с ней
 * в один голос. Кириллица у Playfair Display есть, иначе половина макета
 * поехала бы в подстановочный шрифт.
 */
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Пятый проект витрины: макет главной для фабрики мебели Namuna (namuna.uz).
 *
 * В отличие от MAVERA и Golden House открыт без кода — так решил заказчик
 * показа. Свой корень документа нужен из-за типографики: у мира своя пара
 * шрифтов, и тащить её на остальные витрины незачем.
 */
export const metadata: Metadata = {
  title: {
    default: "Namuna — фабрика комфорта",
    template: "%s · Namuna",
  },
  description:
    "Макет главной страницы для фабрики мебели Namuna: конфигуратор кухни с живой ценой, портфолио, сроки производства и панель управления.",
  icons: { icon: "/favicon.svg" },
  other: {
    copyright: "© 2026 Maximov Tech. Макет для Namuna; копирование запрещено.",
  },
};

export default function NamunaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <noscript>
          <style>{`.w-rise { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body data-world="nm" className="min-h-screen antialiased">
        <OpenAtTop />
        {children}
      </body>
    </html>
  );
}
