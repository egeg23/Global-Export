/**
 * Четыре инвестиционные стратегии Tranio.
 *
 * Названия и доходности — их, с главной страницы: «Строительство в
 * Европе 10—15%», «Строительство в Дубае 8%», «Реновация 2—12%»,
 * «Арендный бизнес 7%». Стартовый капитал от €70 000 — тоже их
 * формулировка.
 *
 * Сроки проектов на сайте прямым текстом не названы, поэтому они здесь
 * подписаны как типовые для такого рода проектов и участвуют только в
 * расчёте горизонта. Считает калькулятор простым сложным процентом по
 * границам вилки — никаких обещаний сверх того, что они публикуют сами.
 */

export type Strategy = {
  id: string;
  label: string;
  /** Вилка годовой доходности, %. Ровно их цифры. */
  yield: [number, number];
  /** Типовой горизонт проекта, лет. */
  years: number;
  /** Минимальный вход, тыс. евро. */
  from: number;
  note: string;
  /** Чем этот путь отличается — одной строкой для карточки. */
  how: string;
};

export const MIN_CAPITAL = 70;

export const strategies: Strategy[] = [
  {
    id: "build-eu",
    label: "Строительство в Европе",
    yield: [10, 15],
    years: 3,
    from: 100,
    note: "Самая высокая вилка из четырёх и самая длинная стройка",
    how: "Вход на площадке до котлована, выход после ввода",
  },
  {
    id: "build-dubai",
    label: "Строительство в Дубае",
    yield: [8, 8],
    years: 2,
    from: 70,
    note: "Короткий цикл и рассрочка от застройщика",
    how: "Покупка на стадии плана, перепродажа до ключей",
  },
  {
    id: "renovation",
    label: "Реновация",
    yield: [2, 12],
    years: 2,
    from: 90,
    note: "Разброс самый широкий: всё решает объект",
    how: "Покупка уставшего здания, ремонт, продажа или сдача",
  },
  {
    id: "rental",
    label: "Арендный бизнес",
    yield: [7, 7],
    years: 5,
    from: 70,
    note: "Предсказуемее остальных: договор аренды уже есть",
    how: "Готовый объект с арендатором, доход с первого месяца",
  },
];

export type Forecast = {
  /** Итог по нижней границе вилки, тыс. евро. */
  low: number;
  /** Итог по верхней границе, тыс. евро. */
  high: number;
  /** Прибыль по нижней и верхней границе. */
  profitLow: number;
  profitHigh: number;
  years: number;
};

/**
 * Сложный процент по границам вилки.
 *
 * Считаем именно сложным, а не простым: деньги в таких проектах
 * реинвестируются, и простая ставка занизила бы итог настолько, что
 * калькулятор перестал бы отвечать на вопрос, ради которого его открыли.
 */
export function forecast(strategy: Strategy, capital: number, years = strategy.years): Forecast {
  const grow = (rate: number) => capital * (1 + rate / 100) ** years;
  const low = grow(strategy.yield[0]);
  const high = grow(strategy.yield[1]);
  return {
    low,
    high,
    profitLow: low - capital,
    profitHigh: high - capital,
    years,
  };
}

/** «1,24 млн» или «340 тыс.» — тысячи евро так, как их произносят. */
export function money(thousands: number): string {
  if (thousands >= 1000) {
    return `${(thousands / 1000).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} млн`;
  }
  return `${Math.round(thousands).toLocaleString("ru-RU").replace(/\s/g, " ")} тыс.`;
}

/** «3 года», «5 лет», «1 год». */
export function years(count: number): string {
  const last = count % 10;
  const teen = count % 100 >= 11 && count % 100 <= 14;
  if (!teen && last === 1) return `${count} год`;
  if (!teen && last >= 2 && last <= 4) return `${count} года`;
  return `${count} лет`;
}
