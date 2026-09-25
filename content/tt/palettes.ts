import type { Palette } from "@/components/showcase/palette";
import type { Lang } from "@/content/tt/i18n";

/**
 * Три палитры «Транстелекома».
 *
 * Тёмная стоит первой намеренно: карта сети на ней читается как
 * диспетчерский экран, а не как баннер. Краска образцов продублирована
 * из app/tt.css — образец «Степи» должен показывать известняк, когда на
 * экране сейчас тёмная «Магистраль».
 */
export const ttPalettes: Palette[] = [
  {
    id: "trunk",
    label: "Магистраль",
    note: "Тёмная: пульт оператора связи",
    swatch: { bg: "#0b1113", paper: "#182326", accent: "#7ed957" },
  },
  {
    id: "day",
    label: "Дневная смена",
    note: "Светлая: для печати и презентаций",
    swatch: { bg: "#f4f7f4", paper: "#e8efe8", accent: "#1c7a37" },
  },
  {
    id: "steppe",
    label: "Степь",
    note: "Тёплая светлая: известняк и медь",
    swatch: { bg: "#f7f4ec", paper: "#ece5d6", accent: "#2a6b2f" },
  },
];

export const TT_DEFAULT_PALETTE = "trunk";
export const TT_PALETTE_IDS = ttPalettes.map((p) => p.id);

/**
 * Те же три палитры по-казахски.
 *
 * Названия палитр — часть того, что видит заказчик, и оставлять их
 * по-русски на казахской странице значило бы сделать перевод наполовину.
 */
const kk: Record<string, { label: string; note: string }> = {
  trunk: { label: "Магистраль", note: "Қараңғы: байланыс операторының пульті" },
  day: { label: "Күндізгі ауысым", note: "Ашық: басып шығару мен презентацияға" },
  steppe: { label: "Дала", note: "Жылы ашық: әктас пен мыс" },
};

export function ttPalettesFor(lang: Lang): Palette[] {
  if (lang === "ru") return ttPalettes;
  return ttPalettes.map((palette) => ({ ...palette, ...kk[palette.id] }));
}
