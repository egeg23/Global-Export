import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Nunito, Nunito_Sans } from "next/font/google";

import "../globals.css";

/**
 * Заголовки — Nunito Black: круглые окончания, кириллица, детский характер
 * без мультяшности. Текст — Nunito Sans той же семьи. Код в песочнице —
 * JetBrains Mono: у неё отчётливые 0 и O, и дети не путают.
 */
const display = Nunito({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["700", "800", "900"],
  variable: "--font-delta-display",
});

const body = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-delta-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["500", "700"],
  variable: "--font-delta-mono",
});

/**
 * Пятый проект витрины: сайт-платформа детской IT-школы Delta IT-School.
 *
 * Свой корень документа: другая школа, другая палитра, другие шрифты. Из
 * индексации закрыт — это предложение, а не их сайт.
 */
export const metadata: Metadata = {
  title: {
    default: "Delta IT-School — программирование для детей 6–17 лет",
    template: "%s · Delta IT-School",
  },
  description:
    "Детская IT-школа: программирование, логика и IT-английский три раза в неделю. Бесплатный пробный урок, на котором ребёнок сделает свою первую программу.",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/delta/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#004aad",
};

export default function DeltaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body data-delta="" className="min-h-screen bg-dl-paper font-dl text-dl-ink antialiased">
        {children}
      </body>
    </html>
  );
}
