import raw from "@/content/akbar/catalog.json";

/**
 * Каталог Akbar Rich для прототипа.
 *
 * Данные сняты скриптом `scripts/akbar-import.py` с их открытого каталога:
 * до восьми моделей на раздел, у каждой — все цвета и покрытия. Разделы,
 * которые у них в меню есть, а внутри пусты, заполнены парой образцов «для
 * вида» — у таких позиций `demo: true`, фото взято с обложки того же раздела.
 * Здесь данные только причёсываются: названия разделов у фабрики записаны
 * по-разному («Трехметровые Двери», «Двери в стиле "Hi-Tech"»), а в меню они
 * должны читаться одной интонацией.
 */

export type Glazing = "solid" | "glass" | null;

export type Variant = {
  id: string;
  color: string;
  swatch: string;
  material: string;
  glazing: Glazing;
  thumb: string;
  image?: string;
};

export type Item = {
  id: string;
  name: string;
  popular?: boolean;
  demo?: boolean;
  variants: Variant[];
};

export type Subcategory = {
  id: string;
  slug: string;
  name: string;
  group: string | null;
  cover: string;
  /** Сколько моделей в разделе у фабрики; у пустых — число образцов. */
  total: number;
  items: Item[];
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  short: string;
  cover: string;
  subcategories: Subcategory[];
};

export type ConfiguratorModel = {
  id: string;
  name: string;
  sub: string;
  variants: (Variant & { image: string })[];
};

type RawCatalog = {
  categories: {
    id: string;
    name: string;
    cover: string;
    subcategories: {
      id: string;
      name: string;
      group: string | null;
      cover: string;
      realCount: number;
      items: Item[];
    }[];
  }[];
  configurator: ConfiguratorModel[];
};

const CATEGORY: Record<string, { slug: string; name: string; short: string }> = {
  "1": { slug: "dveri", name: "Межкомнатные двери", short: "Двери" },
  "2": { slug: "okna", name: "Окна", short: "Окна" },
  "3": { slug: "plintusy", name: "Плинтусы", short: "Плинтусы" },
  "4": { slug: "obreshetki", name: "Обрешётки из МДФ", short: "Обрешётки" },
  "5": { slug: "paneli", name: "Стеновые панели и проёмы", short: "Панели" },
  "6": { slug: "stvorki", name: "Мебельные створки", short: "Створки" },
};

const SUB: Record<string, { slug: string; name: string }> = {
  "8": { slug: "ekonom", name: "Эконом" },
  "9": { slug: "eksklyuziv", name: "Эксклюзивные" },
  "4": { slug: "hi-tech", name: "Hi-Tech" },
  "5": { slug: "konus-freza", name: "Конус-фреза" },
  "2": { slug: "filenchatye", name: "Филёнчатые" },
  "3": { slug: "frezerovannye", name: "Фрезерованные" },
  "1": { slug: "obkladnye", name: "Обкладные" },
  "7": { slug: "tri-metra", name: "Трёхметровые" },
  "6": { slug: "skrytye", name: "Скрытые" },
  "10": { slug: "okna-eksklyuziv", name: "Эксклюзивные окна" },
  "11": { slug: "okna-frezerovannye", name: "Фрезерованные окна" },
  "12": { slug: "okna-obkladnye", name: "Обкладные окна" },
  "13": { slug: "plintus-eksklyuziv", name: "Эксклюзивный плинтус" },
  "14": { slug: "plintus-hi-tech", name: "Плинтус Hi-Tech" },
  "15": { slug: "plintus-premium", name: "Премиум-плинтус" },
  "16": { slug: "obreshetka-batareynaya", name: "Батарейная обрешётка" },
  "17": { slug: "obreshetka-potolochnaya", name: "Потолочная обрешётка" },
  "26": { slug: "paneli-eksklyuziv", name: "Эксклюзивные панели" },
  "23": { slug: "paneli-frezerovannye", name: "Фрезерованные панели" },
  "25": { slug: "paneli-filenchatye", name: "Филёнчатые панели" },
  "24": { slug: "obshivki-obkladnye", name: "Обкладные обшивки" },
  "27": { slug: "paneli-konus", name: "Панели конус-фреза" },
  "29": { slug: "proemy-eksklyuziv", name: "Эксклюзивные проёмы" },
  "28": { slug: "proemy-premium", name: "Премиум-проёмы" },
  "30": { slug: "kolonny", name: "Колонны" },
  "21": { slug: "stvorki-filenchatye", name: "Филёнчатые створки" },
  "22": { slug: "stvorki-konus", name: "Створки конус" },
  "19": { slug: "stvorki-obkladnye", name: "Обкладные створки" },
  "18": { slug: "stvorki-frezerovannye", name: "Фрезерованные створки" },
  "20": { slug: "stvorki-hi-tech", name: "Створки Hi-Tech" },
};

/** Порядок разделов стеновых панелей: сначала панели, потом проёмы и колонны. */
const PANEL_ORDER = ["26", "23", "25", "24", "27", "29", "28", "30"];

const tidy = (name: string) =>
  name
    .replace(/^№\s*Hi-tech$/i, "Hi-Tech")
    .replace(/Hi-tech/g, "Hi-Tech")
    .replace(/\s+/g, " ")
    .trim();

const data = raw as RawCatalog;

export const categories: Category[] = data.categories.map((category) => {
  const meta = CATEGORY[category.id];
  const subs = category.subcategories.map<Subcategory>((sub) => ({
    id: sub.id,
    slug: SUB[sub.id]?.slug ?? `r-${sub.id}`,
    name: SUB[sub.id]?.name ?? sub.name,
    group: sub.group,
    cover: sub.cover,
    total: sub.realCount || sub.items.length,
    items: sub.items.map((item) => ({ ...item, name: tidy(item.name) })),
  }));
  if (category.id === "5") subs.sort((a, b) => PANEL_ORDER.indexOf(a.id) - PANEL_ORDER.indexOf(b.id));
  return {
    id: category.id,
    slug: meta.slug,
    name: meta.name,
    short: meta.short,
    cover: category.cover,
    subcategories: subs,
  };
});

export const doors = categories[0];

export const configurator: ConfiguratorModel[] = data.configurator.map((model) => ({
  ...model,
  name: tidy(model.name),
}));

export const allSubcategories = categories.flatMap((category) =>
  category.subcategories.map((sub) => ({ category, sub })),
);

export function findSubcategory(slug: string) {
  return allSubcategories.find((entry) => entry.sub.slug === slug);
}

/** Популярные модели — отметка «популярное» стоит в их же каталоге. */
export const popular: (Item & { sub: string; subSlug: string })[] = doors.subcategories
  .flatMap((sub) =>
    sub.items
      .filter((item) => item.popular && !item.demo)
      .map((item) => ({ ...item, sub: sub.name, subSlug: sub.slug })),
  )
  .filter((item, index, list) => list.findIndex((other) => other.id === item.id) === index);

export const MATERIALS = ["Эмаль", "Ясень", "Американский орех"] as const;

/** «54 модели», «2 модели», «1 модель». */
export function models(count: number) {
  const tail = count % 10;
  const tens = count % 100;
  if (tail === 1 && tens !== 11) return `${count} модель`;
  if (tail >= 2 && tail <= 4 && (tens < 12 || tens > 14)) return `${count} модели`;
  return `${count} моделей`;
}

export function colorsCount(count: number) {
  const tail = count % 10;
  const tens = count % 100;
  if (tail === 1 && tens !== 11) return `${count} цвет`;
  if (tail >= 2 && tail <= 4 && (tens < 12 || tens > 14)) return `${count} цвета`;
  return `${count} цветов`;
}

/** Уникальные цвета модели — у остеклённой и глухой версии они повторяются. */
export function swatches(item: Item) {
  const seen = new Set<string>();
  return item.variants.filter((variant) => {
    if (seen.has(variant.color)) return false;
    seen.add(variant.color);
    return true;
  });
}

export function sections(count: number) {
  const tail = count % 10;
  const tens = count % 100;
  if (tail === 1 && tens !== 11) return `${count} раздел`;
  if (tail >= 2 && tail <= 4 && (tens < 12 || tens > 14)) return `${count} раздела`;
  return `${count} разделов`;
}
