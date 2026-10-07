/**
 * Apollo Travel (goapollo.uz) — всё, что макет берёт с их сайта.
 *
 * Снято 07.10.2026. Тексты «О компании», контакты, советы и тарифы
 * авиакомпаний — их собственные (страницы /o-kompanii, /kontakty, /blog,
 * /aviabilety). Поиск туров на их сайте — модули Tourvisor, на макете их
 * место занимает наша форма и наша анимация поиска; выдача туров и
 * горящие туры — пример того, как модуль ляжет в оформление, а не их
 * реальные предложения (у каждого такого блока это подписано).
 */

export const company = {
  name: "Apollo Travel",
  slogan: "Ваш путеводитель к звёздам",
  founded: 2017,
  city: "Ташкент",
  address: "Ташкент, ул. Лабзак, д. 29",
  phone: "+998 55 588-87-87",
  phoneHref: "tel:+998555888787",
  email: "apollotravelteam@gmail.com",
  telegram: [
    { handle: "@Apollo_Travel", note: "Telegram для связи", href: "https://t.me/Apollo_Travel" },
    { handle: "@apollotravel_uz", note: "Горящие туры", href: "https://t.me/apollotravel_uz" },
    { handle: "@Oybek_Turagent", note: "Турагент", href: "https://t.me/oybek_turagent" },
  ],
  instagram: "https://www.instagram.com/apollotravel_uz/",
  facebook: "https://www.facebook.com/apollotraveluz",
  yandexMaps: "https://yandex.uz/maps/org/188161320977/",
  yandexReviewsWidget: "https://yandex.ru/maps-reviews-widget/188161320977?comments",
  mission: "Создавать путешествия, которые меняют жизнь, помогая людям лучше понять мир и самих себя.",
};

/** «Почему мы» — их слова с главной. */
export const promises = [
  { title: "Туры от 70+ туроператоров", text: "Онлайн-поиск по всем крупным туроператорам в любое время суток." },
  { title: "Мы видели отели своими глазами", text: "Регулярно ездим в ознакомительные туры и знаем особенности каждого региона и отеля." },
  { title: "Держим руку на пульсе", text: "Знаем, когда появляются хорошие цены, и подбираем тур под вас." },
  { title: "С 2017 года в Ташкенте", text: "Офис на Лабзаке, онлайн-оплата и поддержка в Telegram." },
];

export const values = [
  { title: "Забота о клиенте", text: "Создавать незабываемые путешествия, ориентируясь на потребности и желания каждого клиента." },
  { title: "Прозрачность", text: "Действуем честно и открыто, даём клиентам полную информацию о наших услугах." },
  { title: "Инновации", text: "Внедряем новые технологии, чтобы находить сотни туров за несколько секунд." },
];

/** Туроператоры — логотипы с их главной. */
export const operators = [
  { id: "anex", name: "Anex Tour" },
  { id: "coral", name: "Coral Travel" },
  { id: "pegas", name: "Pegas Touristik" },
  { id: "tez", name: "TEZ TOUR" },
  { id: "sunmar", name: "Sunmar" },
  { id: "biblio", name: "Библио-Глобус" },
  { id: "funsun", name: "FUN&SUN" },
];

export type Destination = {
  id: string;
  country: string;
  place: string;
  /** Широта, долгота — для глобуса. */
  at: [number, number];
  /** Время в пути из Ташкента, часы — ориентир. */
  hours: string;
  /** «от» за человека, 7 ночей с перелётом, $ — ориентир рынка (docs/apollo-research.md). */
  from: number;
  visa: "без визы" | "виза по прилёту" | "e-visa" | "нужна виза";
  season: string;
};

/**
 * Направления — самые частые из Ташкента. Цены «от» — ориентир рынка
 * Ташкента 2025 года (kun.uz, 1travel.uz, turtopar.uz; Вьетнам и Шри-Ланка —
 * без надёжного источника, по соседям). На рабочем сайте их подставит
 * модуль Tourvisor (tv-min-price).
 */
export const destinations: Destination[] = [
  { id: "turkey", country: "Турция", place: "Анталья", at: [36.9, 30.7], hours: "4 ч 40 мин", from: 876, visa: "без визы", season: "май — октябрь" },
  { id: "dubai", country: "ОАЭ", place: "Дубай", at: [25.2, 55.27], hours: "3 ч 30 мин", from: 600, visa: "e-visa", season: "октябрь — апрель" },
  { id: "egypt", country: "Египет", place: "Шарм-эль-Шейх", at: [27.9, 34.33], hours: "5 ч 30 мин", from: 450, visa: "виза по прилёту", season: "круглый год" },
  { id: "thailand", country: "Таиланд", place: "Пхукет", at: [7.88, 98.39], hours: "7 ч 30 мин", from: 1045, visa: "без визы", season: "ноябрь — апрель" },
  { id: "maldives", country: "Мальдивы", place: "Мале", at: [4.18, 73.51], hours: "5 ч 10 мин", from: 947, visa: "виза по прилёту", season: "ноябрь — апрель" },
  { id: "georgia", country: "Грузия", place: "Батуми", at: [41.64, 41.63], hours: "3 ч 10 мин", from: 520, visa: "без визы", season: "июнь — сентябрь" },
  { id: "vietnam", country: "Вьетнам", place: "Нячанг", at: [12.24, 109.19], hours: "7 ч 50 мин", from: 1100, visa: "e-visa", season: "февраль — сентябрь" },
  { id: "srilanka", country: "Шри-Ланка", place: "Бентота", at: [6.42, 80.0], hours: "6 ч 20 мин", from: 1150, visa: "e-visa", season: "декабрь — апрель" },
  { id: "istanbul", country: "Турция", place: "Стамбул", at: [41.01, 28.98], hours: "4 ч 50 мин", from: 560, visa: "без визы", season: "круглый год" },
];

export const TASHKENT: [number, number] = [41.31, 69.28];

export type Fare = { to: string; price: number };

/** Тарифы со страницы «Авиабилеты», в сумах, из Ташкента. */
export const fares: { airline: string; code: string; fares: Fare[] }[] = [
  {
    airline: "Uzbekistan Airways",
    code: "HY",
    fares: [
      { to: "Стамбул", price: 2_924_000 },
      { to: "Дубай", price: 2_679_000 },
      { to: "Париж", price: 4_379_000 },
      { to: "Пекин", price: 2_764_000 },
      { to: "Батуми", price: 2_837_000 },
      { to: "Санкт-Петербург", price: 2_417_000 },
      { to: "Бишкек", price: 1_266_000 },
      { to: "Франкфурт", price: 4_204_000 },
      { to: "Москва", price: 2_100_000 },
    ],
  },
  {
    airline: "Centrum Air",
    code: "C6",
    fares: [
      { to: "Алматы", price: 1_120_000 },
      { to: "Иссык-Куль", price: 655_000 },
      { to: "Баку", price: 1_580_000 },
      { to: "Тбилиси", price: 1_780_000 },
      { to: "Стамбул", price: 2_410_000 },
      { to: "Бангкок", price: 2_755_000 },
      { to: "Сеул", price: 2_740_000 },
      { to: "Ургенч", price: 585_000 },
      { to: "Москва", price: 1_920_000 },
      { to: "Казань", price: 2_210_000 },
    ],
  },
  {
    airline: "Silk Avia",
    code: "US",
    fares: [
      { to: "Самарканд", price: 290_000 },
      { to: "Бухара", price: 320_000 },
      { to: "Андижан", price: 305_000 },
      { to: "Зомин", price: 116_000 },
      { to: "Ургенч", price: 435_000 },
      { to: "Карши", price: 280_000 },
    ],
  },
  {
    airline: "Turkish Airlines",
    code: "TK",
    fares: [
      { to: "Стамбул", price: 2_980_000 },
      { to: "Анталья", price: 4_155_000 },
      { to: "Рим", price: 7_372_000 },
      { to: "Амстердам", price: 8_023_000 },
    ],
  },
];

/** Статьи их блога — заголовки и первые строки. */
export const articles = [
  {
    title: "Италия переходит на цифровые визы",
    text: "С июня 2026 года страна полностью переходит на цифровые шенгенские и национальные визы.",
    tag: "Визы",
  },
  {
    title: "Популярные курорты ОАЭ",
    text: "Дубай и Абу-Даби давно стали синонимом пятизвёздочного отдыха, но Шарджа и Фуджейра не уступают знаменитым соседям.",
    tag: "Направления",
  },
  {
    title: "Шоппинг в Дубае",
    text: "Большая конкуренция и НДС 5% — большую часть можно вернуть. Для сравнения: в Узбекистане НДС 12%.",
    tag: "Советы",
  },
];

export const nav = [
  { id: "search", label: "Подбор тура" },
  { id: "hot", label: "Горящие туры" },
  { id: "flights", label: "Авиабилеты" },
  { id: "countries", label: "Страны" },
  { id: "about", label: "О компании" },
  { id: "contacts", label: "Контакты" },
];

export const fmtSum = (n: number) => `${n.toLocaleString("ru-RU").replace(/,/g, " ")} сум`;
export const fmtUsd = (n: number) => `$${n.toLocaleString("en-US")}`;
