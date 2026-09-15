import { items, sets } from "@/content/adar/catalog";
import type { GiftSet } from "@/lib/adar/types";

/**
 * Производные каталога, которые считаются один раз при сборке.
 *
 * Страницы статические, поэтому эти значения попадают в готовый HTML, а не
 * пересчитываются в браузере на каждое нажатие клавиши в поиске.
 */

export const priceRange = {
  min: Math.min(...sets.map((set) => set.price)),
  max: Math.max(...sets.map((set) => set.price)),
};

export const weightRange = {
  min: Math.min(...sets.map((set) => set.weight)),
  max: Math.max(...sets.map((set) => set.weight)),
};

export const countRange = {
  min: Math.min(...sets.map((set) => set.count)),
  max: Math.max(...sets.map((set) => set.count)),
};

/** Наименования набора текстом — состав, а не индексы. */
export function contentsOf(set: GiftSet): { name: string; grams: number; qty: number }[] {
  return set.parts.map(([item, grams, qty]) => ({ name: items[item], grams, qty }));
}

const cyrillicToLatin: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/**
 * Кириллица в латиницу.
 *
 * Половина состава набора подписана латиницей — «KINDER SURPRISE», «CHUPA
 * CHUPS», — а ищут их по-русски: «киндер», «чупа чупс». Без этой замены
 * поиск отвечал бы «ничего не найдено» на самый очевидный запрос.
 */
export function translit(value: string): string {
  let out = "";
  for (const char of value.toLowerCase()) {
    out += cyrillicToLatin[char] ?? char;
  }
  return out;
}

/**
 * Строка для поиска: название набора, линейка и всё, что внутри, — в двух
 * написаниях сразу. Готовится заранее, чтобы фильтрация в браузере была
 * сравнением строк, а не сборкой состава на каждый символ.
 */
export function searchIndex(set: GiftSet): string {
  const source = [set.name, set.lineLabel, ...set.parts.map(([item]) => items[item])]
    .join(" ")
    .toLowerCase();
  return `${source} ${translit(source)}`;
}

/**
 * Наборы «на витрину»: по одному из линейки, в порядке, который сразу
 * показывает разброс цен. На нынешнем сайте в этом блоке четыре позиции
 * подряд из одной ценовой ступени, и каталог кажется вдвое меньше.
 */
export function featuredSets(count = 4): GiftSet[] {
  const order = ["prestige", "vip", "eko", "platinum", "premium", "gold", "silver", "lux"];
  return order
    .map((line) => sets.find((set) => set.line === line))
    .filter((set): set is GiftSet => Boolean(set))
    .slice(0, count);
}

/**
 * Восемь ступеней для сцены «набор растёт» — по одной на линейку, от самой
 * дешёвой к самой дорогой. Из каждой берётся средний по счёту набор: крайние
 * в линейке выбиваются из ряда и ломают ощущение равномерного роста.
 */
export const growthStages: GiftSet[] = [
  "eko",
  "silver",
  "gold",
  "prestige",
  "lux",
  "premium",
  "vip",
  "platinum",
]
  .map((line) => {
    const inLine = sets.filter((set) => set.line === line);
    return inLine[Math.floor(inLine.length / 2)] ?? inLine[0];
  })
  .filter((set): set is GiftSet => Boolean(set))
  .sort((a, b) => a.price - b.price);
