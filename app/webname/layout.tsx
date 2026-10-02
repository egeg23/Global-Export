import type { Metadata, Viewport } from "next";
import { Geologica, Martian_Mono, Tektur } from "next/font/google";

import "../globals.css";

import { OpenAtTop } from "@/components/mavera/open-at-top";
import { projectRobots } from "@/lib/showcase/seo";

/**
 * Три гарнитуры, все с кириллицей (OFL), и ни одна ещё не стояла на витрине:
 *
 *  - Tektur — угловатый техно-гротеск с рублеными диагоналями: «арсенал»,
 *    маркировка на железе, но не военщина. Заголовки и штамп.
 *  - Martian Mono — моноширинный для того, что и в жизни моноширинное:
 *    адресная строка, имена доменов, DNS-записи, цены в таблицах.
 *  - Geologica — спокойный текстовый гротеск.
 *
 * Веса — 400 и 700: ослабляем цветом, а не весом.
 */
const tektur = Tektur({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], display: "swap", variable: "--font-wn-display" });
const martian = Martian_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], display: "swap", variable: "--font-wn-mono" });
const geologica = Geologica({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], display: "swap", variable: "--font-wn-body" });

/**
 * Проект витрины: макет нового сайта Arsenal D (webname.uz) — аккредитованного
 * регистратора .UZ и хостинга в Ташкенте. Как все проекты витрины, открыт по
 * ссылке и поиску на площадке (lib/showcase/seo); на боевом сайте из этого
 * же кода закрыт — это делает `projectRobots`.
 */
export const metadata: Metadata = {
  title: {
    default: "Arsenal D · webname.uz — макет сайта",
    template: "%s · Arsenal D",
  },
  description:
    "Макет нового сайта Arsenal D (webname.uz): поиск домена .UZ прямо в адресной строке, 23 тарифа хостинга в сумах, SSL, DNSSEC, перенос домена в три шага, калькулятор «домен + хостинг + сайт» и конструктор допов.",
  robots: projectRobots,
  icons: { icon: "/favicon.svg" },
  other: {
    copyright: "© 2026 Maximov Tech · DevUz. Макет для Arsenal D; копирование запрещено.",
  },
};

export const viewport: Viewport = {
  themeColor: "#edf2ef",
};

export default function WebnameLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${tektur.variable} ${martian.variable} ${geologica.variable}`}>
      <head>
        <noscript>
          <style>{`[data-wn] .wn-in { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh overflow-x-clip bg-[#edf2ef] antialiased">
        <OpenAtTop />
        {children}
      </body>
    </html>
  );
}
