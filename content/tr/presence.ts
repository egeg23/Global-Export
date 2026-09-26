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
    };
  })
  // Слева направо: так же идёт и появление стран на карте, и порядок
  // фишек под ней на телефоне — от Португалии к Бали.
  .sort((a, b) => left(a.d) - left(b.d));

/** Левый край контура: по нему страны выстраиваются с запада на восток. */
function left(d: string): number {
  let min = Number.POSITIVE_INFINITY;
  for (const match of d.matchAll(/[ML](-?\d+(?:\.\d+)?) /g)) {
    const x = Number(match[1]);
    if (x < min) min = x;
  }
  return min;
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
