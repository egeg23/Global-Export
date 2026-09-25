import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";

import "../globals.css";

/**
 * Заголовки — Cormorant Garamond: высокий контраст штриха, как у резьбы на
 * их классических моделях, и полная кириллица. Текст — Montserrat: ровный
 * геометрический гротеск держит длинные технические строки (размеры,
 * покрытия) и не спорит с антиквой.
 */
const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-akbar-display",
});

const body = Montserrat({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-akbar-body",
});

/**
 * Шестой проект витрины: сайт фабрики дверей Akbar Rich.
 *
 * Свой корень документа: другая компания, другая палитра, другие шрифты. Из
 * индексации закрыт — это предложение, а не их сайт.
 */
export const metadata: Metadata = {
  title: {
    default: "Akbar Rich — фабрика межкомнатных дверей в Ташкенте",
    template: "%s · Akbar Rich",
  },
  description:
    "Межкомнатные двери из МДФ в эмали, ясене и американском орехе — от классики до hi-tech, высотой до трёх метров. Собственное производство в Ташкенте с 2008 года.",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/akbar/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#16120e",
};

export default function AkbarLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body data-akbar="" className="min-h-screen overflow-x-clip bg-ak-ivory font-ak text-ak-ink antialiased">
        {children}
      </body>
    </html>
  );
}
