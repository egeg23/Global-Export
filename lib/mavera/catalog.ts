/**
 * Квартира такой, какой её видит браузер: данные, а не способ их получить.
 *
 * Генератор квартирографии и планировки живут в lib/mavera/flats.ts и
 * content/mavera/plans.ts и в браузер не попадают: карточка ЖК считает всё на
 * сервере и отдаёт подбору готовый список. Здесь — только то, что нужно
 * фильтру и подписям, без единого импорта из содержимого.
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
  view: "Во двор" | "На улицу" | "Панорама";
  /** «Студия», «2-комнатная» — по планировке, а не по числу комнат. */
  typeName: string;
  planId: string;
  planName: string;
  planNote: string;
  /** Площади комнат чертежа — посчитаны на сервере под метраж квартиры. */
  roomAreas: number[];
};

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
