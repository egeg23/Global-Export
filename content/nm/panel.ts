/**
 * Что лежит в панели управления Namuna.
 *
 * Панель здесь не та, что показывали застройщикам: у фабрики мебели другая
 * работа. Вместо жилых комплексов и шахматки квартир — заявки из
 * калькулятора, заказы в производстве и таблица материалов, из которой
 * калькулятор берёт цены.
 *
 * Телефоны закрыты серединой: панель показывают на встрече и снимают на
 * экран, а полностью набранный номер рано или поздно окажется чьим-то
 * настоящим.
 */

import type { Choice } from "@/content/nm/calc";

export type LeadState = "Новая" | "Замер назначен" | "Смета согласована" | "В производстве" | "Сдан";

export const leadStates: LeadState[] = [
  "Новая",
  "Замер назначен",
  "Смета согласована",
  "В производстве",
  "Сдан",
];

export type Lead = {
  id: string;
  at: string;
  name: string;
  contact: string;
  city: "Ташкент" | "Самарканд";
  /** Состав из калькулятора — ровно то, что человек выбрал на сайте. */
  choice: Choice;
  /** Откуда пришла: собрал состав сам или спросил в чате. */
  source: "Калькулятор" | "Чат";
  state: LeadState;
  manager: string;
};

export const initialLeads: Lead[] = [
  {
    id: "z-1042",
    at: "22.09, 11:47",
    name: "Камола Т.",
    contact: "+998 94 •••-15-60",
    city: "Ташкент",
    choice: {
      kind: "wardrobe",
      amount: 2.8,
      layout: "corner",
      front: "mirror",
      top: "quartz",
      fill: "carousel",
      hardware: "cinetto",
      light: "domus",
      rush: "fast",
      install: "full",
    },
    source: "Чат",
    state: "Новая",
    manager: "Нигора",
  },
  {
    id: "z-1041",
    at: "22.09, 10:14",
    name: "Дилшод А.",
    contact: "+998 90 •••-32-18",
    city: "Ташкент",
    choice: {
      kind: "kitchen",
      amount: 5.4,
      layout: "island",
      front: "veneer",
      top: "stone",
      fill: "boxes",
      hardware: "full",
      light: "domus",
      rush: "normal",
      install: "full",
    },
    source: "Калькулятор",
    state: "Новая",
    manager: "Нигора",
  },
  {
    id: "z-1040",
    at: "22.09, 09:02",
    name: "Зухра К.",
    contact: "@zuhra_k",
    city: "Ташкент",
    choice: {
      kind: "kitchen",
      amount: 4.6,
      layout: "corner",
      front: "matt",
      top: "quartz",
      fill: "boxes",
      hardware: "blum",
      light: "domus",
      rush: "fast",
      install: "full",
    },
    source: "Калькулятор",
    state: "Замер назначен",
    manager: "Нигора",
  },
  {
    id: "z-1038",
    at: "21.09, 17:48",
    name: "Отабек Р.",
    contact: "+998 93 •••-77-05",
    city: "Самарканд",
    choice: {
      kind: "hall",
      amount: 2.4,
      layout: "line",
      front: "mirror",
      top: "post",
      fill: "shelves",
      hardware: "cinetto",
      light: "none",
      rush: "normal",
      install: "full",
    },
    source: "Калькулятор",
    state: "Смета согласована",
    manager: "Жасур",
  },
  {
    id: "z-1035",
    at: "20.09, 12:20",
    name: "Мадина Т.",
    contact: "madina@•••.uz",
    city: "Ташкент",
    choice: {
      kind: "flat",
      amount: 3,
      layout: "u",
      front: "milled",
      top: "quartz",
      fill: "show",
      hardware: "full",
      light: "domus",
      rush: "normal",
      install: "full",
    },
    source: "Калькулятор",
    state: "В производстве",
    manager: "Сардор",
  },
  {
    id: "z-1029",
    at: "17.09, 15:35",
    name: "Бахтиёр У.",
    contact: "+998 97 •••-14-60",
    city: "Самарканд",
    choice: {
      kind: "wardrobe",
      amount: 3.6,
      layout: "corner",
      front: "graphite",
      top: "stone",
      fill: "carousel",
      hardware: "cinetto",
      light: "domus",
      rush: "normal",
      install: "self",
    },
    source: "Калькулятор",
    state: "Сдан",
    manager: "Жасур",
  },
];

export type Stage = "Раскрой" | "Кромка" | "Фрезеровка" | "Покраска" | "Сборка" | "Установка";

export const stages: Stage[] = [
  "Раскрой",
  "Кромка",
  "Фрезеровка",
  "Покраска",
  "Сборка",
  "Установка",
];

export type Order = {
  id: string;
  client: string;
  what: string;
  stage: Stage;
  /** Дата готовности, как она стоит в договоре. */
  due: string;
};

export const initialOrders: Order[] = [
  { id: "n-2418", client: "Мадина Т.", what: "Кухня П-образная, 6,2 п.м.", stage: "Покраска", due: "14 октября" },
  { id: "n-2415", client: "Отабек Р.", what: "Кухня прямая, 3,2 п.м.", stage: "Кромка", due: "8 октября" },
  { id: "n-2411", client: "ЖК Mirabad Avenue", what: "Кухни в 12 квартир", stage: "Раскрой", due: "3 ноября" },
  { id: "n-2406", client: "Зухра К.", what: "Гардеробная, 4,1 п.м.", stage: "Сборка", due: "29 сентября" },
  { id: "n-2401", client: "ЖК Yangi Darhon", what: "Шкафы-купе, 8 квартир", stage: "Установка", due: "26 сентября" },
];

/** Строка журнала: кто и что поменял. */
export type Entry = { id: string; at: string; who: string; what: string };

export const initialLog: Entry[] = [
  { id: "l-1", at: "22.09, 10:20", who: "Нигора", what: "Заявка z-1041 · статус: Новая" },
  { id: "l-2", at: "22.09, 09:40", who: "Сардор", what: "Заказ n-2418 · этап: Фрезеровка → Покраска" },
  { id: "l-3", at: "21.09, 18:05", who: "Жасур", what: "Заявка z-1038 · смета согласована" },
];

export const staff = [
  { name: "Нигора Юсупова", role: "Менеджер продаж, Ташкент" },
  { name: "Жасур Каримов", role: "Менеджер продаж, Самарканд" },
  { name: "Сардор Аминов", role: "Начальник производства" },
];
