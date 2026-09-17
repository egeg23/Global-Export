/**
 * Прогноз стоимости квартиры по годам.
 *
 * Покупателю жилья не нужна «доходность» — ему нужно понимать, что будет с
 * ценой его квартиры через год и через пять. Модель простая и честно
 * подписана как прогноз: до сдачи дома цена растёт быстрее (стадийный рост
 * от котлована к ключам), после — по средней динамике района за 2021–2025.
 * Цифры районов — оценка по рынку Ташкента; заказчик правит их в панели.
 */

export type ForecastPoint = { year: number; priceUsd: number };

export const FROM_YEAR = 2026;

/** Средний годовой рост цены квадратного метра по районам, доля. */
export const districtGrowth: Record<string, number> = {
  Мирабадский: 0.09,
  Яккасарайский: 0.085,
  "Мирзо-Улугбекский": 0.08,
  Юнусабадский: 0.075,
  Яшнабадский: 0.075,
  Шайхантахурский: 0.07,
  Чиланзарский: 0.065,
  Сергелийский: 0.06,
};

/** Сверх районного роста, пока дом строится: цена идёт от котлована к ключам. */
export const BUILD_GROWTH = 0.06;

/** Год сдачи из подписи проекта: «IV кв. 2027», «Сдан в 2024», «2026». */
export function dueYearOf(due: string): number {
  const match = due.match(/(20\d\d)/);
  return match ? Number(match[1]) : FROM_YEAR;
}

export function forecastOf({
  priceUsd,
  district,
  due,
  years = 5,
}: {
  priceUsd: number;
  district: string;
  due: string;
  years?: number;
}): ForecastPoint[] {
  const dueYear = dueYearOf(due);
  const growth = districtGrowth[district] ?? 0.07;
  const points: ForecastPoint[] = [{ year: FROM_YEAR, priceUsd: Math.round(priceUsd) }];
  let price = priceUsd;
  for (let year = FROM_YEAR + 1; year <= FROM_YEAR + years; year += 1) {
    price *= 1 + growth + (year <= dueYear ? BUILD_GROWTH : 0);
    points.push({ year, priceUsd: Math.round(price) });
  }
  return points;
}

/** Рост от первой точки к последней, %. */
export function growthPct(points: ForecastPoint[]): number {
  if (points.length < 2 || !points[0].priceUsd) return 0;
  return (points[points.length - 1].priceUsd / points[0].priceUsd - 1) * 100;
}
