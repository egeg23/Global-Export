/**
 * Форматирование чисел для витрины ADAR.
 *
 * Локаль зашита: проект одноязычный, и `toLocaleString` с русской локалью
 * ставит неразрывный узкий пробел — ровно то, что нужно в цене.
 */

const price = new Intl.NumberFormat("ru-RU");

/** 180000 → «180 000 сум». */
export function formatPrice(value: number): string {
  return `${price.format(value)} сум`;
}

/** То же без единицы — для мест, где «сум» стоит отдельной строкой. */
export function formatNumber(value: number): string {
  return price.format(value);
}

/** 6181 → «6,2 кг», 840 → «840 г». */
export function formatWeight(grams: number): string {
  if (grams < 1000) return `${price.format(grams)} г`;
  const kg = grams / 1000;
  return `${kg.toFixed(1).replace(".", ",")} кг`;
}

/**
 * Русское склонение по числу: 1 набор, 2 набора, 5 наборов.
 * Формы передаются в порядке «один / два / пять».
 */
export function plural(count: number, forms: [string, string, string]): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

/** «12 наименований», «1 наименование». */
export function pluralize(count: number, forms: [string, string, string]): string {
  return `${price.format(count)} ${plural(count, forms)}`;
}
