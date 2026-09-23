import type { TierId } from "@/components/present/mavera/theme";

/**
 * Конструктор: что можно включить и выключить прямо на сайте.
 *
 * Смысл не в списке блоков, а в том, что тумблер переключает настоящий блок
 * на странице: видно, что именно он добавляет, до того как решать, нужен ли
 * он. Цен здесь нет — прайс студии только на сервере
 * (lib/configurator/prices.ts).
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
  | "audit"
  | "cabinet"
  | "partners"
  | "pay"
  | "commerce-calc"
  | "forecast";

export type AddonWhere = "main" | "object" | "both" | "admin" | "integrations";

export type Addon = {
  id: AddonId;
  label: string;
  /** Что изменится на странице — одной строкой. */
  effect: string;
  where: AddonWhere;
};

export const addons: Addon[] = [
  /* Сайт — везде */
  { id: "langs", label: "Три языка EN / RU / UZ", effect: "Переключатель языка в шапке", where: "both" },
  { id: "motion", label: "Анимации и параллакс", effect: "Появление блоков, движение кадров, счётчики", where: "both" },
  { id: "magnetic", label: "Магнитные кнопки", effect: "Кнопки тянутся к курсору и подсвечиваются", where: "both" },
  { id: "chat", label: "Чат WhatsApp / Telegram", effect: "Плавающая кнопка мессенджера", where: "both" },

  /* Главная */
  { id: "hero", label: "Живой первый экран", effect: "Заголовок собирается по словам, кадр медленно наезжает", where: "main" },
  { id: "promo", label: "Строка условий покупки", effect: "Ипотека, рассрочка, скидка над первым экраном", where: "main" },
  { id: "reviews", label: "Отзывы жильцов", effect: "Три отзыва с оценкой перед формой заявки", where: "main" },
  { id: "news", label: "Новости и пресс-центр", effect: "Лента новостей компании на главной", where: "main" },
  { id: "commerce-calc", label: "Калькулятор доходности и заявка в банк", effect: "Взнос, срок, аренда — расчёт по объекту коммерции и заявка банку-партнёру", where: "main" },

  /* Карточка ЖК */
  { id: "map", label: "Интерактивная карта", effect: "Расположение с картой в карточке ЖК", where: "object" },
  { id: "calc", label: "Ипотечный калькулятор", effect: "Расчёт платежа по выбранной квартире", where: "object" },
  { id: "chess", label: "Шахматка квартир", effect: "Этажи клетками вместо списка", where: "object" },
  { id: "favorites", label: "Избранное и подборка", effect: "Сердечко на квартире, подборка уходит ссылкой", where: "object" },
  { id: "progress", label: "Ход строительства", effect: "Фотоотчёт по месяцам в карточке ЖК", where: "object" },
  { id: "booking", label: "Онлайн-бронирование", effect: "Бронь на 5 дней вместо заявки", where: "object" },
  { id: "tour", label: "3D-тур по квартире", effect: "Панорама 360° в карточке ЖК", where: "object" },
  { id: "forecast", label: "Прогноз стоимости квартиры", effect: "График роста цены выбранной квартиры по годам в карточке ЖК", where: "object" },

  /* Панель управления */
  { id: "roles", label: "Роли и права", effect: "Матрица прав по ролям в разделе «Пользователи»", where: "admin" },
  { id: "crm", label: "Интеграция с вашей CRM", effect: "Заявки уходят в вашу CRM, статус сделки виден в списке", where: "admin" },
  { id: "import", label: "Импорт квартир из Excel", effect: "Прайс XLSX с предпросмотром изменений", where: "admin" },
  { id: "metrika", label: "Яндекс.Метрика в панели", effect: "Источники, цели и вебвизор внутри панели", where: "admin" },
  { id: "audit", label: "Журнал действий", effect: "Кто и когда поменял цену или статус", where: "admin" },

  /* Сверх сайта — то, что застройщику нужно рядом с ним. Блока на макете нет. */
  { id: "cabinet", label: "Личный кабинет дольщика", effect: "Договор, график платежей и ход стройки по своей квартире", where: "integrations" },
  { id: "partners", label: "Партнёрский кабинет для риелторов", effect: "Агентство фиксирует клиента, видит статус сделки и свою комиссию", where: "integrations" },
  { id: "pay", label: "Онлайн-оплата брони", effect: "Payme, Click и Uzum прямо в бронировании квартиры", where: "integrations" },
];

/** Что уже входит в вариант — с этим набором страница открывается. */
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
    "commerce-calc",
    "forecast",
    "chess",
    "progress",
    "booking",
    "roles",
    "crm",
    "metrika",
    "audit",
  ],
  // Noir — тот же состав, что «Премиум»: различается оформлением.
  noir: [
    "langs",
    "map",
    "motion",
    "magnetic",
    "hero",
    "promo",
    "calc",
    "commerce-calc",
    "forecast",
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
