/**
 * Условия банков-партнёров для калькулятора.
 *
 * Ставки и сроки — **условные**: реальные меняются каждый квартал и зависят
 * от программы, поэтому в готовом сайте они правятся в панели управления, а
 * не в коде. На витрине это подписано прямым текстом: считать по ним ипотеку
 * всерьёз нельзя, и вводить в заблуждение мы не собираемся.
 *
 * Банки названы настоящие — те, что действительно кредитуют покупку жилья в
 * Узбекистане; условия к ним подставит заказчик.
 */

export type Bank = {
  id: string;
  name: string;
  /** Годовая ставка, %. */
  rate: number;
  /** Минимальный первоначальный взнос, доля от стоимости. */
  down: number;
  /** Максимальный срок, лет. */
  years: number;
  note: string;
};

export const banks: Bank[] = [
  { id: "ipoteka", name: "Ипотека-банк", rate: 17.5, down: 0.15, years: 20, note: "Программа для новостроек" },
  { id: "asaka", name: "Асака-банк", rate: 18.9, down: 0.2, years: 15, note: "Без залога третьих лиц" },
  { id: "kapital", name: "Капиталбанк", rate: 16.9, down: 0.25, years: 15, note: "При подтверждённом доходе" },
  { id: "sqb", name: "SQB", rate: 19.5, down: 0.2, years: 20, note: "Решение за один день" },
  { id: "developer", name: "Рассрочка MAVERA", rate: 0, down: 0.3, years: 1.5, note: "Без процентов до сдачи дома" },
];

/** Аннуитетный платёж — та же формула, что в банковских калькуляторах. */
export function monthlyPayment(principal: number, annualRate: number, years: number): number {
  const months = Math.max(Math.round(years * 12), 1);
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}
