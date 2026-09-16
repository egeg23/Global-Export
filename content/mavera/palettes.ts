/**
 * Палитры «Премиума»: три светлых мира вместо одного тёмного.
 *
 * Заказчик смотрит на светлое, поэтому кинозал разобран на свет: тот же
 * ритм, те же сцены и та же механика, но бумага вместо чёрного кадра.
 * Три палитры отличаются не оттенком фона, а температурой всего набора —
 * тёплая бронза, тёплая терракота и холодный шалфей.
 *
 * Цвета здесь продублированы из app/mavera.css намеренно: там они живут
 * как переменные и красят страницу, а здесь нужны как краска на самих
 * образцах — образец «Песка» должен показывать песок, когда на экране
 * сейчас слоновая кость. Правится в двух местах, зато ничего не мигает.
 */

export type PaletteId = "ivory" | "sand" | "pearl";

export type Palette = {
  id: PaletteId;
  label: string;
  /** Одна строка о характере — под образцом в панели. */
  note: string;
  /** Краска образца: фон, подложка, акцент. */
  swatch: { bg: string; paper: string; accent: string };
};

export const palettes: Palette[] = [
  {
    id: "ivory",
    label: "Слоновая кость",
    note: "Тёплый белый и бронза",
    swatch: { bg: "#faf8f4", paper: "#f1ece2", accent: "#9a7b4f" },
  },
  {
    id: "sand",
    label: "Песок",
    note: "Плотный беж и терракота",
    swatch: { bg: "#f4ede1", paper: "#e8ddca", accent: "#a2643c" },
  },
  {
    id: "pearl",
    label: "Жемчуг",
    note: "Холодный светлый и шалфей",
    swatch: { bg: "#f7f7f4", paper: "#ecece7", accent: "#5f7a63" },
  },
];

export const defaultPalette: PaletteId = "ivory";

const known = new Set<string>(palettes.map((palette) => palette.id));

export function isPalette(value: string | null | undefined): value is PaletteId {
  return typeof value === "string" && known.has(value);
}

export function paletteById(id: PaletteId): Palette {
  return palettes.find((palette) => palette.id === id) ?? palettes[0];
}

/**
 * Разделы «Премиума», у каждого своя палитра.
 *
 * Порядок совпадает со страницей: список читает панель, когда показывает,
 * где заказчик уже отступил от общей палитры.
 */
export const premiumSections: { id: string; label: string }[] = [
  { id: "hero", label: "Первый экран" },
  { id: "stats", label: "О компании и цифры" },
  { id: "projects", label: "Проекты" },
  { id: "genplan", label: "Генплан" },
  { id: "picker", label: "Подбор квартиры" },
  { id: "progress", label: "Ход строительства" },
  { id: "invest", label: "Инвестору" },
  { id: "deal", label: "Сделка и вопросы" },
  { id: "voices", label: "Отзывы и новости" },
  { id: "contacts", label: "Контакты" },
];

export function sectionLabel(id: string): string {
  return premiumSections.find((section) => section.id === id)?.label ?? id;
}
