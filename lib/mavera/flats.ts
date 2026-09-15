import { projects, type Project } from "@/content/mavera/data";

/**
 * Квартирография проектов.
 *
 * Состав дома считается из его же характеристик, а не хранится списком:
 * шесть проектов по тысяче квартир — это тысячи строк, которые всё равно
 * заменятся выгрузкой из 1С заказчика. Здесь важно другое — чтобы фильтры,
 * шахматка и калькулятор работали на правдоподобном наборе.
 *
 * Псевдослучайность детерминированная: один и тот же слаг всегда даёт один и
 * тот же дом. Иначе сервер и браузер нарисовали бы разные шахматки, а ссылка
 * на конкретную квартиру перестала бы что-то значить.
 */

export type FlatStatus = "free" | "booked" | "sold";

export type Flat = {
  id: string;
  corpus: number;
  floor: number;
  /** Номер на этаже, слева направо. */
  line: number;
  rooms: number;
  area: number;
  /** Цена целиком, в долларах. */
  priceUsd: number;
  status: FlatStatus;
  /** Номер типовой планировки — их четыре на проект. */
  plan: number;
  view: "Во двор" | "На улицу" | "Панорама";
};

function noise(seed: number): number {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
}

/** Этажность «9–16» → [9, 16]; «22» → [22, 22]. */
function floorRange(project: Project): [number, number] {
  const parts = project.floors.split("–").map((n) => Number(n.replace(/\D/g, "")));
  return [parts[0] || 9, parts[1] || parts[0] || 9];
}

export function corpusCount(project: Project): number {
  const [, top] = floorRange(project);
  return Math.max(2, Math.min(7, Math.round(Number(project.flats.replace(/\D/g, "")) / (top * 8))));
}

const layouts: { rooms: number; area: number; view: Flat["view"] }[] = [
  { rooms: 1, area: 38.4, view: "Во двор" },
  { rooms: 2, area: 56.2, view: "На улицу" },
  { rooms: 2, area: 62.8, view: "Во двор" },
  { rooms: 3, area: 78.5, view: "Панорама" },
  { rooms: 3, area: 84.1, view: "На улицу" },
  { rooms: 4, area: 104.6, view: "Панорама" },
];

/**
 * Квартиры проекта. Цена растёт с этажом — так это и работает у застройщиков:
 * первые этажи дешевле, верхние с видом дороже.
 */
export function flatsOf(slug: string): Flat[] {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return [];

  const [bottom, top] = floorRange(project);
  const corpuses = corpusCount(project);
  const perFloor = 6;
  const out: Flat[] = [];

  for (let corpus = 1; corpus <= corpuses; corpus += 1) {
    for (let floor = 2; floor <= top; floor += 1) {
      for (let line = 1; line <= perFloor; line += 1) {
        const seed = slug.length * 7 + corpus * 131 + floor * 17 + line * 3;
        const layout = layouts[Math.floor(noise(seed) * layouts.length)];
        const roll = noise(seed + 0.5);

        // Нижние этажи распроданы чаще верхних — как в жизни.
        const soldBias = floor <= bottom ? 0.42 : 0.26;
        const status: FlatStatus = roll < soldBias ? "sold" : roll < soldBias + 0.12 ? "booked" : "free";

        const area = Math.round((layout.area + (noise(seed + 1.5) - 0.5) * 6) * 10) / 10;
        // Надбавка за этаж: до 9% между первым и последним.
        const floorFactor = 1 + ((floor - 2) / Math.max(top - 2, 1)) * 0.09;

        out.push({
          id: `${slug}-${corpus}-${floor}-${line}`,
          corpus,
          floor,
          line,
          rooms: layout.rooms,
          area,
          priceUsd: Math.round(area * project.priceUsd * floorFactor),
          status,
          plan: (Math.floor(noise(seed + 2.5) * 4) % 4) + 1,
          view: layout.view,
        });
      }
    }
  }

  return out;
}

/** Площадь по-русски: запятая, один знак. */
export function area(value: number): string {
  return value.toFixed(1).replace(".", ",");
}

export type FlatFilter = {
  rooms: number[];
  corpus: number | null;
  floorFrom: number;
  priceMaxUsd: number | null;
  onlyFree: boolean;
};

export function filterFlats(flats: Flat[], filter: FlatFilter): Flat[] {
  return flats.filter((flat) => {
    if (filter.rooms.length && !filter.rooms.includes(flat.rooms)) return false;
    if (filter.corpus && flat.corpus !== filter.corpus) return false;
    if (flat.floor < filter.floorFrom) return false;
    if (filter.priceMaxUsd && flat.priceUsd > filter.priceMaxUsd) return false;
    if (filter.onlyFree && flat.status !== "free") return false;
    return true;
  });
}

/** Сводка по проекту для карточки и шапки: сколько и от какой цены. */
export function summaryOf(slug: string) {
  const flats = flatsOf(slug);
  const free = flats.filter((f) => f.status === "free");
  const prices = free.map((f) => f.priceUsd);
  const areas = free.map((f) => f.area);

  return {
    total: flats.length,
    free: free.length,
    minPriceUsd: prices.length ? Math.min(...prices) : 0,
    minArea: areas.length ? Math.min(...areas) : 0,
    maxArea: areas.length ? Math.max(...areas) : 0,
    rooms: [...new Set(free.map((f) => f.rooms))].sort((a, b) => a - b),
  };
}
