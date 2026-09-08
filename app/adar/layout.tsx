import type { Metadata } from "next";
import { Cormorant, Manrope } from "next/font/google";

import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
});

const cormorant = Cormorant({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

/**
 * Второй проект витрины: три концепции главной страницы для adar.uz.
 *
 * У него свой корень документа, а не общий с сайтом Global Export: другая
 * компания, другой язык, другая палитра и другие шрифты. Из индексации
 * закрыт — это предложение, а не чей-то сайт.
 */
export const metadata: Metadata = {
  title: {
    default: "ADAR — три концепции сайта",
    template: "%s · ADAR",
  },
  description:
    "Три варианта главной страницы adar.uz: витрина, каталог с поиском и премиальная версия. Со сметой по каждому.",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/adar/favicon.svg" },
};

export default function AdarLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-adar-cream-50 font-adar text-adar-ink antialiased">
        {children}
      </body>
    </html>
  );
}
