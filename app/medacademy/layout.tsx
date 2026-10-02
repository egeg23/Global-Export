import type { Metadata, Viewport } from "next";
import { Commissioner, Dela_Gothic_One, Literata, Onest } from "next/font/google";

import "../globals.css";

import { OpenAtTop } from "@/components/mavera/open-at-top";
import { projectRobots } from "@/lib/showcase/seo";
import { MockupTerms } from "@/components/showcase/mockup-terms";

/**
 * Две пары шрифтов — по одной на вариант, все с кириллицей (OFL):
 *
 *  - A «Клиника»: Literata — книжная антиква с оптическими размерами,
 *    крупно читается как медицинский справочник, а не как реклама; Onest —
 *    спокойный гротеск для текста и цифр.
 *  - B «Лаборатория»: Dela Gothic One — плотный дисплейный гротеск, слово
 *    поперёк экрана; Commissioner — живой текстовый гротеск.
 *
 * Веса — 400 и 700: ослабляем цветом, а не весом.
 */
const literata = Literata({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], display: "swap", variable: "--font-ma-literata" });
const onest = Onest({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], display: "swap", variable: "--font-ma-onest" });
const dela = Dela_Gothic_One({ subsets: ["latin", "cyrillic"], weight: "400", display: "swap", variable: "--font-ma-dela" });
const commissioner = Commissioner({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], display: "swap", variable: "--font-ma-commissioner" });

/**
 * Проект витрины: макет сайта MedAcademy — центра подготовки абитуриентов
 * в медицинские вузы (Ташкент). Как все проекты витрины, открыт по ссылке
 * и поиску на площадке (lib/showcase/seo); на боевом сайте из этого же
 * кода закрыт — это делает `projectRobots`.
 */
export const metadata: Metadata = {
  title: {
    default: "MedAcademy — макет сайта",
    template: "%s · MedAcademy",
  },
  description:
    "Макет нового сайта MedAcademy — курсы биологии и химии для поступления в медвузы Ташкента: калькулятор балла DTM, преподаватели с баллами 180,5 и 179,2 из 189, запись в Telegram. Два варианта — «Клиника» и «Лаборатория».",
  robots: projectRobots,
  icons: { icon: "/favicon.svg" },
  other: {
    copyright: "© 2026 Maximov Tech · DevUz. Макет для MedAcademy; копирование запрещено.",
  },
};

export const viewport: Viewport = {
  themeColor: "#10181d",
};

export default function MedacademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${literata.variable} ${onest.variable} ${dela.variable} ${commissioner.variable}`}>
      <head>
        <noscript>
          <style>{`[data-ma] .ma-in { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh overflow-x-clip bg-[#10181d] antialiased">
        <OpenAtTop />
        {children}
        <MockupTerms />
      </body>
    </html>
  );
}
