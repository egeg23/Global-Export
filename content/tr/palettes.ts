import type { Palette } from "@/components/showcase/palette";

/**
 * Три палитры Tranio.
 *
 * Отличаются не оттенком фона, а тем, чей это документ: банковская
 * записка, южная сделка, ночной терминал. Краска образцов продублирована
 * из app/tr.css намеренно — образец «Средиземноморья» должен показывать
 * свою бирюзу, когда на экране сейчас синий «Капитал».
 */
export const trPalettes: Palette[] = [
  {
    id: "capital",
    label: "Капитал",
    note: "Банковская записка: белая бумага и фирменный синий",
    swatch: { bg: "#f6f7f9", paper: "#eceff4", accent: "#0358b2" },
  },
  {
    id: "mediterranean",
    label: "Средиземноморье",
    note: "Тёплая бумага и бирюза со знака",
    swatch: { bg: "#f7f4ee", paper: "#efe9dd", accent: "#0f6f5c" },
  },
  {
    id: "terminal",
    label: "Ночной терминал",
    note: "Тёмная: для показа с проектора",
    swatch: { bg: "#0c1017", paper: "#1b2230", accent: "#7fb2ea" },
  },
];

export const TR_DEFAULT_PALETTE = "capital";
export const TR_PALETTE_IDS = trPalettes.map((p) => p.id);
