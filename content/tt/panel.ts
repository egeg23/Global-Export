import type { Pair } from "@/content/tt/i18n";

/**
 * Что лежит в панели управления «Транстелекома».
 *
 * Заявки приходят из конструктора вместе с составом: набор услуг, число
 * рабочих мест, филиал и смета. Менеджеру не нужно выяснять по телефону,
 * о каком подключении речь.
 *
 * Телефоны закрыты серединой: панель показывают на встрече и снимают на
 * экран, а полностью набранный номер рано или поздно окажется чьим-то
 * настоящим.
 */

export type OrderState = "new" | "survey" | "works" | "live";

export const orderStates: { id: OrderState; label: Pair }[] = [
  { id: "new", label: { ru: "Новая", kk: "Жаңа" } },
  { id: "survey", label: { ru: "Обследование", kk: "Тексеру" } },
  { id: "works", label: { ru: "Монтаж", kk: "Монтаж" } },
  { id: "live", label: { ru: "В работе", kk: "Жұмыста" } },
];

export type Order = {
  id: string;
  at: string;
  client: string;
  contact: string;
  /** Филиал, к которому привязано подключение. */
  branch: string;
  services: string[];
  seats: number;
  state: OrderState;
  manager: string;
};

export const initialOrders: Order[] = [
  {
    id: "tt-8140",
    at: "25.09, 09:14",
    client: "ТОО «Қазақ Логистика»",
    contact: "+7 701 •••-22-08",
    branch: "almaty",
    services: ["internet", "ipvpn", "video", "pbx"],
    seats: 120,
    state: "new",
    manager: "Айгүл",
  },
  {
    id: "tt-8137",
    at: "24.09, 16:40",
    client: "АО «Степной банк»",
    contact: "+7 717 •••-51-30",
    branch: "astana",
    services: ["colocation", "security", "internet"],
    seats: 40,
    state: "survey",
    manager: "Данияр",
  },
  {
    id: "tt-8131",
    at: "24.09, 11:05",
    client: "ТОО «Батыс Мұнай Сервис»",
    contact: "+7 702 •••-73-19",
    branch: "atyrau",
    services: ["internet", "telephony", "workplace"],
    seats: 65,
    state: "works",
    manager: "Айгүл",
  },
  {
    id: "tt-8122",
    at: "22.09, 14:52",
    client: "ТОО «Шығыс Медиа»",
    contact: "+7 705 •••-40-66",
    branch: "oskemen",
    services: ["internet", "pbx", "callcenter", "itsm"],
    seats: 35,
    state: "live",
    manager: "Данияр",
  },
];

export type LogEntry = { id: string; text: Pair; who: string; at: string };

export const initialLog: LogEntry[] = [
  {
    id: "l1",
    text: { ru: "Заявка tt-8140 · статус: Новая", kk: "tt-8140 өтінімі · күйі: Жаңа" },
    who: "Айгүл",
    at: "25.09, 09:14",
  },
  {
    id: "l2",
    text: {
      ru: "Тариф «Интернет по выделенному каналу»: 180 000 ₸",
      kk: "«Бөлінген арна бойынша интернет» тарифі: 180 000 ₸",
    },
    who: "Данияр",
    at: "24.09, 18:20",
  },
  {
    id: "l3",
    text: { ru: "Заявка tt-8131 · монтаж начат", kk: "tt-8131 өтінімі · монтаж басталды" },
    who: "Айгүл",
    at: "24.09, 12:00",
  },
];
