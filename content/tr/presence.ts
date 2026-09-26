import { offices, type Office } from "@/content/tr/company";
import { countries, type Country } from "@/content/tr/countries";
import { SHAPES } from "@/content/tr/geo";

/**
 * Что показывает карта присутствия.
 *
 * Страна на карте — это либо направление из каталога, либо страна, где
 * стоит офис, либо и то и другое. Россия и Казахстан в каталоге
 * направлений не значатся, но офисы там есть, поэтому список собирается
 * из двух источников, а не берётся из одного.
 *
 * Данные не дублируются: имя, порог входа и доходность приходят из
 * каталога, адрес — из списка офисов, контур — из geo.ts. Здесь только
 * сшивка по ключу страны.
 */

export type Place = {
  /** Ключ страны: он же ключ контура в SHAPES. */
  id: string;
  name: string;
  /** Контур страны в кадре. */
  d: string;
  offices: Office[];
  /** Карточка каталога, если направление в нём есть. */
  country?: Country;
  /** Габариты контура в кадре: по ним ставится кольцо-указка. */
  box: { x: number; y: number; w: number; h: number };
};

/** Страны без каталога: офис есть, направления в списке нет. */
const extra: Record<string, string> = {
  russia: "Россия",
  kazakhstan: "Казахстан",
};

const byCountry = new Map<string, Office[]>();
for (const office of offices) {
  const list = byCountry.get(office.country) ?? [];
  list.push(office);
  byCountry.set(office.country, list);
}

export const places: Place[] = Object.keys(SHAPES)
  .map((id) => {
    const country = countries.find((item) => item.id === id);
    return {
      id,
      name: country?.name ?? extra[id] ?? id,
      d: SHAPES[id],
      offices: byCountry.get(id) ?? [],
      country,
      box: bounds(SHAPES[id]),
    };
  })
  // Слева направо: так же идёт и появление стран на карте, и порядок
  // фишек под ней на телефоне — от Португалии к Бали.
  .sort((a, b) => left(a.d) - left(b.d));

/** Левый край контура: по нему страны выстраиваются с запада на восток. */
function left(d: string): number {
  return bounds(d).x;
}

/** Габариты пути: разбор координат из строки, без DOM и без браузера. */
function bounds(d: string): { x: number; y: number; w: number; h: number } {
  let x0 = Number.POSITIVE_INFINITY;
  let y0 = Number.POSITIVE_INFINITY;
  let x1 = Number.NEGATIVE_INFINITY;
  let y1 = Number.NEGATIVE_INFINITY;
  for (const match of d.matchAll(/[ML](-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)) {
    const x = Number(match[1]);
    const y = Number(match[2]);
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** Страна по ключу — для подсветки из списка и из фишек. */
export const placeOf = new Map(places.map((place) => [place.id, place]));

/** Сколько направлений каталога попало в кадр и сколько всего офисов. */
export const shown = {
  places: places.length,
  directions: places.filter((place) => place.country).length,
  offices: offices.length,
  /** Направления каталога, которых на карте нет: США за краем кадра. */
  outside: countries.filter((country) => !SHAPES[country.id]).map((country) => country.name),
};
