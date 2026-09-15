import type { TierId } from "@/components/present/mavera/theme";

/**
 * Конструктор: что можно включить и выключить прямо на сайте.
 *
 * Смысл не в списке допников — он есть в смете. Смысл в том, что тумблер
 * переключает настоящий блок на странице, и заказчик видит, за что платит,
 * до того как решит платить. Цены — из сметы, чтобы на витрине и в документе
 * стояли одни и те же цифры.
 *
 * `where` говорит, где живёт блок. Тумблер, включённый не на той странице,
 * не молчит: конструктор сам переводит на нужную и подъезжает к блоку.
 */

export type AddonId =
  | "langs"
  | "map"
  | "motion"
  | "hero"
  | "magnetic"
  | "promo"
  | "reviews"
  | "news"
  | "chat"
  | "calc"
  | "chess"
  | "progress"
  | "booking"
  | "tour"
  | "favorites"
  | "roles"
  | "crm"
  | "import"
  | "metrika"
  | "audit";

export type AddonWhere = "main" | "object" | "both" | "admin";

export type Addon = {
  id: AddonId;
  label: string;
  priceUsd: number;
  /** Что изменится на странице — одной строкой. */
  effect: string;
  where: AddonWhere;
};

export const addons: Addon[] = [
  /* Сайт — везде */
  { id: "langs", label: "Три языка EN / RU / UZ", priceUsd: 0, effect: "Переключатель языка в шапке", where: "both" },
  { id: "motion", label: "Анимации и параллакс", priceUsd: 400, effect: "Появление блоков, движение кадров, счётчики", where: "both" },
  { id: "magnetic", label: "Магнитные кнопки", priceUsd: 250, effect: "Кнопки тянутся к курсору и подсвечиваются", where: "both" },
  { id: "chat", label: "Чат WhatsApp / Telegram", priceUsd: 300, effect: "Плавающая кнопка мессенджера", where: "both" },

  /* Главная */
  { id: "hero", label: "Живой первый экран", priceUsd: 600, effect: "Заголовок собирается по словам, кадр медленно наезжает", where: "main" },
  { id: "promo", label: "Строка условий покупки", priceUsd: 200, effect: "Ипотека, рассрочка, скидка над первым экраном", where: "main" },
  { id: "reviews", label: "Отзывы жильцов", priceUsd: 350, effect: "Три отзыва с оценкой перед формой заявки", where: "main" },
  { id: "news", label: "Новости и пресс-центр", priceUsd: 600, effect: "Лента новостей компании на главной", where: "main" },

  /* Карточка ЖК */
  { id: "map", label: "Интерактивная карта", priceUsd: 0, effect: "Расположение с картой в карточке ЖК", where: "object" },
  { id: "calc", label: "Ипотечный калькулятор", priceUsd: 500, effect: "Расчёт платежа по выбранной квартире", where: "object" },
  { id: "chess", label: "Шахматка квартир", priceUsd: 1200, effect: "Этажи клетками вместо списка", where: "object" },
  { id: "favorites", label: "Избранное и подборка", priceUsd: 450, effect: "Сердечко на квартире, подборка уходит ссылкой", where: "object" },
  { id: "progress", label: "Ход строительства", priceUsd: 350, effect: "Фотоотчёт по месяцам в карточке ЖК", where: "object" },
  { id: "booking", label: "Онлайн-бронирование", priceUsd: 900, effect: "Бронь на 5 дней вместо заявки", where: "object" },
  { id: "tour", label: "3D-тур по квартире", priceUsd: 900, effect: "Панорама 360° в карточке ЖК", where: "object" },

  /* Панель управления */
  { id: "roles", label: "Роли и права", priceUsd: 400, effect: "Матрица прав по ролям в разделе «Пользователи»", where: "admin" },
  { id: "crm", label: "Интеграция с CRM", priceUsd: 700, effect: "Заявки уходят в amoCRM / Bitrix24, статус в списке", where: "admin" },
  { id: "import", label: "Импорт квартир из Excel", priceUsd: 350, effect: "Прайс XLSX с предпросмотром изменений", where: "admin" },
  { id: "metrika", label: "Яндекс.Метрика в панели", priceUsd: 250, effect: "Источники, цели и вебвизор внутри панели", where: "admin" },
  { id: "audit", label: "Журнал действий", priceUsd: 300, effect: "Кто и когда поменял цену или статус", where: "admin" },
];

/** Что уже входит в пакет — за это тумблер денег не просит. */
export const included: Record<TierId, AddonId[]> = {
  standard: ["langs", "map"],
  lux: ["langs", "map", "motion", "metrika"],
  premium: [
    "langs",
    "map",
    "motion",
    "magnetic",
    "hero",
    "promo",
    "calc",
    "chess",
    "progress",
    "booking",
    "roles",
    "crm",
    "metrika",
    "audit",
  ],
};

export function addonById(id: AddonId): Addon {
  return addons.find((addon) => addon.id === id) ?? addons[0];
}
