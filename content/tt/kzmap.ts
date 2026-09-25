import { branches, trunks } from "@/content/tt/company";

/**
 * Схема магистральной сети.
 *
 * Границу Казахстана здесь не рисуем — и это решение, а не упущение.
 * Точечное поле суши в этом регионе выходит почти сплошным (страна
 * внутри материка, из воды рядом только Каспий и Балхаш) и читается как
 * фактура, а не как карта. Рисовать же контур по памяти — значит выдать
 * приблизительную линию за границу государства.
 *
 * Поэтому здесь честная схема сети: города стоят на своих настоящих
 * координатах, между ними магистрали, под каждой — настоящее расстояние
 * по дуге большого круга. Так рисуют схемы у операторов связи, и ничего
 * лишнего такая схема не обещает.
 *
 * Проекция равнопромежуточная со стандартной параллелью 47,75°: долгота
 * сжата на её косинус, иначе страна растягивается вширь.
 */

const LON0 = 48.0;
const LON1 = 86.0;
const LAT0 = 41.0;
const LAT1 = 55.0;

export const KZ_W = 1000;
export const KZ_H = Math.round(
  (KZ_W * (LAT1 - LAT0)) / ((LON1 - LON0) * Math.cos((((LAT0 + LAT1) / 2) * Math.PI) / 180)),
);

/** Куда попадает город с такими координатами. */
export function place(lat: number, lon: number): { x: number; y: number } {
  return {
    x: ((lon - LON0) / (LON1 - LON0)) * KZ_W,
    y: ((LAT1 - lat) / (LAT1 - LAT0)) * KZ_H,
  };
}

/** Расстояние по дуге большого круга, км. Радиус Земли — 6371 км. */
export function distance(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)));
}

const byId = new Map(branches.map((branch) => [branch.id, branch]));

export type Link = {
  id: string;
  from: string;
  to: string;
  km: number;
  a: { x: number; y: number };
  b: { x: number; y: number };
};

/** Магистрали со схемы: координаты концов и настоящая длина. */
export const links: Link[] = trunks.map(([from, to]) => {
  const one = byId.get(from)!;
  const two = byId.get(to)!;
  return {
    id: `${from}-${to}`,
    from,
    to,
    km: distance(one, two),
    a: place(one.lat, one.lon),
    b: place(two.lat, two.lon),
  };
});

/** Сумма показанных плеч. Это не вся их сеть — у них около 15 000 км. */
export const shownKm = links.reduce((sum, link) => sum + link.km, 0);
