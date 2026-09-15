/**
 * Содержимое макетов MAVERA — одно на все три варианта.
 *
 * Здесь только факты портфеля: застройщик один, и этажность не может зависеть
 * от выбранного варианта. Всё, что говорится про эти объекты — описания,
 * порядок покупки, разделы, — лежит в voice.ts и у каждого варианта своё.
 *
 * Цены — за квадратный метр в долларах: это единственная валюта, в которой
 * считается договор, остальные пересчитываются по курсу на витрине.
 */

export type Project = {
  slug: string;
  name: string;
  district: string;
  segment: "Эконом" | "Комфорт" | "Бизнес";
  status: "Сдан" | "Строится" | "Продаётся";
  due: string;
  floors: string;
  flats: string;
  area: string;
  priceUsd: number;
  photo: string;
};

export const projects: Project[] = [
  {
    slug: "chinor",
    name: "Чинор",
    district: "Мирзо-Улугбекский",
    segment: "Комфорт",
    status: "Строится",
    due: "IV кв. 2027",
    floors: "9–16",
    flats: "1 248",
    area: "84 600 м²",
    priceUsd: 970,
    photo: "/images/mavera/project-chinor.jpg",
  },
  {
    slug: "daryo",
    name: "Дарё",
    district: "Яшнабадский",
    segment: "Бизнес",
    status: "Продаётся",
    due: "Сдан в 2026",
    floors: "18–24",
    flats: "640",
    area: "58 200 м²",
    priceUsd: 1260,
    photo: "/images/mavera/project-daryo.jpg",
  },
  {
    slug: "bahor",
    name: "Бахор",
    district: "Сергелийский",
    segment: "Эконом",
    status: "Сдан",
    due: "Сдан в 2024",
    floors: "9",
    flats: "864",
    area: "41 300 м²",
    priceUsd: 780,
    photo: "/images/mavera/project-bahor.jpg",
  },
  {
    slug: "oltin-vodiy",
    name: "Олтин Водий",
    district: "Юнусабадский",
    segment: "Комфорт",
    status: "Строится",
    due: "II кв. 2028",
    floors: "12–16",
    flats: "1 020",
    area: "72 800 м²",
    priceUsd: 1010,
    photo: "/images/mavera/project-oltin.jpg",
  },
  {
    slug: "nur",
    name: "Нур",
    district: "Чиланзарский",
    segment: "Эконом",
    status: "Сдан",
    due: "Сдан в 2023",
    floors: "9–12",
    flats: "1 116",
    area: "49 700 м²",
    priceUsd: 820,
    photo: "/images/mavera/project-nur.jpg",
  },
  {
    slug: "zarafshon",
    name: "Зарафшон",
    district: "Мирабадский",
    segment: "Бизнес",
    status: "Продаётся",
    due: "I кв. 2027",
    floors: "22",
    flats: "418",
    area: "39 400 м²",
    priceUsd: 1300,
    photo: "/images/mavera/project-zarafshon.jpg",
  },
];

export const stats = [
  { value: "48", label: "объектов сдано" },
  { value: "1,24", suffix: "млн м²", label: "построено" },
  { value: "12 400", label: "квартир передано" },
  { value: "14", label: "лет на рынке" },
];

export const commercial = [
  { name: "Бизнес-центр на Амира Темура", kind: "Бизнес-центр", area: "4 200 м²", deal: "Аренда", status: "Свободно", photo: "/images/mavera/business-center.jpg" },
  { name: "Торговая галерея «Чинор»", kind: "Торговый центр", area: "1 850 м²", deal: "Продажа", status: "Бронь", photo: "/images/mavera/mall.jpg" },
  { name: "Отдельно стоящее здание", kind: "Здание", area: "960 м²", deal: "Продажа", status: "Свободно", photo: "/images/mavera/office.jpg" },
];

/** Условия покупки — то, с чего начинают сайты крупных девелоперов. */
export const terms = [
  { value: "от 4,9%", label: "ипотека банков-партнёров" },
  { value: "0%", label: "рассрочка до 18 месяцев" },
  { value: "до 12%", label: "скидка при 100% оплате" },
];
