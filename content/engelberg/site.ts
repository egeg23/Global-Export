/**
 * Engelberg (engelberg-window.com) — всё, что макет говорит о товарах.
 *
 * Тексты и цифры сняты с их сайта 06.10.2026, страницы каталога:
 * /catalog/sistemy-iz-alyuminiya/thermo-90.htm, /catalog/outdoor-sistemy/bkh-65.htm,
 * /catalog/fasadnye-sistemy/fs-50.htm, /catalog/aksessuary/ruchki-engelberg.htm,
 * /catalog/laminatsiya-i-otdelka/premialnye-laminatsii.htm. Своих цифр здесь
 * нет: правило студии — характеристики только заказчика. Переписаны лишь
 * связки между фактами, простыми словами, без новых обещаний.
 */

export type Spec = { label: string; value: string };

export const brand = {
  name: "Engelberg",
  slogan: "Создавая новый стиль жизни",
  lead: "Оконные и раздвижные системы для частных резиденций, вилл, отелей и девелоперских проектов, где важны свет, тишина, вид и точность исполнения.",
  motto: "Окно как часть архитектуры",
  phone: "+998 71 207-77-77",
  phoneHref: "tel:+998712077777",
  email: "info@engelberg-window.com",
  site: "https://engelberg-window.com",
};

/** Окна в пол — Thermo 90, «для панорамного остекления». */
export const thermo90 = {
  name: "Thermo 90",
  series: "Серия Engelberg 90 · Системы из алюминия",
  lead: "Усиленная алюминиевая система с монтажной глубиной 90 мм для панорамного остекления.",
  headline: [
    { value: "43 дБ", label: "Уровень снижения шума" },
    { value: "Uw = 2,10", label: "Теплопроводность, Вт/(м²·К)" },
  ],
  specs: [
    { label: "Тип профиля", value: "Алюминиевый" },
    { label: "Серия", value: "Тёплая" },
    { label: "Монтажная глубина рамы", value: "90 мм" },
    { label: "Глубина створки", value: "84 мм" },
    { label: "Ширина термомоста", value: "39 мм" },
    { label: "Толщина заполнения", value: "до 48 мм" },
    { label: "Макс. вес створки", value: "200 кг" },
  ] satisfies Spec[],
};

/**
 * Четыре преимущества — одни и те же на всех страницах серий. Здесь они
 * рассказываются по ходу пролёта сквозь профиль.
 */
export const benefits = [
  {
    title: "Тепловая эффективность",
    text: "Энергоэффективный термомост и многокамерный профиль удерживают тепло внутри помещения даже в суровом климате.",
  },
  {
    title: "Надёжная герметичность",
    text: "Продуманная система уплотнений защищает помещение от сквозняков, пыли и влаги в любое время года.",
  },
  {
    title: "Тишина в доме",
    text: "Конструкция снижает уровень шума — комфорт даже рядом с оживлённой трассой.",
  },
  {
    title: "Архитектурная свобода",
    text: "Тонкие профили и большие форматы остекления работают вместе с фасадом, интерьером и видом.",
  },
];

/**
 * Три контура алюминиевого профиля с термомостом — простыми словами, что
 * каждый даёт человеку в доме.
 */
export const chambers = [
  {
    n: "01",
    title: "Наружный контур",
    text: "Алюминий принимает на себя улицу: ветер, дождь, солнце и холод.",
  },
  {
    n: "02",
    title: "Термомост 39 мм",
    text: "Разрывает путь холоду. Металл снаружи и металл внутри больше не связаны напрямую.",
  },
  {
    n: "03",
    title: "Внутренний контур",
    text: "Остаётся тёплым. Нет холодной кромки у стекла — нет и конденсата.",
  },
];

/** Раздвижная outdoor-система. */
export const bkh65 = {
  name: "BKH 65",
  series: "Раздвижная серия BKH · Outdoor-системы",
  lead: "Раздвижная outdoor-система для террас, зимних садов и панорамных проёмов.",
  headline: { value: "Uw = 2,20", label: "Теплопроводность, Вт/(м²·К)" },
  specs: [
    { label: "Тип профиля", value: "Алюминиевый" },
    { label: "Серия", value: "Раздвижная" },
    { label: "Монтажная глубина рамы", value: "148/232 мм" },
    { label: "Глубина створки", value: "64 мм" },
    { label: "Ширина термомоста", value: "20–34 мм" },
    { label: "Толщина заполнения", value: "20–48 мм" },
  ] satisfies Spec[],
};

/** Стоечно-ригельный фасад. */
export const fs50 = {
  name: "FS 50",
  series: "Фасадная серия FS · Фасадные системы",
  lead: "Стоечно-ригельная фасадная система с шириной видимой части 50 мм.",
  about:
    "Светопрозрачная фасадная конструкция для коммерческих и девелоперских объектов: большие форматы остекления и высокая теплоизоляция.",
  headline: { value: "Uw = 1,40", label: "Теплопроводность, Вт/(м²·К)" },
  specs: [
    { label: "Тип профиля", value: "Алюминиевый" },
    { label: "Видимая часть", value: "50 мм" },
    { label: "Монтажная глубина", value: "50 мм" },
    { label: "Толщина заполнения", value: "до 60 мм" },
  ] satisfies Spec[],
};

export const handles = {
  name: "Ручки Engelberg",
  lead: "Премиальные оконные ручки Engelberg в шести финишах — деталь, определяющая характер окна.",
  origin: "Made in Germany",
};

/**
 * Премиальные ламинации — шесть отделок с их сайта. Цвет образца — по
 * номеру RAL; у двух дубов — плёнка, её показывает фотография.
 */
export const finishes = [
  { name: "Charcoal Oak", code: "F470-9026", tone: "var(--eb-charcoal-oak)", wood: true },
  { name: "Golden Oak", code: "F436-2178", tone: "var(--eb-golden-oak)", wood: true },
  { name: "Anthracite", code: "RAL 7016", tone: "var(--eb-anthracite)" },
  { name: "Pure White", code: "RAL 9016", tone: "var(--eb-pure-white)" },
  { name: "Silver", code: "RAL 9006", tone: "var(--eb-silver)" },
  { name: "Bronze", code: "RAL 8019", tone: "var(--eb-bronze)" },
];

export const portfolio = [
  { name: "Sea Breeze", kind: "Private Residences", image: "port-sea-breeze" },
  { name: "Skyline Villa", kind: "Villas", image: "port-skyline" },
  { name: "Grand Hotel", kind: "Hospitality", image: "port-grand-hotel" },
  { name: "City Apartments", kind: "Apartments", image: "port-city" },
];

export const catalog = [
  "Системы из алюминия",
  "Фасадные системы",
  "Системы из ПВХ",
  "Outdoor-системы",
  "Аксессуары",
  "Ламинация и отделка",
];
