import { type Bank, monthlyPayment } from "@/content/mavera/banks";

/**
 * Коммерческая недвижимость MAVERA в Ташкенте.
 *
 * Объекты — вымышленные, но в рыночных цифрах 2026 года: офис класса B на
 * Амира Темура сдаётся по $15–20 за метр в месяц, стрит-ритейл в новых ЖК —
 * по $30–35, продажа — от $1 500 за метр у здания на Чиланзаре до $3 000 у
 * витрины на первом этаже. Из этих ставок считается «примерная доходность»
 * на карточке и в калькуляторе; на месте сдачи их правит заказчик в панели.
 *
 * Расчёт намеренно консервативный: аренда берётся с поправкой на простой
 * (заполняемость), из неё вычитается эксплуатация, и только чистый поток
 * сравнивается с платежом банку.
 */

export type CommerceKind = "Офис" | "Торговое" | "Стрит-ритейл" | "Здание" | "Склад";
export type CommerceDeal = "Продажа" | "Аренда";

export type CommerceObject = {
  id: string;
  name: string;
  /** Короткое имя для чипов калькулятора и заявки. */
  short: string;
  kind: CommerceKind;
  district: string;
  address: string;
  /** Площадь, м². */
  area: number;
  floor: string;
  deal: CommerceDeal;
  status: "Свободно" | "Бронь" | "Сдано";
  /** Цена продажи, $ — только у объектов на продажу. */
  priceUsd?: number;
  /** Аренда за объект в месяц, $ — только у объектов в аренду. */
  rentUsdMonth?: number;
  /** Рыночная ставка аренды, $/м² в месяц — для расчёта доходности. */
  rateUsdM2: number;
  /** Заполняемость: доля года, когда объект действительно сдан. */
  occupancy: number;
  /** Эксплуатация, $/м² в месяц — вычитается из аренды. */
  opexUsdM2: number;
  photo: string;
  /** Ночной кадр для «Noir». */
  photoNight?: string;
  note: string;
};

export const commerceObjects: CommerceObject[] = [
  {
    id: "amir-temur-office",
    short: "Офис на Амира Темура",
    name: "Офисный блок в бизнес-центре на Амира Темура",
    kind: "Офис",
    district: "Мирзо-Улугбекский",
    address: "пр. Амира Темура, деловой квартал",
    area: 320,
    floor: "7 этаж, отдельный вход с ресепшена",
    deal: "Продажа",
    status: "Свободно",
    priceUsd: 608_000,
    rateUsdM2: 18,
    occupancy: 0.92,
    opexUsdM2: 2.5,
    photo: "/images/mavera/business-center.jpg",
    photoNight: "/images/mavera/noir-towers-4.jpg",
    note: "Класс B+, открытая планировка, два машиноместа в цене.",
  },
  {
    id: "chinor-gallery",
    short: "Галерея «Чинор»",
    name: "Торговая галерея «Чинор»",
    kind: "Торговое",
    district: "Мирзо-Улугбекский",
    address: "Резиденция «Чинор», первые два этажа",
    area: 1_850,
    floor: "1–2 этажи, витрины на проспект",
    deal: "Продажа",
    status: "Бронь",
    priceUsd: 4_440_000,
    rateUsdM2: 28,
    occupancy: 0.9,
    opexUsdM2: 3,
    photo: "/images/mavera/mall.jpg",
    photoNight: "/images/mavera/noir-towers-1.jpg",
    note: "Продаётся целиком, якорный арендатор — супермаркет, договор на 5 лет.",
  },
  {
    id: "daryo-street",
    short: "Ритейл в «Дарё»",
    name: "Стрит-ритейл в резиденции «Дарё»",
    kind: "Стрит-ритейл",
    district: "Яшнабадский",
    address: "Резиденция «Дарё», первый этаж",
    area: 140,
    floor: "1 этаж, витрина 12 м, отдельный вход",
    deal: "Продажа",
    status: "Свободно",
    priceUsd: 406_000,
    rateUsdM2: 35,
    occupancy: 0.95,
    opexUsdM2: 2.5,
    photo: "/images/mavera/office.jpg",
    photoNight: "/images/mavera/noir-entrance.jpg",
    note: "Кофейня, аптека, салон — трафик 640 квартир над головой.",
  },
  {
    id: "chilanzar-building",
    short: "Здание на Чиланзаре",
    name: "Отдельно стоящее здание на Чиланзаре",
    kind: "Здание",
    district: "Чиланзарский",
    address: "квартал 6, у выхода метро",
    area: 960,
    floor: "3 этажа и цоколь, свой участок 14 соток",
    deal: "Продажа",
    status: "Свободно",
    priceUsd: 1_440_000,
    rateUsdM2: 14,
    occupancy: 0.85,
    opexUsdM2: 2,
    photo: "/images/mavera/office.jpg",
    photoNight: "/images/mavera/noir-towers-2.jpg",
    note: "Под клинику, школу или офис компании — перепланировка согласована.",
  },
  {
    id: "zarafshon-showroom",
    short: "Шоурум в «Зарафшон»",
    name: "Шоурум в резиденции «Зарафшон»",
    kind: "Стрит-ритейл",
    district: "Мирабадский",
    address: "Резиденция «Зарафшон», первый этаж",
    area: 210,
    floor: "1 этаж, потолки 4,2 м, угловое остекление",
    deal: "Продажа",
    status: "Свободно",
    priceUsd: 651_000,
    rateUsdM2: 34,
    occupancy: 0.93,
    opexUsdM2: 2.5,
    photo: "/images/mavera/mall.jpg",
    photoNight: "/images/mavera/noir-skyline.jpg",
    note: "Бизнес-класс над головой: мебель, свет, автосалон премиальных марок.",
  },
  {
    id: "amir-temur-floor",
    short: "Этаж на Амира Темура",
    name: "Этаж целиком в бизнес-центре на Амира Темура",
    kind: "Офис",
    district: "Мирзо-Улугбекский",
    address: "пр. Амира Темура, деловой квартал",
    area: 1_100,
    floor: "11 этаж, панорама на город",
    deal: "Аренда",
    status: "Свободно",
    rentUsdMonth: 18_700,
    rateUsdM2: 17,
    occupancy: 1,
    opexUsdM2: 2.5,
    photo: "/images/mavera/business-center.jpg",
    photoNight: "/images/mavera/noir-rooftop.jpg",
    note: "Под штаб-квартиру: своя переговорная зона, серверная, 30 машиномест.",
  },
  {
    id: "yunusabad-warehouse",
    short: "Склад на Юнусабаде",
    name: "Склад-шоурум на Юнусабаде",
    kind: "Склад",
    district: "Юнусабадский",
    address: "Юнусабад, 17 квартал, у кольцевой",
    area: 1_400,
    floor: "Один уровень, высота 8 м, две рампы",
    deal: "Аренда",
    status: "Свободно",
    rentUsdMonth: 8_400,
    rateUsdM2: 6,
    occupancy: 1,
    opexUsdM2: 1,
    photo: "/images/mavera/construction.jpg",
    photoNight: "/images/mavera/noir-towers-3.jpg",
    note: "Для дистрибьютора: шоурум с фасада, склад и погрузка со двора.",
  },
];

export const commerceKinds: CommerceKind[] = ["Офис", "Торговое", "Стрит-ритейл", "Здание", "Склад"];

/** То, что нужно для расчёта доходности: и объект из списка, и оценка по параметрам. */
export type Yieldable = {
  area: number;
  priceUsd?: number;
  rateUsdM2: number;
  occupancy: number;
  opexUsdM2: number;
};

/**
 * Районы Ташкента с поправкой к базовой цене и ставке: центр дороже,
 * окраина дешевле. Коэффициенты — оценка по объявлениям 2026 года, правятся
 * заказчиком вместе со ставками.
 */
export type District = { id: string; name: string; factor: number; note: string };

export const districts: District[] = [
  { id: "mirabad", name: "Мирабадский", factor: 1.15, note: "Центр: посольства, банки, лучшие рестораны" },
  { id: "yakkasaray", name: "Яккасарайский", factor: 1.12, note: "Деловой центр вдоль Бабура и Шота Руставели" },
  { id: "mirzo-ulugbek", name: "Мирзо-Улугбекский", factor: 1.05, note: "Амира Темура, Tashkent City, метро" },
  { id: "yunusabad", name: "Юнусабадский", factor: 1.0, note: "Крупные ЖК, торговые коридоры, кольцевая" },
  { id: "shaykhantakhur", name: "Шайхантахурский", factor: 0.95, note: "Старый город, базары, плотный поток" },
  { id: "yashnabad", name: "Яшнабадский", factor: 0.92, note: "Новые кварталы у Ташкент-Сити и вокзала" },
  { id: "chilanzar", name: "Чиланзарский", factor: 0.9, note: "Спальный юго-запад, метро, семейный ритейл" },
  { id: "sergeli", name: "Сергелийский", factor: 0.8, note: "Новый юг, склады и автотрафик" },
];

/** Базовые ставки по типу помещения — за м²: продажа и аренда в месяц, $. */
export const kindRates: Record<CommerceKind, { saleUsdM2: number; rentUsdM2: number; occupancy: number; opexUsdM2: number }> = {
  Офис: { saleUsdM2: 1_900, rentUsdM2: 18, occupancy: 0.9, opexUsdM2: 2.5 },
  Торговое: { saleUsdM2: 2_400, rentUsdM2: 28, occupancy: 0.9, opexUsdM2: 3 },
  "Стрит-ритейл": { saleUsdM2: 2_900, rentUsdM2: 34, occupancy: 0.93, opexUsdM2: 2.5 },
  Здание: { saleUsdM2: 1_500, rentUsdM2: 14, occupancy: 0.85, opexUsdM2: 2 },
  Склад: { saleUsdM2: 700, rentUsdM2: 6, occupancy: 0.95, opexUsdM2: 1 },
};

/** Крупные площади дешевле за метр — и в продаже, и в аренде. */
function sizeFactor(area: number): number {
  if (area <= 100) return 1.05;
  if (area <= 300) return 1;
  if (area <= 800) return 0.93;
  return 0.86;
}

export type Estimate = Yieldable & {
  kind: CommerceKind;
  district: District;
  /** Цена и ставка за метр после поправок — для подписи. */
  saleUsdM2: number;
};

/** Оценка помещения, которого нет в списке: район, тип, метраж. */
export function estimateOf(kind: CommerceKind, districtId: string, area: number): Estimate {
  const district = districts.find((item) => item.id === districtId) ?? districts[0];
  const base = kindRates[kind];
  const factor = district.factor * sizeFactor(area);
  const saleUsdM2 = Math.round(base.saleUsdM2 * factor);
  return {
    kind,
    district,
    area,
    saleUsdM2,
    priceUsd: saleUsdM2 * area,
    rateUsdM2: Math.round(base.rentUsdM2 * factor * 10) / 10,
    occupancy: base.occupancy,
    opexUsdM2: base.opexUsdM2,
  };
}

/**
 * Банки, которые кредитуют коммерческую недвижимость. Ставки и сроки —
 * условные, как и у жилья: реальные правятся в панели управления.
 */
export const commerceBanks: Bank[] = [
  { id: "ipoteka-biz", name: "Ипотека-банк · бизнес", rate: 21, down: 0.3, years: 7, note: "Под залог приобретаемого объекта" },
  { id: "asaka-biz", name: "Асака-банк", rate: 22, down: 0.35, years: 5, note: "Для юрлиц и ИП с оборотом от года" },
  { id: "kapital-biz", name: "Капиталбанк", rate: 20, down: 0.3, years: 10, note: "Самый долгий срок среди партнёров" },
  { id: "developer", name: "Рассрочка MAVERA", rate: 0, down: 0.4, years: 1.5, note: "Без процентов до 18 месяцев" },
];

/** Что приносит объект при сдаче в аренду — в месяц и в год, до и после эксплуатации. */
export function rentalOf(object: Yieldable) {
  const gross = object.area * object.rateUsdM2 * object.occupancy;
  const opex = object.area * object.opexUsdM2;
  const net = Math.max(gross - opex, 0);
  const price = object.priceUsd ?? 0;
  return {
    grossMonth: gross,
    netMonth: net,
    /** Чистая доходность, % годовых от цены. */
    yieldPct: price ? (net * 12 * 100) / price : 0,
    /** Окупаемость, лет. */
    paybackYears: price && net ? price / (net * 12) : 0,
  };
}

/** Сделка с банком: взнос, кредит, платёж, поток после платежа. */
export function financingOf(object: Yieldable, bank: Bank, downShare: number, years: number) {
  const price = object.priceUsd ?? 0;
  const share = Math.min(Math.max(downShare, bank.down), 0.9);
  const down = Math.round(price * share);
  const loan = Math.max(price - down, 0);
  const term = Math.min(years, bank.years);
  const monthly = loan > 0 ? monthlyPayment(loan, bank.rate, term) : 0;
  const rental = rentalOf(object);
  return {
    share,
    down,
    loan,
    term,
    monthly,
    /** Что остаётся в месяц после платежа банку — может быть отрицательным. */
    cashflow: rental.netMonth - monthly,
    overpay: Math.max(monthly * term * 12 - loan, 0),
    rental,
  };
}
