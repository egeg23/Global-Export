import type { TierId } from "@/components/present/mavera/theme";

/**
 * Конструктор: что можно включить и выключить прямо на сайте.
 *
 * Смысл не в списке допников — он есть в смете. Смысл в том, что тумблер
 * переключает настоящий блок на странице, и заказчик видит, за что платит,
 * до того как решит платить. Цены — из сметы, чтобы на витрине и в документе
 * стояли одни и те же цифры.
 *
 * `where` говорит, на какой странице живёт блок: тумблер, включённый на
 * главной, должен подсказать, что смотреть надо в карточке ЖК, а не молчать.
 */

export type AddonId =
  | "langs"
  | "map"
  | "motion"
  | "promo"
  | "chat"
  | "calc"
  | "chess"
  | "progress"
  | "booking"
  | "tour";

export type Addon = {
  id: AddonId;
  label: string;
  priceUsd: number;
  /** Что изменится на странице — одной строкой. */
  effect: string;
  where: "main" | "object" | "both";
};

export const addons: Addon[] = [
  { id: "langs", label: "Три языка EN / RU / UZ", priceUsd: 0, effect: "Переключатель языка в шапке", where: "both" },
  { id: "map", label: "Интерактивная карта", priceUsd: 0, effect: "Расположение с картой в карточке ЖК", where: "object" },
  { id: "motion", label: "Анимации и параллакс", priceUsd: 400, effect: "Появление блоков, движение кадров", where: "both" },
  { id: "promo", label: "Строка условий покупки", priceUsd: 200, effect: "Ипотека, рассрочка, скидка над первым экраном", where: "main" },
  { id: "calc", label: "Ипотечный калькулятор", priceUsd: 500, effect: "Расчёт платежа по выбранной квартире", where: "object" },
  { id: "chess", label: "Шахматка квартир", priceUsd: 1200, effect: "Этажи клетками вместо списка", where: "object" },
  { id: "progress", label: "Ход строительства", priceUsd: 350, effect: "Фотоотчёт по месяцам в карточке ЖК", where: "object" },
  { id: "booking", label: "Онлайн-бронирование", priceUsd: 900, effect: "Бронь на 5 дней вместо заявки", where: "object" },
  { id: "tour", label: "3D-тур по квартире", priceUsd: 900, effect: "Панорама 360° в карточке ЖК", where: "object" },
  { id: "chat", label: "Чат WhatsApp / Telegram", priceUsd: 300, effect: "Плавающая кнопка мессенджера", where: "both" },
];

/** Что уже входит в пакет — за это тумблер денег не просит. */
export const included: Record<TierId, AddonId[]> = {
  standard: ["langs", "map"],
  lux: ["langs", "map", "motion"],
  premium: ["langs", "map", "motion", "promo", "calc", "chess", "progress", "booking"],
};

export function addonById(id: AddonId): Addon {
  return addons.find((addon) => addon.id === id) ?? addons[0];
}
