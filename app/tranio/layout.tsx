import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";

import "../globals.css";

import { OpenAtTop } from "@/components/mavera/open-at-top";
import { paletteScript } from "@/lib/showcase/palette-script";
import { TR_DEFAULT_PALETTE, TR_PALETTE_IDS } from "@/content/tr/palettes";

/**
 * Три роли, три шрифта — жанр здесь инвестиционный меморандум.
 *
 * Заголовки набраны антиквой финансовой прессы: на их собственном сайте
 * стоит брусковый Roboto Slab, и засечка — правильная подсказка, только
 * взята она не рабочая, а редакционная.
 *
 * Цифры вынесены в отдельный моноширинный шрифт и это главное решение
 * типографики: доходность, срок и сумма на этой странице — товар, а в
 * пропорциональном наборе колонка цифр не сходится по разряду.
 */
const sourceSerif = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Шестой проект витрины: макет главной для tranio.ru.
 *
 * Открыт без кода — так решил заказчик показа. Свой корень документа
 * нужен из-за типографики: у мира своя тройка шрифтов, и тащить её на
 * остальные витрины незачем.
 */
export const metadata: Metadata = {
  title: {
    default: "Tranio — зарубежная недвижимость и инвестиции",
    template: "%s · Tranio",
  },
  description:
    "Макет главной для Tranio: подбор объекта по стране и доходности, калькулятор инвестиционных стратегий, подбор ВНЖ и панель управления.",
  icons: { icon: "/favicon.svg" },
  other: {
    copyright: "© 2026 Maximov Tech. Макет для Tranio; копирование запрещено.",
  },
};

export default function TranioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${sourceSerif.variable} ${plexMono.variable} ${inter.variable} scroll-smooth`}
    >
      <head>
        <noscript>
          <style>{`.w-rise { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body data-world="tr" className="min-h-screen antialiased">
        {/* Палитра ставится синхронно, до первой отрисовки: иначе страница
            успела бы моргнуть палитрой по умолчанию и только потом взять
            ту, что выбрана в ссылке или запомнена. */}
        <script
          dangerouslySetInnerHTML={{
            __html: paletteScript("tr", TR_PALETTE_IDS, TR_DEFAULT_PALETTE),
          }}
        />
        <OpenAtTop />
        {children}
      </body>
    </html>
  );
}
