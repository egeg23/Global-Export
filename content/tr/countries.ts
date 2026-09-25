/**
 * Направления подбора.
 *
 * Список стран и городов — их собственный, с главной и со страниц
 * направлений tranio.ru. Фотографии городов сняты оттуда же.
 *
 * Про цифры честно, и это важно. Прайса по странам Tranio не публикует:
 * на их страницах есть диапазоны доходностей по стратегиям и отдельные
 * пороги входа — €70 000 у стратегий, €250 000 у ВНЖ ЕС, $205 000 у ОАЭ,
 * €232 000 у их собственного проекта в Лимасоле. Всё, что здесь названо
 * «порогом входа», — ориентир по рынку направления, а не их прайс, и на
 * странице это подписано. В рабочем сайте эта таблица приходит из панели
 * управления и правится менеджером.
 *
 * Доходности взяты из их четырёх стратегий и не выходят за их границы:
 * строительство в Европе 10—15%, строительство в Дубае 8%, реновация
 * 2—12%, арендный бизнес 7%.
 */

export type Purpose = "live" | "rent" | "build" | "permit";

export const purposes: { id: Purpose; label: string; note: string }[] = [
  { id: "live", label: "Для жизни", note: "Переезд, вторая база, зимовка" },
  { id: "rent", label: "Арендный доход", note: "Готовый объект под сдачу" },
  { id: "build", label: "Девелопмент", note: "Вход на стадии строительства" },
  { id: "permit", label: "Ради ВНЖ", note: "Покупка как основание для статуса" },
];

export type Kind = "flat" | "villa" | "commercial";

export const kinds: { id: Kind; label: string }[] = [
  { id: "flat", label: "Квартира" },
  { id: "villa", label: "Дом или вилла" },
  { id: "commercial", label: "Коммерция" },
];

export type Country = {
  id: string;
  name: string;
  /** Код флага в public/images/tr/flags. */
  flag: string;
  region: "Европа" | "Средиземноморье" | "Ближний Восток" | "Азия" | "Америка";
  /** Порог входа, тыс. евро — ориентир по рынку направления. */
  entry: number;
  /** Вилка доходности в год, %. В границах их четырёх стратегий. */
  yield: [number, number];
  purposes: Purpose[];
  kinds: Kind[];
  /** Города с фотографиями: файл в public/images/tr/cities. */
  cities: { name: string; photo?: string }[];
  /** Одна строка о том, зачем сюда идут. */
  note: string;
};

export const countries: Country[] = [
  {
    id: "uae",
    name: "ОАЭ",
    flag: "ae",
    region: "Ближний Восток",
    entry: 190,
    yield: [7, 8],
    purposes: ["rent", "build", "permit"],
    kinds: ["flat", "villa", "commercial"],
    cities: [
      { name: "Дубай", photo: "uae-dubai" },
      { name: "Абу-Даби", photo: "uae-abu-dhabi" },
      { name: "Шарджа", photo: "uae-sharjah" },
      { name: "Рас-эль-Хайма", photo: "uae-ras-al-khaimah" },
      { name: "Аджман", photo: "uae-ajman" },
    ],
    note: "Нет налога на доход от аренды; ВНЖ за инвестиции от $205 тыс.",
  },
  {
    id: "cyprus",
    name: "Кипр",
    flag: "cy",
    region: "Средиземноморье",
    entry: 230,
    yield: [5, 8],
    purposes: ["live", "rent", "permit"],
    kinds: ["flat", "villa"],
    cities: [
      { name: "Лимасол", photo: "cyprus-limassol" },
      { name: "Пафос", photo: "cyprus-paphos" },
      { name: "Ларнака", photo: "cyprus-larnaca" },
      { name: "Айя-Напа", photo: "cyprus-ayia-napa" },
      { name: "Никосия", photo: "cyprus-nicosia" },
      { name: "Фамагуста", photo: "cyprus-famagusta" },
    ],
    note: "ПМЖ при покупке; статус Non-Domicile для налоговой оптимизации.",
  },
  {
    id: "greece",
    name: "Греция",
    flag: "gr",
    region: "Средиземноморье",
    entry: 250,
    yield: [5, 9],
    purposes: ["live", "rent", "permit"],
    kinds: ["flat", "villa", "commercial"],
    cities: [
      { name: "Афины", photo: "greece-athens" },
      { name: "Салоники", photo: "greece-thessaloniki" },
      { name: "Халкидики", photo: "greece-chalkidiki" },
      { name: "Крит", photo: "greece-crete" },
      { name: "Корфу", photo: "greece-corfu" },
      { name: "Пелопоннес", photo: "greece-peloponnese" },
    ],
    note: "Золотая виза Греции — отдельный раздел на их сайте.",
  },
  {
    id: "spain",
    name: "Испания",
    flag: "es",
    region: "Средиземноморье",
    entry: 220,
    yield: [4, 7],
    purposes: ["live", "rent"],
    kinds: ["flat", "villa", "commercial"],
    cities: [
      { name: "Барселона", photo: "spain-barcelona" },
      { name: "Мадрид", photo: "spain-madrid" },
      { name: "Аликанте", photo: "spain-alicante" },
      { name: "Коста-дель-Соль", photo: "spain-costa-del-sol" },
      { name: "Коста-Бланка", photo: "spain-costa-blanca" },
      { name: "Майорка", photo: "spain-majorca" },
      { name: "Тенерифе", photo: "spain-tenerife" },
      { name: "Торревьеха", photo: "spain-torrevieja" },
    ],
    note: "Один из их самых частых запросов: «купить квартиру в Испании».",
  },
  {
    id: "thailand",
    name: "Таиланд",
    flag: "th",
    region: "Азия",
    entry: 95,
    yield: [6, 9],
    purposes: ["live", "rent", "build"],
    kinds: ["flat", "villa"],
    cities: [
      { name: "Пхукет", photo: "thailand-phuket" },
      { name: "Бангкок", photo: "thailand-bangkok" },
      { name: "Паттайя", photo: "thailand-pattaya" },
      { name: "Самуи", photo: "thailand-ko-samui" },
    ],
    note: "Фрихолд в кондоминиумах; у них отдельный разбор дефицита земли на Пхукете.",
  },
  {
    id: "turkey",
    name: "Турция",
    flag: "tr",
    region: "Средиземноморье",
    entry: 120,
    yield: [5, 8],
    purposes: ["live", "rent", "permit"],
    kinds: ["flat", "villa"],
    cities: [{ name: "Стамбул" }, { name: "Анталья" }, { name: "Бодрум" }],
    note: "Гражданство за инвестиции — программа есть в их списке.",
  },
  {
    id: "portugal",
    name: "Португалия",
    flag: "pt",
    region: "Европа",
    entry: 280,
    yield: [4, 6],
    purposes: ["live", "rent", "permit"],
    kinds: ["flat", "villa"],
    cities: [{ name: "Лиссабон" }, { name: "Порту" }, { name: "Алгарве" }],
    note: "Из их списка стран присутствия.",
  },
  {
    id: "germany",
    name: "Германия",
    flag: "de",
    region: "Европа",
    entry: 300,
    yield: [4, 6],
    purposes: ["rent", "build"],
    kinds: ["flat", "commercial"],
    cities: [{ name: "Берлин" }, { name: "Мюнхен" }, { name: "Франкфурт-на-Майне" }],
    note: "Супермаркет в Баварии — один из их «топ-3» с доходностью 6,4%.",
  },
  {
    id: "italy",
    name: "Италия",
    flag: "it",
    region: "Средиземноморье",
    entry: 260,
    yield: [3, 6],
    purposes: ["live", "rent"],
    kinds: ["flat", "villa"],
    cities: [{ name: "Тоскана" }, { name: "Рим" }, { name: "Сицилия" }, { name: "Калабрия" }],
    note: "Из их списка популярных локаций.",
  },
  {
    id: "france",
    name: "Франция",
    flag: "fr",
    region: "Европа",
    entry: 350,
    yield: [3, 5],
    purposes: ["live", "rent"],
    kinds: ["flat", "villa"],
    cities: [{ name: "Париж" }, { name: "Лазурный Берег" }, { name: "Канны" }],
    note: "У них отдельный разбор: цены во Франции от 3 500 €/м².",
  },
  {
    id: "montenegro",
    name: "Черногория",
    flag: "me",
    region: "Средиземноморье",
    entry: 110,
    yield: [5, 8],
    purposes: ["live", "rent"],
    kinds: ["flat", "villa"],
    cities: [{ name: "Будва" }, { name: "Тиват" }, { name: "Котор" }],
    note: "Из их списка популярных локаций.",
  },
  {
    id: "oman",
    name: "Оман",
    flag: "om",
    region: "Ближний Восток",
    entry: 150,
    yield: [6, 8],
    purposes: ["rent", "permit"],
    kinds: ["flat", "villa"],
    cities: [{ name: "Маскат" }, { name: "Салала" }],
    note: "У них есть разбор ВНЖ и налогов Омана.",
  },
  {
    id: "indonesia",
    name: "Бали",
    flag: "id",
    region: "Азия",
    entry: 120,
    yield: [8, 12],
    purposes: ["rent", "build"],
    kinds: ["villa"],
    cities: [{ name: "Семиньяк" }, { name: "Чангу" }, { name: "Убуд" }, { name: "Ломбок" }],
    note: "Из их разбора: ВНЖ и ипотека в Индонезии для россиян.",
  },
  {
    id: "uk",
    name: "Великобритания",
    flag: "uk",
    region: "Европа",
    entry: 420,
    yield: [3, 5],
    purposes: ["live", "rent"],
    kinds: ["flat", "commercial"],
    cities: [{ name: "Лондон" }],
    note: "Из их списка стран.",
  },
  {
    id: "usa",
    name: "США",
    flag: "us",
    region: "Америка",
    entry: 300,
    yield: [4, 7],
    purposes: ["rent", "build"],
    kinds: ["flat", "villa", "commercial"],
    cities: [{ name: "Нью-Йорк" }, { name: "Майами" }, { name: "Нью-Джерси" }],
    note: "Из их списка популярных локаций.",
  },
  {
    id: "austria",
    name: "Австрия",
    flag: "at",
    region: "Европа",
    entry: 320,
    yield: [3, 5],
    purposes: ["live", "rent"],
    kinds: ["flat"],
    cities: [{ name: "Вена" }],
    note: "Из их списка стран.",
  },
  {
    id: "switzerland",
    name: "Швейцария",
    flag: "ch",
    region: "Европа",
    entry: 600,
    yield: [3, 5],
    purposes: ["rent"],
    kinds: ["commercial"],
    cities: [{ name: "Цюрих" }],
    note: "Отель в Цюрихе — первый в их «топ-3» с доходностью 4,7%.",
  },
  {
    id: "hungary",
    name: "Венгрия",
    flag: "hu",
    region: "Европа",
    entry: 140,
    yield: [5, 7],
    purposes: ["live", "rent"],
    kinds: ["flat"],
    cities: [{ name: "Будапешт" }],
    note: "Из их списка стран.",
  },
  {
    id: "croatia",
    name: "Хорватия",
    flag: "hr",
    region: "Средиземноморье",
    entry: 160,
    yield: [4, 7],
    purposes: ["live", "rent"],
    kinds: ["flat", "villa"],
    cities: [{ name: "Дубровник" }, { name: "Сплит" }],
    note: "Из их списка стран.",
  },
  {
    id: "czechia",
    name: "Чехия",
    flag: "cz",
    region: "Европа",
    entry: 180,
    yield: [4, 6],
    purposes: ["live", "rent"],
    kinds: ["flat"],
    cities: [{ name: "Прага" }],
    note: "Из их списка стран.",
  },
  {
    id: "israel",
    name: "Израиль",
    flag: "il",
    region: "Ближний Восток",
    entry: 400,
    yield: [3, 5],
    purposes: ["live"],
    kinds: ["flat"],
    cities: [{ name: "Тель-Авив" }],
    note: "Из их списка стран.",
  },
];

/** Сколько направлений подходит под фильтр и какой у них разброс. */
export function match(filter: {
  purpose: Purpose | null;
  kind: Kind | null;
  budget: number;
}): Country[] {
  return countries.filter((country) => {
    if (filter.purpose && !country.purposes.includes(filter.purpose)) return false;
    if (filter.kind && !country.kinds.includes(filter.kind)) return false;
    return country.entry <= filter.budget;
  });
}

/** «€250 тыс.» — тысячи евро словом, без дробей. */
export function eur(thousands: number): string {
  if (thousands >= 1000) {
    const millions = thousands / 1000;
    return `€${millions.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн`;
  }
  return `€${thousands.toLocaleString("ru-RU")} тыс.`;
}
