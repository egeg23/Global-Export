import type { Metadata } from "next";
import { Golos_Text, Inter, JetBrains_Mono } from "next/font/google";

import "../globals.css";

import { OpenAtTop } from "@/components/mavera/open-at-top";
import { langScript } from "@/lib/showcase/lang-script";
import { paletteScript } from "@/lib/showcase/palette-script";
import { TT_DEFAULT_PALETTE, TT_PALETTE_IDS } from "@/content/tt/palettes";

/**
 * Шрифты выбраны под две кириллицы сразу.
 *
 * Казахский требует расширенной кириллицы — ә, ғ, қ, ң, ө, ұ, ү, һ, і, —
 * и шрифт без подмножества `cyrillic-ext` половину слов на главной
 * отдал бы подстановочному. Поэтому оно запрошено у всех трёх.
 *
 * Заголовки — Golos Text: гротеск, нарисованный от кириллицы, а не
 * пристроенный к латинице. Цифры — моноширинные: скорость канала, SLA и
 * километры магистрали на пульте должны сходиться по разряду.
 */
const golos = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
  variable: "--font-golos",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
});

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Седьмой проект витрины: макет главной для ttc.kz, АО «Транстелеком».
 *
 * Открыт без кода. Язык документа переключается вместе с языком макета,
 * поэтому `lang` проставляет клиентский корень внутри, а здесь стоит
 * русский как язык по умолчанию.
 */
export const metadata: Metadata = {
  title: {
    default: "Транстелеком — связь и цифровые решения Казахстана",
    template: "%s · Транстелеком",
  },
  description:
    "Макет главной для АО «Транстелеком»: конструктор подключения со сметой, карта сети 15 000 км, разбор ЦОД Tier 3 и панель управления.",
  icons: { icon: "/favicon.svg" },
  other: {
    copyright: "© 2026 Maximov Tech. Макет для АО «Транстелеком»; копирование запрещено.",
  },
};

export default function TtcLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${golos.variable} ${jetbrains.variable} ${inter.variable} scroll-smooth`}
    >
      <head>
        <noscript>
          <style>{`.w-rise { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body data-world="tt" className="min-h-screen antialiased">
        {/* Палитра и язык ставятся синхронно, до первой отрисовки: иначе
            страница моргнула бы палитрой по умолчанию и русским текстом,
            и только потом взяла то, что выбрано в ссылке или запомнено. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              paletteScript("tt", TT_PALETTE_IDS, TT_DEFAULT_PALETTE) +
              langScript("tt", ["ru", "kk"], "ru"),
          }}
        />
        <OpenAtTop />
        {children}
      </body>
    </html>
  );
}
