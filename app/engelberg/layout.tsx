import type { Metadata, Viewport } from "next";
import { Cormorant, Inter } from "next/font/google";

import "../globals.css";

import { Guard } from "@/components/mavera/guard";
import { MockupTerms } from "@/components/showcase/mockup-terms";

/** Заголовки — Cormorant, как на engelberg-window.com. */
const serif = Cormorant({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb-serif",
});

/** Текст — Inter, тоже их. */
const sans = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-eb-sans",
});

/**
 * Проект витрины: макет сайта Engelberg (engelberg-window.com) — окна,
 * раздвижные и фасадные системы, фурнитура.
 *
 * Закрыт кодом доступа с первого дня (lib/showcase/access.ts, proxy.ts) и
 * закрыт от поиска: это макет до договора, в карту сайта он не входит.
 */
export const metadata: Metadata = {
  title: {
    default: "Engelberg — окно как часть архитектуры",
    template: "%s · Engelberg",
  },
  // Описание видно и на странице кода — поэтому без содержания макета.
  description: "Макет сайта Engelberg — закрытый показ DevUz Studio.",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/images/engelberg/crest.svg" },
  other: {
    copyright: "© 2026 DevUz Studio. Макет для Engelberg; копирование запрещено.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0d10",
};

export default function EngelbergLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${serif.variable} ${sans.variable}`}>
      <body data-world="engelberg" className="min-h-screen antialiased">
        <Guard />
        {children}
        <MockupTerms />
      </body>
    </html>
  );
}
