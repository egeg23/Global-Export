import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";

import "../globals.css";
import { MockupTerms } from "@/components/showcase/mockup-terms";
import { projectRobots } from "@/lib/showcase/seo";

/**
 * Заголовки — Unbounded: широкий геометрический гротеск, как надпись
 * APOLLO TRAVEL на их логотипе. Текст — Manrope: спокойный и читаемый в
 * цифрах (цены, даты, номера рейсов).
 */
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-apollo-display",
});

const body = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-apollo-body",
});

/**
 * Проект витрины: макет сайта турагентства Apollo Travel (goapollo.uz).
 * Свой корень документа: другая компания, своя палитра и шрифты.
 */
export const metadata: Metadata = {
  title: {
    default: "Apollo Travel — туры и авиабилеты из Ташкента",
    template: "%s · Apollo Travel",
  },
  description:
    "Туры от 70+ туроператоров онлайн, горящие туры и авиабилеты из Ташкента. Apollo Travel — ваш путеводитель к звёздам с 2017 года.",
  robots: projectRobots,
  icons: { icon: "/apollo/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a2c27",
};

export default function ApolloLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body data-apollo="" className="min-h-screen overflow-x-clip bg-ap-sand font-ap text-ap-ink antialiased">
        {children}
        <MockupTerms />
      </body>
    </html>
  );
}
