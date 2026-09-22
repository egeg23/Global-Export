/**
 * Чем наполнена панель управления Golden House.
 *
 * Панель здесь та же, что показывали MAVERA, — экраны, шахматка, журнал
 * действий одинаковые, — но данные внутри их собственные: те же семь
 * кварталов, что на странице, с этажностью и сроками из карточек на gh.uz.
 * Иначе заказчик открывает «свою» панель и видит чужие жилые комплексы.
 *
 * Телефоны в заявках закрыты серединой. Панель — прототип, показывается на
 * встрече и попадает на снимки экрана, а любой набранный полностью номер
 * рано или поздно окажется чьим-то настоящим.
 */

import {
  corpusSet,
  type AuditEntry,
  type Lead,
  type MediaFile,
  type Project,
} from "@/components/mavera/admin/model";

const segmentOf: Record<string, Project["segment"]> = {
  Комфорт: "Комфорт",
  Бизнес: "Бизнес",
  Премиум: "Премиум",
};

export const ghProjects: Project[] = [
  {
    id: "oz-makon",
    name: { RU: "ЖК O`Z MAKON", EN: "O`Z MAKON", UZ: "O`Z MAKON turar-joy majmuasi" },
    desc: {
      RU: "Квартал с приватными дворами без машин, пешеходным бульваром и квартирами с террасами.",
      EN: "A quarter with private car-free courtyards, a pedestrian boulevard and terraced flats.",
      UZ: "",
    },
    district: "Яшнабадский",
    segment: segmentOf.Премиум,
    published: true,
    order: 1,
    corpuses: corpusSet(
      [16, 8, "IV кв. 2026", "Продаётся"],
      [16, 8, "IV кв. 2026", "Продаётся"],
      [14, 10, "II кв. 2027", "Строится"],
    ),
  },
  {
    id: "infinity",
    name: { RU: "Клубный дом INFINITY", EN: "INFINITY Club House", UZ: "" },
    desc: {
      RU: "Пять этажей, 35 квартир от 117 м², архитектура Benoy и Chapman & Taylor.",
      EN: "Five floors, 35 flats from 117 m², architecture by Benoy and Chapman & Taylor.",
      UZ: "",
    },
    district: "Яшнабадский",
    segment: segmentOf.Премиум,
    published: true,
    order: 2,
    corpuses: corpusSet([5, 7, "Сдан в 2024", "Сдан"]),
  },
  {
    id: "oz-zamin",
    name: { RU: "ЖК O`Z ZAMIN", EN: "O`Z ZAMIN", UZ: "" },
    desc: {
      RU: "Закрытые дворы, фруктовый сад, подземный паркинг на 300 мест и доступ по Face ID.",
      EN: "Closed courtyards, an orchard, 300 underground parking spaces and Face ID access.",
      UZ: "",
    },
    district: "Яшнабадский",
    segment: segmentOf.Бизнес,
    published: true,
    order: 3,
    corpuses: corpusSet(
      [16, 10, "III кв. 2026", "Продаётся"],
      [12, 10, "IV кв. 2026", "Строится"],
    ),
  },
  {
    id: "assalom-sohil",
    name: { RU: "ЖК Assalom Sohil", EN: "Assalom Sohil", UZ: "" },
    desc: {
      RU: "Жилой район с набережной, детским садом и школой; трёхслойные стены, сейсмика выше 9 баллов.",
      EN: "A district with an embankment, kindergarten and school; three-layer walls.",
      UZ: "",
    },
    district: "Шайхантахурский",
    segment: segmentOf.Комфорт,
    published: true,
    order: 4,
    corpuses: corpusSet(
      [9, 12, "Сдан в 2024", "Сдан"],
      [12, 12, "Сдан в 2025", "Сдан"],
      [16, 12, "I кв. 2027", "Продаётся"],
    ),
  },
  {
    id: "assalom-boglar",
    name: { RU: "Эко-квартал Assalom Bog`lar", EN: "Assalom Bog`lar", UZ: "" },
    desc: {
      RU: "Второй проект компании по экологическим стандартам: энергосбережение, очистка воды, автополив.",
      EN: "The company's second eco project: energy saving, water treatment, auto irrigation.",
      UZ: "",
    },
    district: "Мирзо-Улугбекский",
    segment: segmentOf.Комфорт,
    published: true,
    order: 5,
    corpuses: corpusSet(
      [12, 12, "Сдан в 2025", "Сдан"],
      [16, 12, "IV кв. 2026", "Продаётся"],
    ),
  },
  {
    id: "assalom-jomiy",
    name: { RU: "Эко-квартал Assalom Jomiy", EN: "Assalom Jomiy", UZ: "" },
    desc: {
      RU: "Зелёные сады во дворах, рынок Джами в четырёх минутах пешком, отделка в подарок.",
      EN: "Green gardens in the courtyards, Jomiy market four minutes away.",
      UZ: "",
    },
    district: "Сергелийский",
    segment: segmentOf.Комфорт,
    published: true,
    order: 6,
    corpuses: corpusSet(
      [16, 12, "II кв. 2027", "Продаётся"],
      [12, 12, "IV кв. 2027", "Строится"],
    ),
  },
  {
    id: "assalom-havo",
    name: { RU: "ЖК Assalom Havo", EN: "Assalom Havo", UZ: "" },
    desc: {
      RU: "Три очереди: восемь пятиэтажных сданы, пять девятиэтажных и четыре шестнадцатиэтажных строятся.",
      EN: "Three phases: eight five-storey buildings completed, nine- and sixteen-storey under way.",
      UZ: "",
    },
    district: "Яшнабадский",
    segment: segmentOf.Комфорт,
    published: false,
    order: 7,
    corpuses: corpusSet(
      [5, 6, "Сдан в 2023", "Сдан"],
      [9, 10, "III кв. 2026", "Продаётся"],
      [16, 12, "II кв. 2027", "Строится"],
    ),
  },
];

export const ghLeads: Lead[] = [
  { id: "l1", date: "17.09, 14:32", name: "Азиз Р.", contact: "+998 90 •••-45-67", source: "Подбор квартиры · 3-комн.", project: "oz-makon", owner: "Нодира", state: "Новая", synced: true },
  { id: "l2", date: "17.09, 11:04", name: "Дилноза К.", contact: "@dilnoza", source: "Главная · обратный звонок", project: "oz-makon", owner: "Нодира", state: "В работе", synced: true },
  { id: "l3", date: "16.09, 18:20", name: "Сергей М.", contact: "+998 93 •••-11-02", source: "Коммерция · аренда", project: "oz-zamin", owner: "Бекзод", state: "В работе", synced: false },
  { id: "l4", date: "16.09, 09:47", name: "Нилуфар А.", contact: "nilufar@•••.uz", source: "Калькулятор ипотеки", project: "assalom-sohil", owner: "Бекзод", state: "Обработана", synced: true },
  { id: "l5", date: "15.09, 16:12", name: "Тимур Х.", contact: "+998 91 •••-80-90", source: "Карточка INFINITY", project: "infinity", owner: "Нодира", state: "Сделка", synced: true },
  { id: "l6", date: "15.09, 10:05", name: "Мадина Ю.", contact: "@madina_y", source: "Подбор квартиры · 1-комн.", project: "assalom-havo", owner: "Азиз", state: "Новая", synced: true },
  { id: "l7", date: "14.09, 19:41", name: "Рустам Б.", contact: "+998 97 •••-14-55", source: "Ход строительства", project: "assalom-jomiy", owner: "Бекзод", state: "Обработана", synced: true },
  { id: "l8", date: "14.09, 12:18", name: "Гульнора С.", contact: "gulnora.s@•••.com", source: "Главная · форма", project: "assalom-boglar", owner: "Азиз", state: "Сделка", synced: true },
];

export const ghMedia: MediaFile[] = [
  { id: "m1", name: "ozmakon-bulvar.jpg", kind: "Рендер", size: "2,4 МБ", used: 3 },
  { id: "m2", name: "ozmakon-dvor.jpg", kind: "Рендер", size: "1,9 МБ", used: 2 },
  { id: "m3", name: "ozmakon-lobby.webp", kind: "Фото", size: "1,1 МБ", used: 1 },
  { id: "m4", name: "infinity-fasad.jpg", kind: "Фото", size: "2,2 МБ", used: 2 },
  { id: "m5", name: "plan-3k-96.pdf", kind: "Планировка", size: "480 КБ", used: 4 },
  { id: "m6", name: "plan-2k-64.pdf", kind: "Планировка", size: "410 КБ", used: 4 },
  { id: "m7", name: "genplan-sohil.pdf", kind: "Документ", size: "1,2 МБ", used: 1 },
  { id: "m8", name: "havo-ochered-3.jpg", kind: "Рендер", size: "1,7 МБ", used: 0 },
];

export const ghAudit: AuditEntry[] = [
  { id: "a1", at: "17.09, 12:40", who: "Нодира Юсупова", section: "Заявки", what: "Статус: Новая → В работе", target: "Дилноза К." },
  { id: "a2", at: "17.09, 10:12", who: "Азиз Каримов", section: "Квартиры", what: "Цена: 11 250 000 → 11 480 000 сум", target: "O`Z MAKON, корпус 2, 24 квартиры" },
  { id: "a3", at: "16.09, 17:55", who: "Шахноза Т.", section: "Карточка ЖК", what: "Описание RU изменено", target: "Assalom Sohil" },
  { id: "a4", at: "16.09, 09:30", who: "Азиз Каримов", section: "Пользователи", what: "Роль: Наблюдатель → Менеджер продаж", target: "Бекзод Раимов" },
  { id: "a5", at: "15.09, 15:02", who: "Шахноза Т.", section: "Медиатека", what: "Загружено файлов: 6", target: "Клубный дом INFINITY" },
];
