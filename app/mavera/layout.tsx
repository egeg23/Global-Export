import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter, Spectral } from "next/font/google";

import "../globals.css";

import { Guard } from "@/components/mavera/guard";

/** «Стандарт» — гротеск швейцарской школы: техничный, спокойный, без характера. */
const plex = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-plex",
});

/** «Люкс» — засечный для заголовков и выносов. */
const spectral = Spectral({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-spectral",
});

/** «Премиум» и тексты витрины. */
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Третий проект витрины: три варианта сайта для застройщика MAVERA.
 *
 * Свой корень документа и три шрифтовых семейства сразу: варианты должны
 * отличаться не палитрой, а типографикой, сеткой и характером движения —
 * иначе выбор сводится к «какой оттенок приятнее».
 */
export const metadata: Metadata = {
  title: {
    default: "MAVERA — три варианта сайта",
    template: "%s · MAVERA",
  },
  description:
    "Три рабочих сайта для застройщика: строгий каталог, журнальный разворот и кинематографичный премиум с генпланом и подбором квартиры. Со сметой по каждому.",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/favicon.svg" },
  other: {
    copyright: "© 2026 Maximov Tech. Закрытый показ для MAVERA; копирование запрещено.",
  },
};

export default function MaveraLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${plex.variable} ${spectral.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <noscript>
          <style>{`.w-rise { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-[#0b0d10] antialiased">
        <Guard />
        {children}
      </body>
    </html>
  );
}
