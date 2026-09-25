import type { Purpose } from "@/content/tr/countries";

/**
 * Что лежит в панели управления Tranio.
 *
 * Заявки приходят из подбора и калькулятора вместе с составом: страна,
 * цель, бюджет, стратегия. Менеджеру не нужно начинать разговор с
 * «расскажите, что вы хотите».
 *
 * Телефоны закрыты серединой: панель показывают на встрече и снимают на
 * экран, а полностью набранный номер рано или поздно окажется чьим-то
 * настоящим.
 */

export type LeadState = "Новая" | "Созвон назначен" | "Подбор отправлен" | "Показ" | "Сделка";

export const leadStates: LeadState[] = [
  "Новая",
  "Созвон назначен",
  "Подбор отправлен",
  "Показ",
  "Сделка",
];

export type Lead = {
  id: string;
  at: string;
  name: string;
  contact: string;
  /** Откуда пришла: подбор направления или калькулятор стратегий. */
  source: "Подбор" | "Калькулятор" | "ВНЖ";
  purpose: Purpose;
  /** Бюджет, тыс. евро. */
  budget: number;
  countries: string[];
  strategy?: string;
  state: LeadState;
  manager: string;
};

export const initialLeads: Lead[] = [
  {
    id: "tr-4821",
    at: "25.09, 11:40",
    name: "Сергей М.",
    contact: "+7 916 •••-44-02",
    source: "Калькулятор",
    purpose: "build",
    budget: 450,
    countries: ["uae", "thailand"],
    strategy: "Строительство в Дубае",
    state: "Новая",
    manager: "Ирина",
  },
  {
    id: "tr-4820",
    at: "25.09, 10:12",
    name: "Алина К.",
    contact: "@alina_k",
    source: "Подбор",
    purpose: "live",
    budget: 280,
    countries: ["cyprus", "greece", "spain"],
    state: "Созвон назначен",
    manager: "Ирина",
  },
  {
    id: "tr-4818",
    at: "24.09, 18:35",
    name: "Дмитрий Р.",
    contact: "+7 903 •••-19-77",
    source: "ВНЖ",
    purpose: "permit",
    budget: 250,
    countries: ["greece"],
    strategy: "Золотая виза Греции",
    state: "Подбор отправлен",
    manager: "Павел",
  },
  {
    id: "tr-4815",
    at: "24.09, 14:02",
    name: "Ольга В.",
    contact: "+7 921 •••-06-31",
    source: "Калькулятор",
    purpose: "rent",
    budget: 900,
    countries: ["germany", "switzerland"],
    strategy: "Арендный бизнес",
    state: "Показ",
    manager: "Павел",
  },
  {
    id: "tr-4809",
    at: "23.09, 09:20",
    name: "Рустам А.",
    contact: "+998 90 •••-52-14",
    source: "Подбор",
    purpose: "rent",
    budget: 160,
    countries: ["turkey", "montenegro"],
    state: "Сделка",
    manager: "Ирина",
  },
];

export type LogEntry = { id: string; text: string; who: string; at: string };

export const initialLog: LogEntry[] = [
  { id: "l1", text: "Заявка tr-4821 · статус: Новая", who: "Ирина", at: "25.09, 11:40" },
  { id: "l2", text: "Порог входа по ОАЭ: 190 → 205 тыс. €", who: "Павел", at: "25.09, 09:05" },
  { id: "l3", text: "Заявка tr-4818 · подбор отправлен", who: "Павел", at: "24.09, 18:51" },
];

export const staff = ["Ирина", "Павел"];
