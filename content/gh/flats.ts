/**
 * Квартиры для подбора.
 *
 * На gh.uz подбора нет: чтобы увидеть свободные квартиры, надо позвонить в
 * отдел продаж. Это и есть первая фишка макета — фильтр, который отвечает
 * сразу. Раскладка собирается из карточек жилых комплексов: площади берутся
 * из их диапазона, этажи — из этажности корпусов, цена — из ориентира за
 * квадрат.
 *
 * Россыпь детерминированная: одна и та же квартира на каждой сборке и у
 * каждого, кто откроет ссылку. Заказчик возвращается на экран и должен
 * увидеть то же, что минуту назад, — случайность здесь только мешает.
 */

import { projects, type Project } from "@/content/gh/projects";

export type FlatStatus = "free" | "booked" | "sold";

export type Flat = {
  id: string;
  project: string;
  rooms: number;
  area: number;
  floor: number;
  floors: number;
  /** Цена в млн сум. */
  price: number;
  view: string;
  status: FlatStatus;
};

export const statusLabel: Record<FlatStatus, string> = {
  free: "Свободна",
  booked: "Бронь",
  sold: "Продана",
};

const views = ["Во двор", "На бульвар", "На парк", "На город"];

/** Простой генератор: одно число на входе — одна и та же последовательность. */
function stream(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const seedOf = (text: string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

/** Верхняя граница этажности из строки вида «12–16 этажей». */
function topFloor(project: Project): number {
  const numbers = project.floors.match(/\d+/g);
  return numbers ? Math.max(...numbers.map(Number)) : 12;
}

function buildFlats(): Flat[] {
  const out: Flat[] = [];

  for (const project of projects) {
    const next = stream(seedOf(project.slug));
    const top = topFloor(project);
    const [min, max] = project.area;
    const count = project.slug === "infinity" ? 12 : 26;

    for (let i = 0; i < count; i += 1) {
      const share = next();
      // Комнатность и площадь связаны: студия не бывает в сто квадратов.
      const rooms = share < 0.22 ? 1 : share < 0.58 ? 2 : share < 0.86 ? 3 : 4;
      const span = (max - min) / 4;
      const area = Math.round(min + span * (rooms - 1) + span * next());
      const floor = 1 + Math.floor(next() * top);

      // Верхние этажи дороже нижних, вид — ещё несколько процентов.
      const height = 1 + (floor / top) * 0.08;
      const view = views[Math.floor(next() * views.length)];
      const scenery = view === "На парк" || view === "На город" ? 1.04 : 1;
      const price = Math.round(area * project.perSqm * height * scenery * 10) / 10;

      const luck = next();
      const status: FlatStatus = luck < 0.58 ? "free" : luck < 0.78 ? "booked" : "sold";

      out.push({
        id: `${project.slug}-${i + 1}`,
        project: project.slug,
        rooms,
        area,
        floor,
        floors: top,
        price,
        view,
        status,
      });
    }
  }

  return out;
}

export const flats: Flat[] = buildFlats();

export const roomOptions = [1, 2, 3, 4];

/** Границы бюджета по всей раскладке — начальные значения ползунка. */
export const priceRange: [number, number] = [
  Math.floor(Math.min(...flats.map((flat) => flat.price))),
  Math.ceil(Math.max(...flats.map((flat) => flat.price))),
];

export type Filter = {
  project: string | null;
  rooms: number | null;
  budget: number;
  onlyFree: boolean;
};

export function select(filter: Filter): Flat[] {
  return flats
    .filter((flat) => (filter.project ? flat.project === filter.project : true))
    .filter((flat) => (filter.rooms ? flat.rooms === filter.rooms : true))
    .filter((flat) => flat.price <= filter.budget)
    .filter((flat) => (filter.onlyFree ? flat.status === "free" : true))
    .sort((a, b) => a.price - b.price);
}

/** «1 240,5» — пробелы неразрывные, иначе число рвётся по строкам. */
export function sums(value: number): string {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 1 }).replace(/\s/g, " ");
}
