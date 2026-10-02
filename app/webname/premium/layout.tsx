import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Serif_Display, Wix_Madefor_Text } from "next/font/google";

/**
 * Вариант «Премиум» — свои гарнитуры, все с кириллицей (OFL), и только на
 * страницах этого варианта:
 *
 *  - Noto Serif Display — контрастная антиква для заголовков: тонкие
 *    волосные и крупный кегль читаются как дорогой материал;
 *  - Wix Madefor Text — спокойный текстовый гротеск интерфейса;
 *  - Geist Mono — адреса доменов, цены и DNS.
 */
const display = Noto_Serif_Display({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], display: "swap", variable: "--font-wp-display" });
const body = Wix_Madefor_Text({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], display: "swap", variable: "--font-wp-body" });
const mono = Geist_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], display: "swap", variable: "--font-wp-mono" });

export const metadata: Metadata = {
  title: {
    default: "Arsenal D · Премиум — макет сайта",
    template: "%s · Arsenal D Премиум",
  },
  description:
    "Премиальный вариант макета сайта Arsenal D (webname.uz): жидкое стекло, параллакс и живой поиск домена .UZ, хостинг в сумах, пошаговая регистрация домена и заказ хостинга.",
};

export const viewport: Viewport = {
  themeColor: "#0b0a10",
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-dvh bg-[#0b0a10]`}>{children}</div>;
}
