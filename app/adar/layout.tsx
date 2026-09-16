import type { Metadata } from "next";
import { Cormorant, Manrope } from "next/font/google";

import { adarIndexable, adarSiteUrl } from "@/lib/adar/seo";

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
 * компания, другой язык, другая палитра и другие шрифты.
 *
 * На нашей площадке раздел закрыт от поиска целиком — это предложение, а не
 * чей-то сайт, и в выдаче ему делать нечего. На сервере заказчика та же
 * сборка открывается поисковикам: признак один, `SHOWCASE_ROOT`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(adarSiteUrl),
  title: adarIndexable
    ? { default: "Подарочные наборы ADAR — новогодние подарки в Ташкенте", template: "%s · ADAR" }
    : { default: "ADAR — три концепции сайта", template: "%s · ADAR" },
  description: adarIndexable
    ? "80 готовых подарочных наборов от 50 000 сум: состав и вес каждого, подбор по бюджету и партии с вашим логотипом. Ташкент, работаем с 2011 года."
    : "Три варианта главной страницы adar.uz: витрина, каталог с поиском и премиальная версия. Со сметой по каждому.",
  robots: adarIndexable
    ? {
        index: true,
        follow: true,
        // Полный текст сниппета и крупная картинка: у подарочных наборов
        // выбирают глазами, и маленькая превьюшка стоит переходов.
        googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
      }
    : { index: false, follow: false, nocache: true },
  icons: { icon: "/adar/favicon.svg" },
};

export default function AdarLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${cormorant.variable}`}>
      <body
        data-adar=""
        className="min-h-screen bg-adar-cream-50 font-adar text-adar-ink antialiased"
      >
        {children}
      </body>
    </html>
  );
}
