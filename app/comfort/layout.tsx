import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import "../globals.css";

import { OpenAtTop } from "@/components/mavera/open-at-top";
import { projectRobots } from "@/lib/showcase/seo";
import { MockupTerms } from "@/components/showcase/mockup-terms";

/**
 * Заголовки — Manrope 800: жирный гротеск с открытыми формами, как в
 * референсе владельца студии (крупное слово поверх макро фактуры), и с
 * полной кириллицей. Текст и мелкие таблички характеристик — Inter: у него
 * табличные цифры, размеры и цены встают ровным столбиком.
 */
const head = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["600", "800"],
  variable: "--font-cf-head",
});

const body = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-cf-body",
});

/**
 * Проект витрины: прототип сайта мебельной фабрики Comfort Mebel.
 *
 * Свой корень документа — своя пара шрифтов. Как все проекты витрины,
 * открыт по ссылке и поиску на площадке (lib/showcase/seo); на боевом
 * сайте из этого же кода закрыт — это делает `projectRobots`.
 */
export const metadata: Metadata = {
  title: {
    default: "Comfort Mebel — прототип сайта",
    template: "%s · Comfort Mebel",
  },
  description:
    "Прототип сайта мебельной фабрики Comfort Mebel (Ташкент, с 2007 года): фактура крупным планом, подбор по размерам комнаты, рассрочка в месяц и запись в шоурум.",
  robots: projectRobots,
  icons: { icon: "/favicon.svg" },
  other: {
    copyright: "© 2026 Maximov Tech. Прототип для Comfort Mebel; копирование запрещено.",
  },
};

export const viewport: Viewport = {
  themeColor: "#23212c",
};

export default function ComfortLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${head.variable} ${body.variable} scroll-smooth`}>
      <head>
        <noscript>
          <style>{`[data-cf] .cf-in { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-screen overflow-x-clip bg-[#1d1a20] antialiased">
        <OpenAtTop />
        {children}
        <MockupTerms />
      </body>
    </html>
  );
}
