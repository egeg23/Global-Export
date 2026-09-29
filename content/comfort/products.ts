/**
 * Каталог Comfort Mebel для прототипа — выборка из их же магазина.
 *
 * Всё здесь переписано с comfort-mebel.uz (выгрузка Store API
 * WooCommerce от 29.09.2026): название, цена в сумах, габариты и
 * характеристики — из описания товара, фотография — из его карточки.
 * Ничего не досчитано и не придумано: если габарита в описании нет, поля
 * нет, и калькулятор «Влезет ли» такую модель не проверяет.
 *
 * `source` — номер товара у них в магазине: по нему карточку находят в
 * панели и сверяют цену перед показом.
 *
 * Эти цены — цены мебели заказчика, часть макета. К ценам студии они
 * отношения не имеют.
 */

export type ComfortCategory = "sofa" | "wardrobe" | "dining" | "bed" | "storage";

export type ComfortProduct = {
  id: string;
  source: number;
  name: string;
  category: ComfortCategory;
  /** Цена в карточке у них на сайте, сум. */
  price: number;
  /** Вдоль стены, см. */
  width?: number;
  /** От стены в комнату, см. */
  depth?: number;
  height?: number;
  /** Модульный: заносится по частям, дверь ему не помеха. */
  modular?: boolean;
  /** Корпусная мебель: привозят в разобранном виде и собирают на месте. */
  assembled?: boolean;
  /** Строка габаритов так, как её пишет клиент. */
  size: string;
  facts: string[];
  image: string;
  alt: string;
};

export const categories: { id: ComfortCategory; label: string; uz: string }[] = [
  { id: "sofa", label: "Диваны и кресла", uz: "Divanlar" },
  { id: "wardrobe", label: "Шкафы", uz: "Shkaflar" },
  { id: "dining", label: "Столы и стулья", uz: "Stol va stullar" },
  { id: "bed", label: "Кровати и спальни", uz: "Karavotlar" },
  { id: "storage", label: "Комоды и ТВ-зоны", uz: "Komodlar" },
];

export const products: ComfortProduct[] = [
  /* Диваны и кресла */
  {
    id: "corner-280",
    source: 28061,
    name: "Угловой диван 280×155",
    category: "sofa",
    price: 6_700_000,
    width: 280,
    depth: 155,
    size: "280 × 155 см",
    facts: ["Турецкая ткань, 100% моющаяся", "Механизм «Дельфин»", "Ящик «Аллигатор»"],
    image: "/images/comfort/corner-280.jpg",
    alt: "Угловой серый диван в гостиной",
  },
  {
    id: "velmont",
    source: 28537,
    name: "Модульный диван ВЕЛЬМОНТ",
    category: "sofa",
    price: 10_400_000,
    width: 390,
    depth: 250,
    modular: true,
    size: "390 × 250 см",
    facts: ["Беспроводная зарядка в подлокотнике", "Регулируемые спинки", "Моющаяся ткань"],
    image: "/images/comfort/velmont.jpg",
    alt: "Модульный угловой диван ВЕЛЬМОНТ в гостиной",
  },
  {
    id: "prestige",
    source: 28342,
    name: "PRESTIGE — модульный диван",
    category: "sofa",
    price: 10_200_000,
    width: 345,
    depth: 245,
    modular: true,
    size: "345 × 245 см",
    facts: ["Прямой, мини-диван, кровать и кресла", "Откидные спинки", "Моющаяся ткань"],
    image: "/images/comfort/prestige.jpg",
    alt: "Светлый модульный диван PRESTIGE с пуфом",
  },
  {
    id: "transformer",
    source: 28531,
    name: "Модульный угловой диван-трансформер",
    category: "sofa",
    price: 9_000_000,
    width: 355,
    depth: 240,
    modular: true,
    size: "355 × 240 см",
    facts: ["4 решения в одном", "Откидные спинки", "Моющаяся ткань"],
    image: "/images/comfort/transformer.jpg",
    alt: "Модульный угловой диван-трансформер",
  },
  {
    id: "monet",
    source: 28643,
    name: "Угловой диван MONET",
    category: "sofa",
    price: 5_200_000,
    width: 260,
    depth: 155,
    size: "260 × 155 см",
    facts: ["Раскладной механизм", "Ящик для хранения", "Моющаяся обивка"],
    image: "/images/comfort/monet.jpg",
    alt: "Угловой диван MONET",
  },
  {
    id: "corner-l",
    source: 28188,
    name: "Угловой Г-образный диван",
    category: "sofa",
    price: 10_700_000,
    width: 300,
    depth: 220,
    size: "300 × 220 см",
    facts: ["Турецкий механизм «Дельфин»", "Сундук для хранения", "Угол меняется местами"],
    image: "/images/comfort/corner-l.jpg",
    alt: "Большой Г-образный диван со столиком",
  },
  {
    id: "straight",
    source: 28658,
    name: "Раскладной прямой диван",
    category: "sofa",
    price: 2_800_000,
    width: 230,
    depth: 90,
    size: "230 × 90 см, спальное 230 × 120",
    facts: ["Моющаяся обивка", "Удобный механизм раскладки"],
    image: "/images/comfort/straight.jpg",
    alt: "Тёмно-серый прямой диван",
  },
  {
    id: "sofa-bed",
    source: 28673,
    name: "Прямой диван-софа",
    category: "sofa",
    price: 4_000_000,
    width: 210,
    depth: 100,
    size: "210 × 100 см, спальное 190 × 170",
    facts: ["Раскладной механизм", "Моющаяся ткань"],
    image: "/images/comfort/sofa-bed.jpg",
    alt: "Синий диван-софа",
  },
  {
    id: "armchair",
    source: 28652,
    name: "Раскладное кресло",
    category: "sofa",
    price: 2_950_000,
    width: 92,
    depth: 80,
    size: "92 × 80 см, в разложенном 198 × 80",
    facts: ["Основание из фанеры", "Моющаяся обивка"],
    image: "/images/comfort/armchair.jpg",
    alt: "Светлое раскладное кресло",
  },
  {
    id: "relax",
    source: 28212,
    name: "Кресло-качалка RELAX с пуфом",
    category: "sofa",
    price: 3_500_000,
    width: 60,
    depth: 70,
    height: 105,
    size: "60 × 70 × 105 см",
    facts: ["Деревянный каркас", "Пуф для ног в комплекте"],
    image: "/images/comfort/relax.jpg",
    alt: "Кресло-качалка с пуфом",
  },

  /* Шкафы */
  {
    id: "kupe",
    source: 28445,
    name: "Шкаф-купе",
    category: "wardrobe",
    price: 5_700_000,
    width: 220,
    depth: 60,
    height: 235,
    assembled: true,
    size: "220 × 60 × 235 см",
    facts: ["ЛДСП", "Бесшумный ход дверей"],
    image: "/images/comfort/kupe.jpg",
    alt: "Шкаф-купе с зеркалом",
  },
  {
    id: "yulduz",
    source: 28677,
    name: "Шкаф распашной Yulduz",
    category: "wardrobe",
    price: 5_100_000,
    width: 185,
    depth: 55,
    height: 237,
    assembled: true,
    size: "185 × 55 × 237 см",
    facts: ["ЛДСП", "Немецкая фурнитура"],
    image: "/images/comfort/yulduz.jpg",
    alt: "Распашной шкаф Yulduz",
  },
  {
    id: "wardrobe-hit",
    source: 28564,
    name: "Современный распашной шкаф",
    category: "wardrobe",
    price: 4_400_000,
    width: 180,
    depth: 52,
    height: 260,
    assembled: true,
    size: "180 × 52 × 260 см",
    facts: ["ЛДСП", "Тихое открытие"],
    image: "/images/comfort/wardrobe-hit.jpg",
    alt: "Высокий распашной шкаф",
  },
  {
    id: "florensia",
    source: 28377,
    name: "Шкаф FLORENSIA",
    category: "wardrobe",
    price: 4_800_000,
    width: 240,
    depth: 52,
    height: 205,
    assembled: true,
    size: "240 × 52 × 205 см",
    facts: ["Четыре двери, зеркало"],
    image: "/images/comfort/florensia.jpg",
    alt: "Белый шкаф FLORENSIA",
  },
  {
    id: "humo",
    source: 28106,
    name: "Угловой шкаф «Хумо»",
    category: "wardrobe",
    price: 4_800_000,
    width: 145,
    depth: 145,
    height: 250,
    assembled: true,
    size: "145 × 145 × 250 см, глубина 47",
    facts: ["ЛДСП", "Зеркальная дверь"],
    image: "/images/comfort/humo.jpg",
    alt: "Угловой шкаф Хумо",
  },
  {
    id: "swing",
    source: 28681,
    name: "Распашной шкаф",
    category: "wardrobe",
    price: 3_100_000,
    width: 180,
    depth: 50,
    height: 220,
    assembled: true,
    size: "180 × 50 × 220 см",
    facts: ["ЛДСП", "Премиальная фурнитура"],
    image: "/images/comfort/swing.jpg",
    alt: "Распашной шкаф в дубовом цвете",
  },
  {
    id: "laconic",
    source: 28662,
    name: "Лаконичный распашной шкаф",
    category: "wardrobe",
    price: 1_950_000,
    width: 140,
    depth: 45,
    height: 230,
    assembled: true,
    size: "140 × 45 × 230 см",
    facts: ["ЛДСП"],
    image: "/images/comfort/laconic.jpg",
    alt: "Трёхдверный шкаф",
  },

  /* Столы и стулья: ширина и глубина — столешница */
  {
    id: "malaysia",
    source: 28366,
    name: "Обеденный комплект из Малайзии",
    category: "dining",
    price: 11_800_000,
    width: 180,
    depth: 90,
    size: "стол 180 × 90 см",
    facts: ["Столешница из шпона", "Стулья из каучукового дерева"],
    image: "/images/comfort/malaysia.jpg",
    alt: "Обеденный стол из шпона со стульями",
  },
  {
    id: "fenix",
    source: 28296,
    name: "Скандинавский комплект FENIX XL",
    category: "dining",
    price: 7_400_000,
    width: 155,
    depth: 85,
    size: "стол 155 × 85 см",
    facts: ["МДФ", "Ножки из ореха", "Моющаяся ткань"],
    image: "/images/comfort/fenix.jpg",
    alt: "Скандинавские стулья у стола",
  },
  {
    id: "luxe",
    source: 28306,
    name: "Скандинавский комплект Luxe",
    category: "dining",
    price: 5_300_000,
    width: 90,
    depth: 90,
    size: "стол 90 × 90 см",
    facts: ["МДФ", "Ножки из ореха"],
    image: "/images/comfort/luxe.jpg",
    alt: "Мягкие стулья скандинавского комплекта",
  },
  {
    id: "retro",
    source: 28181,
    name: "Обеденный комплект СССР",
    category: "dining",
    price: 5_800_000,
    width: 136,
    depth: 80,
    size: "стол 136 × 80 см",
    facts: ["МДФ", "Стулья из ореха"],
    image: "/images/comfort/retro.jpg",
    alt: "Деревянный обеденный комплект",
  },
  {
    id: "aurora",
    source: 28266,
    name: "Обеденный комплект AURORA",
    category: "dining",
    price: 4_900_000,
    width: 120,
    depth: 70,
    size: "стол 120 × 70 см",
    facts: ["На 4 персоны", "Износостойкая ткань"],
    image: "/images/comfort/aurora.jpg",
    alt: "Белый стол AURORA с бежевыми стульями",
  },
  {
    id: "emely",
    source: 28162,
    name: "Раздвижной комплект emely 6/1",
    category: "dining",
    price: 13_000_000,
    width: 110,
    depth: 110,
    size: "стол 110 × 110, в раскладке 150 × 150 см",
    facts: ["Крашеный МДФ", "Крутящиеся стулья"],
    image: "/images/comfort/emely.jpg",
    alt: "Круглый белый стол со стульями",
  },

  /* Кровати и спальни: ширина — изголовье, глубина — длина */
  {
    id: "lift-bed",
    source: 28194,
    name: "Кровать с подъёмным механизмом",
    category: "bed",
    price: 5_000_000,
    width: 185,
    depth: 218,
    size: "218 × 185 см",
    facts: ["Мягкое изголовье", "Место для хранения"],
    image: "/images/comfort/lift-bed.jpg",
    alt: "Кровать с мягким изголовьем",
  },
  {
    id: "single-bed",
    source: 28639,
    name: "Односпальная кровать",
    category: "bed",
    price: 1_250_000,
    width: 90,
    depth: 210,
    size: "90 × 210 см",
    facts: ["ЛДСП и моющаяся ткань", "Сундук", "Без матраса"],
    image: "/images/comfort/single-bed.jpg",
    alt: "Односпальная кровать",
  },
  {
    id: "bedroom-set",
    source: 28633,
    name: "Спальный комплект",
    category: "bed",
    price: 6_250_000,
    size: "комплект",
    facts: ["ЛДСП", "Фурнитура премиум-класса", "Без матраса"],
    image: "/images/comfort/bedroom-set.jpg",
    alt: "Спальный комплект",
  },

  /* Комоды и ТВ-зоны */
  {
    id: "dresser",
    source: 28592,
    name: "Лаконичный комод",
    category: "storage",
    price: 1_050_000,
    width: 160,
    depth: 42,
    height: 90,
    assembled: true,
    size: "160 × 90 × 42 см",
    facts: ["ЛДСП"],
    image: "/images/comfort/dresser.jpg",
    alt: "Комод с круглым зеркалом",
  },
  {
    id: "tv-wall",
    source: 27867,
    name: "ТВ-подставка с полками",
    category: "storage",
    price: 8_200_000,
    width: 320,
    depth: 43,
    height: 213,
    assembled: true,
    size: "320 × 43 × 213 см",
    facts: ["Открытые полки и шкафчики", "Под большой телевизор"],
    image: "/images/comfort/tv-wall.jpg",
    alt: "ТВ-стенка с полками",
  },
];

export function productById(id: string): ComfortProduct {
  return products.find((product) => product.id === id) ?? products[0];
}

/** «6 700 000 сум». Неразрывные пробелы — цена не рвётся на две строки. */
export function sum(value: number): string {
  return `${value.toLocaleString("ru-RU").replace(/\s/g, " ")} сум`;
}

/** Шоурумы — со страницы «Филиалы» и из подвала описаний товаров. */
export const branches = [
  {
    id: "sampi",
    name: "ТЦ «Сампи»",
    note: "основной шоурум",
    address: "Юнусабадский р-н, ул. Богишамол, 260А, −1 этаж",
    phones: ["+998 99 847-99-09", "+998 33 998-13-13"],
    image: "/images/comfort/branch-sampi.jpg",
  },
  {
    id: "tsum",
    name: "ЦУМ",
    note: "Мирабадский район",
    address: "ул. Ислама Каримова, 17, 2-й этаж",
    phones: ["+998 77 448-99-09", "+998 33 088-13-13"],
    image: "/images/comfort/branch-tsum.jpg",
  },
  {
    id: "chilanzar",
    name: "Чиланзар",
    note: "23-й квартал",
    address: "Чиланзарский р-н, 23-й квартал, ул. Ширин, 27",
    phones: ["+998 77 385-13-13", "+998 77 550-99-09"],
    image: "/images/comfort/showroom.jpg",
  },
] as const;

export const contacts = {
  callCenter: "+998 55 500-40-40",
  callCenterHref: "tel:+998555004040",
  email: "info@comfort-mebel.uz",
  telegram: "https://t.me/Comfort_mebel_2018",
  instagram: "https://www.instagram.com/comfort_mebel_2018/",
  youtube: "https://www.youtube.com/@comfortmebel-z1i",
  site: "https://comfort-mebel.uz",
};

/** Раздел «Часто задаваемые вопросы» с их главной — дословно по сути. */
export const faq = [
  ["Входит ли доставка в стоимость?", "Да, доставка по Ташкенту бесплатная. В регионы — по договорённости."],
  ["Собираете ли вы мебель?", "Сборка и установка бесплатные, их делает команда Comfort Mebel."],
  ["Можно ли заказать по своим размерам?", "Да: по индивидуальным размерам, цветам и стилю под ваш интерьер."],
  ["Из каких материалов мебель?", "ЛДСП, МДФ и массив дерева от проверенных поставщиков из России, Турции и Китая."],
  ["Есть ли гарантия?", "От 6 до 24 месяцев — в зависимости от типа мебели."],
  ["Есть ли рассрочка?", "Да, через Uzum и Anor. Оформление за 5 минут, без справок."],
  ["Сколько ждать доставку?", "Если товар в наличии — 1–3 дня. Индивидуальный заказ — от 7 до 14 рабочих дней."],
  ["Можно посмотреть вживую?", "Да, в любом из трёх шоурумов в Ташкенте — там представлены актуальные модели."],
] as const;
